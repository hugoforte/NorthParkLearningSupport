import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teachers: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    isActive: v.boolean(),
  })
    .index("by_active", ["isActive"])
    .index("by_name", ["lastName", "firstName"]),
});
