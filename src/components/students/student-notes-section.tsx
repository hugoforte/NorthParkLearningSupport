"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Lock,
  Eye,
  Calendar,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import type { Id } from "../../../convex/_generated/dataModel";

interface StudentNotesSectionProps {
  studentId: Id<"students">;
  notes?: Array<{
    _id: Id<"notes">;
    studentId: Id<"students">;
    authorId: Id<"teachers">;
    category: "ACADEMIC" | "BEHAVIOR" | "SOCIAL" | "HEALTH" | "OTHER";
    content: string;
    isPrivate: boolean;
    _creationTime: number;
  }>;
}

const categoryOptions = [
  { value: "ACADEMIC", label: "Academic", color: "bg-blue-600" },
  { value: "BEHAVIOR", label: "Behavior", color: "bg-yellow-600" },
  { value: "SOCIAL", label: "Social", color: "bg-green-600" },
  { value: "HEALTH", label: "Health", color: "bg-red-600" },
  { value: "OTHER", label: "Other", color: "bg-gray-600" },
] as const;

export const StudentNotesSection = ({
  studentId,
  notes,
}: StudentNotesSectionProps) => {
  const teachers = useQuery(api.teachers.getActive);
  const removeNote = useMutation(api.notes.remove);

  const getTeacherName = (teacherId: Id<"teachers">) => {
    const teacher = teachers?.find((t) => t._id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unknown";
  };

  const getCategoryInfo = (category: string) => {
    return (
      categoryOptions.find((opt) => opt.value === category) ??
      categoryOptions[4]
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteNote = async (noteId: Id<"notes">) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await removeNote({ id: noteId });
      } catch (error) {
        console.error("Failed to delete note:", error);
        alert("Failed to delete note. Please try again.");
      }
    }
  };

  if (!notes) {
    return (
      <Card className="border-gray-700 bg-gray-800">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="mb-4 h-4 w-1/4 rounded bg-gray-700"></div>
            <div className="space-y-3">
              <div className="h-20 rounded bg-gray-700"></div>
              <div className="h-20 rounded bg-gray-700"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort notes by creation time (newest first)
  const sortedNotes = [...notes].sort(
    (a, b) => b._creationTime - a._creationTime,
  );

  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">
                Notes & Observations
              </CardTitle>
              <p className="text-sm text-gray-400">
                {notes.length} total notes •{" "}
                {notes.filter((n) => n.isPrivate).length} private
              </p>
            </div>
          </div>
          <Link href={`/notes/add?studentId=${studentId}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Note
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="mb-4 text-gray-400">
              No notes recorded for this student yet.
            </p>
            <Link href={`/notes/add?studentId=${studentId}`}>
              <Button
                variant="outline"
                className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Note
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedNotes.map((note) => {
              const categoryInfo = getCategoryInfo(note.category);

              return (
                <div key={note._id} className="rounded-lg bg-gray-700 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={`${categoryInfo.color} text-white`}>
                        {categoryInfo.label}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {note.isPrivate ? (
                          <div className="flex items-center space-x-1">
                            <Lock className="h-3 w-3 text-yellow-400" />
                            <span className="text-xs text-yellow-400">
                              Private
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3 text-green-400" />
                            <span className="text-xs text-green-400">
                              Public
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Link href={`/notes/edit/${note._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="mb-3 text-sm leading-relaxed text-white">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(note._creationTime)} at{" "}
                        {formatTime(note._creationTime)}
                      </span>
                    </div>
                    <span>By {getTeacherName(note.authorId)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
