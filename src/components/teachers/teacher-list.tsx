import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { TeacherCard } from "./teacher-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const TeacherList = () => {
  const teachers = useQuery(api.teachers.getAll);

  if (teachers === undefined) {
    return <div>Loading teachers...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-white">Teachers</h1>
          <p className="text-gray-400">Manage your teaching staff</p>
        </div>
        <Link href="/teachers/add">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher._id} teacher={teacher} />
        ))}
      </div>
    </div>
  );
};
