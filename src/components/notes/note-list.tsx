import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, X, Edit, Trash2, Lock, Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import type { Id } from '../../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';

type SortField = 'student' | 'teacher' | 'category' | 'date' | 'content';
type SortDirection = 'asc' | 'desc';

export const NoteList = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const notes = useQuery(api.notes.getAll);
  const students = useQuery(api.students.getActive);
  const teachers = useQuery(api.teachers.getActive);
  const removeNote = useMutation(api.notes.remove);

  if (notes === undefined || students === undefined || teachers === undefined) {
    return <div>Loading notes...</div>;
  }

  // Helper functions
  const getStudentName = (studentId: Id<"students">) => {
    const student = students.find(s => s._id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getTeacherName = (teacherId: Id<"teachers">) => {
    const teacher = teachers.find(t => t._id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      ACADEMIC: "bg-blue-600 hover:bg-blue-700",
      BEHAVIOR: "bg-yellow-600 hover:bg-yellow-700",
      SOCIAL: "bg-green-600 hover:bg-green-700",
      HEALTH: "bg-red-600 hover:bg-red-700",
      OTHER: "bg-gray-600 hover:bg-gray-700",
    };
    return colors[category as keyof typeof colors] || "bg-gray-600";
  };

  // Filter and sort notes
  const filteredNotes = notes
    .filter((note) => {
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
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortField) {
        case 'student':
          aValue = getStudentName(a.studentId);
          bValue = getStudentName(b.studentId);
          break;
        case 'teacher':
          aValue = getTeacherName(a.authorId);
          bValue = getTeacherName(b.authorId);
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'date':
          aValue = a._creationTime;
          bValue = b._creationTime;
          break;
        case 'content':
          aValue = a.content.toLowerCase();
          bValue = b.content.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (noteId: Id<"notes">) => {
    setIsDeleting(true);
    try {
      await removeNote({ id: noteId });
      setDeleteDialogOpen(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSelectedStudent('all');
    setSelectedTeacher('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedStudent !== 'all' || selectedTeacher !== 'all' || searchQuery;

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
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
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
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

      {/* Excel-like Data Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-700 hover:bg-gray-700">
                <TableHead 
                  className="text-gray-300 cursor-pointer hover:text-white select-none"
                  onClick={() => handleSort('student')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Student</span>
                    {getSortIcon('student')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-gray-300 cursor-pointer hover:text-white select-none"
                  onClick={() => handleSort('teacher')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Teacher</span>
                    {getSortIcon('teacher')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-gray-300 cursor-pointer hover:text-white select-none"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Category</span>
                    {getSortIcon('category')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-gray-300 cursor-pointer hover:text-white select-none"
                  onClick={() => handleSort('content')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Content</span>
                    {getSortIcon('content')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-gray-300 cursor-pointer hover:text-white select-none"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Date</span>
                    {getSortIcon('date')}
                  </div>
                </TableHead>
                <TableHead className="text-gray-300">Privacy</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <TableRow key={note._id} className="bg-gray-800 hover:bg-gray-750 border-gray-700">
                    <TableCell className="text-white font-medium">
                      {getStudentName(note.studentId)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {getTeacherName(note.authorId)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCategoryColor(note.category)} text-white`}>
                        {note.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-xs">
                      <div className="truncate" title={note.content}>
                        {note.content}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {formatDate(note._creationTime)}
                    </TableCell>
                    <TableCell>
                      {note.isPrivate ? (
                        <div className="flex items-center space-x-1">
                          <Lock className="h-4 w-4 text-yellow-400" />
                          <span className="text-xs text-yellow-400">Private</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4 text-green-400" />
                          <span className="text-xs text-green-400">Public</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/notes/edit/${note._id}`}>
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Dialog open={deleteDialogOpen === note._id} onOpenChange={(open) => setDeleteDialogOpen(open ? note._id : null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Note</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this note? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => setDeleteDialogOpen(null)}
                                disabled={isDeleting}
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDelete(note._id)}
                                disabled={isDeleting}
                              >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
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
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
