export type GoalCategory =
  | 'health'
  | 'career'
  | 'learning'
  | 'finance'
  | 'relationships'
  | 'creativity'
  | 'mindfulness'
  | 'other';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  milestoneId: string;
  goalId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  estimatedMinutes?: number;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  targetDate?: string;
  completedAt?: string;
  order: number;
  tasks: Task[];
}

export interface CheckIn {
  id: string;
  goalId: string;
  date: string;
  note: string;
  mood: 1 | 2 | 3 | 4 | 5;
  progress: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  priority: Priority;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
  checkIns: CheckIn[];
  aiPlan?: string;
  motivation?: string;
  tags: string[];
  coverEmoji: string;
}

export interface AppSettings {
  openaiApiKey?: string;
  theme: 'dark';
  notifications: boolean;
  weekStartsMonday: boolean;
}

export interface AppState {
  goals: Goal[];
  settings: AppSettings;
  chatHistory: Record<string, AIMessage[]>;
}
