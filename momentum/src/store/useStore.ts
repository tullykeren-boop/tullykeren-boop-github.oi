import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Goal, Task, Milestone, CheckIn, AppState, AppSettings, AIMessage, GoalCategory, Priority } from '../types';

const STORAGE_KEY = 'momentum_app_state';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    goals: [],
    settings: { theme: 'dark', notifications: true, weekStartsMonday: false },
    chatHistory: {},
  };
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

let globalState: AppState = loadState();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

function setState(updater: (s: AppState) => AppState) {
  globalState = updater(globalState);
  saveState(globalState);
  notify();
}

export function useStore() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const fn = () => rerender(n => n + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const createGoal = useCallback((data: {
    title: string;
    description: string;
    category: GoalCategory;
    priority: Priority;
    targetDate?: string;
    motivation?: string;
    tags: string[];
    coverEmoji: string;
    aiPlan?: string;
    milestones?: Array<{ title: string; description?: string; targetDate?: string; tasks?: Array<{ title: string; description?: string; priority?: Priority; estimatedMinutes?: number }> }>;
  }) => {
    const goalId = uuidv4();
    const now = new Date().toISOString();

    const milestones: Milestone[] = (data.milestones || []).map((m, idx) => {
      const msId = uuidv4();
      return {
        id: msId,
        goalId,
        title: m.title,
        description: m.description,
        targetDate: m.targetDate,
        order: idx,
        tasks: (m.tasks || []).map(t => ({
          id: uuidv4(),
          milestoneId: msId,
          goalId,
          title: t.title,
          description: t.description,
          status: 'todo' as const,
          priority: t.priority || 'medium' as const,
          createdAt: now,
          estimatedMinutes: t.estimatedMinutes,
        })),
      };
    });

    const goal: Goal = {
      id: goalId,
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'active',
      priority: data.priority,
      targetDate: data.targetDate,
      createdAt: now,
      updatedAt: now,
      milestones,
      checkIns: [],
      aiPlan: data.aiPlan,
      motivation: data.motivation,
      tags: data.tags,
      coverEmoji: data.coverEmoji,
    };

    setState(s => ({ ...s, goals: [goal, ...s.goals] }));
    return goal;
  }, []);

  const updateGoal = useCallback((goalId: string, updates: Partial<Omit<Goal, 'id' | 'createdAt' | 'milestones' | 'checkIns'>>) => {
    setState(s => ({
      ...s,
      goals: s.goals.map(g =>
        g.id === goalId ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
      ),
    }));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setState(s => ({ ...s, goals: s.goals.filter(g => g.id !== goalId) }));
  }, []);

  const addMilestone = useCallback((goalId: string, data: { title: string; description?: string; targetDate?: string }) => {
    const msId = uuidv4();
    setState(s => ({
      ...s,
      goals: s.goals.map(g => {
        if (g.id !== goalId) return g;
        const milestone: Milestone = {
          id: msId,
          goalId,
          title: data.title,
          description: data.description,
          targetDate: data.targetDate,
          order: g.milestones.length,
          tasks: [],
        };
        return { ...g, milestones: [...g.milestones, milestone], updatedAt: new Date().toISOString() };
      }),
    }));
    return msId;
  }, []);

  const updateMilestone = useCallback((goalId: string, milestoneId: string, updates: Partial<Omit<Milestone, 'id' | 'goalId' | 'tasks'>>) => {
    setState(s => ({
      ...s,
      goals: s.goals.map(g => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: g.milestones.map(m => m.id === milestoneId ? { ...m, ...updates } : m),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const deleteMilestone = useCallback((goalId: string, milestoneId: string) => {
    setState(s => ({
      ...s,
      goals: s.goals.map(g => {
        if (g.id !== goalId) return g;
        return { ...g, milestones: g.milestones.filter(m => m.id !== milestoneId), updatedAt: new Date().toISOString() };
      }),
    }));
  }, []);

  const addTask = useCallback((goalId: string, milestoneId: string, data: { title: string; description?: string; priority?: Priority; dueDate?: string; estimatedMinutes?: number }) => {
    const taskId = uuidv4();
    const now = new Date().toISOString();
    setState(s => ({
      ...s,
      goals: s.goals.map(g => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: g.milestones.map(m => {
            if (m.id !== milestoneId) return m;
            const task: Task = {
              id: taskId,
              milestoneId,
              goalId,
              title: data.title,
              description: data.description,
              status: 'todo',
              priority: data.priority || 'medium',
              dueDate: data.dueDate,
              createdAt: now,
              estimatedMinutes: data.estimatedMinutes,
            };
            return { ...m, tasks: [...m.tasks, task] };
          }),
          updatedAt: now,
        };
      }),
    }));
    return taskId;
  }, []);

  const updateTask = useCallback((goalId: string, milestoneId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'milestoneId' | 'goalId' | 'createdAt'>>) => {
    setState(s => ({
      ...s,
      goals: s.goals.map(g => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: g.milestones.map(m => {
            if (m.id !== milestoneId) return m;
            return {
              ...m,
              tasks: m.tasks.map(t => {
                if (t.id !== taskId) return t;
                const isCompleting = updates.status === 'done' && t.status !== 'done';
                return {
                  ...t,
                  ...updates,
                  completedAt: isCompleting ? new Date().toISOString() : t.completedAt,
                };
              }),
            };
          }),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const deleteTask = useCallback((goalId: string, milestoneId: string, taskId: string) => {
    setState(s => ({
      ...s,
      goals: s.goals.map(g => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: g.milestones.map(m => {
            if (m.id !== milestoneId) return m;
            return { ...m, tasks: m.tasks.filter(t => t.id !== taskId) };
          }),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const addCheckIn = useCallback((goalId: string, data: { note: string; mood: 1 | 2 | 3 | 4 | 5; progress: number }) => {
    const checkIn: CheckIn = {
      id: uuidv4(),
      goalId,
      date: new Date().toISOString(),
      ...data,
    };
    setState(s => ({
      ...s,
      goals: s.goals.map(g => {
        if (g.id !== goalId) return g;
        return { ...g, checkIns: [...g.checkIns, checkIn], updatedAt: new Date().toISOString() };
      }),
    }));
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setState(s => ({ ...s, settings: { ...s.settings, ...updates } }));
  }, []);

  const addChatMessage = useCallback((goalId: string, message: AIMessage) => {
    setState(s => ({
      ...s,
      chatHistory: {
        ...s.chatHistory,
        [goalId]: [...(s.chatHistory[goalId] || []), message],
      },
    }));
  }, []);

  const clearChatHistory = useCallback((goalId: string) => {
    setState(s => ({
      ...s,
      chatHistory: { ...s.chatHistory, [goalId]: [] },
    }));
  }, []);

  const completeMilestone = useCallback((goalId: string, milestoneId: string) => {
    setState(s => ({
      ...s,
      goals: s.goals.map(g => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: g.milestones.map(m =>
            m.id === milestoneId ? { ...m, completedAt: m.completedAt ? undefined : new Date().toISOString() } : m
          ),
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  return {
    goals: globalState.goals,
    settings: globalState.settings,
    chatHistory: globalState.chatHistory,
    createGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addTask,
    updateTask,
    deleteTask,
    addCheckIn,
    updateSettings,
    addChatMessage,
    clearChatHistory,
    completeMilestone,
  };
}
