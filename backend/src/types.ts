export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  tags?: string[];
  dueDate?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  tags?: string[];
  dueDate?: string;
}
