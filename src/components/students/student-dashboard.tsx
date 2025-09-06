"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { StudentInfoCard } from "./student-info-card";
import { StudentGoalsSection } from "./student-goals-section";
import { StudentNotesSection } from "./student-notes-section";
import { StudentClassSection } from "./student-class-section";
import type { Id } from "../../../convex/_generated/dataModel";

interface StudentDashboardProps {
  studentId: Id<"students">;
}

export const StudentDashboard = ({ studentId }: StudentDashboardProps) => {
  const student = useQuery(api.students.getById, { id: studentId });
  const goals = useQuery(api.goals.getByStudent, { studentId });
  const notes = useQuery(api.notes.getByStudent, { studentId });

  if (!student) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="h-64 animate-pulse rounded-lg bg-gray-800"></div>
        </div>
        <div className="space-y-6 lg:col-span-2">
          <div className="h-64 animate-pulse rounded-lg bg-gray-800"></div>
          <div className="h-64 animate-pulse rounded-lg bg-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left Column - Student Info */}
      <div className="lg:col-span-1">
        <StudentInfoCard student={student} />
        <StudentClassSection student={student} />
      </div>

      {/* Right Column - Goals and Notes */}
      <div className="space-y-6 lg:col-span-2">
        <StudentGoalsSection studentId={studentId} goals={goals} />
        <StudentNotesSection studentId={studentId} notes={notes} />
      </div>
    </div>
  );
};
