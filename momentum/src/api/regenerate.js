import { callAnthropic, withRetryAndTimeout } from './_shared.js'

export async function regeneratePlan(goal, existingPlan, rating, feedback, apiKey) {
  const ratingLabel = rating === 'positive' ? 'positive (but wants changes)' : 'negative'

  const userContent = [
    `Original goal: ${goal}`,
    `User rating of existing plan: ${ratingLabel}`,
    `User feedback: ${feedback}`,
    ``,
    `Existing plan:`,
    JSON.stringify(existingPlan, null, 2),
    ``,
    `Revise this plan to address the feedback. Return the same JSON structure with the same number of weeks (${existingPlan.weeks.length}). Apply the feedback concretely.`,
  ].join('\n')

  return withRetryAndTimeout((signal) =>
    callAnthropic([{ role: 'user', content: userContent }], apiKey, signal)
  )
}
