"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { NoteForm } from "@/components/notes/note-form";
import type { Id } from "../../../../../convex/_generated/dataModel";

interface EditNotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditNotePage({ params }: EditNotePageProps) {
  const router = useRouter();
  const { id } = use(params);
  const note = useQuery(api.notes.getById, { id: id as Id<"notes"> });

  const handleSuccess = () => {
    router.push("/notes");
  };

  const handleCancel = () => {
    router.push("/notes");
  };

  if (note === undefined) {
    return (
      <div className="container mx-auto py-6">
        <div>Loading note...</div>
      </div>
    );
  }

  if (note === null) {
    return (
      <div className="container mx-auto py-6">
        <div>Note not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <NoteForm note={note} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
