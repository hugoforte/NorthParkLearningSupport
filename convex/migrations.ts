import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Migration to populate grades table with K through 8
export const populateGrades = mutation({
  args: {},
  handler: async (ctx) => {
    const grades = [
      { name: "Kindergarten", level: 0, description: "Kindergarten" },
      { name: "1st Grade", level: 1, description: "First Grade" },
      { name: "2nd Grade", level: 2, description: "Second Grade" },
      { name: "3rd Grade", level: 3, description: "Third Grade" },
      { name: "4th Grade", level: 4, description: "Fourth Grade" },
      { name: "5th Grade", level: 5, description: "Fifth Grade" },
      { name: "6th Grade", level: 6, description: "Sixth Grade" },
      { name: "7th Grade", level: 7, description: "Seventh Grade" },
      { name: "8th Grade", level: 8, description: "Eighth Grade" },
    ];

    const results = [];

    for (const grade of grades) {
      // Check if grade already exists
      const existing = await ctx.db
        .query("grades")
        .withIndex("by_level", (q) => q.eq("level", grade.level))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("grades", {
          ...grade,
          isActive: true,
        });
        results.push({ action: "created", id, grade: grade.name });
      } else {
        results.push({
          action: "skipped",
          id: existing._id,
          grade: grade.name,
        });
      }
    }

    return results;
  },
});

// Migration to clear all grades (use with caution!)
export const clearGrades = mutation({
  args: {},
  handler: async (ctx) => {
    const allGrades = await ctx.db.query("grades").collect();

    for (const grade of allGrades) {
      await ctx.db.delete(grade._id);
    }

    return { deleted: allGrades.length };
  },
});

// Migration to populate subjects table with common subjects
export const populateSubjects = mutation({
  args: {},
  handler: async (ctx) => {
    const subjects = [
      { name: "Mathematics", description: "Math and numerical skills" },
      {
        name: "English Language Arts",
        description: "Reading, writing, and communication",
      },
      { name: "Science", description: "Scientific inquiry and discovery" },
      { name: "Social Studies", description: "History, geography, and civics" },
      {
        name: "Physical Education",
        description: "Physical fitness and health",
      },
      { name: "Art", description: "Creative expression and visual arts" },
      { name: "Music", description: "Musical education and appreciation" },
      { name: "Foreign Language", description: "Second language learning" },
      { name: "Computer Science", description: "Technology and programming" },
      { name: "Life Skills", description: "Practical life and social skills" },
    ];

    const results = [];

    for (const subject of subjects) {
      // Check if subject already exists
      const existing = await ctx.db
        .query("subjects")
        .withIndex("by_name", (q) => q.eq("name", subject.name))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("subjects", {
          ...subject,
          isActive: true,
        });
        results.push({ action: "created", id, subject: subject.name });
      } else {
        results.push({
          action: "skipped",
          id: existing._id,
          subject: subject.name,
        });
      }
    }

    return results;
  },
});
