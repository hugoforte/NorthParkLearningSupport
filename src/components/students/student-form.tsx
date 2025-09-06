import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Id } from '../../../convex/_generated/dataModel';

interface StudentFormProps {
  student?: {
    _id: Id<"students">;
    firstName: string;
    lastName: string;
    classId: Id<"classes">;
    studentId?: string;
    dateOfBirth?: number;
    isActive: boolean;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const StudentForm = ({ student, onSuccess, onCancel }: StudentFormProps) => {
  const [firstName, setFirstName] = useState(student?.firstName ?? '');
  const [lastName, setLastName] = useState(student?.lastName ?? '');
  const [classId, setClassId] = useState(student?.classId ?? '');
  const [studentId, setStudentId] = useState(student?.studentId ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(
    student?.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : ''
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createStudent = useMutation(api.students.create);
  const updateStudent = useMutation(api.students.update);
  const classes = useQuery(api.classes.getActive);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const dateOfBirthTimestamp = dateOfBirth ? new Date(dateOfBirth).getTime() : undefined;
      
      if (student) {
        await updateStudent({
          id: student._id,
          firstName,
          lastName,
          classId: classId as Id<"classes">,
          studentId: studentId || undefined,
          dateOfBirth: dateOfBirthTimestamp,
        });
      } else {
        await createStudent({
          firstName,
          lastName,
          classId: classId as Id<"classes">,
          studentId: studentId || undefined,
          dateOfBirth: dateOfBirthTimestamp,
        });
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">{student ? 'Edit Student' : 'Add Student'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                required
                disabled={isLoading}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class" className="text-gray-300">Class</Label>
            <Select value={classId} onValueChange={setClassId} disabled={isLoading}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((classItem) => (
                  <SelectItem key={classItem._id} value={classItem._id}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-gray-300">Student ID (Optional)</Label>
            <Input
              id="studentId"
              value={studentId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentId(e.target.value)}
              disabled={isLoading}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              placeholder="e.g., 2024001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-gray-300">Date of Birth (Optional)</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateOfBirth(e.target.value)}
              disabled={isLoading}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading || !classId} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? 'Saving...' : student ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
