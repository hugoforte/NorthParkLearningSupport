import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, FileText, Lock, Eye } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { useState } from "react";

interface NoteCardProps {
  note: {
    _id: Id<"notes">;
    studentId: Id<"students">;
    authorId: Id<"teachers">;
    category: "ACADEMIC" | "BEHAVIOR" | "SOCIAL" | "HEALTH" | "OTHER";
    content: string;
    isPrivate: boolean;
    _creationTime: number;
  };
}

const categoryColors = {
  ACADEMIC: "bg-blue-600 hover:bg-blue-700",
  BEHAVIOR: "bg-yellow-600 hover:bg-yellow-700",
  SOCIAL: "bg-green-600 hover:bg-green-700",
  HEALTH: "bg-red-600 hover:bg-red-700",
  OTHER: "bg-gray-600 hover:bg-gray-700",
};

const categoryLabels = {
  ACADEMIC: "Academic",
  BEHAVIOR: "Behavior",
  SOCIAL: "Social",
  HEALTH: "Health",
  OTHER: "Other",
};

export const NoteCard = ({ note }: NoteCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const removeNote = useMutation(api.notes.remove);
  const student = useQuery(api.students.getById, { id: note.studentId });
  const author = useQuery(api.teachers.getById, { id: note.authorId });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeNote({ id: note._id });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">
                {student
                  ? `${student.firstName} ${student.lastName}`
                  : "Loading..."}
              </CardTitle>
              <p className="text-sm text-gray-400">
                by{" "}
                {author
                  ? `${author.firstName} ${author.lastName}`
                  : "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {note.isPrivate ? (
              <div className="flex items-center space-x-1">
                <Lock className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-yellow-400">Private</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4 text-green-400" />
                <span className="text-xs text-green-400">Public</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={`${categoryColors[note.category]} text-white`}>
              {categoryLabels[note.category]}
            </Badge>
            <span className="text-xs text-gray-400">
              {formatDate(note._creationTime)}
            </span>
          </div>

          <p className="line-clamp-3 text-sm text-gray-300">{note.content}</p>

          <div className="flex justify-end space-x-2">
            <Link href={`/notes/edit/${note._id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Note</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this note? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
