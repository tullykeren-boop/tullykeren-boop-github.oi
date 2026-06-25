import type { Task } from '../api/types';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  tasks: Task[];
}

export function StatsBar({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const overdue = tasks.filter(
    (t) => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date()
  ).length;

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
          <Circle size={18} className="text-slate-500" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-xl font-bold text-slate-800">{total}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
          <Clock size={18} className="text-blue-500" />
        </div>
        <div>
          <p className="text-xs text-slate-500">In Progress</p>
          <p className="text-xl font-bold text-blue-600">{inProgress}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
          <CheckCircle2 size={18} className="text-emerald-500" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Completed</p>
          <p className="text-xl font-bold text-emerald-600">{done}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center">
          <AlertTriangle size={18} className="text-rose-500" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Overdue</p>
          <p className="text-xl font-bold text-rose-600">{overdue}</p>
        </div>
      </div>

      <div className="col-span-2 sm:col-span-4 bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-600">Overall Progress</span>
          <span className="text-xs font-bold text-indigo-600">{pct}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
