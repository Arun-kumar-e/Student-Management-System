import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  decimals?: number;
  icon: LucideIcon;
  description?: string;
  gradient: string;
  delay?: number;
}

// Animate a number from 0 to value
export const AnimatedCounter = ({ value, decimals = 0 }: { value: number; decimals?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2 seconds animation
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuad easing
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
  gradient,
  delay = 0,
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="p-6 rounded-2xl glass-panel shadow-premium flex items-center relative overflow-hidden group border border-surface-border bg-surface-card"
    >
      {/* Background radial gradient overlay on hover */}
      <div className="absolute inset-0 bg-radial from-brand-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Icon frame */}
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-surface-bg shadow-lg`}>
        <Icon size={24} className="animate-pulse" />
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

      {/* Decorative background shape */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-5 blur-xl group-hover:scale-125 transition-transform duration-700`} />
    </motion.div>
  );
};
