import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all notes
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("notes").collect();
  },
});

// Get note by ID
export const getById = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }
    return note;
  },
});

// Get notes by student
export const getByStudent = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();
  },
});

// Get notes by author (teacher)
export const getByAuthor = query({
  args: { authorId: v.id("teachers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();
  },
});

// Get notes by category
export const getByCategory = query({
  args: {
    category: v.union(
      v.literal("ACADEMIC"),
      v.literal("BEHAVIOR"),
      v.literal("SOCIAL"),
      v.literal("HEALTH"),
      v.literal("OTHER"),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Get public notes (non-private)
export const getPublic = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("isPrivate"), false))
      .collect();
  },
});

// Get private notes by author
export const getPrivateByAuthor = query({
  args: { authorId: v.id("teachers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .filter((q) => q.eq(q.field("isPrivate"), true))
      .collect();
  },
});

// Create note
export const create = mutation({
  args: {
    studentId: v.id("students"),
    authorId: v.id("teachers"),
    category: v.union(
      v.literal("ACADEMIC"),
      v.literal("BEHAVIOR"),
      v.literal("SOCIAL"),
      v.literal("HEALTH"),
      v.literal("OTHER"),
    ),
    content: v.string(),
    isPrivate: v.boolean(),
    currentUserId: v.string(), // ID of the current authenticated user (validated on backend)
  },
  handler: async (ctx, args) => {
    // Validate authentication using Convex Auth
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }
    const userId = identity.subject;

    // Remove currentUserId from args and add backend-determined createdBy
    const { currentUserId, ...noteData } = args;
    
    return await ctx.db.insert("notes", {
      ...noteData,
      createdBy: userId, // Set createdBy to the authenticated user ID
    });
  },
});

// Update note
export const update = mutation({
  args: {
    id: v.id("notes"),
    category: v.optional(
      v.union(
        v.literal("ACADEMIC"),
        v.literal("BEHAVIOR"),
        v.literal("SOCIAL"),
        v.literal("HEALTH"),
        v.literal("OTHER"),
      ),
    ),
    content: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const note = await ctx.db.get(id);
    if (!note) {
      throw new Error("Note not found");
    }

    return await ctx.db.patch(id, updates);
  },
});

// Delete note
export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }

    return await ctx.db.delete(args.id);
  },
});
