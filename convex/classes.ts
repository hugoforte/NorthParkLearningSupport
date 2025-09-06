import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all classes
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("classes").collect();
  },
});

// Get class by ID
export const getById = query({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    const classItem = await ctx.db.get(args.id);
    if (!classItem) {
      throw new Error("Class not found");
    }
    return classItem;
  },
});

// Get classes by grade
export const getByGrade = query({
  args: { gradeId: v.id("grades") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classes")
      .withIndex("by_grade", (q) => q.eq("gradeId", args.gradeId))
      .collect();
  },
});

// Get active classes only
export const getActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("classes")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Search classes by name
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classes")
      .filter((q) => q.eq(q.field("name"), args.query))
      .collect();
  },
});

// Create class
export const create = mutation({
  args: {
    name: v.string(),
    gradeId: v.id("grades"),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("classes", {
      ...args,
      isActive: true,
    });
  },
});

// Update class
export const update = mutation({
  args: {
    id: v.id("classes"),
    name: v.optional(v.string()),
    gradeId: v.optional(v.id("grades")),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const classItem = await ctx.db.get(id);
    if (!classItem) {
      throw new Error("Class not found");
    }

    return await ctx.db.patch(id, updates);
  },
});

// Soft delete class (set isActive to false)
export const remove = mutation({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    const classItem = await ctx.db.get(args.id);
    if (!classItem) {
      throw new Error("Class not found");
    }

    return await ctx.db.patch(args.id, { isActive: false });
  },
});

// Hard delete class
export const hardDelete = mutation({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    const classItem = await ctx.db.get(args.id);
    if (!classItem) {
      throw new Error("Class not found");
    }

    return await ctx.db.delete(args.id);
  },
});
