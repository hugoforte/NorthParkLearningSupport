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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "@/components/auth/auth-context";

interface GoalFormProps {
  goal?: {
    _id: Id<"goals">;
    studentId: Id<"students">;
    authorId: Id<"teachers">;
    subjectIds: Id<"subjects">[];
    note: string;
    isCompleted: boolean;
    status:
      | "NOT_STARTED"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "ON_HOLD"
      | "CANCELLED";
    targetDate?: number;
  };
  initialStudentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusOptions = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const GoalForm = ({
  goal,
  initialStudentId,
  onSuccess,
  onCancel,
}: GoalFormProps) => {
  const [studentId, setStudentId] = useState(
    goal?.studentId ?? initialStudentId ?? "",
  );
  const [authorId, setAuthorId] = useState(goal?.authorId ?? "");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    goal?.subjectIds ?? [],
  );
  const [note, setNote] = useState(goal?.note ?? "");
  const [status, setStatus] = useState(goal?.status ?? "NOT_STARTED");
  const [targetDate, setTargetDate] = useState(
    goal?.targetDate
      ? new Date(goal.targetDate).toISOString().split("T")[0]
      : "",
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createGoal = useMutation(api.goals.create);
  const updateGoal = useMutation(api.goals.update);
  const students = useQuery(api.students.getActive);
  const teachers = useQuery(api.teachers.getActive);
  const subjects = useQuery(api.subjects.getActive);

  const handleSubjectChange = (subjectId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    } else {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!user?.email) {
      setError("You must be logged in to create a goal");
      setIsLoading(false);
      return;
    }

    try {
      const targetDateTimestamp = targetDate
        ? new Date(targetDate).getTime()
        : undefined;

      if (goal) {
        await updateGoal({
          id: goal._id,
          subjectIds: selectedSubjects as Id<"subjects">[],
          note,
          status,
          targetDate: targetDateTimestamp,
        });
      } else {
        await createGoal({
          studentId: studentId as Id<"students">,
          authorId: authorId as Id<"teachers">,
          subjectIds: selectedSubjects as Id<"subjects">[],
          note,
          status,
          targetDate: targetDateTimestamp,
          currentUserId: user._id, // Pass current user ID for backend validation
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
          {goal ? "Edit Goal" : "Add Goal"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!goal && (
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
            <Label className="text-gray-300">Subjects</Label>
            <div className="grid max-h-32 grid-cols-2 gap-2 overflow-y-auto rounded-md border border-gray-600 bg-gray-700 p-3 md:grid-cols-3">
              {subjects?.map((subject) => (
                <div key={subject._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject._id}
                    checked={selectedSubjects.includes(subject._id)}
                    onCheckedChange={(checked) =>
                      handleSubjectChange(subject._id, checked === true)
                    }
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={subject._id}
                    className="text-sm text-gray-300"
                  >
                    {subject.name}
                  </Label>
                </div>
              ))}
            </div>
            {selectedSubjects.length === 0 && (
              <p className="text-sm text-red-400">
                Please select at least one subject
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-gray-300">
              Goal Description
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNote(e.target.value)
              }
              required
              disabled={isLoading}
              className="min-h-[120px] border-gray-600 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Describe the learning goal or objective..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-300">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(
                  value as
                    | "NOT_STARTED"
                    | "IN_PROGRESS"
                    | "COMPLETED"
                    | "ON_HOLD"
                    | "CANCELLED",
                )
              }
              disabled={isLoading}
            >
              <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate" className="text-gray-300">
              Target Date (Optional)
            </Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTargetDate(e.target.value)
              }
              disabled={isLoading}
              className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
            />
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
                !note ||
                selectedSubjects.length === 0 ||
                (!goal && (!studentId || !authorId))
              }
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : goal ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
