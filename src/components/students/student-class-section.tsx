"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, UserPlus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import type { Id } from "../../../convex/_generated/dataModel";

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

const GradeInfo = ({ gradeId }: { gradeId: Id<"grades"> }) => {
  const grade = useQuery(api.grades.getById, { id: gradeId });
  return <span>{grade?.name ?? "Loading..."}</span>;
};

export const StudentClassSection = ({ student }: StudentClassSectionProps) => {
  const classItem = useQuery(api.classes.getById, { id: student.classId });
  const assignments = useQuery(api.classAssignments.getByClass, {
    classId: student.classId,
  });
  const teachers = useQuery(api.teachers.getActive);

  const getTeacherName = (teacherId: Id<"teachers">) => {
    const teacher = teachers?.find((t) => t._id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unknown";
  };

  if (!classItem) {
    return (
      <Card className="border-gray-700 bg-gray-800">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-700"></div>
            <div className="h-3 w-1/2 rounded bg-gray-700"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">
              Class Information
            </CardTitle>
             <p className="text-sm text-gray-400">
               {classItem?.gradeId ? (
                 <GradeInfo gradeId={classItem.gradeId} />
               ) : (
                 "Loading..."
               )}
             </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Class Details */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-300">
            Current Class
          </h4>
          <div className="rounded-lg bg-gray-700 p-3">
            <h5 className="font-medium text-white">{classItem.name}</h5>
            {classItem.description && (
              <p className="mt-1 text-sm text-gray-400">
                {classItem.description}
              </p>
            )}
            <Badge
              variant={classItem.isActive ? "default" : "secondary"}
              className={`mt-2 ${
                classItem.isActive
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {classItem.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Assigned Teachers */}
        {assignments && assignments.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-300">Teachers</h4>
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="flex items-center justify-between rounded-lg bg-gray-700 p-2"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-white">
                      {getTeacherName(assignment.teacherId)}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-gray-600 text-xs text-gray-300"
                  >
                    {assignment.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t border-gray-700 pt-4">
          <Link href={`/classes/${classItem._id}/assignments`}>
            <div className="flex cursor-pointer items-center space-x-2 text-blue-400 hover:text-blue-300">
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">Manage Class Assignments</span>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
