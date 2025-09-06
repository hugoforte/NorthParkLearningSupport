import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all class assignments
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("classAssignments")
      .collect();
  },
});

// Get assignments by teacher
export const getByTeacher = query({
  args: { teacherId: v.id("teachers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classAssignments")
      .withIndex("by_teacher", (q) => q.eq("teacherId", args.teacherId))
      .collect();
  },
});

// Get assignments by class
export const getByClass = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classAssignments")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();
  },
});

// Get specific assignment
export const getByTeacherAndClass = query({
  args: { 
    teacherId: v.id("teachers"),
    classId: v.id("classes")
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classAssignments")
      .withIndex("by_teacher_class", (q) => 
        q.eq("teacherId", args.teacherId).eq("classId", args.classId)
      )
      .first();
  },
});

// Create class assignment
export const create = mutation({
  args: {
    teacherId: v.id("teachers"),
    classId: v.id("classes"),
    role: v.string(), // 'teacher' | 'assistant'
  },
  handler: async (ctx, args) => {
    // Check if assignment already exists
    const existing = await ctx.db
      .query("classAssignments")
      .withIndex("by_teacher_class", (q) => 
        q.eq("teacherId", args.teacherId).eq("classId", args.classId)
      )
      .first();

    if (existing) {
      throw new Error("Teacher is already assigned to this class");
    }

    return await ctx.db.insert("classAssignments", args);
  },
});

// Update class assignment
export const update = mutation({
  args: {
    id: v.id("classAssignments"),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const assignment = await ctx.db.get(id);
    if (!assignment) {
      throw new Error("Class assignment not found");
    }

    return await ctx.db.patch(id, updates);
  },
});

// Delete class assignment
export const remove = mutation({
  args: { id: v.id("classAssignments") },
  handler: async (ctx, args) => {
    const assignment = await ctx.db.get(args.id);
    if (!assignment) {
      throw new Error("Class assignment not found");
    }

    return await ctx.db.delete(args.id);
  },
});

// Remove teacher from class (by teacher and class IDs)
export const removeByTeacherAndClass = mutation({
  args: { 
    teacherId: v.id("teachers"),
    classId: v.id("classes")
  },
  handler: async (ctx, args) => {
    const assignment = await ctx.db
      .query("classAssignments")
      .withIndex("by_teacher_class", (q) => 
        q.eq("teacherId", args.teacherId).eq("classId", args.classId)
      )
      .first();

    if (!assignment) {
      throw new Error("Class assignment not found");
    }

    return await ctx.db.delete(assignment._id);
  },
});
