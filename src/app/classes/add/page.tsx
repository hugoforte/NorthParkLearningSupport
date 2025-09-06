"use client";

import { useRouter } from "next/navigation";
import { ClassForm } from "@/components/classes/class-form";

export default function AddClassPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/classes");
  };

  const handleCancel = () => {
    router.push("/classes");
  };

  return (
    <div className="container mx-auto py-6">
      <ClassForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
