# Teacher to User Migration Plan

## Overview
This plan migrates the system from a `teachers` table to a more generic `users` table with roles, allowing for future expansion to different user types (teachers, admins, staff, etc.).

## Migration Strategy
We'll do this step-by-step, testing at each stage to ensure nothing breaks.

---

## Phase 1: Backend Schema Changes

### Step 1.1: Update Schema References
**Goal**: Change all database references from `teacher` to `user` without breaking existing functionality.

**Changes**:
- [x] Update `convex/schema.ts`:
  - [x] Change `teacherId` → `userId` in `classAssignments` table
  - [x] Change `authorId` from `Id<"teachers">` → `Id<"users">` in `notes` and `goals` tables
  - [x] Update comments to reflect user references
  - [x] **Keep the `teachers` table name for now**

**Test**: 
- [x] Run `npx convex dev --once` to ensure schema validates
- [x] Verify no TypeScript errors in backend files
- [ ] **MANUAL TEST**: Start dev server (`pnpm run dev`) and verify:
  - [ ] Application loads without errors
  - [ ] Can navigate between pages
  - [ ] No JavaScript errors in browser console

### Step 1.2: Update Backend Functions
**Goal**: Update all Convex backend functions to use user references.

**Changes**:
- [x] Update `convex/classAssignments.ts`:
  - [x] Change `teacherId` → `userId` in all functions
  - [x] Update function names: `getByTeacher` → `getByUser`, etc.
  - [x] Update indexes: `by_teacher` → `by_user`, etc.
- [x] Update `convex/goals.ts`:
  - [x] Change `authorId` from `Id<"teachers">` → `Id<"users">`
- [x] Update `convex/notes.ts`:
  - [x] Change `authorId` from `Id<"teachers">` → `Id<"users">`

**Test**:
- [x] Run `npx convex dev --once` to ensure all functions compile
- [x] Verify no TypeScript errors
- [ ] **MANUAL TEST**: Verify application still works:
  - [ ] Can sign in successfully
  - [ ] Can navigate to all pages
  - [ ] No JavaScript errors in browser console
  - [ ] All existing functionality preserved

### Step 1.3: Create Users API
**Goal**: Create a new `convex/users.ts` file with CRUD operations.

**Changes**:
- [x] Create `convex/users.ts` with:
  - [x] `getAll`, `getById`, `getActive`, `getByRole`, `getByEmail`, `getByAuthUserId`
  - [x] `create`, `update`, `remove`, `hardDelete`
  - [x] All functions should work with `users` table
- [x] **Keep `convex/teachers.ts` for now**

**Test**:
- [x] Run `npx convex dev --once` to ensure new functions compile
- [x] Verify no TypeScript errors
- [x] **MANUAL TEST**: Verify application still works:
  - [x] Can sign in successfully
  - [x] Can navigate to all pages
  - [x] No JavaScript errors in browser console

---

## Phase 2: Schema Table Rename

### Step 2.1: Rename Teachers Table to Users
**Goal**: Actually rename the table in the schema.

**Changes**:
- [ ] Update `convex/schema.ts`:
  - Rename `teachers` table to `users`
  - Make `email` required (not optional)
  - Keep all existing fields (no role field yet)

**Test**:
- [ ] Run `npx convex dev --once`
- [ ] **Expected**: Schema validation should pass
- [ ] **If it fails**: Run migration to clear old data: `npx convex run migrations:clearAuthData`
- [ ] **MANUAL TEST**: Verify application still works:
  - [ ] Can sign in successfully
  - [ ] Can navigate to all pages
  - [ ] No JavaScript errors in browser console

### Step 2.2: Update Auth Functions
**Goal**: Update authentication to work with users table.

**Changes**:
- [ ] Update `convex/auth.ts`:
  - Change `createOrLinkTeacher` → `createOrLinkUser`
  - Update to work with `users` table instead of `teachers`
  - Ensure `getCurrentUser` returns user from `authAccounts` table (for authentication)
  - Remove role field references (not needed yet)

**Test**:
- [ ] Run `npx convex dev --once`
- [ ] **Test authentication**: Try signing in
- [ ] **Expected**: Should work and create user record in `users` table
- [ ] **MANUAL TEST**: Verify authentication works:
  - [ ] Can sign in with Google
  - [ ] Shows as authenticated after login
  - [ ] Can navigate to all pages
  - [ ] No JavaScript errors in browser console

### Step 2.3: Remove Old Teachers File
**Goal**: Clean up old teachers.ts file.

**Changes**:
- [ ] Delete `convex/teachers.ts`

**Test**:
- [ ] Run `npx convex dev --once`
- [ ] Verify no TypeScript errors
- [ ] **MANUAL TEST**: Verify application still works:
  - [ ] Can sign in successfully
  - [ ] Can navigate to all pages
  - [ ] No JavaScript errors in browser console

---

## Phase 3: Frontend Updates

### Step 3.1: Update Auth Context
**Goal**: Update authentication context to use new user system.

**Changes**:
- [ ] Update `src/components/auth/auth-context.tsx`:
  - Change `createOrLinkTeacher` → `createOrLinkUser`
  - Update User interface to match users table structure
  - Ensure authentication flow works

**Test**:
- [ ] **Test authentication**: Try signing in
- [ ] **Expected**: Should work and show as authenticated
- [ ] **MANUAL TEST**: Verify authentication works:
  - [ ] Can sign in with Google
  - [ ] Shows as authenticated after login
  - [ ] Can navigate to all pages
  - [ ] No JavaScript errors in browser console

### Step 3.2: Update Component Files (Batch 1)
**Goal**: Update core component files to use users API.

**Files to update**:
- [ ] `src/components/teachers/teacher-form.tsx`
- [ ] `src/components/teachers/teacher-list.tsx`
- [ ] `src/components/teachers/teacher-card.tsx`

**Changes**:
- [ ] Change `api.teachers` → `api.users`
- [ ] Change `Id<"teachers">` → `Id<"users">`
- [ ] Update function calls: `getByTeacher` → `getByUser`, etc.

**Test**:
- [ ] Run `npx tsc --noEmit` to check for TypeScript errors
- [ ] **Expected**: Should have fewer TypeScript errors

### Step 3.3: Update Component Files (Batch 2)
**Goal**: Update remaining component files.

**Files to update**:
- [ ] `src/components/class-assignments/assignment-form.tsx`
- [ ] `src/components/class-assignments/assignment-list.tsx`
- [ ] `src/components/classes/class-card.tsx`

**Changes**:
- [ ] Change `api.teachers` → `api.users`
- [ ] Change `teacherId` → `userId` in assignment objects
- [ ] Update function calls and references

**Test**:
- [ ] Run `npx tsc --noEmit` to check for TypeScript errors
- [ ] **Expected**: Should have fewer TypeScript errors

### Step 3.4: Update Component Files (Batch 3)
**Goal**: Update notes and goals components.

**Files to update**:
- [ ] `src/components/notes/note-form.tsx`
- [ ] `src/components/notes/note-list.tsx`
- [ ] `src/components/notes/note-card.tsx`
- [ ] `src/components/goals/goal-form.tsx`
- [ ] `src/components/goals/goal-list.tsx`

**Changes**:
- [ ] Change `api.teachers` → `api.users`
- [ ] Change `Id<"teachers">` → `Id<"users">` for authorId
- [ ] Update function calls and references

**Test**:
- [ ] Run `npx tsc --noEmit` to check for TypeScript errors
- [ ] **Expected**: Should have fewer TypeScript errors

### Step 3.5: Update Student Components
**Goal**: Update student-related components.

**Files to update**:
- [ ] `src/components/students/student-class-section.tsx`
- [ ] `src/components/students/student-dashboard.tsx`
- [ ] `src/components/students/student-goals-section.tsx`
- [ ] `src/components/students/student-notes-section.tsx`

**Changes**:
- [ ] Change `api.teachers` → `api.users`
- [ ] Change `Id<"teachers">` → `Id<"users">`
- [ ] Update function calls and references

**Test**:
- [ ] Run `npx tsc --noEmit` to check for TypeScript errors
- [ ] **Expected**: Should have no TypeScript errors

### Step 3.6: Update App Pages
**Goal**: Update app page files.

**Files to update**:
- [ ] `src/app/teachers/page.tsx`
- [ ] `src/app/teachers/add/page.tsx`
- [ ] `src/app/teachers/edit/[id]/page.tsx`
- [ ] `src/app/goals/edit/[id]/page.tsx`
- [ ] `src/app/notes/edit/[id]/page.tsx`

**Changes**:
- [ ] Change `api.teachers` → `api.users`
- [ ] Change `Id<"teachers">` → `Id<"users">`
- [ ] Update function calls and references

**Test**:
- [ ] Run `npx tsc --noEmit` to check for TypeScript errors
- [ ] **Expected**: Should have no TypeScript errors

---

## Phase 4: Final Testing

### Step 4.1: TypeScript Check
**Goal**: Ensure no TypeScript errors.

**Test**:
- [ ] Run `npx tsc --noEmit`
- [ ] **Expected**: No TypeScript errors

### Step 4.2: Build Test
**Goal**: Ensure application builds successfully.

**Test**:
- [ ] Run `pnpm run build`
- [ ] **Expected**: Build should complete successfully

### Step 4.3: Authentication Test
**Goal**: Ensure authentication still works.

**Test**:
- [ ] Sign in with Google
- [ ] **Expected**: Should work and show as authenticated
- [ ] Check that user record is created in `users` table

### Step 4.4: Functionality Test
**Goal**: Test core functionality.

**Test**:
- [ ] Create a user (formerly teacher)
- [ ] Create a class assignment
- [ ] Create a note
- [ ] Create a goal
- [ ] **Expected**: All operations should work

---

## Rollback Plan

If anything goes wrong at any step:

1. **Git revert** the current changes
2. **Run migration** to clear any corrupted data: `npx convex run migrations:clearAuthData`
3. **Regenerate types**: `npx convex dev --once`
4. **Test authentication** to ensure it's working again

---

## Success Criteria

- [ ] No TypeScript errors
- [ ] Application builds successfully
- [ ] Authentication works
- [ ] All CRUD operations work with users table
- [ ] Database schema uses `users` table instead of `teachers`
- [ ] All frontend components use `api.users` instead of `api.teachers`

---

## Manual Testing Checklist

**After EVERY step, run these manual tests:**

### Basic Functionality Test
- [ ] Start dev server: `pnpm run dev`
- [ ] Application loads without errors
- [ ] Can navigate between all pages
- [ ] No JavaScript errors in browser console

### Authentication Test
- [ ] Can sign in with Google
- [ ] Shows as authenticated after login
- [ ] Can sign out successfully
- [ ] Authentication state persists on page refresh

### Core Feature Test
- [ ] Can create/edit/delete users (formerly teachers)
- [ ] Can create/edit/delete class assignments
- [ ] Can create/edit/delete notes
- [ ] Can create/edit/delete goals
- [ ] All CRUD operations work correctly

### Error Handling Test
- [ ] No TypeScript compilation errors
- [ ] No runtime JavaScript errors
- [ ] No network/API errors in browser dev tools
- [ ] All forms submit successfully

## Notes

- **Test after each step** - don't proceed until the current step is working
- **Keep backups** - commit after each successful step
- **Database will be cleared** - this is expected and necessary for schema changes
- **Authentication will work** - the flow remains the same, just with different table names
- **Manual testing is critical** - automated tests can miss UI/UX issues
