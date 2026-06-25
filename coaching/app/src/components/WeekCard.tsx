import { CheckSquare } from 'lucide-react';
import type { WeekPlan } from '../api/types';

const weekColors = [
  { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-600', dot: 'bg-indigo-400' },
  { bg: 'bg-violet-50', border: 'border-violet-200', badge: 'bg-violet-600', dot: 'bg-violet-400' },
  { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-600', dot: 'bg-blue-400' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', badge: 'bg-cyan-600', dot: 'bg-cyan-400' },
];

interface Props {
  week: WeekPlan;
  index: number;
  total: number;
}

export function WeekCard({ week, index, total }: Props) {
  const colors = weekColors[index % weekColors.length]!;
  const isLast = index === total - 1;

  return (
    <div
      className={`relative rounded-2xl border-2 ${colors.bg} ${colors.border} p-6 transition-all duration-300`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <span
            className={`inline-block px-2.5 py-1 text-xs font-bold text-white rounded-lg ${colors.badge} mb-2`}
          >
            Week {week.week}
          </span>
          <h3 className="text-base font-semibold text-slate-800 leading-snug">{week.focus}</h3>
        </div>
        {isLast && (
          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full">
            Goal complete
          </span>
        )}
      </div>

      <ul className="space-y-2.5">
        {week.tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <div className={`mt-1 w-4 h-4 flex-shrink-0 rounded flex items-center justify-center ${colors.badge}`}>
              <CheckSquare size={10} className="text-white" />
            </div>
            <span className="text-sm text-slate-700 leading-relaxed">{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
