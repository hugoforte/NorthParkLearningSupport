import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useAuth } from "@/components/auth/auth-context";

interface ClassFormProps {
  classItem?: {
    _id: Id<"classes">;
    name: string;
    gradeId: Id<"grades">;
    description?: string;
    isActive: boolean;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ClassForm = ({
  classItem,
  onSuccess,
  onCancel,
}: ClassFormProps) => {
  const [name, setName] = useState(classItem?.name ?? "");
  const [gradeId, setGradeId] = useState(classItem?.gradeId ?? "");
  const [description, setDescription] = useState(classItem?.description ?? "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createClass = useMutation(api.classes.create);
  const updateClass = useMutation(api.classes.update);
  const grades = useQuery(api.grades.getActive);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!user?.email) {
      setError("You must be logged in to create a class");
      setIsLoading(false);
      return;
    }

    try {
      if (classItem) {
        await updateClass({
          id: classItem._id,
          name,
          gradeId: gradeId as Id<"grades">,
          description: description || undefined,
        });
      } else {
        await createClass({
          name,
          gradeId: gradeId as Id<"grades">,
          description: description || undefined,
          currentUserId: user.id, // Pass current user ID for backend validation
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
    <Card className="mx-auto max-w-md border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="text-white">
          {classItem ? "Edit Class" : "Add Class"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Class Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              required
              disabled={isLoading}
              className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
              placeholder="e.g., Class A, Room 101"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade" className="text-gray-300">
              Grade
            </Label>
            <Select
              value={gradeId}
              onValueChange={setGradeId}
              disabled={isLoading}
            >
              <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                <SelectValue placeholder="Select a grade" />
              </SelectTrigger>
              <SelectContent>
                {grades?.map((grade) => (
                  <SelectItem key={grade._id} value={grade._id}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Description (Optional)
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              disabled={isLoading}
              className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
              placeholder="Brief description of the class"
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
              disabled={isLoading || !gradeId}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : classItem ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
