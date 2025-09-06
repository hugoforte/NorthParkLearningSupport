import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all grades
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("grades")
      .collect();
  },
});

// Get grade by ID
export const getById = query({
  args: { id: v.id("grades") },
  handler: async (ctx, args) => {
    const grade = await ctx.db.get(args.id);
    if (!grade) {
      throw new Error("Grade not found");
    }
    return grade;
  },
});

// Get grades by level
export const getByLevel = query({
  args: { level: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("grades")
      .withIndex("by_level", (q) => q.eq("level", args.level))
      .first();
  },
});

// Get active grades only
export const getActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("grades")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Create grade
export const create = mutation({
  args: {
    name: v.string(),
    level: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("grades", {
      ...args,
      isActive: true,
    });
  },
});

// Update grade
export const update = mutation({
  args: {
    id: v.id("grades"),
    name: v.optional(v.string()),
    level: v.optional(v.number()),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const grade = await ctx.db.get(id);
    if (!grade) {
      throw new Error("Grade not found");
    }

    return await ctx.db.patch(id, updates);
  },
});

// Soft delete grade (set isActive to false)
export const remove = mutation({
  args: { id: v.id("grades") },
  handler: async (ctx, args) => {
    const grade = await ctx.db.get(args.id);
    if (!grade) {
      throw new Error("Grade not found");
    }

    return await ctx.db.patch(args.id, { isActive: false });
  },
});
