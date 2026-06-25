import { Router, Request, Response } from 'express';
import * as store from './store';
import { CreateTaskDTO, UpdateTaskDTO } from './types';

const router = Router();

router.get('/tasks', (_req: Request, res: Response) => {
  res.json(store.getAllTasks());
});

router.get('/tasks/:id', (req: Request, res: Response) => {
  const task = store.getTaskById(req.params['id'] as string);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
});

router.post('/tasks', (req: Request, res: Response) => {
  const dto = req.body as CreateTaskDTO;
  if (!dto.title || typeof dto.title !== 'string' || dto.title.trim() === '') {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  const task = store.createTask({ ...dto, title: dto.title.trim() });
  res.status(201).json(task);
});

router.patch('/tasks/:id', (req: Request, res: Response) => {
  const dto = req.body as UpdateTaskDTO;
  const task = store.updateTask(req.params['id'] as string, dto);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json(task);
});

router.delete('/tasks/:id', (req: Request, res: Response) => {
  const ok = store.deleteTask(req.params['id'] as string);
  if (!ok) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.status(204).send();
});

export default router;
