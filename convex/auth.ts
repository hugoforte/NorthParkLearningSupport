import Google from "@auth/core/providers/google";
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    
    // Get user from authAccounts table
    const user = await ctx.db.get(userId);
    return user;
  },
});

export const createOrLinkTeacher = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User must be authenticated");
    }
    
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const userEmail = user.email?.toLowerCase();
    if (!userEmail) {
      throw new Error("User email is required");
    }
    
    // Check if there's already a teacher with this email (case insensitive)
    const existingTeacher = await ctx.db
      .query("teachers")
      .filter((q) => q.eq(q.field("email"), userEmail))
      .first();
    
    if (existingTeacher) {
      // Link existing teacher to this user if not already linked
      if (!existingTeacher.authUserId) {
        await ctx.db.patch(existingTeacher._id, {
          authUserId: userId,
        });
      }
      return existingTeacher._id;
    } else {
      // Create new teacher record
      const teacherId = await ctx.db.insert("teachers", {
        firstName: user.name?.split(" ")[0] ?? "Unknown",
        lastName: user.name?.split(" ").slice(1).join(" ") ?? "User",
        email: userEmail,
        authUserId: userId,
        isActive: true,
        createdBy: userId,
      });
      return teacherId;
    }
  },
});



