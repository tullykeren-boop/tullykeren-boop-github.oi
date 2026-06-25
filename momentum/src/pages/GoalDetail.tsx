import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  MessageSquare,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Clock,
  Edit3,
  Check,
  X,
  Target,
  TrendingUp,
  PlayCircle,
  PauseCircle,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  computeGoalProgress,
  getCategoryConfig,
  getPriorityConfig,
  getDaysRemaining,
  formatDate,
  formatRelativeDate,
} from '../utils/goalUtils';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { AIChat } from '../components/goals/AIChat';
import type { TaskStatus, Priority } from '../types';

function TaskItem({
  task,
  goalId,
  milestoneId,
}: {
  task: { id: string; title: string; description?: string; status: TaskStatus; priority: Priority; estimatedMinutes?: number; dueDate?: string; completedAt?: string };
  goalId: string;
  milestoneId: string;
}) {
  const { updateTask, deleteTask } = useStore();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const priConfig = getPriorityConfig(task.priority);
  const isDone = task.status === 'done';

  const toggle = () => {
    const next: TaskStatus = isDone ? 'todo' : 'done';
    updateTask(goalId, milestoneId, task.id, { status: next });
    if (next === 'done') toast('Task completed! ✅');
  };

  const saveEdit = () => {
    if (editTitle.trim()) {
      updateTask(goalId, milestoneId, task.id, { title: editTitle.trim() });
      setEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group ${
        isDone ? 'bg-surface-900/30 opacity-60' : 'bg-surface-800/40 hover:bg-surface-800/60'
      }`}
    >
      <button
        onClick={toggle}
        className={`mt-0.5 flex-shrink-0 transition-all duration-200 ${isDone ? 'text-emerald-400' : 'text-surface-600 hover:text-brand-400'}`}
      >
        {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false); }}
              className="flex-1 bg-surface-900 border border-brand-500/50 rounded-lg px-3 py-1.5 text-sm text-surface-100 focus:outline-none"
              autoFocus
            />
            <button onClick={saveEdit} className="text-emerald-400 hover:text-emerald-300">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => setEditing(false)} className="text-surface-400 hover:text-surface-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className={`text-sm ${isDone ? 'line-through text-surface-500' : 'text-surface-200'}`}>
            {task.title}
          </p>
        )}
        {task.description && !editing && (
          <p className="text-xs text-surface-500 mt-0.5">{task.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${priConfig.bgClass} ${priConfig.textClass}`}>
            {priConfig.label}
          </span>
          {task.estimatedMinutes && (
            <span className="text-xs text-surface-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />{task.estimatedMinutes}m
            </span>
          )}
          {task.completedAt && (
            <span className="text-xs text-emerald-500">Done {formatRelativeDate(task.completedAt)}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded text-surface-500 hover:text-surface-300 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => deleteTask(goalId, milestoneId, task.id)}
          className="p-1 rounded text-surface-600 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function MilestoneSection({
  milestone,
  goalId,
  index,
}: {
  milestone: { id: string; title: string; description?: string; completedAt?: string; tasks: Array<{ id: string; title: string; description?: string; status: TaskStatus; priority: Priority; estimatedMinutes?: number; dueDate?: string; completedAt?: string }> };
  goalId: string;
  index: number;
}) {
  const { addTask, deleteMilestone, completeMilestone } = useStore();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(true);
  const [addingTask, setAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' as Priority, estimatedMinutes: '' });

  const doneTasks = milestone.tasks.filter(t => t.status === 'done').length;
  const isComplete = !!milestone.completedAt;

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addTask(goalId, milestone.id, {
      title: newTask.title,
      priority: newTask.priority,
      estimatedMinutes: newTask.estimatedMinutes ? parseInt(newTask.estimatedMinutes) : undefined,
    });
    setNewTask({ title: '', priority: 'medium', estimatedMinutes: '' });
    setAddingTask(false);
    toast('Task added!');
  };

  return (
    <Card className={`transition-all duration-300 ${isComplete ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => completeMilestone(goalId, milestone.id)}
          className={`mt-0.5 flex-shrink-0 transition-all duration-200 ${isComplete ? 'text-emerald-400' : 'text-surface-600 hover:text-brand-400'}`}
        >
          {isComplete ? <CheckCircle2 className="w-5 h-5" /> : (
            <div className="w-5 h-5 rounded-full border-2 border-surface-600 hover:border-brand-400 transition-colors flex items-center justify-center text-xs font-bold text-surface-500">
              {index + 1}
            </div>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className={`font-semibold ${isComplete ? 'line-through text-surface-400' : 'text-surface-100'}`}>
                {milestone.title}
              </h3>
              {milestone.description && (
                <p className="text-sm text-surface-400 mt-0.5">{milestone.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-surface-500">{doneTasks}/{milestone.tasks.length} tasks</span>
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 rounded text-surface-500 hover:text-surface-300 transition-colors"
              >
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this milestone and all its tasks?')) {
                    deleteMilestone(goalId, milestone.id);
                    toast('Milestone deleted', 'error');
                  }
                }}
                className="p-1 rounded text-surface-600 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-col gap-2">
                  <AnimatePresence>
                    {milestone.tasks.map(task => (
                      <TaskItem key={task.id} task={task} goalId={goalId} milestoneId={milestone.id} />
                    ))}
                  </AnimatePresence>

                  {addingTask ? (
                    <div className="p-3 rounded-xl bg-surface-800/50 border border-brand-500/20">
                      <div className="flex flex-col gap-2">
                        <input
                          value={newTask.title}
                          onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); if (e.key === 'Escape') setAddingTask(false); }}
                          placeholder="Task title..."
                          className="w-full bg-surface-900 border border-surface-700 rounded-lg px-3 py-2 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                          autoFocus
                        />
                        <div className="flex items-center gap-2">
                          <select
                            value={newTask.priority}
                            onChange={e => setNewTask(n => ({ ...n, priority: e.target.value as Priority }))}
                            className="bg-surface-900 border border-surface-700 rounded-lg px-2 py-1.5 text-xs text-surface-300 focus:outline-none"
                          >
                            <option value="high">🔴 High</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="low">🟢 Low</option>
                          </select>
                          <input
                            type="number"
                            value={newTask.estimatedMinutes}
                            onChange={e => setNewTask(n => ({ ...n, estimatedMinutes: e.target.value }))}
                            placeholder="Est. minutes"
                            className="w-32 bg-surface-900 border border-surface-700 rounded-lg px-2 py-1.5 text-xs text-surface-300 focus:outline-none"
                          />
                          <div className="flex items-center gap-1 ml-auto">
                            <button onClick={handleAddTask} className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded-lg transition-colors">
                              Add
                            </button>
                            <button onClick={() => setAddingTask(false)} className="px-3 py-1.5 bg-surface-700 text-surface-300 text-xs rounded-lg transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingTask(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-surface-500 hover:text-brand-400 hover:bg-surface-800/40 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" /> Add task
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}

export function GoalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { goals, updateGoal, addMilestone, addCheckIn } = useStore();
  const { toast } = useToast();

  const goal = goals.find(g => g.id === id);

  const [showChat, setShowChat] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [newMs, setNewMs] = useState({ title: '', description: '', targetDate: '' });
  const [checkIn, setCheckIn] = useState({ note: '', mood: 3 as 1 | 2 | 3 | 4 | 5, progress: 50 });

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-surface-400">Goal not found</p>
        <Link to="/goals"><Button>Back to Goals</Button></Link>
      </div>
    );
  }

  const progress = computeGoalProgress(goal);
  const catConfig = getCategoryConfig(goal.category);
  const priConfig = getPriorityConfig(goal.priority);
  const daysLeft = getDaysRemaining(goal.targetDate);
  const allTasks = goal.milestones.flatMap(m => m.tasks);
  const doneTasks = allTasks.filter(t => t.status === 'done');

  const handleAddMilestone = () => {
    if (!newMs.title.trim()) return;
    addMilestone(goal.id, { title: newMs.title, description: newMs.description || undefined, targetDate: newMs.targetDate || undefined });
    setNewMs({ title: '', description: '', targetDate: '' });
    setShowAddMilestone(false);
    toast('Milestone added!');
  };

  const handleCheckIn = () => {
    addCheckIn(goal.id, checkIn);
    setShowCheckIn(false);
    setCheckIn({ note: '', mood: 3, progress: 50 });
    toast('Check-in saved! Keep going! 🎯');
  };

  const toggleStatus = () => {
    const next = goal.status === 'active' ? 'paused' : 'active';
    updateGoal(goal.id, { status: next });
    toast(`Goal ${next === 'paused' ? 'paused' : 'resumed'}!`);
  };

  const markComplete = () => {
    if (confirm('Mark this goal as completed?')) {
      updateGoal(goal.id, { status: 'completed' });
      toast('Goal completed! Outstanding work! 🏆', 'success');
    }
  };

  const MOODS = ['😞', '😕', '😐', '🙂', '😄'];

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button
          onClick={() => navigate('/goals')}
          className="flex items-center gap-2 text-surface-400 hover:text-surface-200 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Goals
        </button>

        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${catConfig.bgClass}`}>
              {goal.coverEmoji}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-surface-100">{goal.title}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full ${
                  goal.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  goal.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-brand-500/20 text-brand-400'
                }`}>
                  {goal.status}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-sm ${catConfig.textClass}`}>{catConfig.emoji} {catConfig.label}</span>
                <span className={`text-sm ${priConfig.textClass}`}>{priConfig.dot} {priConfig.label} Priority</span>
                {goal.targetDate && (
                  <span className={`text-sm flex items-center gap-1 ${daysLeft !== null && daysLeft < 0 ? 'text-red-400' : daysLeft !== null && daysLeft < 7 ? 'text-amber-400' : 'text-surface-400'}`}>
                    <Calendar className="w-4 h-4" />
                    {daysLeft !== null && daysLeft < 0
                      ? `${Math.abs(daysLeft)} days overdue`
                      : daysLeft === 0 ? 'Due today'
                      : `${daysLeft} days left · ${formatDate(goal.targetDate)}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setShowCheckIn(true)} icon={<TrendingUp className="w-4 h-4" />}>
              Check In
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowChat(true)} icon={<MessageSquare className="w-4 h-4" />}>
              AI Coach
            </Button>
            {goal.status !== 'completed' && (
              <>
                <Button variant="ghost" size="sm" onClick={toggleStatus} icon={goal.status === 'paused' ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}>
                  {goal.status === 'paused' ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="success" size="sm" onClick={markComplete} icon={<Check className="w-4 h-4" />}>
                  Complete
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Progress Overview */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-surface-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-400" />
                Progress Overview
              </h2>
              <span className="text-2xl font-bold gradient-text">{progress}%</span>
            </div>
            <ProgressBar value={progress} size="lg" showLabel={false} />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 rounded-xl bg-surface-800/50">
                <p className="text-xl font-bold text-surface-100">{goal.milestones.length}</p>
                <p className="text-xs text-surface-500 mt-0.5">Milestones</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface-800/50">
                <p className="text-xl font-bold text-surface-100">{allTasks.length}</p>
                <p className="text-xs text-surface-500 mt-0.5">Total Tasks</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-500/10">
                <p className="text-xl font-bold text-emerald-400">{doneTasks.length}</p>
                <p className="text-xs text-surface-500 mt-0.5">Completed</p>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <h2 className="font-semibold text-surface-200 mb-3">About this Goal</h2>
            <p className="text-surface-300 text-sm leading-relaxed">{goal.description}</p>

            {goal.motivation && (
              <div className="mt-4 p-4 rounded-xl bg-brand-600/10 border border-brand-500/20">
                <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-2">Your Motivation</p>
                <p className="text-sm text-surface-300 italic leading-relaxed">"{goal.motivation}"</p>
              </div>
            )}

            {goal.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {goal.tags.map(tag => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
            )}
          </Card>

          {/* AI Plan */}
          {goal.aiPlan && (
            <Card className="border border-brand-500/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <h2 className="font-semibold text-surface-200">AI Execution Plan</h2>
              </div>
              <p className="text-surface-300 text-sm leading-relaxed">{goal.aiPlan}</p>
            </Card>
          )}

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-200">Milestones & Tasks</h2>
              <Button size="sm" variant="secondary" onClick={() => setShowAddMilestone(true)} icon={<Plus className="w-4 h-4" />}>
                Add Milestone
              </Button>
            </div>

            {goal.milestones.length === 0 ? (
              <Card className="text-center py-12">
                <Target className="w-10 h-10 text-surface-600 mx-auto mb-3" />
                <p className="text-surface-400 mb-4">No milestones yet. Add one to get started!</p>
                <Button size="sm" onClick={() => setShowAddMilestone(true)} icon={<Plus className="w-4 h-4" />}>
                  Add First Milestone
                </Button>
              </Card>
            ) : (
              <div className="flex flex-col gap-3">
                {goal.milestones
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((ms, i) => (
                    <MilestoneSection key={ms.id} milestone={ms} goalId={goal.id} index={i} />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Check-in History */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-surface-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                Check-ins
              </h2>
              <Button size="sm" variant="ghost" onClick={() => setShowCheckIn(true)} icon={<Plus className="w-3.5 h-3.5" />}>
                Add
              </Button>
            </div>

            {goal.checkIns.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-surface-500">No check-ins yet.</p>
                <p className="text-xs text-surface-600 mt-1">Log your progress regularly to stay on track.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {[...goal.checkIns].reverse().slice(0, 8).map(ci => (
                  <div key={ci.id} className="p-3 rounded-xl bg-surface-800/50 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{MOODS[ci.mood - 1]}</span>
                      <span className="text-xs text-surface-500">{formatRelativeDate(ci.date)}</span>
                    </div>
                    <p className="text-surface-300 text-xs leading-relaxed">{ci.note}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 bg-surface-700 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${ci.progress}%` }} />
                      </div>
                      <span className="text-xs text-surface-500">{ci.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Goal Info */}
          <Card>
            <h2 className="font-semibold text-surface-200 mb-3">Goal Details</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-400">Created</span>
                <span className="text-surface-300">{formatDate(goal.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Last Updated</span>
                <span className="text-surface-300">{formatRelativeDate(goal.updatedAt)}</span>
              </div>
              {goal.targetDate && (
                <div className="flex justify-between">
                  <span className="text-surface-400">Target Date</span>
                  <span className="text-surface-300">{formatDate(goal.targetDate)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-surface-400">Priority</span>
                <span className={priConfig.textClass}>{priConfig.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Check-ins</span>
                <span className="text-surface-300">{goal.checkIns.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Milestone Modal */}
      <Modal open={showAddMilestone} onClose={() => setShowAddMilestone(false)} title="Add Milestone">
        <div className="flex flex-col gap-4">
          <Input
            label="Milestone Title"
            placeholder="e.g. Complete Foundation Phase"
            value={newMs.title}
            onChange={e => setNewMs(m => ({ ...m, title: e.target.value }))}
          />
          <Textarea
            label="Description (optional)"
            placeholder="What does completing this milestone mean?"
            value={newMs.description}
            onChange={e => setNewMs(m => ({ ...m, description: e.target.value }))}
            rows={3}
          />
          <Input
            label="Target Date (optional)"
            type="date"
            value={newMs.targetDate}
            onChange={e => setNewMs(m => ({ ...m, targetDate: e.target.value }))}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowAddMilestone(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleAddMilestone} className="flex-1" disabled={!newMs.title.trim()}>Add Milestone</Button>
          </div>
        </div>
      </Modal>

      {/* Check In Modal */}
      <Modal open={showCheckIn} onClose={() => setShowCheckIn(false)} title="Log Progress Check-in">
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-surface-300 block mb-3">How are you feeling about this goal?</label>
            <div className="flex justify-center gap-4">
              {MOODS.map((mood, i) => (
                <button
                  key={i}
                  onClick={() => setCheckIn(c => ({ ...c, mood: (i + 1) as 1 | 2 | 3 | 4 | 5 }))}
                  className={`text-3xl transition-all duration-200 ${checkIn.mood === i + 1 ? 'scale-125' : 'opacity-50 hover:opacity-80'}`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-surface-300 block mb-2">
              Progress estimate: <span className="text-brand-400">{checkIn.progress}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={checkIn.progress}
              onChange={e => setCheckIn(c => ({ ...c, progress: parseInt(e.target.value) }))}
              className="w-full accent-brand-500"
            />
          </div>

          <Textarea
            label="Notes"
            placeholder="What progress did you make? Any blockers? How are you feeling?"
            value={checkIn.note}
            onChange={e => setCheckIn(c => ({ ...c, note: e.target.value }))}
            rows={4}
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowCheckIn(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCheckIn} className="flex-1" disabled={!checkIn.note.trim()}>Save Check-in</Button>
          </div>
        </div>
      </Modal>

      {/* AI Chat */}
      <AnimatePresence>
        {showChat && (
          <AIChat goal={goal} onClose={() => setShowChat(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
