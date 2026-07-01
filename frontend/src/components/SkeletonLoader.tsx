import { motion } from 'framer-motion';

const shimmerVariants: any = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <motion.div
          key={index}
          variants={shimmerVariants}
          animate="animate"
          className="flex items-center space-x-4 py-4 border-b border-surface-border"
        >
          <div className="h-4 bg-surface-border rounded md:w-12" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-border rounded md:w-1/4" />
            <div className="h-3 bg-surface-border rounded md:w-1/3" />
          </div>
          <div className="h-4 bg-surface-border rounded md:w-24" />
          <div className="h-4 bg-surface-border rounded md:w-16" />
          <div className="h-8 bg-surface-border rounded md:w-20" />
        </motion.div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          variants={shimmerVariants}
          animate="animate"
          className="p-6 rounded-card border border-surface-border bg-surface-card space-y-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-surface-border rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-border rounded md:w-2/3" />
              <div className="h-3 bg-surface-border rounded md:w-1/2" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-surface-border rounded md:w-3/4" />
            <div className="h-3 bg-surface-border rounded md:w-5/6" />
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-surface-border">
            <div className="h-6 bg-surface-border rounded-full md:w-16" />
            <div className="h-8 bg-surface-border rounded md:w-24" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      className="max-w-3xl mx-auto rounded-card border border-surface-border bg-surface-card overflow-hidden"
    >
      <div className="h-48 bg-gradient-to-r from-surface-border to-surface-bg" />
      <div className="px-8 pb-8 relative">
        <div className="w-28 h-28 bg-surface-border rounded-full border-4 border-surface-card absolute -top-14 left-8" />
        <div className="pt-20 space-y-6">
          <div className="space-y-3">
            <div className="h-8 bg-surface-border rounded md:w-1/3" />
            <div className="h-4 bg-surface-border rounded md:w-1/4" />
          </div>
          <hr className="border-surface-border" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-3 bg-surface-border rounded md:w-1/3" />
              <div className="h-5 bg-surface-border rounded md:w-2/3" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-surface-border rounded md:w-1/3" />
              <div className="h-5 bg-surface-border rounded md:w-2/3" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-surface-border rounded md:w-1/3" />
              <div className="h-5 bg-surface-border rounded md:w-2/3" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-surface-border rounded md:w-1/3" />
              <div className="h-5 bg-surface-border rounded md:w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            variants={shimmerVariants}
            animate="animate"
            className="p-6 rounded-card border border-surface-border bg-surface-card flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-surface-border rounded-button" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-surface-border rounded md:w-1/2" />
              <div className="h-6 bg-surface-border rounded md:w-1/3" />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          className="lg:col-span-2 p-6 rounded-card border border-surface-border bg-surface-card h-80"
        >
          <div className="h-6 bg-surface-border rounded md:w-1/4 mb-6" />
          <div className="h-4/5 bg-surface-border rounded-card" />
        </motion.div>
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          className="p-6 rounded-card border border-surface-border bg-surface-card h-80"
        >
          <div className="h-6 bg-surface-border rounded md:w-1/3 mb-6" />
          <div className="h-4/5 bg-surface-border rounded-card" />
        </motion.div>
      </div>
    </div>
  );
};
