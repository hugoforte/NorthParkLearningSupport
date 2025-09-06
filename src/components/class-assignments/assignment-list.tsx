import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, User, UserCheck } from 'lucide-react';
import type { Id } from '../../../convex/_generated/dataModel';
import { useState } from 'react';

interface AssignmentListProps {
  classId: Id<"classes">;
}

export const AssignmentList = ({ classId }: AssignmentListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const assignments = useQuery(api.classAssignments.getByClass, { classId });
  const teachers = useQuery(api.teachers.getActive);
  const removeAssignment = useMutation(api.classAssignments.remove);

  const handleDelete = async (assignmentId: Id<"classAssignments">) => {
    setIsDeleting(true);
    try {
      await removeAssignment({ id: assignmentId });
      setDeleteDialogOpen(null);
    } catch (error) {
      console.error('Failed to remove assignment:', error);
      alert('Failed to remove assignment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getTeacherName = (teacherId: Id<"teachers">) => {
    const teacher = teachers?.find(t => t._id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher';
  };

  const getRoleColor = (role: string) => {
    return role === 'teacher' 
      ? "bg-blue-600 hover:bg-blue-700 text-white" 
      : "bg-green-600 hover:bg-green-700 text-white";
  };

  const getRoleIcon = (role: string) => {
    return role === 'teacher' ? <User className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />;
  };

  if (assignments === undefined || teachers === undefined) {
    return <div className="text-gray-400">Loading assignments...</div>;
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No teachers assigned</p>
          <p className="text-sm">Assign teachers to this class to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Assigned Teachers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-gray-700 border border-gray-600 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {getRoleIcon(assignment.role)}
              </div>
              <div>
                <p className="text-white font-medium">
                  {getTeacherName(assignment.teacherId)}
                </p>
                <Badge className={`${getRoleColor(assignment.role)} text-white`}>
                  {assignment.role.charAt(0).toUpperCase() + assignment.role.slice(1)}
                </Badge>
              </div>
            </div>
            <Dialog open={deleteDialogOpen === assignment._id} onOpenChange={(open) => setDeleteDialogOpen(open ? assignment._id : null)}>
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
                  <DialogTitle>Remove Teacher Assignment</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove <strong>{getTeacherName(assignment.teacherId)}</strong> from this class? 
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setDeleteDialogOpen(null)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(assignment._id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Removing...' : 'Remove'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
};
