import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
  CheckCircle,
  TrendingUp,
  Calendar,
  ArrowRight,
  Plus,
  Flame,
  Clock,
  Star,
  Zap,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  computeGoalProgress,
  getCategoryConfig,
  getPriorityConfig,
  getUpcomingTasks,
  getDaysRemaining,
  formatRelativeDate,
} from '../utils/goalUtils';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
};

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <motion.div variants={stagger.item}>
      <Card className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl -mr-10 -mt-10 ${color}`} />
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${color} bg-opacity-20`}>
            <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-').replace('/20', '')}`} />
          </div>
        </div>
        <p className="text-3xl font-bold text-surface-100 mb-1">{value}</p>
        <p className="text-sm font-medium text-surface-300">{label}</p>
        {sub && <p className="text-xs text-surface-500 mt-0.5">{sub}</p>}
      </Card>
    </motion.div>
  );
}

export function Dashboard() {
  const { goals } = useStore();

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const allTasks = goals.flatMap(g => g.milestones.flatMap(m => m.tasks));
  const doneTasks = allTasks.filter(t => t.status === 'done');
  const upcomingTasks = getUpcomingTasks(goals, 6);
  const highPriorityGoals = activeGoals.filter(g => g.priority === 'high');
  const avgProgress = activeGoals.length
    ? Math.round(activeGoals.reduce((acc, g) => acc + computeGoalProgress(g), 0) / activeGoals.length)
    : 0;

  const topGoals = [...activeGoals]
    .sort((a, b) => {
      const pOrder = { high: 0, medium: 1, low: 2 };
      return pOrder[a.priority] - pOrder[b.priority];
    })
    .slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-surface-100 mb-1">
              {greeting} <span className="gradient-text">👋</span>
            </h1>
            <p className="text-surface-400">
              {activeGoals.length === 0
                ? "Ready to start your journey? Create your first goal."
                : `You have ${activeGoals.length} active goal${activeGoals.length === 1 ? '' : 's'} in progress.`}
            </p>
          </div>
          <Link to="/goals/new">
            <Button icon={<Plus className="w-4 h-4" />}>New Goal</Button>
          </Link>
        </div>
      </motion.div>

      {goals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/20 flex items-center justify-center mb-6 animate-pulse-glow">
            <Zap className="w-12 h-12 text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold text-surface-200 mb-3">Welcome to Momentum</h2>
          <p className="text-surface-400 max-w-md mb-8 leading-relaxed">
            Your AI-powered goal execution planner. Create your first goal and let our AI help you build a concrete action plan to make it happen.
          </p>
          <Link to="/goals/new">
            <Button size="lg" icon={<Plus className="w-5 h-5" />}>
              Create Your First Goal
            </Button>
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Stats */}
          <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <StatCard icon={Target} label="Active Goals" value={activeGoals.length} sub={`${highPriorityGoals.length} high priority`} color="bg-brand-500" />
            <StatCard icon={CheckCircle} label="Completed" value={completedGoals.length} sub="goals achieved" color="bg-emerald-500" />
            <StatCard icon={TrendingUp} label="Avg. Progress" value={`${avgProgress}%`} sub="across active goals" color="bg-violet-500" />
            <StatCard icon={Flame} label="Tasks Done" value={doneTasks.length} sub={`of ${allTasks.length} total tasks`} color="bg-orange-500" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Goals */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-surface-200">Active Goals</h2>
                <Link to="/goals" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {topGoals.length === 0 ? (
                <Card className="text-center py-12">
                  <p className="text-surface-400 mb-4">No active goals yet</p>
                  <Link to="/goals/new">
                    <Button size="sm" icon={<Plus className="w-4 h-4" />}>Add Goal</Button>
                  </Link>
                </Card>
              ) : (
                <div className="flex flex-col gap-3">
                  {topGoals.map((goal, i) => {
                    const progress = computeGoalProgress(goal);
                    const catConfig = getCategoryConfig(goal.category);
                    const priConfig = getPriorityConfig(goal.priority);
                    const daysLeft = getDaysRemaining(goal.targetDate);
                    const taskCount = goal.milestones.flatMap(m => m.tasks).length;
                    const doneCount = goal.milestones.flatMap(m => m.tasks).filter(t => t.status === 'done').length;

                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <Link to={`/goals/${goal.id}`}>
                          <Card hover className="group">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${catConfig.bgClass}`}>
                                {goal.coverEmoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h3 className="font-semibold text-surface-100 group-hover:text-white transition-colors truncate">
                                    {goal.title}
                                  </h3>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${priConfig.bgClass} ${priConfig.textClass}`}>
                                      {priConfig.label}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-surface-400 mb-3 line-clamp-1">{goal.description}</p>
                                <div className="flex items-center gap-4">
                                  <div className="flex-1">
                                    <ProgressBar value={progress} size="sm" animated={false} />
                                  </div>
                                  <span className="text-xs font-semibold text-surface-400">{progress}%</span>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className={`text-xs ${catConfig.textClass}`}>{catConfig.label}</span>
                                  {taskCount > 0 && (
                                    <span className="text-xs text-surface-500">
                                      {doneCount}/{taskCount} tasks
                                    </span>
                                  )}
                                  {daysLeft !== null && (
                                    <span className={`text-xs flex items-center gap-1 ${daysLeft < 0 ? 'text-red-400' : daysLeft < 7 ? 'text-amber-400' : 'text-surface-500'}`}>
                                      <Calendar className="w-3 h-3" />
                                      {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-surface-600 group-hover:text-brand-400 flex-shrink-0 mt-1 transition-colors" />
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                  {activeGoals.length > 4 && (
                    <Link to="/goals">
                      <Card hover className="text-center py-3">
                        <span className="text-sm text-brand-400 hover:text-brand-300">
                          +{activeGoals.length - 4} more active goals
                        </span>
                      </Card>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Upcoming Tasks */}
              <div>
                <h2 className="text-lg font-semibold text-surface-200 mb-3">Upcoming Tasks</h2>
                {upcomingTasks.length === 0 ? (
                  <Card className="text-center py-8">
                    <Star className="w-8 h-8 text-surface-600 mx-auto mb-3" />
                    <p className="text-sm text-surface-500">No pending tasks</p>
                  </Card>
                ) : (
                  <Card padding="none">
                    <div className="divide-y divide-surface-800/50">
                      {upcomingTasks.map((task, i) => {
                        const priConfig = getPriorityConfig(task.priority);
                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Link
                              to={`/goals/${task.goalId}`}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-surface-800/30 transition-colors group"
                            >
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priConfig.bgClass.replace('/20', '')}`}
                                style={{ backgroundColor: priConfig.color }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-surface-300 group-hover:text-surface-100 transition-colors truncate">
                                  {task.title}
                                </p>
                                <p className="text-xs text-surface-500 truncate mt-0.5">{task.goalTitle}</p>
                                {task.estimatedMinutes && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3 text-surface-600" />
                                    <span className="text-xs text-surface-600">{task.estimatedMinutes}m</span>
                                  </div>
                                )}
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </div>

              {/* Recent Activity */}
              {goals.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-surface-200 mb-3">Recently Updated</h2>
                  <Card padding="none">
                    <div className="divide-y divide-surface-800/50">
                      {[...goals]
                        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                        .slice(0, 4)
                        .map((goal) => (
                          <Link
                            key={goal.id}
                            to={`/goals/${goal.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-surface-800/30 transition-colors group"
                          >
                            <span className="text-lg">{goal.coverEmoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-surface-300 group-hover:text-surface-100 transition-colors truncate">
                                {goal.title}
                              </p>
                              <p className="text-xs text-surface-500">{formatRelativeDate(goal.updatedAt)}</p>
                            </div>
                            <Badge variant={goal.status === 'completed' ? 'success' : goal.status === 'paused' ? 'warning' : 'info'}>
                              {goal.status}
                            </Badge>
                          </Link>
                        ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
