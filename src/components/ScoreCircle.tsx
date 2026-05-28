import { getScoreColor } from '@/lib/utils';

interface ScoreCircleProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ScoreCircle({ score, label, size = 'md' }: ScoreCircleProps) {
  const sizes = {
    sm: 'w-20 h-20 text-xl',
    md: 'w-32 h-32 text-3xl',
    lg: 'w-48 h-48 text-5xl',
    xl: 'w-48 h-48 text-5xl',
  };

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizes[size]} relative flex items-center justify-center`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <span
          className={`absolute font-bold ${getScoreColor(score)}`}
        >
          {Math.round(score)}
        </span>
      </div>
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}
