import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { NoteCard } from './note-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, X } from 'lucide-react';
import Link from 'next/link';

export const NoteList = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const notes = useQuery(api.notes.getAll);
  const students = useQuery(api.students.getActive);
  const teachers = useQuery(api.teachers.getActive);

  if (notes === undefined || students === undefined || teachers === undefined) {
    return <div>Loading notes...</div>;
  }

  // Filter notes based on selected filters
  const filteredNotes = notes.filter((note) => {
    // Student filter
    if (selectedStudent !== 'all' && note.studentId !== selectedStudent) {
      return false;
    }
    
    // Teacher filter
    if (selectedTeacher !== 'all' && note.authorId !== selectedTeacher) {
      return false;
    }
    
    // Search query filter (searches in content)
    if (searchQuery && !note.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const clearFilters = () => {
    setSelectedStudent('all');
    setSelectedTeacher('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedStudent !== 'all' || selectedTeacher !== 'all' || searchQuery;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Notes</h1>
          <p className="text-gray-400">Manage student notes and observations</p>
        </div>
        <Link href="/notes/add">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="ml-auto border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Search Content</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search in note content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Student Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Student</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All students" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All students</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student._id} value={student._id}>
                    {student.firstName} {student.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teacher Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Teacher</label>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All teachers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher._id} value={teacher._id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Showing {filteredNotes.length} of {notes.length} notes
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400">
              {hasActiveFilters ? (
                <>
                  <p className="text-lg mb-2">No notes found matching your filters</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </>
              ) : (
                <>
                  <p className="text-lg mb-2">No notes yet</p>
                  <p className="text-sm">Create your first note to get started</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
