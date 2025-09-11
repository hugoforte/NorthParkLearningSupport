import { internalMutation } from "./_generated/server";

// Migration functions temporarily disabled during Convex Auth migration
// These will be re-enabled once the new auth system is fully working

console.log("Migrations temporarily disabled during Convex Auth migration");

// Clear old Better Auth data that's incompatible with Convex Auth schema
export const clearAuthData = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Clearing old Better Auth data...");
    
    // Clear old auth tables that might still exist
    try {
      const authUsers = await ctx.db.query("users").collect();
      for (const user of authUsers) {
        await ctx.db.delete(user._id);
      }
      console.log(`Cleared ${authUsers.length} old users`);
    } catch (e) {
      console.log("No old users table found");
    }
    
    try {
      const authAccounts = await ctx.db.query("authAccounts").collect();
      for (const account of authAccounts) {
        await ctx.db.delete(account._id);
      }
      console.log(`Cleared ${authAccounts.length} old accounts`);
    } catch (e) {
      console.log("No old accounts table found");
    }
    
    try {
      const authSessions = await ctx.db.query("authSessions").collect();
      for (const session of authSessions) {
        await ctx.db.delete(session._id);
      }
      console.log(`Cleared ${authSessions.length} old sessions`);
    } catch (e) {
      console.log("No old sessions table found");
    }
    
    return "Auth data cleared successfully";
  },
});