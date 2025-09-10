import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all teachers
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("teachers").collect();
  },
});

// Get teacher by ID
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

// Search teachers by name
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teachers")
      .filter((q) =>
        q.or(
          q.eq(q.field("firstName"), args.query),
          q.eq(q.field("lastName"), args.query),
        ),
      )
      .collect();
  },
});

// Get active teachers only
export const getActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("teachers")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Get teacher by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teachers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get teacher by auth user ID
export const getByAuthUserId = query({
  args: { authUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teachers")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", args.authUserId))
      .first();
  },
});

// Create teacher
export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    authUserId: v.optional(v.string()), // ID of the authUser this teacher represents
  },
  handler: async (ctx, args) => {
    // For now, we'll determine the creator from the authUserId if provided
    // In the future, this should be determined from the session/auth context
    let createdBy: string;
    
    if (args.authUserId) {
      // Verify the authUserId exists
      const authUser = await ctx.db
        .query("authUsers")
        .filter((q) => q.eq(q.field("id"), args.authUserId))
        .first();
      
      if (!authUser) {
        throw new Error("Invalid auth user ID");
      }
      
      createdBy = args.authUserId;
    } else {
      // For manually created teachers without authUserId, we need a way to identify the creator
      // This is a temporary solution - ideally we'd get this from session context
      throw new Error("Cannot determine creator - authentication context not available");
    }

    // Check for duplicate email if provided
    if (args.email) {
      const existingTeacher = await ctx.db
        .query("teachers")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();
      
      if (existingTeacher) {
        throw new Error(`A teacher with email ${args.email} already exists`);
      }
    }

    // Check for duplicate authUserId if provided
    if (args.authUserId) {
      const existingTeacher = await ctx.db
        .query("teachers")
        .withIndex("by_auth_user", (q) => q.eq("authUserId", args.authUserId))
        .first();
      
      if (existingTeacher) {
        throw new Error(`A teacher is already associated with this user account`);
      }
    }
    
    return await ctx.db.insert("teachers", {
      ...args,
      createdBy, // Set createdBy to the authUser ID on the backend
      isActive: true,
    });
  },
});

// Update teacher
export const update = mutation({
  args: {
    id: v.id("teachers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const teacher = await ctx.db.get(id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Email is not allowed to be updated - it's tied to the auth user
    // Remove email from updates if somehow passed in
    const { email: _, ...safeUpdates } = updates as any;

    return await ctx.db.patch(id, safeUpdates);
  },
});

// Soft delete teacher (set isActive to false)
export const remove = mutation({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    return await ctx.db.patch(args.id, { isActive: false });
  },
});

// Hard delete teacher
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
