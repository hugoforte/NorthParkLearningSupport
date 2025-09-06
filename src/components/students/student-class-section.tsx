'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, UserPlus } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';
import type { Id } from '../../../convex/_generated/dataModel';

interface StudentClassSectionProps {
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

export const StudentClassSection = ({ student }: StudentClassSectionProps) => {
  const classItem = useQuery(api.classes.getById, { id: student.classId });
  const grade = useQuery(api.grades.getById, { id: classItem?.gradeId }, { enabled: !!classItem?.gradeId });
  const assignments = useQuery(api.classAssignments.getByClass, { classId: student.classId });
  const teachers = useQuery(api.teachers.getActive);

  const getTeacherName = (teacherId: Id<"teachers">) => {
    const teacher = teachers?.find(t => t._id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };

  if (!classItem) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Class Information</CardTitle>
            <p className="text-sm text-gray-400">{grade?.name ?? 'Loading...'}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Class Details */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Current Class</h4>
          <div className="bg-gray-700 rounded-lg p-3">
            <h5 className="text-white font-medium">{classItem.name}</h5>
            {classItem.description && (
              <p className="text-sm text-gray-400 mt-1">{classItem.description}</p>
            )}
            <Badge 
              variant={classItem.isActive ? "default" : "secondary"}
              className={`mt-2 ${
                classItem.isActive 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-gray-600 hover:bg-gray-700 text-gray-300"
              }`}
            >
              {classItem.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Assigned Teachers */}
        {assignments && assignments.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Teachers</h4>
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <div key={assignment._id} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-white">{getTeacherName(assignment.teacherId)}</span>
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {assignment.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-700">
          <Link href={`/classes/${classItem._id}/assignments`}>
            <div className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 cursor-pointer">
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">Manage Class Assignments</span>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
