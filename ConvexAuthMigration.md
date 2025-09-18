# Migration Plan: Better Auth → Convex Auth

## Overview
Switch from Better Auth to Convex Auth for simpler, native Convex integration with Google OAuth.

## Phase 1: Dependencies & Environment
- [ ] Install Convex Auth dependencies and remove Better Auth
- [ ] Update environment variables configuration  
- [ ] Set up Google OAuth credentials in Convex environment

## Phase 2: Core Configuration
- [ ] Replace convex/auth.ts with Convex Auth configuration
- [ ] Update Convex schema to use authTables
- [ ] Update root layout with ConvexAuthNextjsServerProvider

## Phase 3: Client-side Changes
- [ ] Replace auth context with Convex Auth hooks
- [ ] Update auth guard component
- [ ] Simplify middleware.ts for Convex Auth

## Phase 4: Cleanup
- [ ] Remove Better Auth API routes and adapter files

## Phase 5: Testing & Verification
- [ ] Test authentication flow and fix any issues
- [ ] Run TypeScript checks and build verification

## Benefits of Migration
- **Simpler**: No custom adapter, no API routes, built-in auth tables
- **Native Integration**: Designed specifically for Convex
- **Less Code**: ~200 lines of auth code vs ~800+ with Better Auth
- **Built-in Security**: Automatic CSRF protection, secure defaults
- **Better DX**: Hooks like `useCurrentUser()` work seamlessly with Convex queries

## Files to be Modified
- `package.json` - Update dependencies
- `src/env.js` - Update environment variables
- `convex/auth.ts` - Replace with Convex Auth config
- `convex/schema.ts` - Use authTables
- `src/app/layout.tsx` - Add ConvexAuthNextjsServerProvider
- `src/components/auth/auth-context.tsx` - Replace with Convex Auth hooks
- `src/components/auth/auth-guard.tsx` - Update for new auth system
- `middleware.ts` - Simplify

## Files to be Removed
- `src/app/api/auth/[...better-auth]/route.ts`
- `src/lib/better-auth-convex-adapter.ts`

## Environment Variables Changes
### Remove:
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`

### Add:
- `AUTH_GOOGLE_ID` (from existing `GOOGLE_CLIENT_ID`)
- `AUTH_GOOGLE_SECRET` (from existing `GOOGLE_CLIENT_SECRET`)
