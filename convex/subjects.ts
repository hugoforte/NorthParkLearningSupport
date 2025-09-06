import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all subjects
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("subjects").collect();
  },
});

// Get subject by ID
export const getById = query({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    const subject = await ctx.db.get(args.id);
    if (!subject) {
      throw new Error("Subject not found");
    }
    return subject;
  },
});

// Get active subjects only
export const getActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("subjects")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Get subject by name
export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subjects")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

// Create subject
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subjects", {
      ...args,
      isActive: true,
    });
  },
});

// Update subject
export const update = mutation({
  args: {
    id: v.id("subjects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const subject = await ctx.db.get(id);
    if (!subject) {
      throw new Error("Subject not found");
    }

    return await ctx.db.patch(id, updates);
  },
});

// Soft delete subject (set isActive to false)
export const remove = mutation({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    const subject = await ctx.db.get(args.id);
    if (!subject) {
      throw new Error("Subject not found");
    }

    return await ctx.db.patch(args.id, { isActive: false });
  },
});

// Hard delete subject
export const hardDelete = mutation({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    const subject = await ctx.db.get(args.id);
    if (!subject) {
      throw new Error("Subject not found");
    }

    return await ctx.db.delete(args.id);
  },
});
