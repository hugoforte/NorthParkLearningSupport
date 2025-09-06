import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Id } from "../../../convex/_generated/dataModel";

interface NoteFormProps {
  note?: {
    _id: Id<"notes">;
    studentId: Id<"students">;
    authorId: Id<"teachers">;
    category: "ACADEMIC" | "BEHAVIOR" | "SOCIAL" | "HEALTH" | "OTHER";
    content: string;
    isPrivate: boolean;
  };
  initialStudentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categories = [
  { value: "ACADEMIC", label: "Academic" },
  { value: "BEHAVIOR", label: "Behavior" },
  { value: "SOCIAL", label: "Social" },
  { value: "HEALTH", label: "Health" },
  { value: "OTHER", label: "Other" },
] as const;

export const NoteForm = ({
  note,
  initialStudentId,
  onSuccess,
  onCancel,
}: NoteFormProps) => {
  const [studentId, setStudentId] = useState(
    note?.studentId ?? initialStudentId ?? "",
  );
  const [authorId, setAuthorId] = useState(note?.authorId ?? "");
  const [category, setCategory] = useState(note?.category ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [isPrivate, setIsPrivate] = useState(note?.isPrivate ?? false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);
  const students = useQuery(api.students.getActive);
  const teachers = useQuery(api.teachers.getActive);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (note) {
        await updateNote({
          id: note._id,
          category: category as
            | "ACADEMIC"
            | "BEHAVIOR"
            | "SOCIAL"
            | "HEALTH"
            | "OTHER",
          content,
          isPrivate,
        });
      } else {
        await createNote({
          studentId: studentId as Id<"students">,
          authorId: authorId as Id<"teachers">,
          category: category as
            | "ACADEMIC"
            | "BEHAVIOR"
            | "SOCIAL"
            | "HEALTH"
            | "OTHER",
          content,
          isPrivate,
        });
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="text-white">
          {note ? "Edit Note" : "Add Note"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!note && (
            <>
              <div className="space-y-2">
                <Label htmlFor="student" className="text-gray-300">
                  Student
                </Label>
                <Select
                  value={studentId}
                  onValueChange={setStudentId}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.map((student) => (
                      <SelectItem key={student._id} value={student._id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-gray-300">
                  Author (Teacher)
                </Label>
                <Select
                  value={authorId}
                  onValueChange={setAuthorId}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers?.map((teacher) => (
                      <SelectItem key={teacher._id} value={teacher._id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={isLoading}
            >
              <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-gray-300">
              Note Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
              required
              disabled={isLoading}
              className="min-h-[120px] border-gray-600 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter your note here..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPrivate"
              checked={isPrivate}
              onCheckedChange={(checked) => setIsPrivate(checked === true)}
              disabled={isLoading}
            />
            <Label htmlFor="isPrivate" className="text-gray-300">
              Private note (only visible to the author)
            </Label>
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={
                isLoading ||
                !category ||
                !content ||
                (!note && (!studentId || !authorId))
              }
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : note ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
