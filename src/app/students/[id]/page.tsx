'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { StudentDashboard } from '@/components/students/student-dashboard';
import { use } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

interface StudentPageProps {
  params: Promise<{ id: string }>;
}

export default function StudentPage({ params }: StudentPageProps) {
  const { id } = use(params);
  const studentId = id as Id<"students">;
  
  const student = useQuery(api.students.getById, { id: studentId });

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-800 rounded-lg"></div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-800 rounded-lg"></div>
                <div className="h-64 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-gray-400 mt-1">Student Dashboard</p>
        </div>
        
        <StudentDashboard studentId={studentId} />
      </div>
    </div>
  );
}
