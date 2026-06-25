import { callAnthropic, withRetryAndTimeout } from './_shared.js'

export async function generatePlan(goal, weeks, apiKey) {
  const userContent = `My goal: ${goal}\nNumber of weeks: ${weeks}\n\nGenerate a ${weeks}-week execution plan.`

  return withRetryAndTimeout((signal) =>
    callAnthropic([{ role: 'user', content: userContent }], apiKey, signal)
  )
}
