"use client";

import { ClassList } from "@/components/classes/class-list";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function ClassesPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <ClassList />
      </div>
    </AuthGuard>
  );
}
