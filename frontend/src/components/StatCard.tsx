import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  decimals?: number;
  icon: LucideIcon;
  description?: string;
  delay?: number;
}

const AnimatedCounter = ({ value, decimals = 0 }: { value: number; decimals?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = progress * (2 - progress);
      const currentValue = startValue + (value - startValue) * easedProgress;
      setCount(currentValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return <>{count.toFixed(decimals)}</>;
};

export const StatCard = ({
  title,
  value,
  decimals = 0,
  icon: Icon,
  description,
  delay = 0,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -4 }}
      className="p-6 rounded-card border border-surface-border bg-surface-card flex items-center relative overflow-hidden group"
    >
      <div className="p-3 rounded-button bg-brand-purple text-[#101010]">
        <Icon size={22} />
      </div>

      <div className="ml-5 flex-1 z-10">
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold mt-1 font-display tracking-tight text-text-title">
          <AnimatedCounter value={value} decimals={decimals} />
        </h3>
        {description && (
          <p className="text-xs text-text-muted mt-1 font-medium">{description}</p>
        )}
      </div>
    </motion.div>
  );
};
