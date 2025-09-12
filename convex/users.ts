import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all users
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("teachers").collect(); // Will be changed to "users" in Phase 2
  },
});

// Get user by ID
export const getById = query({
  args: { id: v.id("teachers") }, // Will be changed to "users" in Phase 2
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
});

// Get active users
export const getActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("teachers") // Will be changed to "users" in Phase 2
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Get users by role (will be implemented in Phase 2 when role field is added)
export const getByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    // TODO: Implement when role field is added to schema in Phase 2
    return await ctx.db.query("teachers").collect();
  },
});

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase();
    return await ctx.db
      .query("teachers") // Will be changed to "users" in Phase 2
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
  },
});

// Get user by auth user ID
export const getByAuthUserId = query({
  args: { authUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teachers") // Will be changed to "users" in Phase 2
      .withIndex("by_auth_user", (q) => q.eq("authUserId", args.authUserId))
      .first();
  },
});

// Search users by name
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const term = args.searchTerm.toLowerCase();
    return await ctx.db
      .query("teachers") // Will be changed to "users" in Phase 2
      .withIndex("by_name")
      .filter((q) => 
        q.or(
          q.eq(q.field("firstName"), term),
          q.eq(q.field("lastName"), term),
          q.eq(q.field("email"), term)
        )
      )
      .collect();
  },
});

// Create user
export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    currentUserId: v.string(), // ID of the current authenticated user (validated on backend)
  },
  handler: async (ctx, args) => {
    // Validate authentication using Convex Auth
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }
    const userId = identity.subject;

    // Normalize email
    const normalizedEmail = args.email.toLowerCase();

    // Check if user with this email already exists
    const existingUser = await ctx.db
      .query("teachers") // Will be changed to "users" in Phase 2
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    // Remove currentUserId from args and add backend-determined createdBy
    const { currentUserId, ...userData } = args;
    
    return await ctx.db.insert("teachers", { // Will be changed to "users" in Phase 2
      ...userData,
      email: normalizedEmail,
      isActive: userData.isActive ?? true, // Default to active
      createdBy: userId, // Set createdBy to the authenticated user ID
    });
  },
});

// Update user
export const update = mutation({
  args: {
    id: v.id("teachers"), // Will be changed to "users" in Phase 2
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const user = await ctx.db.get(id);
    if (!user) {
      throw new Error("User not found");
    }

    // If email is being updated, normalize it and check for duplicates
    if (updates.email) {
      const normalizedEmail = updates.email.toLowerCase();
      
      // Check if another user with this email already exists
      const existingUser = await ctx.db
        .query("teachers") // Will be changed to "users" in Phase 2
        .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
        .first();

      if (existingUser && existingUser._id !== id) {
        throw new Error("A user with this email already exists");
      }

      updates.email = normalizedEmail;
    }

    return await ctx.db.patch(id, updates);
  },
});

// Soft delete user (mark as inactive)
export const remove = mutation({
  args: { id: v.id("teachers") }, // Will be changed to "users" in Phase 2
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }

    // Soft delete by marking as inactive
    return await ctx.db.patch(args.id, { isActive: false });
  },
});

// Hard delete user (permanent removal)
export const hardDelete = mutation({
  args: { id: v.id("teachers") }, // Will be changed to "users" in Phase 2
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }

    // TODO: Add checks for related records (class assignments, notes, goals)
    // For now, we'll allow hard delete but this should be enhanced

    return await ctx.db.delete(args.id);
  },
});

// Activate user
export const activate = mutation({
  args: { id: v.id("teachers") }, // Will be changed to "users" in Phase 2
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.patch(args.id, { isActive: true });
  },
});

// Deactivate user
export const deactivate = mutation({
  args: { id: v.id("teachers") }, // Will be changed to "users" in Phase 2
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.patch(args.id, { isActive: false });
  },
});
