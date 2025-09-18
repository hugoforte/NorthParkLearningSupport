"use client";

import { GoalList } from "@/components/goals/goal-list";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function GoalsPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <GoalList />
      </div>
    </AuthGuard>
  );
}
