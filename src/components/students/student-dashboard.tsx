'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { StudentInfoCard } from './student-info-card';
import { StudentGoalsSection } from './student-goals-section';
import { StudentNotesSection } from './student-notes-section';
import { StudentClassSection } from './student-class-section';
import type { Id } from '../../../convex/_generated/dataModel';

interface StudentDashboardProps {
  studentId: Id<"students">;
}

export const StudentDashboard = ({ studentId }: StudentDashboardProps) => {
  const student = useQuery(api.students.getById, { id: studentId });
  const goals = useQuery(api.goals.getByStudent, { studentId });
  const notes = useQuery(api.notes.getByStudent, { studentId });

  if (!student) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="h-64 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Student Info */}
      <div className="lg:col-span-1">
        <StudentInfoCard student={student} />
        <StudentClassSection student={student} />
      </div>

      {/* Right Column - Goals and Notes */}
      <div className="lg:col-span-2 space-y-6">
        <StudentGoalsSection studentId={studentId} goals={goals} />
        <StudentNotesSection studentId={studentId} notes={notes} />
      </div>
    </div>
  );
};
