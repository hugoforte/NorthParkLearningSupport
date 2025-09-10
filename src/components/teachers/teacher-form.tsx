import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/auth-context";

interface TeacherFormProps {
  teacher?: {
    _id: Id<"teachers">;
    firstName: string;
    lastName: string;
    email?: string;
    isActive: boolean;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TeacherForm = ({
  teacher,
  onSuccess,
  onCancel,
}: TeacherFormProps) => {
  const [firstName, setFirstName] = useState(teacher?.firstName ?? "");
  const [lastName, setLastName] = useState(teacher?.lastName ?? "");
  const [email, setEmail] = useState(teacher?.email ?? "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createTeacher = useMutation(api.teachers.create);
  const updateTeacher = useMutation(api.teachers.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!user?.email) {
      setError("You must be logged in to create a teacher");
      setIsLoading(false);
      return;
    }

    try {
      if (teacher) {
        // Don't send email when updating - it's read-only
        await updateTeacher({
          id: teacher._id,
          firstName,
          lastName,
        });
      } else {
        await createTeacher({
          firstName,
          lastName,
          email: email || undefined,
          authUserId: user.id, // Associate this teacher with the current auth user
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
          {teacher ? "Edit Teacher" : "Add Teacher"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFirstName(e.target.value)
                  }
                  required
                  disabled={isLoading}
                  className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLastName(e.target.value)
                  }
                  required
                  disabled={isLoading}
                  className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email {teacher && <span className="text-xs text-gray-500">(read-only)</span>}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                disabled={isLoading || !!teacher} // Disable email editing for existing teachers
                placeholder="teacher@example.com"
                className={`border-gray-600 text-white placeholder-gray-400 ${
                  teacher 
                    ? "bg-gray-600 cursor-not-allowed" // Read-only styling for existing teachers
                    : "bg-gray-700"
                }`}
              />
              {!teacher && (
                <p className="text-xs text-gray-500">
                  Optional - leave blank if teacher will sign in with Google
                </p>
              )}
            </div>
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
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : teacher ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
