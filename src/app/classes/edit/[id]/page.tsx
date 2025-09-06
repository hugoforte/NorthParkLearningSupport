"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { ClassForm } from "@/components/classes/class-form";
import type { Id } from "../../../../../convex/_generated/dataModel";

interface EditClassPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditClassPage({ params }: EditClassPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const classItem = useQuery(api.classes.getById, { id: id as Id<"classes"> });

  const handleSuccess = () => {
    router.push("/classes");
  };

  const handleCancel = () => {
    router.push("/classes");
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
      <ClassForm
        classItem={classItem}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
