import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { StudentCard } from "./student-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const StudentList = () => {
  const students = useQuery(api.students.getAll);

  if (students === undefined) {
    return <div>Loading students...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-white">Students</h1>
          <p className="text-gray-400">
            Manage your school students and their class assignments
          </p>
        </div>
        <Link href="/students/add">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {students.map((student) => (
          <StudentCard key={student._id} student={student} />
        ))}
      </div>
    </div>
  );
};
