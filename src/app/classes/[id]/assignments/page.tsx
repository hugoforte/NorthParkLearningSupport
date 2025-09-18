"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AssignmentList } from "@/components/class-assignments/assignment-list";
import { AssignmentForm } from "@/components/class-assignments/assignment-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { useState } from "react";

interface ClassAssignmentsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ClassAssignmentsPage({
  params,
}: ClassAssignmentsPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  const classItem = useQuery(api.classes.getById, { id: id as Id<"classes"> });

  const handleSuccess = () => {
    setShowAssignmentForm(false);
  };

  const handleCancel = () => {
    setShowAssignmentForm(false);
  };

  if (classItem === undefined) {
    return (
      <div className="container mx-auto py-6">
        <div>Loading class...</div>
      </div>
    );
  }

  if (classItem === null) {
    return (
      <div className="container mx-auto py-6">
        <div>Class not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Class Assignments
              </h1>
              <p className="text-gray-400">{classItem.name}</p>
            </div>
          </div>
          {!showAssignmentForm && (
            <Button
              onClick={() => setShowAssignmentForm(true)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Assign Teacher
            </Button>
          )}
        </div>

        {/* Assignment Form */}
        {showAssignmentForm && (
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <AssignmentForm
              classId={classItem._id}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Assignment List */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
          <AssignmentList classId={classItem._id} />
        </div>
      </div>
    </div>
  );
}
