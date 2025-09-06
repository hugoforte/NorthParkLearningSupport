import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all students
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("students").collect();
  },
});

// Get student by ID
export const getById = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.id);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  },
});

// Get students by class
export const getByClass = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();
  },
});

// Get active students only
export const getActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("students")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Get active students by class
export const getActiveByClass = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Search students by name
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .withIndex("by_name", (q) => q.eq("lastName", args.query))
      .collect();
  },
});

// Create student
export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    classId: v.id("classes"),
    studentId: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("students", {
      ...args,
      isActive: true,
    });
  },
});

// Update student
export const update = mutation({
  args: {
    id: v.id("students"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    classId: v.optional(v.id("classes")),
    studentId: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const student = await ctx.db.get(id);
    if (!student) {
      throw new Error("Student not found");
    }

    return await ctx.db.patch(id, updates);
  },
});

// Soft delete student (set isActive to false)
export const remove = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.id);
    if (!student) {
      throw new Error("Student not found");
    }

    return await ctx.db.patch(args.id, { isActive: false });
  },
});

// Hard delete student
export const hardDelete = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.id);
    if (!student) {
      throw new Error("Student not found");
    }

    return await ctx.db.delete(args.id);
  },
});
