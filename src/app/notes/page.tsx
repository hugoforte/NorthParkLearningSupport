"use client";

import { NoteList } from "@/components/notes/note-list";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function NotesPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-6">
        <NoteList />
      </div>
    </AuthGuard>
  );
}
