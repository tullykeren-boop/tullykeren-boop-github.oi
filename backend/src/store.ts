import { v4 as uuidv4 } from 'uuid';
import { Task, CreateTaskDTO, UpdateTaskDTO } from './types';

const tasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Design system architecture',
    description: 'Plan the overall system design and define component boundaries.',
    priority: 'high',
    status: 'done',
    tags: ['architecture', 'planning'],
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Implement REST API',
    description: 'Build the backend REST API with Express and TypeScript.',
    priority: 'high',
    status: 'in_progress',
    tags: ['backend', 'api'],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Build React frontend',
    description: 'Create a responsive and accessible UI with React and TypeScript.',
    priority: 'high',
    status: 'in_progress',
    tags: ['frontend', 'react'],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Write unit tests',
    description: 'Cover all service functions and API endpoints with tests.',
    priority: 'medium',
    status: 'todo',
    tags: ['testing', 'quality'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    priority: 'medium',
    status: 'todo',
    tags: ['devops', 'automation'],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Write documentation',
    description: 'Document the API endpoints and setup instructions for contributors.',
    priority: 'low',
    status: 'todo',
    tags: ['docs'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getAllTasks(): Task[] {
  return [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function createTask(dto: CreateTaskDTO): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: uuidv4(),
    title: dto.title,
    description: dto.description ?? '',
    priority: dto.priority ?? 'medium',
    status: dto.status ?? 'todo',
    tags: dto.tags ?? [],
    createdAt: now,
    updatedAt: now,
    dueDate: dto.dueDate,
  };
  tasks.push(task);
  return task;
}

export function updateTask(id: string, dto: UpdateTaskDTO): Task | undefined {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  const updated: Task = {
    ...tasks[idx],
    ...dto,
    updatedAt: new Date().toISOString(),
  };
  tasks[idx] = updated;
  return updated;
}

export function deleteTask(id: string): boolean {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}
