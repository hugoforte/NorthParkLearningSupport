"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { GoalForm } from "@/components/goals/goal-form";
import type { Id } from "../../../../../convex/_generated/dataModel";

interface EditGoalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditGoalPage({ params }: EditGoalPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const goal = useQuery(api.goals.getById, { id: id as Id<"goals"> });

  const handleSuccess = () => {
    router.push("/goals");
  };

  const handleCancel = () => {
    router.push("/goals");
  };

  if (goal === undefined) {
    return (
      <div className="container mx-auto py-6">
        <div>Loading goal...</div>
      </div>
    );
  }

  if (goal === null) {
    return (
      <div className="container mx-auto py-6">
        <div>Goal not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <GoalForm goal={goal} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
