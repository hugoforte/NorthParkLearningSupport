"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { StudentDashboard } from "@/components/students/student-dashboard";
import { use } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";

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
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-1/4 rounded bg-gray-700"></div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="h-64 rounded-lg bg-gray-800"></div>
              </div>
              <div className="space-y-6 lg:col-span-2">
                <div className="h-64 rounded-lg bg-gray-800"></div>
                <div className="h-64 rounded-lg bg-gray-800"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">
            {student.firstName} {student.lastName}
          </h1>
          <p className="mt-1 text-gray-400">Student Dashboard</p>
        </div>

        <StudentDashboard studentId={studentId} />
      </div>
    </div>
  );
}
