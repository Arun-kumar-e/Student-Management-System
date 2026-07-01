import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  ArrowUpDown,
  Filter,
  RefreshCw,
  AlertCircle,
  X
} from 'lucide-react';
import { studentService } from '../services/api';
import { PageResponse, StudentRequest, StudentResponse } from '../types/student';
import { StudentForm } from '../components/StudentForm';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { TableSkeleton, CardSkeleton } from '../components/SkeletonLoader';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
];

export const StudentList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State Management
  const [studentsData, setStudentsData] = useState<PageResponse<StudentResponse> | null>(null);
  const [nonPaginatedStudents, setNonPaginatedStudents] = useState<StudentResponse[] | null>(null);
  
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [sortBy, setSortBy] = useState('id');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const [selectedDept, setSelectedDept] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentResponse | undefined>(undefined);
  const [deletingStudent, setDeletingStudent] = useState<StudentResponse | undefined>(undefined);
  const [isFormSaving, setIsFormSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if we navigated here with intent to open enrollment form (e.g. from Dashboard click)
  useEffect(() => {
    if (location.state && (location.state as any).openCreateForm) {
      setIsFormOpen(true);
      // Clear state so it doesn't reopen on reload
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Load students based on page settings, search query, or department filter
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      if (debouncedSearchQuery.trim()) {
        const results = await studentService.searchByName(debouncedSearchQuery);
        setNonPaginatedStudents(results);
        setStudentsData(null);
      } else if (selectedDept) {
        const results = await studentService.getByDepartment(selectedDept);
        setNonPaginatedStudents(results);
        setStudentsData(null);
      } else {
        const data = await studentService.getAll(page, size, sortBy, direction);
        setStudentsData(data);
        setNonPaginatedStudents(null);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Unable to fetch students. The backend service may be offline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, sortBy, direction, debouncedSearchQuery, selectedDept]);

  // Handle pagination triggers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && studentsData && newPage < studentsData.totalPages) {
      setPage(newPage);
    }
  };

  // Toggle sorting options
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setDirection('asc');
    }
    setPage(0); // Reset page on sort trigger
  };

  // Form submission handler
  const handleFormSubmit = async (requestData: StudentRequest) => {
    try {
      setIsFormSaving(true);
      if (editingStudent) {
        await studentService.update(editingStudent.id, requestData);
        toast.success('Student details updated successfully!');
      } else {
        await studentService.create(requestData);
        toast.success('New student enrolled successfully!');
      }
      setIsFormOpen(false);
      setEditingStudent(undefined);
      fetchStudents();
    } catch (error: any) {
      // Allow the form component to handle 400/409 errors
      throw error;
    } finally {
      setIsFormSaving(false);
    }
  };

  // Student deletion handler
  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      setIsDeleting(true);
      await studentService.delete(deletingStudent.id);
      toast.success('Student profile deleted successfully!');
      setDeletingStudent(undefined);
      fetchStudents();
    } catch (error) {
      console.error('Failed to delete student:', error);
      toast.error('Could not delete student. Try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditForm = (student: StudentResponse) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingStudent(undefined);
  };

  // Determine current active list
  const activeStudents = nonPaginatedStudents || (studentsData ? studentsData.content : []);
  const isSearchActive = !!(debouncedSearchQuery.trim() || selectedDept);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Student Directory</h2>
          <p className="text-text-muted text-sm mt-1">
            Browse and query records, edit student metrics, or complete enrollments.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setEditingStudent(undefined);
            setIsFormOpen(true);
          }}
          className="px-5 py-2.5 rounded-button bg-brand-purple hover:bg-brand-purple-hover text-[#101010] font-semibold flex items-center justify-center space-x-2 cursor-pointer text-sm"
        >
          <Plus size={18} />
          <span>Add Student</span>
        </motion.button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-card border border-surface-border bg-surface-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search student profiles by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedDept(''); // Reset dept if searching
              setPage(0);
            }}
            className="w-full pl-12 pr-4 py-2.5 rounded-button border border-surface-border bg-surface-bg text-text-title placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-text-muted hover:text-text-title"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:flex-none">
            <Filter size={14} className="absolute left-3 top-3.5 text-text-muted" />
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setSearchQuery(''); // Reset search if filtering dept
                setPage(0);
              }}
              className="w-full pl-9 pr-8 py-2.5 rounded-button border border-surface-border bg-surface-bg text-text-title focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all text-sm appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('');
              setPage(0);
              fetchStudents();
            }}
            className="p-2.5 rounded-button border border-surface-border bg-surface-card hover:bg-surface-bg text-text-muted hover:text-text-title transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RefreshCw size={18} />
          </motion.button>
        </div>
      </div>

      {/* Main Grid/Table Content */}
      {isLoading ? (
        <>
          <div className="hidden md:block">
            <TableSkeleton rows={5} />
          </div>
          <div className="md:hidden">
            <CardSkeleton count={3} />
          </div>
        </>
      ) : activeStudents.length > 0 ? (
        <div className="space-y-6">
          {/* Table view (Tablet/Desktop) */}
          <div className="hidden md:block overflow-hidden rounded-card border border-surface-border bg-surface-card">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-surface-bg border-b border-surface-border">
                    <th className="px-6 py-4 font-semibold text-text-muted">
                      <button
                        onClick={() => handleSort('id')}
                        className="flex items-center space-x-1.5 hover:text-text-title cursor-pointer"
                      >
                        <span>ID</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="px-6 py-4 font-semibold text-text-muted">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center space-x-1.5 hover:text-text-title cursor-pointer"
                      >
                        <span>Name</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="px-6 py-4 font-semibold text-text-muted">
                      <button
                        onClick={() => handleSort('rollNumber')}
                        className="flex items-center space-x-1.5 hover:text-text-title cursor-pointer"
                      >
                        <span>Roll Number</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="px-6 py-4 font-semibold text-text-muted">
                      <button
                        onClick={() => handleSort('department')}
                        className="flex items-center space-x-1.5 hover:text-text-title cursor-pointer"
                      >
                        <span>Department</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="px-6 py-4 font-semibold text-text-muted text-center">
                      <button
                        onClick={() => handleSort('cgpa')}
                        className="mx-auto flex items-center justify-center space-x-1.5 hover:text-text-title cursor-pointer"
                      >
                        <span>CGPA</span>
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                    <th className="px-6 py-4 font-semibold text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {activeStudents.map((student) => (
                    <motion.tr
                      key={student.id}
                      layoutId={`row-${student.id}`}
                      className="hover:bg-surface-bg/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-text-muted">#{student.id}</td>
                      <td className="px-6 py-4 font-bold text-text-title">
                        <div className="flex flex-col">
                          <span>{student.name}</span>
                          <span className="text-xs font-medium text-text-muted">{student.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-text-body">{student.rollNumber}</td>
                      <td className="px-6 py-4 font-medium text-text-body">{student.department}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 text-xs font-extrabold rounded-full ${
                          student.cgpa >= 8.5 
                            ? 'bg-brand-purple/10 text-brand-purple' 
                            : student.cgpa >= 7.0 
                              ? 'bg-brand-purple/10 text-brand-purple' 
                              : 'bg-warning/10 text-warning'
                        }`}>
                          {student.cgpa.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() => navigate(`/students/${student.id}`)}
                            className="p-1.5 rounded-button border border-surface-border hover:bg-surface-bg text-text-muted hover:text-brand-purple transition-colors cursor-pointer"
                            title="View Profile"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => openEditForm(student)}
                            className="p-1.5 rounded-button border border-surface-border hover:bg-surface-bg text-text-muted hover:text-brand-purple transition-colors cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingStudent(student)}
                            className="p-1.5 rounded-button border border-surface-border hover:bg-surface-bg text-text-muted hover:text-error transition-colors cursor-pointer"
                            title="Delete Student"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards fallback (Mobile View) */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {activeStudents.map((student) => (
              <motion.div
                key={student.id}
                layoutId={`card-${student.id}`}
                className="p-5 rounded-card border border-surface-border bg-surface-card space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-text-title text-base leading-snug">{student.name}</h4>
                    <p className="text-xs font-semibold text-text-muted mt-0.5">{student.email}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full ${
                    student.cgpa >= 8.5 ? 'bg-brand-purple/10 text-brand-purple' : 'bg-brand-purple/10 text-brand-purple'
                  }`}>
                    {student.cgpa.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border text-xs font-medium text-text-body">
                  <div>
                    <p className="text-text-muted uppercase text-[10px] tracking-wider">Roll Number</p>
                    <p className="font-mono mt-0.5">{student.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-text-muted uppercase text-[10px] tracking-wider">Department</p>
                    <p className="truncate mt-0.5">{student.department}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-surface-border">
                  <button
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="flex-1 py-2 rounded-button border border-surface-border bg-surface-bg text-text-body flex items-center justify-center space-x-1 text-xs cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => openEditForm(student)}
                    className="p-2 rounded-button border border-surface-border text-text-muted hover:text-brand-purple cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingStudent(student)}
                    className="p-2 rounded-button border border-surface-border text-text-muted hover:text-error cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination bar (Only visible when search/department filters are NOT active) */}
          {!isSearchActive && studentsData && studentsData.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border border-surface-border rounded-card bg-surface-card">
              <span className="text-xs font-medium text-text-muted">
                Showing page <span className="font-semibold text-text-title">{page + 1}</span> of{' '}
                <span className="font-semibold text-text-title">{studentsData.totalPages}</span>
              </span>

              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={studentsData.first}
                  className="p-2 rounded-button border border-surface-border hover:bg-surface-bg text-text-muted hover:text-text-title disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={studentsData.last}
                  className="p-2 rounded-button border border-surface-border hover:bg-surface-bg text-text-muted hover:text-text-title disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty state view */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 rounded-card border border-surface-border bg-surface-card text-center max-w-xl mx-auto space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto mb-2">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-xl font-bold">No Students Found</h3>
          <p className="text-text-body text-sm font-medium">
            {isSearchActive
              ? "We couldn't find any student records matching your active filter criteria."
              : 'There are no students enrolled in the system yet. Start by enrolling a student.'}
          </p>
          <div className="pt-2">
            {isSearchActive ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDept('');
                }}
                className="px-4 py-2 border border-surface-border hover:bg-surface-bg text-text-title font-medium rounded-button text-sm transition-colors cursor-pointer"
              >
                Clear Query
              </button>
            ) : (
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-[#101010] font-medium rounded-button text-sm transition-colors cursor-pointer"
              >
                Create First Record
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Centered Modal Form Panel */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-40 overflow-hidden flex items-center justify-center p-4">
            {/* Dark Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Centered Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-surface-card border border-surface-border p-6 rounded-card z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-surface-border">
                <div>
                  <h3 className="text-xl font-bold">
                    {editingStudent ? 'Edit Student Details' : 'New Enrollment Form'}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">
                    {editingStudent ? 'Update fields to save record' : 'Register and validate fields'}
                  </p>
                </div>
                <button
                  onClick={closeForm}
                  className="p-1.5 rounded-full text-text-muted hover:bg-surface-bg hover:text-text-title transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form container body */}
              <div className="flex-1 overflow-y-auto py-6 pr-1">
                <StudentForm
                  initialData={editingStudent}
                  onSubmit={handleFormSubmit}
                  onCancel={closeForm}
                  isLoading={isFormSaving}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Warning Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(undefined)}
        onConfirm={handleDeleteConfirm}
        studentName={deletingStudent ? deletingStudent.name : ''}
        isDeleting={isDeleting}
      />
    </motion.div>
  );
};
