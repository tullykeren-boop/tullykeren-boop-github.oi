import type { Priority, Status } from '../api/types';

const priorityStyles: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-600 border border-slate-200',
  medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  high: 'bg-rose-50 text-rose-700 border border-rose-200',
};

const statusStyles: Record<Status, string> = {
  todo: 'bg-slate-100 text-slate-600 border border-slate-200',
  in_progress: 'bg-blue-50 text-blue-700 border border-blue-200',
  done: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const statusLabels: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
