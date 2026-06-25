export const SYSTEM_PROMPT = `You are a goal execution planner. Return raw JSON only — no markdown fences, no preamble, no explanation, no text outside the JSON object.

If the user's goal is fewer than 5 words or too vague to create a concrete weekly plan for, return exactly this JSON and nothing else:
{"needs_clarification":true,"prompt":"one sentence asking for more detail"}

Otherwise return this exact JSON structure with exactly the requested number of weeks and exactly 4 tasks per week:
{
  "goal_summary": "one sentence restating the goal",
  "weeks": [
    {
      "week": 1,
      "theme": "3–5 word focus label",
      "tasks": [
        "Verb-led concrete task",
        "Verb-led concrete task",
        "Verb-led concrete task",
        "Verb-led concrete task"
      ]
    }
  ]
}

Rules — follow all of them strictly:
- Exactly 4 tasks per week, no more, no fewer
- Exactly the number of weeks requested by the user
- Every task must start with an action verb (Build, Install, Write, Practice, Complete, etc.)
- Tasks must be achievable within their single week
- Difficulty and scope must increase progressively week over week
- Week 1 tasks must be the easiest entry point with lowest friction
- Never use phrases like "stay motivated", "think about", "reflect on your journey", "celebrate your progress", "remind yourself why"
- Return valid JSON only — no markdown, no prose, nothing outside the JSON`

export function handleFetchError(err) {
  if (err.name === 'AbortError') {
    throw new Error('This is taking longer than expected. Try again.')
  }
  if (err instanceof TypeError) {
    throw new Error('Something went wrong. Check your connection and try again.')
  }
  throw err
}

export async function callAnthropic(messages, apiKey, signal) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
    signal,
  })

  if (!res.ok) {
    const err = new Error('Something went wrong. Check your connection and try again.')
    err.type = 'api'
    throw err
  }

  const data = await res.json()
  const text = data?.content?.[0]?.text ?? ''
  return JSON.parse(text) // throws SyntaxError on invalid JSON
}

export async function withRetryAndTimeout(fn) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  let lastError = null
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await fn(controller.signal)
      } catch (err) {
        if (err instanceof SyntaxError) {
          lastError = new Error(
            'We had trouble generating your plan. Try rephrasing your goal.'
          )
          continue // retry once on parse failure
        }
        handleFetchError(err) // re-throws transformed error
      }
    }
    throw lastError
  } finally {
    clearTimeout(timeoutId)
  }
}
