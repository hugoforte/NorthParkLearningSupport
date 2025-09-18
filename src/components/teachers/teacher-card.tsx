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
import { Edit, Trash2, User } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { useState } from "react";

interface TeacherCardProps {
  teacher: {
    _id: Id<"teachers">;
    firstName: string;
    lastName: string;
    email?: string;
    isActive: boolean;
    _creationTime: number;
  };
}

export const TeacherCard = ({ teacher }: TeacherCardProps) => {
  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const removeTeacher = useMutation(api.teachers.remove);
  const updateTeacher = useMutation(api.teachers.update);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeTeacher({ id: teacher._id });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete teacher:", error);
      alert("Failed to delete teacher. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReactivate = async () => {
    setIsReactivating(true);
    try {
      await updateTeacher({ id: teacher._id, isActive: true });
    } catch (error) {
      console.error("Failed to reactivate teacher:", error);
      alert("Failed to reactivate teacher. Please try again.");
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors overflow-hidden">
      <CardHeader>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <CardTitle className="text-lg text-white truncate">{fullName}</CardTitle>
            {teacher.email && (
              <p className="text-sm text-gray-400 truncate" title={teacher.email}>
                {teacher.email.length > 30 ? `${teacher.email.substring(0, 30)}...` : teacher.email}
              </p>
            )}
            <p className="text-xs text-gray-500">Teacher</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge
            variant={teacher.isActive ? "default" : "secondary"}
            className={
              teacher.isActive
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-600 text-gray-300 hover:bg-gray-700"
            }
          >
            {teacher.isActive ? "Active" : "Inactive"}
          </Badge>
          <div className="flex space-x-2">
            <Link href={`/teachers/edit/${teacher._id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            {teacher.isActive ? (
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
                    <DialogTitle>Deactivate Teacher</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to deactivate{" "}
                      <strong>{fullName}</strong>? This will mark them as
                      inactive but preserve their data.
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
                      {isDeleting ? "Deactivating..." : "Deactivate"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReactivate}
                disabled={isReactivating}
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
              >
                {isReactivating ? "Reactivating..." : "Reactivate"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
