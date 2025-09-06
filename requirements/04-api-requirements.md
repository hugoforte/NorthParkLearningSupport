# API Requirements

## API Overview

The NorthPark Learning Support application uses Convex for type-safe API communication between the frontend and backend. All API functions are organized into logical modules and provide end-to-end type safety with real-time capabilities.

## API Architecture

### Convex Function Structure

```
convex/
├── schema.ts                 # Database schema definition
├── _generated/               # Auto-generated types
├── auth.ts                   # Authentication functions
├── users.ts                  # User management
├── students.ts               # Student management
├── classes.ts                # Class management
├── grades.ts                 # Grade management
├── notes.ts                  # Note management
├── admin.ts                  # Admin functions
└── seed.ts                   # Initial data seeding
```

## Authentication API

### Auth Functions

```typescript
// convex/auth.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.patch(user._id, args);
  },
});
```

## User Management API

### Users Functions

```typescript
// convex/users.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!user || user.role !== "ADMIN") {
      throw new Error("Admin access required");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }

    // Get class assignments
    const classAssignments = await ctx.db
      .query("classAssignments")
      .withIndex("by_user", (q) => q.eq("userId", args.id))
      .collect();

    const classes = await Promise.all(
      classAssignments.map(async (assignment) => {
        const classData = await ctx.db.get(assignment.classId);
        const grade = classData ? await ctx.db.get(classData.gradeId) : null;
        return {
          ...assignment,
          class: classData,
          grade,
        };
      })
    );

    return {
      ...user,
      classAssignments: classes,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("TEACHER"), v.literal("ADMIN")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!currentUser || currentUser.role !== "ADMIN") {
      throw new Error("Admin access required");
    }

    return await ctx.db.insert("users", {
      ...args,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.union(v.literal("TEACHER"), v.literal("ADMIN"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!currentUser || currentUser.role !== "ADMIN") {
      throw new Error("Admin access required");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const assignToClass = mutation({
  args: {
    userId: v.id("users"),
    classId: v.id("classes"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!currentUser || currentUser.role !== "ADMIN") {
      throw new Error("Admin access required");
    }

    return await ctx.db.insert("classAssignments", args);
  },
});
```

## Student Management API

### Students Router

```typescript
// src/server/api/routers/students.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../trpc';

export const studentsRouter = createTRPCRouter({
  // Get students by class
  getByClass: protectedProcedure
    .input(z.object({
      classId: z.string(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const [students, total] = await Promise.all([
        ctx.db.student.findMany({
          where: {
            classId: input.classId,
            isActive: true,
          },
          include: {
            class: {
              include: {
                grade: true,
              },
            },
            _count: {
              select: {
                notes: true,
              },
            },
          },
          orderBy: [
            { lastName: 'asc' },
            { firstName: 'asc' },
          ],
          skip,
          take: input.limit,
        }),
        ctx.db.student.count({
          where: {
            classId: input.classId,
            isActive: true,
          },
        }),
      ]);

      return {
        students,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          pages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Search students
  search: protectedProcedure
    .input(z.object({
      query: z.string().min(1),
      classId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.student.findMany({
        where: {
          AND: [
            {
              OR: [
                { firstName: { contains: input.query, mode: 'insensitive' } },
                { lastName: { contains: input.query, mode: 'insensitive' } },
              ],
            },
            input.classId ? { classId: input.classId } : {},
            { isActive: true },
          ],
        },
        include: {
          class: {
            include: {
              grade: true,
            },
          },
          _count: {
            select: {
              notes: true,
            },
          },
        },
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' },
        ],
        take: 20,
      });
    }),

  // Get student by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.student.findUnique({
        where: { id: input.id },
        include: {
          class: {
            include: {
              grade: true,
            },
          },
          notes: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }),

  // Create student (admin only)
  create: adminProcedure
    .input(z.object({
      firstName: z.string().min(1).max(50),
      lastName: z.string().min(1).max(50),
      classId: z.string(),
      studentId: z.string().optional(),
      dateOfBirth: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.student.create({
        data: input,
        include: {
          class: {
            include: {
              grade: true,
            },
          },
        },
      });
    }),

  // Update student (admin only)
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      classId: z.string().optional(),
      studentId: z.string().optional(),
      dateOfBirth: z.date().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.student.update({
        where: { id },
        data: updateData,
        include: {
          class: {
            include: {
              grade: true,
            },
          },
        },
      });
    }),
});
```

## Class Management API

### Classes Router

```typescript
// src/server/api/routers/classes.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, adminProcedure } from '../trpc';

export const classesRouter = createTRPCRouter({
  // Get classes for current user
  getMyClasses: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.classAssignment.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          class: {
            include: {
              grade: true,
              _count: {
                select: {
                  students: {
                    where: { isActive: true },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          class: {
            grade: { level: 'asc' },
            name: 'asc',
          },
        },
      });
    }),

  // Get all classes (admin only)
  getAll: adminProcedure
    .query(async ({ ctx }) => {
      return ctx.db.class.findMany({
        where: { isActive: true },
        include: {
          grade: true,
          _count: {
            select: {
              students: {
                where: { isActive: true },
              },
              classAssignments: true,
            },
          },
        },
        orderBy: [
          { grade: { level: 'asc' } },
          { name: 'asc' },
        ],
      });
    }),

  // Get class by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.class.findUnique({
        where: { id: input.id },
        include: {
          grade: true,
          students: {
            where: { isActive: true },
            orderBy: [
              { lastName: 'asc' },
              { firstName: 'asc' },
            ],
          },
          classAssignments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }),

  // Create class (admin only)
  create: adminProcedure
    .input(z.object({
      name: z.string().min(2).max(100),
      gradeId: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.class.create({
        data: input,
        include: {
          grade: true,
        },
      });
    }),

  // Update class (admin only)
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(2).max(100).optional(),
      gradeId: z.string().optional(),
      description: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.class.update({
        where: { id },
        data: updateData,
        include: {
          grade: true,
        },
      });
    }),
});
```

## Note Management API

### Notes Router

```typescript
// src/server/api/routers/notes.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const notesRouter = createTRPCRouter({
  // Get notes for a student
  getByStudent: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      category: z.enum(['ACADEMIC', 'BEHAVIOR', 'SOCIAL', 'HEALTH', 'OTHER']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const where = {
        studentId: input.studentId,
        ...(input.category && { category: input.category }),
      };

      const [notes, total] = await Promise.all([
        ctx.db.note.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: input.limit,
        }),
        ctx.db.note.count({ where }),
      ]);

      return {
        notes,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          pages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Create note
  create: protectedProcedure
    .input(z.object({
      studentId: z.string(),
      category: z.enum(['ACADEMIC', 'BEHAVIOR', 'SOCIAL', 'HEALTH', 'OTHER']),
      content: z.string().min(10).max(10000),
      isPrivate: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.create({
        data: {
          ...input,
          authorId: ctx.session.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    }),

  // Update note (only by author)
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      category: z.enum(['ACADEMIC', 'BEHAVIOR', 'SOCIAL', 'HEALTH', 'OTHER']).optional(),
      content: z.string().min(10).max(10000).optional(),
      isPrivate: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Check if user is the author
      const note = await ctx.db.note.findFirst({
        where: {
          id,
          authorId: ctx.session.user.id,
        },
      });

      if (!note) {
        throw new Error('Note not found or unauthorized');
      }

      return ctx.db.note.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    }),

  // Delete note (only by author)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is the author
      const note = await ctx.db.note.findFirst({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
        },
      });

      if (!note) {
        throw new Error('Note not found or unauthorized');
      }

      return ctx.db.note.delete({
        where: { id: input.id },
      });
    }),

  // Get note by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.note.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              class: {
                include: {
                  grade: true,
                },
              },
            },
          },
        },
      });
    }),
});
```

## Grade Management API

### Grades Router

```typescript
// src/server/api/routers/grades.ts
import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc';

export const gradesRouter = createTRPCRouter({
  // Get all grades
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return ctx.db.grade.findMany({
        where: { isActive: true },
        orderBy: { level: 'asc' },
      });
    }),

  // Get grade by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.grade.findUnique({
        where: { id: input.id },
        include: {
          classes: {
            where: { isActive: true },
            include: {
              _count: {
                select: {
                  students: {
                    where: { isActive: true },
                  },
                },
              },
            },
          },
        },
      });
    }),
});
```

## Error Handling

### Custom Error Types

```typescript
// src/server/api/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errors = {
  UNAUTHORIZED: new AppError('Unauthorized', 'UNAUTHORIZED', 401),
  FORBIDDEN: new AppError('Forbidden', 'FORBIDDEN', 403),
  NOT_FOUND: new AppError('Not found', 'NOT_FOUND', 404),
  VALIDATION_ERROR: new AppError('Validation error', 'VALIDATION_ERROR', 400),
  INTERNAL_ERROR: new AppError('Internal server error', 'INTERNAL_ERROR', 500),
};
```

### Error Middleware

```typescript
// src/server/api/trpc.ts
import { TRPCError } from '@trpc/server';
import { AppError } from './errors';

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  // Context creation logic
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        code: error.code,
        message: error.message,
      },
    };
  },
});

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }
  return next({ ctx });
});
```

## Rate Limiting

### Rate Limiting Middleware

```typescript
// src/server/api/middleware/rateLimit.ts
import { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (identifier: string, limit: number, window: number) => {
  const now = Date.now();
  const windowStart = now - window;
  
  const current = rateLimitMap.get(identifier);
  
  if (!current || current.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now });
    return { success: true, remaining: limit - 1 };
  }
  
  if (current.count >= limit) {
    return { success: false, remaining: 0 };
  }
  
  current.count++;
  return { success: true, remaining: limit - current.count };
};

export const rateLimitMiddleware = (limit: number, window: number) => {
  return async ({ ctx, next }: any) => {
    const identifier = ctx.session?.user?.id || 'anonymous';
    const result = rateLimit(identifier, limit, window);
    
    if (!result.success) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded',
      });
    }
    
    return next({ ctx });
  };
};
```

## API Documentation

### OpenAPI Integration

```typescript
// src/server/api/openapi.ts
import { generateOpenApiDocument } from 'trpc-openapi';
import { appRouter } from './root';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'NorthPark Learning Support API',
  description: 'API documentation for NorthPark Learning Support application',
  version: '1.0.0',
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
});
```

## Testing

### API Testing Examples

```typescript
// src/__tests__/api/notes.test.ts
import { createMocks } from 'node-mocks-http';
import { appRouter } from '@/server/api/root';

describe('Notes API', () => {
  it('should create a note', async () => {
    const caller = appRouter.createCaller({
      session: { user: { id: 'user-1', role: 'TEACHER' } },
      db: mockDb,
    });

    const result = await caller.notes.create({
      studentId: 'student-1',
      category: 'ACADEMIC',
      content: 'Student showed improvement in math',
    });

    expect(result).toMatchObject({
      studentId: 'student-1',
      category: 'ACADEMIC',
      content: 'Student showed improvement in math',
    });
  });
});
```
