import { useState } from 'react';
import { Trash2, Pencil, ChevronDown, ChevronUp, Calendar, Tag } from 'lucide-react';
import type { Task, Status } from '../api/types';
import { PriorityBadge, StatusBadge } from './Badge';

const statusOrder: Status[] = ['todo', 'in_progress', 'done'];

interface Props {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
  onEdit: (task: Task) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TaskCard({ task, onDelete, onStatusChange, onEdit }: Props) {
  const [expanded, setExpanded] = useState(false);

  const nextStatus = (): Status | null => {
    const idx = statusOrder.indexOf(task.status);
    return idx < statusOrder.length - 1 ? statusOrder[idx + 1] : null;
  };

  const isOverdue =
    task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <button
              onClick={() => {
                const ns = nextStatus();
                if (ns) onStatusChange(task.id, ns);
              }}
              title={nextStatus() ? `Mark as ${nextStatus()}` : 'Already completed'}
              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors ${
                task.status === 'done'
                  ? 'bg-emerald-500 border-emerald-500'
                  : task.status === 'in_progress'
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
            >
              {task.status === 'done' && (
                <svg viewBox="0 0 20 20" fill="white" className="w-full h-full p-0.5">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <div className="min-w-0">
              <h3
                className={`text-sm font-semibold leading-snug ${
                  task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{task.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Edit task"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
              title="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          {task.dueDate && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                isOverdue
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              <Calendar size={10} />
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.tags.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Tag size={10} />
              {task.tags.join(', ')}
            </span>
          )}
        </div>

        {task.description && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Less' : 'More'}
          </button>
        )}
        {expanded && task.description && (
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">{task.description}</p>
        )}
      </div>
    </div>
  );
}
