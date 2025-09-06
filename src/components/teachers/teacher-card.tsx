import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, User } from 'lucide-react';
import type { Id } from '../../../convex/_generated/dataModel';

interface TeacherCardProps {
  teacher: {
    _id: Id<"teachers">;
    firstName: string;
    lastName: string;
    isActive: boolean;
    _creationTime: number;
  };
}

export const TeacherCard = ({ teacher }: TeacherCardProps) => {
  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <CardTitle className="text-lg">{fullName}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={teacher.isActive ? "default" : "secondary"}>
            {teacher.isActive ? "Active" : "Inactive"}
          </Badge>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
