import { internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

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

// Seed database with sample data
export const seedDatabase = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("Seeding database with sample data...");
    
    // Create a system user ID for seeding (since we need createdBy for all records)
    const systemUserId = "system-seed";
    
    // 1. Create Grades (K-9)
    const grades = [
      { name: "Kindergarten", level: 0, description: "Kindergarten level" },
      { name: "Grade 1", level: 1, description: "First grade" },
      { name: "Grade 2", level: 2, description: "Second grade" },
      { name: "Grade 3", level: 3, description: "Third grade" },
      { name: "Grade 4", level: 4, description: "Fourth grade" },
      { name: "Grade 5", level: 5, description: "Fifth grade" },
      { name: "Grade 6", level: 6, description: "Sixth grade" },
      { name: "Grade 7", level: 7, description: "Seventh grade" },
      { name: "Grade 8", level: 8, description: "Eighth grade" },
      { name: "Grade 9", level: 9, description: "Ninth grade" },
    ];
    
    const gradeIds: Record<number, Id<"grades">> = {};
    for (const grade of grades) {
      const gradeId = await ctx.db.insert("grades", {
        ...grade,
        isActive: true,
        createdBy: systemUserId,
      });
      gradeIds[grade.level] = gradeId;
      console.log(`Created grade: ${grade.name}`);
    }
    
    // 2. Create Subjects
    const subjects = [
      { name: "Mathematics", description: "Core mathematics curriculum" },
      { name: "English Language Arts", description: "Reading, writing, and language skills" },
      { name: "Science", description: "General science education" },
      { name: "Social Studies", description: "History, geography, and civics" },
      { name: "Physical Education", description: "Physical fitness and health" },
      { name: "Art", description: "Visual arts and creativity" },
      { name: "Music", description: "Musical education and appreciation" },
      { name: "French", description: "French language learning" },
    ];
    
    const subjectIds: Record<string, Id<"subjects">> = {};
    for (const subject of subjects) {
      const subjectId = await ctx.db.insert("subjects", {
        ...subject,
        isActive: true,
        createdBy: systemUserId,
      });
      subjectIds[subject.name] = subjectId;
      console.log(`Created subject: ${subject.name}`);
    }
    
    // 3. Create Teachers
    const teachers = [
      { firstName: "Sarah", lastName: "Johnson", email: "sarah.johnson@school.edu" },
      { firstName: "Michael", lastName: "Chen", email: "michael.chen@school.edu" },
      { firstName: "Emily", lastName: "Rodriguez", email: "emily.rodriguez@school.edu" },
      { firstName: "David", lastName: "Thompson", email: "david.thompson@school.edu" },
      { firstName: "Lisa", lastName: "Williams", email: "lisa.williams@school.edu" },
    ];
    
    const teacherIds: Id<"teachers">[] = [];
    for (const teacher of teachers) {
      const teacherId = await ctx.db.insert("teachers", {
        ...teacher,
        isActive: true,
        createdBy: systemUserId,
      });
      teacherIds.push(teacherId);
      console.log(`Created teacher: ${teacher.firstName} ${teacher.lastName}`);
    }
    
    // 4. Create Classes for different grades
    const classes = [
      { name: "Kindergarten A", gradeLevel: 0, description: "Morning kindergarten class" },
      { name: "Kindergarten B", gradeLevel: 0, description: "Afternoon kindergarten class" },
      { name: "Grade 1A", gradeLevel: 1, description: "First grade class A" },
      { name: "Grade 1B", gradeLevel: 1, description: "First grade class B" },
      { name: "Grade 2A", gradeLevel: 2, description: "Second grade class A" },
      { name: "Grade 3A", gradeLevel: 3, description: "Third grade class A" },
      { name: "Grade 4A", gradeLevel: 4, description: "Fourth grade class A" },
      { name: "Grade 5A", gradeLevel: 5, description: "Fifth grade class A" },
    ];
    
    const classIds: Id<"classes">[] = [];
    for (const classData of classes) {
      const gradeId = gradeIds[classData.gradeLevel];
      if (!gradeId) {
        throw new Error(`Grade level ${classData.gradeLevel} not found`);
      }
      const classId = await ctx.db.insert("classes", {
        name: classData.name,
        gradeId,
        description: classData.description,
        isActive: true,
        createdBy: systemUserId,
      });
      classIds.push(classId);
      console.log(`Created class: ${classData.name}`);
    }
    
    // 5. Create Class Assignments (assign teachers to classes)
    const assignments = [
      { teacherIndex: 0, classIndex: 0, role: "teacher" }, // Sarah -> Kindergarten A
      { teacherIndex: 1, classIndex: 1, role: "teacher" }, // Michael -> Kindergarten B
      { teacherIndex: 2, classIndex: 2, role: "teacher" }, // Emily -> Grade 1A
      { teacherIndex: 3, classIndex: 3, role: "teacher" }, // David -> Grade 1B
      { teacherIndex: 4, classIndex: 4, role: "teacher" }, // Lisa -> Grade 2A
      { teacherIndex: 0, classIndex: 5, role: "teacher" }, // Sarah -> Grade 3A
      { teacherIndex: 1, classIndex: 6, role: "teacher" }, // Michael -> Grade 4A
      { teacherIndex: 2, classIndex: 7, role: "teacher" }, // Emily -> Grade 5A
    ];
    
    for (const assignment of assignments) {
      const teacherId = teacherIds[assignment.teacherIndex];
      const classId = classIds[assignment.classIndex];
      if (!teacherId || !classId) {
        throw new Error(`Teacher or class not found for assignment ${assignment.teacherIndex} -> ${assignment.classIndex}`);
      }
      await ctx.db.insert("classAssignments", {
        teacherId,
        classId,
        role: assignment.role,
        createdBy: systemUserId,
      });
      console.log(`Assigned teacher ${assignment.teacherIndex} to class ${assignment.classIndex}`);
    }
    
    // 6. Create Students
    const students = [
      // Kindergarten A students
      { firstName: "Emma", lastName: "Smith", classIndex: 0, studentId: "K001", dateOfBirth: Date.now() - (5 * 365 * 24 * 60 * 60 * 1000) },
      { firstName: "Liam", lastName: "Brown", classIndex: 0, studentId: "K002", dateOfBirth: Date.now() - (5 * 365 * 24 * 60 * 60 * 1000) },
      { firstName: "Olivia", lastName: "Davis", classIndex: 0, studentId: "K003", dateOfBirth: Date.now() - (5 * 365 * 24 * 60 * 60 * 1000) },
      
      // Kindergarten B students
      { firstName: "Noah", lastName: "Miller", classIndex: 1, studentId: "K004", dateOfBirth: Date.now() - (5 * 365 * 24 * 60 * 60 * 1000) },
      { firstName: "Ava", lastName: "Wilson", classIndex: 1, studentId: "K005", dateOfBirth: Date.now() - (5 * 365 * 24 * 60 * 60 * 1000) },
      
      // Grade 1A students
      { firstName: "William", lastName: "Moore", classIndex: 2, studentId: "101", dateOfBirth: Date.now() - (6 * 365 * 24 * 60 * 60 * 1000) },
      { firstName: "Sophia", lastName: "Taylor", classIndex: 2, studentId: "102", dateOfBirth: Date.now() - (6 * 365 * 24 * 60 * 60 * 1000) },
      { firstName: "James", lastName: "Anderson", classIndex: 2, studentId: "103", dateOfBirth: Date.now() - (6 * 365 * 24 * 60 * 60 * 1000) },
      
      // Grade 1B students
      { firstName: "Isabella", lastName: "Thomas", classIndex: 3, studentId: "104", dateOfBirth: Date.now() - (6 * 365 * 24 * 60 * 60 * 1000) },
      { firstName: "Benjamin", lastName: "Jackson", classIndex: 3, studentId: "105", dateOfBirth: Date.now() - (6 * 365 * 24 * 60 * 60 * 1000) },
      
      // Grade 2A students
      { firstName: "Mia", lastName: "White", classIndex: 4, studentId: "201", dateOfBirth: Date.now() - (7 * 365 * 24 * 60 * 60 * 1000) },
      { firstName: "Lucas", lastName: "Harris", classIndex: 4, studentId: "202", dateOfBirth: Date.now() - (7 * 365 * 24 * 60 * 60 * 1000) },
    ];
    
    const studentIds: Id<"students">[] = [];
    for (const student of students) {
      const classId = classIds[student.classIndex];
      if (!classId) {
        throw new Error(`Class index ${student.classIndex} not found`);
      }
      const studentId = await ctx.db.insert("students", {
        firstName: student.firstName,
        lastName: student.lastName,
        classId,
        studentId: student.studentId,
        dateOfBirth: student.dateOfBirth,
        isActive: true,
        createdBy: systemUserId,
      });
      studentIds.push(studentId);
      console.log(`Created student: ${student.firstName} ${student.lastName} (${student.studentId})`);
    }
    
    // 7. Create some sample notes
    const notes = [
      {
        studentIndex: 0,
        authorIndex: 0,
        category: "ACADEMIC" as const,
        content: "Emma is showing great progress in letter recognition. She can identify all uppercase letters and most lowercase letters.",
        isPrivate: false,
      },
      {
        studentIndex: 1,
        authorIndex: 0,
        category: "BEHAVIOR" as const,
        content: "Liam has been very helpful in the classroom, always willing to assist other students.",
        isPrivate: false,
      },
      {
        studentIndex: 2,
        authorIndex: 0,
        category: "SOCIAL" as const,
        content: "Olivia is very social and makes friends easily. She's a natural leader in group activities.",
        isPrivate: false,
      },
      {
        studentIndex: 5,
        authorIndex: 2,
        category: "ACADEMIC" as const,
        content: "William is excelling in reading. He's already reading at a second-grade level.",
        isPrivate: false,
      },
      {
        studentIndex: 6,
        authorIndex: 2,
        category: "HEALTH" as const,
        content: "Sophia mentioned feeling tired in the afternoons. Parents should be notified to check sleep schedule.",
        isPrivate: true,
      },
    ];
    
    for (const note of notes) {
      const studentId = studentIds[note.studentIndex];
      const authorId = teacherIds[note.authorIndex];
      if (!studentId || !authorId) {
        throw new Error(`Student or teacher not found for note ${note.studentIndex} -> ${note.authorIndex}`);
      }
      await ctx.db.insert("notes", {
        studentId,
        authorId,
        category: note.category,
        content: note.content,
        isPrivate: note.isPrivate,
        createdBy: systemUserId,
      });
      console.log(`Created note for student ${note.studentIndex} by teacher ${note.authorIndex}`);
    }
    
    // 8. Create some sample goals
    const goals = [
      {
        studentIndex: 0,
        authorIndex: 0,
        subjectNames: ["Mathematics", "English Language Arts"],
        note: "Help Emma improve number recognition and counting skills",
        status: "IN_PROGRESS" as const,
        targetDate: Date.now() + (3 * 30 * 24 * 60 * 60 * 1000), // 3 months from now
      },
      {
        studentIndex: 5,
        authorIndex: 2,
        subjectNames: ["English Language Arts"],
        note: "Encourage William to read more challenging books to maintain his advanced reading level",
        status: "NOT_STARTED" as const,
        targetDate: Date.now() + (2 * 30 * 24 * 60 * 60 * 1000), // 2 months from now
      },
      {
        studentIndex: 10,
        authorIndex: 4,
        subjectNames: ["Mathematics", "Science"],
        note: "Help Mia develop better problem-solving skills in math and science",
        status: "IN_PROGRESS" as const,
        targetDate: Date.now() + (4 * 30 * 24 * 60 * 60 * 1000), // 4 months from now
      },
    ];
    
    for (const goal of goals) {
      const studentId = studentIds[goal.studentIndex];
      const authorId = teacherIds[goal.authorIndex];
      if (!studentId || !authorId) {
        throw new Error(`Student or teacher not found for goal ${goal.studentIndex} -> ${goal.authorIndex}`);
      }
      const subjectIdsForGoal = goal.subjectNames.map(name => subjectIds[name]).filter((id): id is Id<"subjects"> => id !== undefined);
      if (subjectIdsForGoal.length === 0) {
        throw new Error(`No valid subjects found for goal: ${goal.subjectNames.join(", ")}`);
      }
      await ctx.db.insert("goals", {
        studentId,
        authorId,
        subjectIds: subjectIdsForGoal,
        note: goal.note,
        isCompleted: false,
        status: goal.status,
        targetDate: goal.targetDate,
        createdBy: systemUserId,
      });
      console.log(`Created goal for student ${goal.studentIndex} by teacher ${goal.authorIndex}`);
    }
    
    console.log("Database seeding completed successfully!");
    return {
      message: "Database seeded successfully",
      counts: {
        grades: grades.length,
        subjects: subjects.length,
        teachers: teachers.length,
        classes: classes.length,
        students: students.length,
        notes: notes.length,
        goals: goals.length,
      },
    };
  },
});