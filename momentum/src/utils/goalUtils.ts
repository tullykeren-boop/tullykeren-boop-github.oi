import type { Goal, GoalCategory, Task } from '../types';

export function computeGoalProgress(goal: Goal): number {
  const allTasks = goal.milestones.flatMap(m => m.tasks);
  if (allTasks.length === 0) {
    const completedMs = goal.milestones.filter(m => !!m.completedAt).length;
    if (goal.milestones.length === 0) return 0;
    return Math.round((completedMs / goal.milestones.length) * 100);
  }
  const doneTasks = allTasks.filter(t => t.status === 'done').length;
  return Math.round((doneTasks / allTasks.length) * 100);
}

export function getDaysRemaining(targetDate?: string): number | null {
  if (!targetDate) return null;
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getCategoryConfig(category: GoalCategory) {
  const configs: Record<GoalCategory, { label: string; emoji: string; color: string; bgClass: string; textClass: string }> = {
    health: { label: 'Health & Fitness', emoji: '💪', color: '#10b981', bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400' },
    career: { label: 'Career & Work', emoji: '🚀', color: '#3b82f6', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400' },
    learning: { label: 'Learning & Skills', emoji: '📚', color: '#8b5cf6', bgClass: 'bg-violet-500/20', textClass: 'text-violet-400' },
    finance: { label: 'Finance & Wealth', emoji: '💰', color: '#f59e0b', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400' },
    relationships: { label: 'Relationships', emoji: '❤️', color: '#ec4899', bgClass: 'bg-pink-500/20', textClass: 'text-pink-400' },
    creativity: { label: 'Creativity', emoji: '🎨', color: '#f97316', bgClass: 'bg-orange-500/20', textClass: 'text-orange-400' },
    mindfulness: { label: 'Mindfulness', emoji: '🧘', color: '#06b6d4', bgClass: 'bg-cyan-500/20', textClass: 'text-cyan-400' },
    other: { label: 'Other', emoji: '⭐', color: '#6366f1', bgClass: 'bg-indigo-500/20', textClass: 'text-indigo-400' },
  };
  return configs[category];
}

export function getPriorityConfig(priority: string) {
  const configs = {
    high: { label: 'High', color: '#ef4444', bgClass: 'bg-red-500/20', textClass: 'text-red-400', dot: '🔴' },
    medium: { label: 'Medium', color: '#f59e0b', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400', dot: '🟡' },
    low: { label: 'Low', color: '#10b981', bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400', dot: '🟢' },
  };
  return configs[priority as keyof typeof configs] || configs.medium;
}

export function getStatusConfig(status: string) {
  const configs = {
    active: { label: 'Active', bgClass: 'bg-brand-500/20', textClass: 'text-brand-400' },
    completed: { label: 'Completed', bgClass: 'bg-emerald-500/20', textClass: 'text-emerald-400' },
    paused: { label: 'Paused', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400' },
    archived: { label: 'Archived', bgClass: 'bg-surface-500/20', textClass: 'text-surface-400' },
  };
  return configs[status as keyof typeof configs] || configs.active;
}

export function getUpcomingTasks(goals: Goal[], limit = 5): Array<Task & { goalTitle: string; goalId: string }> {
  const tasks: Array<Task & { goalTitle: string; goalId: string }> = [];
  for (const goal of goals) {
    if (goal.status !== 'active') continue;
    for (const ms of goal.milestones) {
      for (const task of ms.tasks) {
        if (task.status !== 'done') {
          tasks.push({ ...task, goalTitle: goal.title, goalId: goal.id });
        }
      }
    }
  }
  tasks.sort((a, b) => {
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    const pOrder = { high: 0, medium: 1, low: 2 };
    return pOrder[a.priority] - pOrder[b.priority];
  });
  return tasks.slice(0, limit);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(date);
}
