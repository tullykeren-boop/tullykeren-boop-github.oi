import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Target,
  Plus,
  Settings,
  Zap,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { computeGoalProgress } from '../../utils/goalUtils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/goals', icon: Target, label: 'My Goals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { goals } = useStore();
  const location = useLocation();
  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 5);

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen bg-surface-900/50 border-r border-surface-800 fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-900/40">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Momentum</h1>
            <p className="text-[10px] text-surface-500 font-medium tracking-wider uppercase">Goal Planner</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-brand-600/20 text-brand-400 border border-brand-500/20'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : ''}`} />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Add */}
      <div className="px-3 mb-2">
        <NavLink
          to="/goals/new"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white transition-all duration-200 shadow-md shadow-brand-900/30"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </NavLink>
      </div>

      {/* Active Goals Quick Nav */}
      <AnimatePresence>
        {activeGoals.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-3 py-3 border-t border-surface-800 flex-1 overflow-hidden"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-surface-500 px-3 mb-2">Active Goals</p>
            <div className="flex flex-col gap-0.5 overflow-y-auto max-h-48">
              {activeGoals.map(goal => {
                  const progress = computeGoalProgress(goal);
                const isActive = location.pathname === `/goals/${goal.id}`;
                return (
                  <NavLink
                    key={goal.id}
                    to={`/goals/${goal.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      isActive ? 'bg-surface-800' : 'hover:bg-surface-800/50'
                    }`}
                  >
                    <span className="text-base leading-none">{goal.coverEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-surface-300 truncate group-hover:text-surface-100 transition-colors">
                        {goal.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex-1 h-1 bg-surface-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-surface-500">{progress}%</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-surface-600 flex-shrink-0" />
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats footer */}
      <div className="mt-auto p-4 border-t border-surface-800">
        <div className="glass-light rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-xs font-semibold text-surface-300">Quick Stats</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-brand-400">{goals.filter(g => g.status === 'active').length}</p>
              <p className="text-[10px] text-surface-500">Active</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-400">{goals.filter(g => g.status === 'completed').length}</p>
              <p className="text-[10px] text-surface-500">Done</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-surface-300">{goals.length}</p>
              <p className="text-[10px] text-surface-500">Total</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
