import type { Task, CreateTaskDTO, UpdateTaskDTO } from './types';

const BASE = 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  getTasks: () => request<Task[]>('/tasks'),
  getTask: (id: string) => request<Task>(`/tasks/${id}`),
  createTask: (dto: CreateTaskDTO) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(dto) }),
  updateTask: (id: string, dto: UpdateTaskDTO) =>
    request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  deleteTask: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
};
