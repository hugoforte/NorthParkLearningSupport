# Authentication & Authorization

## Authentication Overview

The NorthPark Learning Support application implements a secure authentication system using Convex Auth, supporting both email/password authentication and OAuth providers. The system ensures that only authorized teachers can access student data and create notes.

### Authentication Features
- **Email/Password Authentication** - Traditional login with secure password hashing
- **OAuth Integration** - Google and Microsoft login options
- **Session Management** - Built-in secure session handling
- **Password Reset** - Self-service password recovery
- **Account Security** - Built-in rate limiting and security logging

## Convex Auth Configuration

### Core Configuration

```typescript
// convex/auth.config.js
import { convexAuth } from "@convex-dev/auth/server";
import Google from "@convex-dev/auth/providers/Google";
import { Password } from "@convex-dev/auth/providers/Password";

export default convexAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Password({
      userTable: "users",
      emailField: "email",
      passwordField: "passwordHash",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow sign in for existing users
      if (account?.provider === 'google') {
        const existingUser = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", user.email))
          .first();
        
        if (existingUser) {
          return true;
        }
        
        // Create new user for Google OAuth
        await ctx.db.insert("users", {
          email: user.email,
          name: user.name,
          image: user.image,
          role: "TEACHER", // Default role for new users
          isActive: true,
        });
      }
      
      return true;
    },
  },
});
```

### Auth Functions

```typescript
// convex/auth.ts
import { convexAuth } from "@convex-dev/auth/server";
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

export const signInWithPassword = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || !user.passwordHash) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(args.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    return user;
  },
});
```

## Database Schema for Authentication

### User Model

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.union(v.literal("TEACHER"), v.literal("ADMIN")),
    isActive: v.boolean(),
    emailVerified: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_active", ["isActive"]),

  // Convex Auth tables (automatically managed)
  authAccounts: defineTable({
    userId: v.id("users"),
    type: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
    refreshToken: v.optional(v.string()),
    accessToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    tokenType: v.optional(v.string()),
    scope: v.optional(v.string()),
    idToken: v.optional(v.string()),
    sessionState: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_provider", ["provider", "providerAccountId"]),

  authSessions: defineTable({
    sessionToken: v.string(),
    userId: v.id("users"),
    expires: v.number(),
  })
    .index("by_session_token", ["sessionToken"])
    .index("by_user", ["userId"]),

  authVerificationTokens: defineTable({
    identifier: v.string(),
    token: v.string(),
    expires: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_identifier", ["identifier"]),
});
```

## Authentication Components

### Sign In Component

```typescript
// src/components/auth/signin-form.tsx
import { useState } from 'react';
import { useSignIn } from '@convex-dev/auth/react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';

export const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const signIn = useSignIn();
  const signInWithPassword = useMutation(api.auth.signInWithPassword);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithPassword({ email, password });
      window.location.href = '/dashboard';
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn("google");
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your teacher account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* OAuth Providers */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span className="mr-2">🔗</span>
            )}
            Sign in with Google
          </Button>
        </div>

        {/* Forgot Password Link */}
        <div className="text-center">
          <a
            href="/auth/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Forgot your password?
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Auth Provider

```typescript
// src/components/providers/auth-provider.tsx
'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ReactNode } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <ConvexProvider client={convex}>
      <ConvexAuthProvider>
        {children}
      </ConvexAuthProvider>
    </ConvexProvider>
  );
};
```

### Protected Route Component

```typescript
// src/components/auth/protected-route.tsx
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/convex/_generated/api';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'TEACHER' | 'ADMIN';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const user = useQuery(api.auth.getCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; // Still loading

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }
  }, [user, router, requiredRole]);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};
```

## Authorization System

### Role-Based Access Control

```typescript
// src/lib/auth-utils.ts
export const hasRole = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    TEACHER: 1,
    ADMIN: 2,
  };

  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
         roleHierarchy[requiredRole as keyof typeof roleHierarchy];
};

export const canAccess = (userRole: string, resource: string): boolean => {
  const permissions = {
    TEACHER: [
      'read:own-classes',
      'read:own-students',
      'create:notes',
      'read:own-notes',
      'update:own-notes',
      'delete:own-notes',
    ],
    ADMIN: [
      'read:all-classes',
      'read:all-students',
      'create:users',
      'update:users',
      'delete:users',
      'create:classes',
      'update:classes',
      'delete:classes',
      'create:students',
      'update:students',
      'delete:students',
      'read:all-notes',
    ],
  };

  const userPermissions = permissions[userRole as keyof typeof permissions] || [];
  
  return userPermissions.includes(resource);
};
```

### Authorization Middleware

```typescript
// src/server/api/middleware/auth.ts
import { TRPCError } from '@trpc/server';
import { hasRole, canAccess } from '@/lib/auth-utils';

export const requireAuth = (requiredRole?: string) => {
  return async ({ ctx, next }: any) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      });
    }

    if (requiredRole && !hasRole(ctx.session.user.role, requiredRole)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this resource',
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  };
};

export const requirePermission = (permission: string) => {
  return async ({ ctx, next }: any) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      });
    }

    if (!canAccess(ctx.session.user.role, permission)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  };
};
```

## Session Management

### Session Types

```typescript
// src/types/auth.ts
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'TEACHER' | 'ADMIN';
    } & DefaultSession['user'];
  }

  interface User {
    role: 'TEACHER' | 'ADMIN';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'TEACHER' | 'ADMIN';
  }
}
```

### Session Utilities

```typescript
// src/lib/session-utils.ts
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export const getServerAuthSession = () => {
  return getServerSession(authOptions);
};

export const requireServerAuth = async () => {
  const session = await getServerAuthSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
};

export const requireServerRole = async (requiredRole: string) => {
  const session = await requireServerAuth();
  
  if (!hasRole(session.user.role, requiredRole)) {
    throw new Error('Forbidden');
  }
  
  return session;
};
```

## Password Management

### Password Hashing

```typescript
// src/lib/password.ts
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

### Password Reset

```typescript
// src/lib/password-reset.ts
import crypto from 'crypto';
import { db } from './db';
import { sendEmail } from './email';

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const createPasswordResetToken = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const token = generateResetToken();
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  // Send reset email
  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your NorthPark Learning Support account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}">
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
    `,
  });

  return token;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.expires < new Date()) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await hashPassword(newPassword);

  await db.user.update({
    where: { email: verificationToken.identifier },
    data: { passwordHash: hashedPassword },
  });

  // Delete the used token
  await db.verificationToken.delete({
    where: { token },
  });
};
```

## Security Features

### Rate Limiting

```typescript
// src/lib/rate-limit.ts
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

// Apply rate limiting to auth endpoints
export const authRateLimit = (req: NextRequest) => {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  return rateLimit(ip, 5, 900000); // 5 attempts per 15 minutes
};
```

### Security Headers

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
```

## Environment Variables

### Required Environment Variables

```bash
# .env.local
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/northpark_learning"

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (for password reset)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@northparklearning.com
```

## Authentication Pages

### Sign In Page

```typescript
// src/app/auth/signin/page.tsx
import { getProviders } from 'next-auth/react';
import { SignInForm } from '@/components/auth/signin-form';
import { AuthLayout } from '@/components/layouts/auth-layout';

export default async function SignInPage() {
  const providers = await getProviders();

  return (
    <AuthLayout>
      <SignInForm providers={providers} />
    </AuthLayout>
  );
}
```

### Sign Out Page

```typescript
// src/app/auth/signout/page.tsx
'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SignOutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Signing out...</h2>
        <p className="text-gray-600">You will be redirected shortly.</p>
      </div>
    </div>
  );
}
```

## Testing Authentication

### Authentication Tests

```typescript
// src/__tests__/auth.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { SignInForm } from '@/components/auth/signin-form';

jest.mock('next-auth/react');

describe('SignInForm', () => {
  it('should render sign in form', () => {
    render(<SignInForm providers={{}} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should handle email sign in', async () => {
    const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
    mockSignIn.mockResolvedValue({ error: null, status: 200, ok: true, url: null });

    render(<SignInForm providers={{}} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'teacher@school.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'teacher@school.com',
        password: 'password123',
        redirect: false,
      });
    });
  });
});
```
