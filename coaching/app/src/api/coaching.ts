import type { CoachingPlan } from './types';

export async function generatePlan(goal: string): Promise<CoachingPlan> {
  const res = await fetch('/api/coaching/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal }),
  });

  const data = await res.json() as { plan?: CoachingPlan; error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }

  return data.plan!;
}
