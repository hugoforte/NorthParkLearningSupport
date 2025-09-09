import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Generic CRUD for Better Auth models

// Users
export const getUserById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("authUsers")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("authUsers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

export const createUser = mutation({
  args: {
    id: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    emailVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("authUsers", args);
    return args;
  },
});

export const updateUser = mutation({
  args: {
    id: v.string(),
    data: v.object({
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      emailVerified: v.optional(v.boolean()),
      updatedAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { id, data }) => {
    const existing = await ctx.db
      .query("authUsers")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
    if (!existing) return null;
    await ctx.db.patch(existing._id, data);
    return { ...existing, ...data };
  },
});

// Accounts
export const getAccountByProviderAccountId = query({
  args: { providerId: v.string(), accountId: v.string() },
  handler: async (ctx, { providerId, accountId }) => {
    return await ctx.db
      .query("authAccounts")
      .filter((q) =>
        q.and(
          q.eq(q.field("providerId"), providerId),
          q.eq(q.field("accountId"), accountId),
        ),
      )
      .first();
  },
});

export const getAccountsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("authAccounts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createAccount = mutation({
  args: {
    id: v.string(),
    userId: v.string(),
    providerId: v.string(),
    accountId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    scope: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.number()),
    refreshTokenExpiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("authAccounts", args);
    return args;
  },
});

export const updateAccount = mutation({
  args: {
    id: v.string(),
    data: v.object({
      accessToken: v.optional(v.string()),
      refreshToken: v.optional(v.string()),
      idToken: v.optional(v.string()),
      scope: v.optional(v.string()),
      accessTokenExpiresAt: v.optional(v.number()),
      refreshTokenExpiresAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { id, data }) => {
    const existing = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
    if (!existing) return null;
    await ctx.db.patch(existing._id, data);
    return { ...existing, ...data };
  },
});

// Sessions
export const getSessionById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("authSessions")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
  },
});

export const getSessionsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("authSessions")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const createSession = mutation({
  args: {
    id: v.string(),
    userId: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("authSessions", args);
    return args;
  },
});

export const updateSession = mutation({
  args: {
    id: v.string(),
    data: v.object({
      expiresAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
      ipAddress: v.optional(v.string()),
      userAgent: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { id, data }) => {
    const existing = await ctx.db
      .query("authSessions")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
    if (!existing) return null;
    await ctx.db.patch(existing._id, data);
    return { ...existing, ...data };
  },
});

export const deleteSession = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db
      .query("authSessions")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
    if (existing) await ctx.db.delete(existing._id);
    return undefined;
  },
});

// Verifications
export const getVerification = query({
  args: { identifier: v.string(), value: v.string() },
  handler: async (ctx, { identifier, value }) => {
    return await ctx.db
      .query("authVerifications")
      .filter((q) =>
        q.and(
          q.eq(q.field("identifier"), identifier),
          q.eq(q.field("value"), value),
        ),
      )
      .first();
  },
});

export const getVerificationsByIdentifier = query({
  args: { identifier: v.string() },
  handler: async (ctx, { identifier }) => {
    return await ctx.db
      .query("authVerifications")
      .filter((q) => q.eq(q.field("identifier"), identifier))
      .collect();
  },
});

export const getVerificationByValue = query({
  args: { value: v.string() },
  handler: async (ctx, { value }) => {
    return await ctx.db
      .query("authVerifications")
      .filter((q) => q.eq(q.field("value"), value))
      .first();
  },
});

export const getVerificationById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("authVerifications")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
  },
});

export const getVerificationDebug = query({
  args: { },
  handler: async (ctx) => {
    const all = await ctx.db.query("authVerifications").collect();
    return all.map((v) => ({ id: v.id, identifier: v.identifier, value: v.value, expiresAt: v.expiresAt }));
  },
});

export const createVerification = mutation({
  args: {
    id: v.string(),
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("authVerifications", args);
    return args;
  },
});

export const deleteVerification = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db
      .query("authVerifications")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
    if (existing) await ctx.db.delete(existing._id);
    return undefined;
  },
});

export const deleteAccount = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
    if (existing) await ctx.db.delete(existing._id);
    return undefined;
  },
});


