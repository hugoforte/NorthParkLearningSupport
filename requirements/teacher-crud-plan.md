# Teacher CRUD Implementation Plan

## Overview

This plan outlines the complete implementation of CRUD (Create, Read, Update, Delete) operations for teachers in the NorthPark Learning Support application. Teachers are a separate entity from users and will be the foundational entity that other features depend on.

## Phase 1: Convex Schema Setup

### 1.1 Create Convex Schema
**File**: `convex/schema.ts`
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teachers: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    isActive: v.boolean(),
  })
    .index("by_active", ["isActive"])
    .index("by_name", ["lastName", "firstName"]),
});
```

### 1.2 Environment Configuration
✅ **Already completed** - Convex project initialized and environment configured

## Phase 2: Convex Functions (Backend)

### 2.1 Teacher Query Functions
**File**: `convex/teachers.ts`

#### Get All Teachers
```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("teachers")
      .collect();
  },
});
```

#### Get Teacher by ID
```typescript
export const getById = query({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    return teacher;
  },
});
```

#### Search Teachers
```typescript
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teachers")
      .filter((q) => 
        q.or(
          q.eq(q.field("firstName"), args.query),
          q.eq(q.field("lastName"), args.query),
          q.eq(q.field("email"), args.query)
        )
      )
      .collect();
  },
});
```

### 2.2 Teacher Mutation Functions

#### Create Teacher
```typescript
export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("teachers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("Teacher with this email already exists");
    }

    return await ctx.db.insert("teachers", {
      ...args,
      isActive: true,
    });
  },
});
```

#### Update Teacher
```typescript
export const update = mutation({
  args: {
    id: v.id("teachers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const teacher = await ctx.db.get(id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Check email uniqueness if email is being updated
    if (updates.email && updates.email !== teacher.email) {
      const existing = await ctx.db
        .query("teachers")
        .withIndex("by_email", (q) => q.eq("email", updates.email))
        .first();
      
      if (existing) {
        throw new Error("Teacher with this email already exists");
      }
    }

    return await ctx.db.patch(id, updates);
  },
});
```

#### Delete Teacher (Soft Delete)
```typescript
export const remove = mutation({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Soft delete by setting isActive to false
    return await ctx.db.patch(args.id, { isActive: false });
  },
});
```

#### Hard Delete Teacher
```typescript
export const hardDelete = mutation({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    return await ctx.db.delete(args.id);
  },
});
```

## Phase 3: Frontend Components

### 3.1 Teacher List Component
**File**: `src/components/teachers/teacher-list.tsx`

```typescript
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { TeacherCard } from './teacher-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const TeacherList = () => {
  const teachers = useQuery(api.teachers.getAll);

  if (teachers === undefined) {
    return <div>Loading teachers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher._id} teacher={teacher} />
        ))}
      </div>
    </div>
  );
};
```

### 3.2 Teacher Card Component
**File**: `src/components/teachers/teacher-card.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, User } from 'lucide-react';

interface TeacherCardProps {
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    image?: string;
    isActive: boolean;
    _creationTime: number;
  };
}

export const TeacherCard = ({ teacher }: TeacherCardProps) => {
  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            {teacher.image ? (
              <img src={teacher.image} alt={fullName} className="h-10 w-10 rounded-full" />
            ) : (
              <User className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div>
            <CardTitle className="text-lg">{fullName}</CardTitle>
            <p className="text-sm text-gray-500">{teacher.email}</p>
            {teacher.phone && (
              <p className="text-sm text-gray-500">{teacher.phone}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={teacher.isActive ? "default" : "secondary"}>
            {teacher.isActive ? "Active" : "Inactive"}
          </Badge>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

### 3.3 Teacher Form Component
**File**: `src/components/teachers/teacher-form.tsx`

```typescript
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TeacherFormProps {
  teacher?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    image?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TeacherForm = ({ teacher, onSuccess, onCancel }: TeacherFormProps) => {
  const [firstName, setFirstName] = useState(teacher?.firstName || '');
  const [lastName, setLastName] = useState(teacher?.lastName || '');
  const [email, setEmail] = useState(teacher?.email || '');
  const [phone, setPhone] = useState(teacher?.phone || '');
  const [image, setImage] = useState(teacher?.image || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createTeacher = useMutation(api.teachers.create);
  const updateTeacher = useMutation(api.teachers.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (teacher) {
        await updateTeacher({
          id: teacher._id,
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          image: image || undefined,
        });
      } else {
        await createTeacher({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          image: image || undefined,
        });
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{teacher ? 'Edit Teacher' : 'Add Teacher'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Image URL (Optional)</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : teacher ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
```

## Phase 4: Pages and Routing

### 4.1 Teachers Page
**File**: `src/app/teachers/page.tsx`

```typescript
import { TeacherList } from '@/components/teachers/teacher-list';

export default function TeachersPage() {
  return (
    <div className="container mx-auto py-6">
      <TeacherList />
    </div>
  );
}
```

### 4.2 Add Teacher Page
**File**: `src/app/teachers/add/page.tsx`

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { TeacherForm } from '@/components/teachers/teacher-form';

export default function AddTeacherPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/teachers');
  };

  const handleCancel = () => {
    router.push('/teachers');
  };

  return (
    <div className="container mx-auto py-6">
      <TeacherForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
```

## Phase 5: Testing

### 5.1 Unit Tests for Convex Functions
**File**: `src/__tests__/teachers.test.ts`

```typescript
import { ConvexTestingHelper } from "convex/testing";
import { api } from "@/convex/_generated/api";

describe("Teacher CRUD", () => {
  let t: ConvexTestingHelper;

  beforeEach(() => {
    t = new ConvexTestingHelper();
  });

  afterEach(() => {
    t.cleanup();
  });

  it("should create a teacher", async () => {
    const teacherId = await t.mutation(api.teachers.create, {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    });

    expect(teacherId).toBeDefined();
  });

  it("should get all teachers", async () => {
    await t.mutation(api.teachers.create, {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    });

    const teachers = await t.query(api.teachers.getAll);
    expect(teachers).toHaveLength(1);
    expect(teachers[0].firstName).toBe("John");
    expect(teachers[0].lastName).toBe("Doe");
  });

  it("should update a teacher", async () => {
    const teacherId = await t.mutation(api.teachers.create, {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    });

    await t.mutation(api.teachers.update, {
      id: teacherId,
      firstName: "Jane",
    });

    const teacher = await t.query(api.teachers.getById, { id: teacherId });
    expect(teacher.firstName).toBe("Jane");
    expect(teacher.lastName).toBe("Doe");
  });

  it("should soft delete a teacher", async () => {
    const teacherId = await t.mutation(api.teachers.create, {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    });

    await t.mutation(api.teachers.remove, { id: teacherId });

    const teacher = await t.query(api.teachers.getById, { id: teacherId });
    expect(teacher.isActive).toBe(false);
  });
});
```

### 5.2 Component Tests
**File**: `src/__tests__/teacher-list.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { TeacherList } from '@/components/teachers/teacher-list';

// Mock Convex
jest.mock('convex/react', () => ({
  useQuery: () => [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isActive: true,
    }
  ]
}));

describe('TeacherList', () => {
  it('renders teacher list', () => {
    render(<TeacherList />);
    expect(screen.getByText('Teachers')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## Phase 6: Error Handling & Validation

### 6.1 Input Validation
- Email format validation
- Name length validation
- Duplicate email prevention
- Required field validation

### 6.2 Error Messages
- User-friendly error messages
- Loading states
- Success notifications
- Form validation feedback

## Implementation Order

1. **Phase 1**: Create Convex schema for teachers
2. **Phase 2**: Implement Convex functions (backend)
3. **Phase 3**: Create basic UI components
4. **Phase 4**: Set up pages and routing
5. **Phase 5**: Add comprehensive testing
6. **Phase 6**: Implement error handling

## Success Criteria

- [ ] Teachers can be created, read, updated, and deleted
- [ ] Real-time updates when teachers are modified
- [ ] Proper error handling and validation
- [ ] All tests passing
- [ ] UI is responsive and user-friendly
- [ ] Type safety throughout the application

## Teacher Entity Structure

```typescript
interface Teacher {
  _id: string;           // Convex-generated ID
  firstName: string;     // Required
  lastName: string;      // Required
  email: string;         // Required, unique
  phone?: string;        // Optional
  image?: string;        // Optional profile image URL
  isActive: boolean;     // Default: true
  _creationTime: number; // Convex auto-generated
}
```

This plan provides a solid foundation for implementing teacher CRUD operations as a separate entity from users, without the complexity of authentication for now.
