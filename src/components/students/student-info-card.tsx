'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, User, Calendar, Hash } from 'lucide-react';
import Link from 'next/link';
import type { Id } from '../../../convex/_generated/dataModel';

interface StudentInfoCardProps {
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

export const StudentInfoCard = ({ student }: StudentInfoCardProps) => {
  const formatDateOfBirth = (timestamp?: number) => {
    if (!timestamp) return 'Not provided';
    return new Date(timestamp).toLocaleDateString();
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

  const age = calculateAge(student.dateOfBirth);

  return (
    <Card className="bg-gray-800 border-gray-700 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">
                {student.firstName} {student.lastName}
              </CardTitle>
              <p className="text-sm text-gray-400">Student Information</p>
            </div>
          </div>
          <Link href={`/students/edit/${student._id}`}>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Student ID */}
        {student.studentId && (
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">ID:</span>
            <span className="text-sm text-white font-mono">{student.studentId}</span>
          </div>
        )}

        {/* Date of Birth */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">Date of Birth:</span>
          <span className="text-sm text-white">{formatDateOfBirth(student.dateOfBirth)}</span>
          {age && (
            <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
              {age} years old
            </Badge>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Status:</span>
          <Badge 
            variant={student.isActive ? "default" : "secondary"}
            className={student.isActive 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-gray-600 hover:bg-gray-700 text-gray-300"
            }
          >
            {student.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <Link href={`/goals/add?studentId=${student._id}`}>
              <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white text-xs">
                Add Goal
              </Button>
            </Link>
            <Link href={`/notes/add?studentId=${student._id}`}>
              <Button variant="outline" size="sm" className="w-full border-green-600 text-green-400 hover:bg-green-600 hover:text-white text-xs">
                Add Note
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
