"use client";

import { StudentList } from "@/components/students/student-list";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function StudentsPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <StudentList />
      </div>
    </AuthGuard>
  );
}
