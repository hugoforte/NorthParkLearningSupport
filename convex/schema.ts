import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Legacy teachers table (keeping for backward compatibility)
  teachers: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    isActive: v.boolean(),
  })
    .index("by_active", ["isActive"])
    .index("by_name", ["lastName", "firstName"]),

  // Grades (K-9)
  grades: defineTable({
    name: v.string(),
    level: v.number(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_level", ["level"])
    .index("by_active", ["isActive"]),

  // Classes (belong to grades)
  classes: defineTable({
    name: v.string(),
    gradeId: v.id("grades"),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_grade", ["gradeId"])
    .index("by_active", ["isActive"]),

  // Class Assignments (many-to-many: teachers to classes)
  classAssignments: defineTable({
    teacherId: v.id("teachers"),
    classId: v.id("classes"),
    role: v.string(), // 'teacher' | 'assistant'
  })
    .index("by_teacher", ["teacherId"])
    .index("by_class", ["classId"])
    .index("by_teacher_class", ["teacherId", "classId"]),

  // Students (belong to classes)
  students: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    classId: v.id("classes"),
    studentId: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index("by_class", ["classId"])
    .index("by_active", ["isActive"])
    .index("by_name", ["lastName", "firstName"]),

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
  })
    .index("by_student", ["studentId"])
    .index("by_author", ["authorId"])
    .index("by_category", ["category"]),

  // Subjects (Math, Science, English, etc.)
  subjects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_name", ["name"])
    .index("by_active", ["isActive"]),

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
  })
    .index("by_student", ["studentId"])
    .index("by_author", ["authorId"])
    .index("by_completed", ["isCompleted"])
    .index("by_status", ["status"]),
});
