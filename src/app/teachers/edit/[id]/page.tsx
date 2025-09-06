"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { TeacherForm } from "@/components/teachers/teacher-form";
import type { Id } from "../../../../../convex/_generated/dataModel";

interface EditTeacherPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditTeacherPage({ params }: EditTeacherPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const teacher = useQuery(api.teachers.getById, { id: id as Id<"teachers"> });

  const handleSuccess = () => {
    router.push("/teachers");
  };

  const handleCancel = () => {
    router.push("/teachers");
  };

  if (teacher === undefined) {
    return (
      <div className="container mx-auto py-6">
        <div>Loading teacher...</div>
      </div>
    );
  }

  if (teacher === null) {
    return (
      <div className="container mx-auto py-6">
        <div>Teacher not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <TeacherForm
        teacher={teacher}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
