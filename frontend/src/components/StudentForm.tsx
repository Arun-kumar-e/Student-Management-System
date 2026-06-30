import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Save, X } from 'lucide-react';
import { StudentRequest, StudentResponse } from '../types/student';

// Zod Schema matching backend spring boot validations
export const studentSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be between 2 and 100 characters' })
    .max(100, { message: 'Name must be between 2 and 100 characters' }),
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please provide a valid email address' }),
  department: z.string()
    .min(1, { message: 'Department is required' }),
  rollNumber: z.string()
    .min(5, { message: 'Roll number must be between 5 and 20 characters' })
    .max(20, { message: 'Roll number must be between 5 and 20 characters' }),
  cgpa: z.any()
    .refine((val) => val !== '' && val !== undefined && val !== null, { message: 'CGPA is required' })
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: 'CGPA must be a valid number' })
    .refine((val) => val >= 0.0, { message: 'CGPA cannot be negative' })
    .refine((val) => val <= 10.0, { message: 'CGPA cannot exceed 10.0' }),
});

type StudentFormValues = any;

interface StudentFormProps {
  initialData?: StudentResponse;
  onSubmit: (data: StudentRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
];

export const StudentForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      department: '',
      rollNumber: '',
      cgpa: undefined,
    },
  });

  // Pre-fill form on edit mode
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        department: initialData.department,
        rollNumber: initialData.rollNumber,
        cgpa: initialData.cgpa,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (values: StudentFormValues) => {
    try {
      await onSubmit(values);
    } catch (error: any) {
      // Map server 400 validation error responses
      if (error.response && error.response.status === 400) {
        const fieldErrors = error.response.data;
        Object.keys(fieldErrors).forEach((field) => {
          setError(field as any, {
            type: 'server',
            message: fieldErrors[field],
          });
        });
      } 
      // Map server 409 conflict error responses (duplicates)
      else if (error.response && error.response.status === 409) {
        const errorMsg = error.response.data.message || '';
        if (errorMsg.toLowerCase().includes('email')) {
          setError('email', {
            type: 'server',
            message: 'Email address is already in use by another student',
          });
        } else if (errorMsg.toLowerCase().includes('roll')) {
          setError('rollNumber', {
            type: 'server',
            message: 'Roll number is already in use by another student',
          });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name Input */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-text-title block" htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. Arun Kumar"
          {...register('name')}
          className={`w-full px-4 py-3 rounded-xl border bg-surface-bg text-text-title placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all ${
            errors.name ? 'border-error/60 focus:ring-error/20' : 'border-surface-border'
          }`}
        />
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-error mt-1"
          >
            {errors.name.message as string}
          </motion.p>
        )}
      </div>

      {/* Email Input */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-text-title block" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="e.g. arun@university.edu"
          {...register('email')}
          className={`w-full px-4 py-3 rounded-xl border bg-surface-bg text-text-title placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all ${
            errors.email ? 'border-error/60 focus:ring-error/20' : 'border-surface-border'
          }`}
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-error mt-1"
          >
            {errors.email.message as string}
          </motion.p>
        )}
      </div>

      {/* Department Dropdown */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-text-title block" htmlFor="department">
          Department
        </label>
        <select
          id="department"
          {...register('department')}
          className={`w-full px-4 py-3 rounded-xl border bg-surface-bg text-text-title focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all ${
            errors.department ? 'border-error/60 focus:ring-error/20' : 'border-surface-border'
          }`}
        >
          <option value="">Select a department</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-error mt-1"
          >
            {errors.department.message as string}
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Roll Number Input */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-text-title block" htmlFor="rollNumber">
            Roll Number
          </label>
          <input
            id="rollNumber"
            type="text"
            placeholder="e.g. CS2026-001"
            {...register('rollNumber')}
            className={`w-full px-4 py-3 rounded-xl border bg-surface-bg text-text-title placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all ${
              errors.rollNumber ? 'border-error/60 focus:ring-error/20' : 'border-surface-border'
            }`}
          />
          {errors.rollNumber && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-medium text-error mt-1"
            >
              {errors.rollNumber.message as string}
            </motion.p>
          )}
        </div>

        {/* CGPA Input */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-text-title block" htmlFor="cgpa">
            CGPA (0.0 - 10.0)
          </label>
          <input
            id="cgpa"
            type="number"
            step="0.01"
            placeholder="e.g. 9.15"
            {...register('cgpa')}
            className={`w-full px-4 py-3 rounded-xl border bg-surface-bg text-text-title placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/40 focus:border-brand-purple transition-all ${
              errors.cgpa ? 'border-error/60 focus:ring-error/20' : 'border-surface-border'
            }`}
          />
          {errors.cgpa && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-medium text-error mt-1"
            >
              {errors.cgpa.message as string}
            </motion.p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-surface-border">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-3 px-4 rounded-xl border border-surface-border text-text-title font-medium hover:bg-surface-bg transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <X size={16} />
          <span>Cancel</span>
        </motion.button>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading || (!isDirty && initialData !== undefined)}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo hover:from-brand-purple-hover text-surface-bg font-medium shadow-md shadow-brand-purple/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          <span>{initialData ? 'Save Changes' : 'Create Student'}</span>
        </motion.button>
      </div>
    </form>
  );
};
