import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const sizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color,
  showLabel = false,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  const getColor = () => {
    if (color) return color;
    if (pct >= 80) return 'from-emerald-500 to-emerald-400';
    if (pct >= 50) return 'from-brand-600 to-brand-400';
    if (pct >= 25) return 'from-amber-600 to-amber-400';
    return 'from-red-600 to-red-400';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 bg-surface-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-surface-300 w-10 text-right">{Math.round(pct)}%</span>
      )}
    </div>
  );
}
