import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TeacherFormProps {
  teacher?: {
    _id: Id<"teachers">;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TeacherForm = ({ teacher, onSuccess, onCancel }: TeacherFormProps) => {
  const [firstName, setFirstName] = useState(teacher?.firstName ?? '');
  const [lastName, setLastName] = useState(teacher?.lastName ?? '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createTeacher = useMutation(api.teachers.create);
  const updateTeacher = useMutation(api.teachers.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (teacher) {
        await updateTeacher({
          id: teacher._id,
          firstName,
          lastName,
        });
      } else {
        await createTeacher({
          firstName,
          lastName,
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
        <CardTitle className="text-white">{teacher ? 'Edit Teacher' : 'Add Teacher'}</CardTitle>
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
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? 'Saving...' : teacher ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
