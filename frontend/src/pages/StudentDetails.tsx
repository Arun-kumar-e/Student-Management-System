import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  User,
  GraduationCap,
  Calendar,
  BookOpen,
  Hash,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { studentService } from '../services/api';
import { StudentResponse, StudentRequest } from '../types/student';
import { DetailSkeleton } from '../components/SkeletonLoader';
import { StudentForm } from '../components/StudentForm';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import toast from 'react-hot-toast';

export const StudentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State
  const [student, setStudent] = useState<StudentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormSaving, setIsFormSaving] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<StudentResponse | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStudentDetails = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await studentService.getById(Number(id));
      setStudent(data);
    } catch (error: any) {
      console.error('Failed to load student details:', error);
      if (error.response && error.response.status === 404) {
        toast.error('Student record not found in system.');
      } else {
        toast.error('Failed to load student details.');
      }
      setStudent(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const handleFormSubmit = async (requestData: StudentRequest) => {
    if (!student) return;
    try {
      setIsFormSaving(true);
      const updated = await studentService.update(student.id, requestData);
      setStudent(updated);
      toast.success('Student profile updated successfully!');
      setIsFormOpen(false);
    } catch (error) {
      // Allow form to catch validation / conflict bindings
      throw error;
    } finally {
      setIsFormSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!student) return;
    try {
      setIsDeleting(true);
      await studentService.delete(student.id);
      toast.success('Student profile deleted successfully!');
      setDeletingStudent(undefined);
      navigate('/students');
    } catch (error) {
      console.error('Failed to delete student:', error);
      toast.error('Could not delete student.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!student) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center p-8 rounded-3xl border border-surface-border bg-surface-card shadow-premium space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-2">
          <AlertCircle size={28} />
        </div>
        <h3 className="text-xl font-bold">Profile Not Found</h3>
        <p className="text-text-body text-sm font-medium">
          The student record with ID #{id} does not exist or has been deleted from the database.
        </p>
        <button
          onClick={() => navigate('/students')}
          className="px-5 py-2.5 bg-gradient-to-r from-brand-purple to-brand-indigo text-surface-bg font-medium rounded-xl text-sm transition-transform hover:scale-[1.02] cursor-pointer inline-flex items-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </button>
      </motion.div>
    );
  }

  // Formatting date of enrollment
  const enrollmentDate = new Date(student.enrolledAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center space-x-2 text-sm font-medium text-text-muted hover:text-text-title transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Students List</span>
        </button>
      </div>

      {/* Profile Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Badge Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 rounded-3xl border border-surface-border bg-surface-card shadow-premium overflow-hidden flex flex-col justify-between"
        >
          {/* Cover Header Accent */}
          <div className="h-44 gradient-bg relative" />

          {/* Profile Details Grid */}
          <div className="px-8 pb-8 relative flex-1 flex flex-col">
            {/* Initials Avatar */}
            <div className="absolute -top-14 left-8">
              <div className="w-28 h-28 rounded-full border-4 border-surface-card gradient-bg flex items-center justify-center text-surface-bg text-4xl font-extrabold shadow-md">
                {student.name.charAt(0)}
              </div>
            </div>

            <div className="pt-18 flex-1 flex flex-col justify-between">
              {/* Profile Bio */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-text-title">{student.name}</h3>
                <p className="text-sm font-medium text-brand-purple flex items-center mt-1">
                  <GraduationCap size={16} className="mr-1.5" />
                  <span>Enrolled Student Candidate</span>
                </p>
              </div>

              <hr className="border-surface-border my-4" />

              {/* Data Blocks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="p-2.5 rounded-xl bg-surface-bg border border-surface-border text-text-muted">
                    <Hash size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Roll Number</p>
                    <p className="font-mono font-semibold text-text-title mt-0.5">{student.rollNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <div className="p-2.5 rounded-xl bg-surface-bg border border-surface-border text-text-muted">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Email Address</p>
                    <p className="font-semibold text-text-title mt-0.5 truncate max-w-[200px]">{student.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <div className="p-2.5 rounded-xl bg-surface-bg border border-surface-border text-text-muted">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Branch/Department</p>
                    <p className="font-semibold text-text-title mt-0.5">{student.department}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-sm">
                  <div className="p-2.5 rounded-xl bg-surface-bg border border-surface-border text-text-muted">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Date Enrolled</p>
                    <p className="font-semibold text-text-title mt-0.5">{enrollmentDate}</p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-surface-border mt-8">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-4 py-2.5 border border-surface-border hover:bg-surface-bg text-text-title font-medium rounded-xl text-sm transition-colors cursor-pointer inline-flex items-center space-x-2"
                >
                  <Edit2 size={15} />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setDeletingStudent(student)}
                  className="px-4 py-2.5 border border-error/20 hover:bg-error/5 text-error font-medium rounded-xl text-sm transition-colors cursor-pointer inline-flex items-center space-x-2"
                >
                  <Trash2 size={15} />
                  <span>Delete Profile</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CGPA Gauge Meter Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-3xl border border-surface-border bg-surface-card p-6 shadow-premium flex flex-col justify-between"
        >
          <div>
            <h4 className="font-bold text-lg mb-1">Academic Rating</h4>
            <p className="text-xs text-text-muted font-medium">Cumulative Grade Point Average</p>
          </div>

          {/* Radial Indicator Gauge */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center">
              {/* Background Circle */}
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="var(--color-surface-border)"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Score Arc */}
                <motion.circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="url(#cgpaGradient)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="390"
                  initial={{ strokeDashoffset: 390 }}
                  animate={{ strokeDashoffset: 390 - (390 * student.cgpa) / 10 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="cgpaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-brand-purple)" />
                    <stop offset="100%" stopColor="var(--color-brand-pink)" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Inner score label */}
              <div className="absolute text-center">
                <span className="text-3xl font-extrabold font-display text-text-title">
                  {student.cgpa.toFixed(2)}
                </span>
                <span className="block text-[10px] text-text-muted font-bold tracking-wider mt-0.5 uppercase">
                  Grade / 10.0
                </span>
              </div>
            </div>

            {/* Performance status label */}
            <div className="text-center mt-6">
              <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                student.cgpa >= 9.0 
                  ? 'bg-success/10 text-success' 
                  : student.cgpa >= 7.5 
                    ? 'bg-brand-indigo/10 text-brand-indigo' 
                    : 'bg-warning/10 text-warning'
              }`}>
                {student.cgpa >= 9.0 
                  ? 'First Class with Distinction' 
                  : student.cgpa >= 7.5 
                    ? 'First Class Honors' 
                    : 'Pass Division'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface-bg text-center space-y-1">
            <p className="text-xs text-text-muted font-medium">Evaluation Reference</p>
            <p className="text-xs font-bold text-text-title">UGC Standard 10-Point System</p>
          </div>
        </motion.div>
      </div>

      {/* Centered Modal Edit Panel */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-40 overflow-hidden flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-surface-card border border-surface-border p-6 shadow-premium rounded-3xl z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-surface-border">
                <div>
                  <h3 className="text-xl font-bold">Edit Student Details</h3>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">Update fields to modify student records</p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-full text-text-muted hover:bg-surface-bg hover:text-text-title transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 pr-1">
                <StudentForm
                  initialData={student}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsFormOpen(false)}
                  isLoading={isFormSaving}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Warning Overlay */}
      <DeleteConfirmationModal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(undefined)}
        onConfirm={handleDeleteConfirm}
        studentName={student.name}
        isDeleting={isDeleting}
      />
    </motion.div>
  );
};

// Simple import alias replacement wrapper
const X = ({ size, className }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
