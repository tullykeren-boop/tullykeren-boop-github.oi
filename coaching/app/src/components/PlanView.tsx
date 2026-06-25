import { RotateCcw, Download } from 'lucide-react';
import type { CoachingPlan } from '../api/types';
import { WeekCard } from './WeekCard';

interface Props {
  plan: CoachingPlan;
  onReset: () => void;
}

function downloadJson(plan: CoachingPlan) {
  const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'coaching-plan.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function PlanView({ plan, onReset }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Your goal</p>
          <h2 className="text-lg font-bold text-slate-900 leading-snug">{plan.goal}</h2>
          <p className="text-xs text-slate-500 mt-1">
            {plan.weeks.length}-week execution plan · {plan.weeks.reduce((s, w) => s + w.tasks.length, 0)} tasks total
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => downloadJson(plan)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            title="Download as JSON"
          >
            <Download size={13} />
            JSON
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <RotateCcw size={13} />
            New goal
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {plan.weeks.map((week, i) => (
          <WeekCard key={week.week} week={week} index={i} total={plan.weeks.length} />
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-xs font-semibold text-slate-600 mb-2">Raw JSON</p>
        <pre className="text-xs text-slate-500 overflow-x-auto leading-relaxed">
          {JSON.stringify(plan, null, 2)}
        </pre>
      </div>
    </div>
  );
}
