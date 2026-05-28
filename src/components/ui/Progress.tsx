import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getBarColor = () => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div
      className={cn(
        'h-2 bg-slate-100 rounded-full overflow-hidden',
        className
      )}
    >
      <div
        className={cn('h-full transition-all duration-500', getBarColor(), barClassName)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
