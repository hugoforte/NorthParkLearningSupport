import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
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
import type { Id } from "../../../convex/_generated/dataModel";

interface AssignmentFormProps {
  classId: Id<"classes">;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AssignmentForm = ({
  classId,
  onSuccess,
  onCancel,
}: AssignmentFormProps) => {
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [role, setRole] = useState<string>("teacher");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createAssignment = useMutation(api.classAssignments.create);
  const teachers = useQuery(api.teachers.getActive);
  const existingAssignments = useQuery(api.classAssignments.getByClass, {
    classId,
  });

  // Filter out teachers already assigned to this class
  const availableTeachers =
    teachers?.filter(
      (teacher) =>
        !existingAssignments?.some(
          (assignment) => assignment.teacherId === teacher._id,
        ),
    ) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await createAssignment({
        teacherId: selectedTeacher as Id<"teachers">,
        classId,
        role,
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Assign Teacher to Class</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="teacher" className="text-gray-300">
              Teacher
            </Label>
            <Select
              value={selectedTeacher}
              onValueChange={setSelectedTeacher}
              disabled={isLoading}
            >
              <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {availableTeachers.length > 0 ? (
                  availableTeachers.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No available teachers
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-300">
              Role
            </Label>
            <Select value={role} onValueChange={setRole} disabled={isLoading}>
              <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
              </SelectContent>
            </Select>
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
                isLoading || !selectedTeacher || availableTeachers.length === 0
              }
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Assigning..." : "Assign Teacher"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
