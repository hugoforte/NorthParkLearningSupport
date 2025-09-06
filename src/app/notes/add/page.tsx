"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { NoteForm } from "@/components/notes/note-form";
import { Suspense } from "react";

function AddNotePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  const handleSuccess = () => {
    if (studentId) {
      router.push(`/students/${studentId}`);
    } else {
      router.push("/notes");
    }
  };

  const handleCancel = () => {
    if (studentId) {
      router.push(`/students/${studentId}`);
    } else {
      router.push("/notes");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Add New Note</h1>
          <p className="mt-1 text-gray-400">
            Record an observation about a student
          </p>
        </div>

        <NoteForm
          initialStudentId={studentId || undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default function AddNotePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 p-6">
          <div className="mx-auto max-w-2xl">
            <div className="animate-pulse">
              <div className="mb-6 h-8 w-1/3 rounded bg-gray-700"></div>
              <div className="h-96 rounded bg-gray-800"></div>
            </div>
          </div>
        </div>
      }
    >
      <AddNotePageContent />
    </Suspense>
  );
}
