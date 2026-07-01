import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Plus, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { studentService } from '../services/api';
import { StudentResponse } from '../types/student';
import { StatCard } from '../components/StatCard';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import toast from 'react-hot-toast';

const CHART_COLORS = ['#8b5cf6', '#7c3aed', '#a78bfa', '#6366f1', '#818cf8', '#c4b5fd'];

export const Dashboard = () => {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await studentService.getAll(0, 1000, 'enrolledAt', 'desc');
        setStudents(data.content);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Unable to load dashboard metrics. Check server status.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const totalStudents = students.length;
  const avgCgpa = totalStudents > 0 
    ? students.reduce((sum, s) => sum + s.cgpa, 0) / totalStudents 
    : 0.0;

  const departmentCounts: { [key: string]: number } = {};
  students.forEach((s) => {
    departmentCounts[s.department] = (departmentCounts[s.department] || 0) + 1;
  });

  const uniqueDepartments = Object.keys(departmentCounts).length;

  const chartData = Object.keys(departmentCounts).map((dept) => ({
    name: dept.split(' ').map(w => w.charAt(0)).join(''),
    fullName: dept,
    count: departmentCounts[dept],
  })).sort((a, b) => b.count - a.count);

  const recentStudents = students.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 rounded-lg border border-surface-border bg-surface-card relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/[0.04] to-brand-indigo/[0.02]" />
        <div className="space-y-2 z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Academic <span className="text-brand-purple">Overview</span> Dashboard
          </h2>
          <p className="text-text-body text-sm font-medium">
            Welcome back to SMS Console. Manage enrollments, inspect metrics, and analyze student performances.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/students', { state: { openCreateForm: true } })}
          className="mt-4 md:mt-0 px-5 py-2.5 rounded-md bg-brand-purple text-[#101010] font-semibold flex items-center space-x-2 cursor-pointer z-10 hover:bg-brand-purple-hover transition-colors duration-150"
        >
          <Plus size={18} />
          <span>New Enrollment</span>
        </motion.button>
      </motion.div>

      {/* Metric Cards Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          description="Enrolled in active terms"
          delay={0.1}
        />
        <StatCard
          title="Average CGPA"
          value={avgCgpa}
          decimals={2}
          icon={GraduationCap}
          description="Consolidated student rating"
          delay={0.2}
        />
        <StatCard
          title="Departments"
          value={uniqueDepartments}
          icon={BookOpen}
          description="Active branches of study"
          delay={0.3}
        />
      </motion.div>

      {/* Analytics & Recent Enrollments */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department chart */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
          className="lg:col-span-2 p-6 rounded-lg border border-surface-border bg-surface-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <TrendingUp size={18} className="text-brand-purple" />
              <span>Department breakdown</span>
            </h3>
            <span className="text-xs text-text-muted font-medium bg-surface-bg px-3 py-1 rounded-full border border-surface-border">
              Distribution Count
            </span>
          </div>

          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#8b949e" fontSize={12} tickLine={false} />
                  <YAxis stroke="#8b949e" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-surface-card border border-surface-border rounded-md text-xs font-semibold text-text-title">
                            <p className="font-bold text-brand-purple">{data.fullName}</p>
                            <p className="mt-1">Students: {data.count}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={45}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text-muted text-sm font-medium">
                No department distribution data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Students Panel */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
          className="p-6 rounded-lg border border-surface-border bg-surface-card flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent Enrollments</h3>
            <button
              onClick={() => navigate('/students')}
              className="text-xs font-bold text-brand-purple flex items-center space-x-1 hover:text-brand-purple-hover transition-colors duration-150"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex-1 space-y-3 py-2">
            {recentStudents.length > 0 ? (
              recentStudents.map((s, idx) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.25, ease: 'easeOut' }}
                  whileHover={{ y: -2 }}
                  className="flex items-center justify-between p-3 rounded-md border border-surface-border bg-surface-bg/40 hover:bg-surface-bg transition-colors duration-150 cursor-pointer"
                  onClick={() => navigate(`/students/${s.id}`)}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-brand-purple/10 text-brand-purple font-semibold flex items-center justify-center text-sm">
                      {s.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate text-text-title">{s.name}</p>
                      <p className="text-xs text-text-muted truncate">{s.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-success/10 text-success">
                      {s.cgpa.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-48 flex items-center justify-center text-text-muted text-sm font-medium text-center">
                No students enrolled yet
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
