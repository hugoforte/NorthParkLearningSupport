"use client";

import { TeacherList } from "@/components/teachers/teacher-list";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function TeachersPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <TeacherList />
      </div>
    </AuthGuard>
  );
}
