import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Users, UserPlus } from 'lucide-react';
import type { Id } from '../../../convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';
import { useState } from 'react';

interface ClassCardProps {
  classItem: {
    _id: Id<"classes">;
    name: string;
    gradeId: Id<"grades">;
    description?: string;
    isActive: boolean;
    _creationTime: number;
  };
}

export const ClassCard = ({ classItem }: ClassCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const removeClass = useMutation(api.classes.remove);
  const updateClass = useMutation(api.classes.update);
  const grade = useQuery(api.grades.getById, { id: classItem.gradeId });
  const assignments = useQuery(api.classAssignments.getByClass, { classId: classItem._id });
  const teachers = useQuery(api.teachers.getActive);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeClass({ id: classItem._id });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete class:', error);
      alert('Failed to delete class. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReactivate = async () => {
    setIsReactivating(true);
    try {
      await updateClass({ id: classItem._id, isActive: true });
    } catch (error) {
      console.error('Failed to reactivate class:', error);
      alert('Failed to reactivate class. Please try again.');
    } finally {
      setIsReactivating(false);
    }
  };

  const getTeacherName = (teacherId: Id<"teachers">) => {
    const teacher = teachers?.find(t => t._id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };
  
  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">{classItem.name}</CardTitle>
            <p className="text-sm text-gray-400">{grade?.name ?? 'Loading...'}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {classItem.description && (
          <p className="text-sm text-gray-300 mb-4">{classItem.description}</p>
        )}
        
        {/* Assigned Teachers */}
        {assignments && assignments.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Assigned Teachers:</p>
            <div className="flex flex-wrap gap-1">
              {assignments.slice(0, 2).map((assignment) => (
                <Badge 
                  key={assignment._id}
                  variant="outline"
                  className="text-xs border-gray-600 text-gray-300"
                >
                  {getTeacherName(assignment.teacherId)}
                </Badge>
              ))}
              {assignments.length > 2 && (
                <Badge 
                  variant="outline"
                  className="text-xs border-gray-600 text-gray-300"
                >
                  +{assignments.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Badge 
            variant={classItem.isActive ? "default" : "secondary"}
            className={classItem.isActive 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-gray-600 hover:bg-gray-700 text-gray-300"
            }
          >
            {classItem.isActive ? "Active" : "Inactive"}
          </Badge>
          <div className="flex space-x-2">
            <Link href={`/classes/${classItem._id}/assignments`}>
              <Button variant="outline" size="sm" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                <UserPlus className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/classes/edit/${classItem._id}`}>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            {classItem.isActive ? (
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
                    <DialogTitle>Deactivate Class</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to deactivate <strong>{classItem.name}</strong>? 
                      This will mark it as inactive but preserve all data.
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
                      {isDeleting ? 'Deactivating...' : 'Deactivate'}
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
                {isReactivating ? 'Reactivating...' : 'Reactivate'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
