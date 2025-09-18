"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { StudentForm } from "@/components/students/student-form";
import type { Id } from "../../../../../convex/_generated/dataModel";

interface EditStudentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditStudentPage({ params }: EditStudentPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const student = useQuery(api.students.getById, { id: id as Id<"students"> });

  const handleSuccess = () => {
    router.push("/students");
  };

  const handleCancel = () => {
    router.push("/students");
  };

  if (student === undefined) {
    return (
      <div className="container mx-auto py-6">
        <div>Loading student...</div>
      </div>
    );
  }

  if (student === null) {
    return (
      <div className="container mx-auto py-6">
        <div>Student not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <StudentForm
        student={student}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
