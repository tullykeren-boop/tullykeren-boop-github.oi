import { Router, Request, Response } from 'express';
import { generatePlan } from './openai';
import type { GenerateRequest } from './types';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
  const { goal } = req.body as GenerateRequest;

  if (!goal || typeof goal !== 'string' || goal.trim().length === 0) {
    res.status(400).json({ error: 'goal is required' });
    return;
  }

  if (goal.trim().length > 500) {
    res.status(400).json({ error: 'goal must be 500 characters or fewer' });
    return;
  }

  if (!process.env['OPENAI_API_KEY']) {
    res.status(503).json({
      error: 'OPENAI_API_KEY is not configured. Add it as a secret in the Cursor dashboard.',
    });
    return;
  }

  try {
    const plan = await generatePlan(goal.trim());
    res.json({ plan });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[coaching] generate error:', message);
    res.status(500).json({ error: message });
  }
});

export default router;
