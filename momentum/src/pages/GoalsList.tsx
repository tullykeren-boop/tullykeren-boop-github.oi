import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  ArrowRight,
  Trash2,
  CheckCircle2,
  PauseCircle,
  Archive,
  MoreVertical,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { computeGoalProgress, getCategoryConfig, getPriorityConfig, getDaysRemaining, formatDate } from '../utils/goalUtils';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import type { GoalStatus, GoalCategory } from '../types';

const STATUS_TABS: { key: GoalStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'paused', label: 'Paused' },
  { key: 'archived', label: 'Archived' },
];

const CATEGORIES: { key: GoalCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Categories' },
  { key: 'health', label: '💪 Health' },
  { key: 'career', label: '🚀 Career' },
  { key: 'learning', label: '📚 Learning' },
  { key: 'finance', label: '💰 Finance' },
  { key: 'relationships', label: '❤️ Relationships' },
  { key: 'creativity', label: '🎨 Creativity' },
  { key: 'mindfulness', label: '🧘 Mindfulness' },
  { key: 'other', label: '⭐ Other' },
];

export function GoalsList() {
  const { goals, updateGoal, deleteGoal } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<GoalCategory | 'all'>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = goals.filter(g => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && g.category !== categoryFilter) return false;
    if (search && !g.title.toLowerCase().includes(search.toLowerCase()) && !g.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleStatusChange = (goalId: string, status: GoalStatus) => {
    updateGoal(goalId, { status });
    toast(`Goal ${status === 'completed' ? 'marked as completed! 🎉' : `set to ${status}`}`);
    setOpenMenu(null);
  };

  const handleDelete = (goalId: string) => {
    if (confirm('Delete this goal and all its data? This cannot be undone.')) {
      deleteGoal(goalId);
      toast('Goal deleted', 'error');
    }
    setOpenMenu(null);
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-surface-100 mb-1">My Goals</h1>
            <p className="text-surface-400">{goals.length} total goal{goals.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/goals/new">
            <Button icon={<Plus className="w-4 h-4" />}>New Goal</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search goals..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-surface-400" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value as GoalCategory | 'all')}
                className="bg-surface-900 border border-surface-700 rounded-xl px-3 py-2.5 text-sm text-surface-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                {CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-surface-900 rounded-xl w-fit">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === tab.key
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                {tab.label}
                {tab.key !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({goals.filter(g => g.status === tab.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Goals Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          emoji="🎯"
          title={search || categoryFilter !== 'all' ? 'No goals match your filters' : 'No goals yet'}
          description={search || categoryFilter !== 'all'
            ? 'Try adjusting your search or filters to find what you\'re looking for.'
            : 'Create your first goal and let AI help you build an action plan to achieve it.'}
          action={!search && categoryFilter === 'all' ? (
            <Link to="/goals/new">
              <Button icon={<Plus className="w-4 h-4" />}>Create Goal</Button>
            </Link>
          ) : undefined}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(goal => {
              const progress = computeGoalProgress(goal);
              const catConfig = getCategoryConfig(goal.category);
              const priConfig = getPriorityConfig(goal.priority);
              const daysLeft = getDaysRemaining(goal.targetDate);
              const allTasks = goal.milestones.flatMap(m => m.tasks);
              const doneTasks = allTasks.filter(t => t.status === 'done');

              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative"
                >
                  {/* Context Menu */}
                  {openMenu === goal.id && (
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenu(null)}
                    />
                  )}
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      onClick={e => { e.preventDefault(); setOpenMenu(openMenu === goal.id ? null : goal.id); }}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {openMenu === goal.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute right-0 mt-1 w-48 glass rounded-xl shadow-xl z-30 overflow-hidden"
                        >
                          {goal.status !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(goal.id, 'completed')}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-emerald-400 hover:bg-surface-800 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Mark Completed
                            </button>
                          )}
                          {goal.status === 'active' && (
                            <button
                              onClick={() => handleStatusChange(goal.id, 'paused')}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-amber-400 hover:bg-surface-800 transition-colors"
                            >
                              <PauseCircle className="w-4 h-4" /> Pause Goal
                            </button>
                          )}
                          {goal.status === 'paused' && (
                            <button
                              onClick={() => handleStatusChange(goal.id, 'active')}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-brand-400 hover:bg-surface-800 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Resume Goal
                            </button>
                          )}
                          {goal.status !== 'archived' && (
                            <button
                              onClick={() => handleStatusChange(goal.id, 'archived')}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-surface-400 hover:bg-surface-800 transition-colors"
                            >
                              <Archive className="w-4 h-4" /> Archive
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-surface-800 transition-colors border-t border-surface-800"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Goal
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link to={`/goals/${goal.id}`} className="block h-full">
                    <Card hover className="h-full group pr-10">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${catConfig.bgClass}`}>
                          {goal.coverEmoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-surface-100 group-hover:text-white transition-colors truncate">
                            {goal.title}
                          </h3>
                          <span className={`text-xs ${catConfig.textClass}`}>{catConfig.label}</span>
                        </div>
                      </div>

                      <p className="text-sm text-surface-400 mb-4 line-clamp-2">{goal.description}</p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-surface-500">Progress</span>
                          <span className="text-xs font-semibold text-surface-300">{progress}%</span>
                        </div>
                        <ProgressBar value={progress} size="sm" animated={false} />
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${priConfig.bgClass} ${priConfig.textClass}`}>
                          {priConfig.label} priority
                        </span>
                        {allTasks.length > 0 && (
                          <span className="text-xs text-surface-500">
                            {doneTasks.length}/{allTasks.length} tasks
                          </span>
                        )}
                        {goal.targetDate && (
                          <span className={`text-xs flex items-center gap-1 ml-auto ${daysLeft !== null && daysLeft < 0 ? 'text-red-400' : daysLeft !== null && daysLeft < 7 ? 'text-amber-400' : 'text-surface-500'}`}>
                            <Calendar className="w-3 h-3" />
                            {goal.targetDate ? (daysLeft !== null && daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`) : formatDate(goal.targetDate)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-800/50">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          goal.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          goal.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                          goal.status === 'archived' ? 'bg-surface-700 text-surface-400' :
                          'bg-brand-500/20 text-brand-400'
                        }`}>
                          {goal.status}
                        </span>
                        <span className="text-xs text-brand-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View details <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
