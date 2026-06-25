import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './prompt';
import type { CoachingPlan } from './types';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

export async function generatePlan(goal: string): Promise<CoachingPlan> {
  const openai = getClient();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: goal },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }

  const parsed = JSON.parse(content) as CoachingPlan;

  if (!parsed.goal || !Array.isArray(parsed.weeks) || parsed.weeks.length === 0) {
    throw new Error('Invalid plan structure returned by model');
  }

  return parsed;
}
