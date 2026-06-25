import { useState, useMemo } from 'react';
import { Plus, RefreshCw, LayoutDashboard } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import type { Filters } from './components/FilterBar';
import type { Task, Status } from './api/types';

export default function App() {
  const { tasks, loading, error, reload, createTask, updateTask, deleteTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<Filters>({ search: '', priority: '', status: '' });

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !t.title.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q) &&
          !t.tags.some((tag) => tag.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.status && t.status !== filters.status) return false;
      return true;
    });
  }, [tasks, filters]);

  const handleStatusChange = (id: string, status: Status) => {
    updateTask(id, { status }).catch(console.error);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) {
      deleteTask(id).catch(console.error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSave = async (data: Parameters<typeof createTask>[0]) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">TaskFlow</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage your work</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={reload}
              disabled={loading}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg hover:from-indigo-700 hover:to-violet-700 shadow-sm transition-all"
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <StatsBar tasks={tasks} />

        <FilterBar filters={filters} onChange={setFilters} />

        {error && (
          <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 flex items-center gap-2">
            <span className="font-medium">Error:</span> {error}
            <button
              onClick={reload}
              className="ml-auto text-rose-500 hover:text-rose-700 underline text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {loading && tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading tasks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <LayoutDashboard size={28} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </p>
            {tasks.length === 0 && (
              <button
                onClick={() => setModalOpen(true)}
                className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Create your first task →
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-xs text-slate-400">
            Showing {filtered.length} of {tasks.length} tasks
          </p>
        )}
      </main>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
