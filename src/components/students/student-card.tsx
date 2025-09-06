import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, User } from 'lucide-react';
import type { Id } from '../../../convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';
import { useState } from 'react';

interface StudentCardProps {
  student: {
    _id: Id<"students">;
    firstName: string;
    lastName: string;
    classId: Id<"classes">;
    studentId?: string;
    dateOfBirth?: number;
    isActive: boolean;
    _creationTime: number;
  };
}

export const StudentCard = ({ student }: StudentCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const removeStudent = useMutation(api.students.remove);
  const updateStudent = useMutation(api.students.update);
  const classItem = useQuery(api.classes.getById, { id: student.classId });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeStudent({ id: student._id });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete student:', error);
      alert('Failed to delete student. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReactivate = async () => {
    setIsReactivating(true);
    try {
      await updateStudent({ id: student._id, isActive: true });
    } catch (error) {
      console.error('Failed to reactivate student:', error);
      alert('Failed to reactivate student. Please try again.');
    } finally {
      setIsReactivating(false);
    }
  };

  const calculateAge = (timestamp?: number) => {
    if (!timestamp) return null;
    const today = new Date();
    const birthDate = new Date(timestamp);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">
              {student.firstName} {student.lastName}
            </CardTitle>
            <p className="text-sm text-gray-400">
              {classItem?.name ?? 'Loading...'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {student.studentId && (
            <p className="text-sm text-gray-300">
              <span className="font-medium">ID:</span> {student.studentId}
            </p>
          )}
          {student.dateOfBirth && (
            <p className="text-sm text-gray-300">
              <span className="font-medium">Age:</span> {calculateAge(student.dateOfBirth)} years old
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant={student.isActive ? "default" : "secondary"}
            className={student.isActive 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-gray-600 hover:bg-gray-700 text-gray-300"
            }
          >
            {student.isActive ? "Active" : "Inactive"}
          </Badge>
          <div className="flex space-x-2">
            <Link href={`/students/edit/${student._id}`}>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            {student.isActive ? (
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
                    <DialogTitle>Deactivate Student</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to deactivate <strong>{student.firstName} {student.lastName}</strong>? 
                      This will mark them as inactive but preserve all data.
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
