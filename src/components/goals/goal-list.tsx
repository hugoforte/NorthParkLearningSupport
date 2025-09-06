import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, X, Edit, Trash2, Target, CheckCircle, Circle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import type { Id } from '../../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';

type SortField = 'student' | 'teacher' | 'subjects' | 'note' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

const statusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

const getStatusColor = (status: string) => {
  const colors = {
    NOT_STARTED: "bg-gray-600 hover:bg-gray-700 text-white",
    IN_PROGRESS: "bg-blue-600 hover:bg-blue-700 text-white",
    COMPLETED: "bg-green-600 hover:bg-green-700 text-white",
    ON_HOLD: "bg-yellow-600 hover:bg-yellow-700 text-white",
    CANCELLED: "bg-red-600 hover:bg-red-700 text-white",
  };
  return colors[status as keyof typeof colors] || "bg-gray-600";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'NOT_STARTED':
      return <Circle className="h-4 w-4" />;
    case 'IN_PROGRESS':
      return <Target className="h-4 w-4" />;
    case 'COMPLETED':
      return <CheckCircle className="h-4 w-4" />;
    case 'ON_HOLD':
      return <Circle className="h-4 w-4" />;
    case 'CANCELLED':
      return <X className="h-4 w-4" />;
    default:
      return <Circle className="h-4 w-4" />;
  }
};

export const GoalList = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const goals = useQuery(api.goals.getAll);
  const students = useQuery(api.students.getActive);
  const teachers = useQuery(api.teachers.getActive);
  const subjects = useQuery(api.subjects.getActive);
  const removeGoal = useMutation(api.goals.remove);

  if (goals === undefined || students === undefined || teachers === undefined || subjects === undefined) {
    return <div>Loading goals...</div>;
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

  const getSubjectNames = (subjectIds: Id<"subjects">[]) => {
    return subjectIds.map(id => {
      const subject = subjects.find(s => s._id === id);
      return subject?.name ?? 'Unknown';
    }).join(', ');
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'No target date';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter and sort goals
  const filteredGoals = goals
    .filter((goal) => {
      // Student filter
      if (selectedStudent !== 'all' && goal.studentId !== selectedStudent) {
        return false;
      }
      
      // Teacher filter
      if (selectedTeacher !== 'all' && goal.authorId !== selectedTeacher) {
        return false;
      }
      
      // Status filter
      if (selectedStatus !== 'all' && goal.status !== selectedStatus) {
        return false;
      }
      
      // Search query filter (searches in note)
      if (searchQuery && !goal.note.toLowerCase().includes(searchQuery.toLowerCase())) {
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
        case 'subjects':
          aValue = getSubjectNames(a.subjectIds);
          bValue = getSubjectNames(b.subjectIds);
          break;
        case 'note':
          aValue = a.note.toLowerCase();
          bValue = b.note.toLowerCase();
          break;
        case 'date':
          aValue = a.targetDate ?? 0;
          bValue = b.targetDate ?? 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
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

  const handleDelete = async (goalId: Id<"goals">) => {
    setIsDeleting(true);
    try {
      await removeGoal({ id: goalId });
      setDeleteDialogOpen(null);
    } catch (error) {
      console.error('Failed to delete goal:', error);
      alert('Failed to delete goal. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSelectedStudent('all');
    setSelectedTeacher('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedStudent !== 'all' || selectedTeacher !== 'all' || selectedStatus !== 'all' || searchQuery;

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
          <h1 className="text-4xl font-bold text-white mb-2">Goals</h1>
          <p className="text-gray-400">Manage student learning goals and objectives</p>
        </div>
        <Link href="/goals/add">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Search Goals</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search in goal notes..."
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

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Showing {filteredGoals.length} of {goals.length} goals
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
      </div>

      {/* Goals Table */}
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
                  onClick={() => handleSort('subjects')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Subjects</span>
                    {getSortIcon('subjects')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-gray-300 cursor-pointer hover:text-white select-none"
                  onClick={() => handleSort('note')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Goal</span>
                    {getSortIcon('note')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-gray-300 cursor-pointer hover:text-white select-none"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Target Date</span>
                    {getSortIcon('date')}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-gray-300 cursor-pointer hover:text-white select-none"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGoals.length > 0 ? (
                filteredGoals.map((goal) => (
                  <TableRow key={goal._id} className="bg-gray-800 hover:bg-gray-750 border-gray-700">
                    <TableCell className="text-white font-medium">
                      {getStudentName(goal.studentId)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {getTeacherName(goal.authorId)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {goal.subjectIds.slice(0, 2).map((subjectId) => {
                          const subject = subjects.find(s => s._id === subjectId);
                          return (
                            <Badge key={subjectId} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {subject?.name ?? 'Unknown'}
                            </Badge>
                          );
                        })}
                        {goal.subjectIds.length > 2 && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            +{goal.subjectIds.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-xs">
                      <div className="truncate" title={goal.note}>
                        {goal.note}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {formatDate(goal.targetDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(goal.status)}
                        <Badge className={`${getStatusColor(goal.status)} text-white`}>
                          {statusOptions.find(opt => opt.value === goal.status)?.label ?? goal.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/goals/edit/${goal._id}`}>
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Dialog open={deleteDialogOpen === goal._id} onOpenChange={(open) => setDeleteDialogOpen(open ? goal._id : null)}>
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
                              <DialogTitle>Delete Goal</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this goal? This action cannot be undone.
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
                                onClick={() => handleDelete(goal._id)}
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
                          <p className="text-lg mb-2">No goals found matching your filters</p>
                          <p className="text-sm">Try adjusting your search criteria</p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg mb-2">No goals yet</p>
                          <p className="text-sm">Create your first goal to get started</p>
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
