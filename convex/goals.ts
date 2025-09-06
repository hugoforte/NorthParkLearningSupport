import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all goals
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("goals")
      .collect();
  },
});

// Get goal by ID
export const getById = query({
  args: { id: v.id("goals") },
  handler: async (ctx, args) => {
    const goal = await ctx.db.get(args.id);
    if (!goal) {
      throw new Error("Goal not found");
    }
    return goal;
  },
});

// Get goals by student
export const getByStudent = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("goals")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});

// Get goals by author (teacher)
export const getByAuthor = query({
  args: { authorId: v.id("teachers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("goals")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();
  },
});

// Get completed goals
export const getCompleted = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("goals")
      .withIndex("by_completed", (q) => q.eq("isCompleted", true))
      .collect();
  },
});

// Get pending goals
export const getPending = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("goals")
      .withIndex("by_completed", (q) => q.eq("isCompleted", false))
      .collect();
  },
});

// Get goals by student and completion status
export const getByStudentAndStatus = query({
  args: { 
    studentId: v.id("students"),
    isCompleted: v.boolean()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("goals")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .filter((q) => q.eq(q.field("isCompleted"), args.isCompleted))
      .collect();
  },
});

// Get goals by status
export const getByStatus = query({
  args: { 
    status: v.union(
      v.literal("NOT_STARTED"),
      v.literal("IN_PROGRESS"),
      v.literal("COMPLETED"),
      v.literal("ON_HOLD"),
      v.literal("CANCELLED")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("goals")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Create goal
export const create = mutation({
  args: {
    studentId: v.id("students"),
    authorId: v.id("teachers"),
    subjectIds: v.array(v.id("subjects")),
    note: v.string(),
    status: v.optional(v.union(
      v.literal("NOT_STARTED"),
      v.literal("IN_PROGRESS"),
      v.literal("COMPLETED"),
      v.literal("ON_HOLD"),
      v.literal("CANCELLED")
    )),
    targetDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("goals", {
      ...args,
      isCompleted: false,
      status: args.status ?? "NOT_STARTED",
    });
  },
});

// Update goal
export const update = mutation({
  args: {
    id: v.id("goals"),
    subjectIds: v.optional(v.array(v.id("subjects"))),
    note: v.optional(v.string()),
    isCompleted: v.optional(v.boolean()),
    status: v.optional(v.union(
      v.literal("NOT_STARTED"),
      v.literal("IN_PROGRESS"),
      v.literal("COMPLETED"),
      v.literal("ON_HOLD"),
      v.literal("CANCELLED")
    )),
    targetDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const goal = await ctx.db.get(id);
    if (!goal) {
      throw new Error("Goal not found");
    }

    return await ctx.db.patch(id, updates);
  },
});

// Mark goal as completed
export const markCompleted = mutation({
  args: { id: v.id("goals") },
  handler: async (ctx, args) => {
    const goal = await ctx.db.get(args.id);
    if (!goal) {
      throw new Error("Goal not found");
    }

    return await ctx.db.patch(args.id, { isCompleted: true, status: "COMPLETED" });
  },
});

// Mark goal as pending
export const markPending = mutation({
  args: { id: v.id("goals") },
  handler: async (ctx, args) => {
    const goal = await ctx.db.get(args.id);
    if (!goal) {
      throw new Error("Goal not found");
    }

    return await ctx.db.patch(args.id, { isCompleted: false, status: "NOT_STARTED" });
  },
});

// Update goal status
export const updateStatus = mutation({
  args: { 
    id: v.id("goals"),
    status: v.union(
      v.literal("NOT_STARTED"),
      v.literal("IN_PROGRESS"),
      v.literal("COMPLETED"),
      v.literal("ON_HOLD"),
      v.literal("CANCELLED")
    )
  },
  handler: async (ctx, args) => {
    const goal = await ctx.db.get(args.id);
    if (!goal) {
      throw new Error("Goal not found");
    }

    const isCompleted = args.status === "COMPLETED";
    return await ctx.db.patch(args.id, { status: args.status, isCompleted });
  },
});

// Delete goal
export const remove = mutation({
  args: { id: v.id("goals") },
  handler: async (ctx, args) => {
    const goal = await ctx.db.get(args.id);
    if (!goal) {
      throw new Error("Goal not found");
    }

    return await ctx.db.delete(args.id);
  },
});
