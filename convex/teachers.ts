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

// Create teacher
export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teachers", {
      ...args,
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

    return await ctx.db.patch(id, updates);
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
