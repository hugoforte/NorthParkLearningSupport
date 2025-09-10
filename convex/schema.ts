import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Legacy teachers table (keeping for backward compatibility)
  teachers: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()), // Email from auth user - must be unique
    authUserId: v.optional(v.string()), // ID of the authUser this teacher represents (if any)
    isActive: v.boolean(),
    createdBy: v.string(), // authUsers.id (who created this record)
  })
    .index("by_active", ["isActive"])
    .index("by_name", ["lastName", "firstName"])
    .index("by_email", ["email"]) // Unique constraint enforced at application level
    .index("by_auth_user", ["authUserId"]) // Index for finding teacher by auth user
    .index("by_created_by", ["createdBy"]),

  // Grades (K-9)
  grades: defineTable({
    name: v.string(),
    level: v.number(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    createdBy: v.string(), // authUsers.id
  })
    .index("by_level", ["level"])
    .index("by_active", ["isActive"])
    .index("by_created_by", ["createdBy"]),

  // Classes (belong to grades)
  classes: defineTable({
    name: v.string(),
    gradeId: v.id("grades"),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    createdBy: v.string(), // authUsers.id
  })
    .index("by_grade", ["gradeId"])
    .index("by_active", ["isActive"])
    .index("by_created_by", ["createdBy"]),

  // Class Assignments (many-to-many: teachers to classes)
  classAssignments: defineTable({
    teacherId: v.id("teachers"),
    classId: v.id("classes"),
    role: v.string(), // 'teacher' | 'assistant'
    createdBy: v.string(), // authUsers.id
  })
    .index("by_teacher", ["teacherId"])
    .index("by_class", ["classId"])
    .index("by_teacher_class", ["teacherId", "classId"])
    .index("by_created_by", ["createdBy"]),

  // Students (belong to classes)
  students: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    classId: v.id("classes"),
    studentId: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    isActive: v.boolean(),
    createdBy: v.string(), // authUsers.id
  })
    .index("by_class", ["classId"])
    .index("by_active", ["isActive"])
    .index("by_name", ["lastName", "firstName"])
    .index("by_created_by", ["createdBy"]),

  // Notes (created by teachers about students)
  notes: defineTable({
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
    createdBy: v.string(), // authUsers.id
  })
    .index("by_student", ["studentId"])
    .index("by_author", ["authorId"])
    .index("by_category", ["category"])
    .index("by_created_by", ["createdBy"]),

  // Subjects (Math, Science, English, etc.)
  subjects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    createdBy: v.string(), // authUsers.id
  })
    .index("by_name", ["name"])
    .index("by_active", ["isActive"])
    .index("by_created_by", ["createdBy"]),

  // Goals (created by teachers for students)
  goals: defineTable({
    studentId: v.id("students"),
    authorId: v.id("teachers"),
    subjectIds: v.array(v.id("subjects")),
    note: v.string(),
    isCompleted: v.boolean(),
    status: v.union(
      v.literal("NOT_STARTED"),
      v.literal("IN_PROGRESS"),
      v.literal("COMPLETED"),
      v.literal("ON_HOLD"),
      v.literal("CANCELLED"),
    ),
    targetDate: v.optional(v.number()),
    createdBy: v.string(), // authUsers.id
  })
    .index("by_student", ["studentId"])
    .index("by_author", ["authorId"])
    .index("by_completed", ["isCompleted"])
    .index("by_status", ["status"])
    .index("by_created_by", ["createdBy"]),

  // Better Auth storage: Users
  authUsers: defineTable({
    id: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    emailVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["id"]) // unique logical id used by Better Auth
    .index("by_email", ["email"]),

  // Better Auth storage: Accounts
  authAccounts: defineTable({
    id: v.string(),
    userId: v.string(), // references authUsers.id
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
  })
    .index("by_account_id", ["id"]) // unique logical id used by Better Auth
    .index("by_user", ["userId"]) // for listing by user
    .index("by_provider_account", ["providerId", "accountId"]),

  // Better Auth storage: Sessions
  authSessions: defineTable({
    id: v.string(), // session token
    userId: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_session_id", ["id"]) // lookup by token
    .index("by_user", ["userId"]),

  // Better Auth storage: Verifications (email / magic link)
  authVerifications: defineTable({
    id: v.string(),
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_verification_id", ["id"])
    .index("by_identifier_value", ["identifier", "value"]),
});
