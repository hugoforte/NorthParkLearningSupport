import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ClassCard } from './class-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const ClassList = () => {
  const classes = useQuery(api.classes.getAll);

  if (classes === undefined) {
    return <div>Loading classes...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Classes</h1>
          <p className="text-gray-400">Manage your school classes and grade levels</p>
        </div>
        <Link href="/classes/add">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes.map((classItem) => (
          <ClassCard key={classItem._id} classItem={classItem} />
        ))}
      </div>
    </div>
  );
};
