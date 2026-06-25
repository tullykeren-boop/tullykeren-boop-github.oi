import { useState } from 'react'

const PLAN_LENGTHS = [2, 3, 4]

export default function GoalInput({
  defaultGoal = '',
  defaultWeeks = 3,
  onSubmit,
  clarification,
  error,
  onClearError,
  onNeedKey,
}) {
  const [goal, setGoal] = useState(defaultGoal)
  const [weeks, setWeeks] = useState(defaultWeeks)
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isEmpty = goal.trim().length === 0
  const showEmptyError = touched && isEmpty

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (isEmpty) return
    onClearError?.()
    setSubmitting(true)
    await onSubmit(goal.trim(), weeks)
    setSubmitting(false)
  }

  const handleRetry = () => {
    onClearError?.()
    if (!isEmpty) onSubmit(goal.trim(), weeks)
  }

  return (
    <main className="goal-screen">
      <header className="hero">
        <h1 className="hero-heading">
          Turn your goal into<br />
          <span className="accent">a weekly plan</span>
        </h1>
        <p className="hero-sub">
          Describe what you want to achieve. Get a focused, week-by-week execution plan.
        </p>
      </header>

      <form className="goal-form" onSubmit={handleSubmit} noValidate>
        <div className="textarea-wrap">
          <textarea
            className={`goal-textarea${showEmptyError ? ' input-error' : ''}`}
            value={goal}
            onChange={(e) => {
              setGoal(e.target.value)
              if (touched) setTouched(false)
            }}
            placeholder="e.g. I want to learn enough Python to build a web scraper from scratch"
            maxLength={500}
            rows={4}
            disabled={submitting}
            aria-label="Describe your goal"
            aria-describedby={
              clarification
                ? 'clarification-msg'
                : showEmptyError
                ? 'empty-error'
                : undefined
            }
          />
          <div className="char-count" aria-live="polite">
            {goal.length}/500
          </div>
        </div>

        {showEmptyError && (
          <p id="empty-error" className="field-error" role="alert">
            Please describe your goal before continuing.
          </p>
        )}

        <fieldset className="week-toggle" disabled={submitting}>
          <legend className="week-toggle-label">Plan length</legend>
          <div className="week-toggle-buttons" role="group" aria-label="Plan length">
            {PLAN_LENGTHS.map((n) => (
              <button
                key={n}
                type="button"
                className={`week-btn${weeks === n ? ' active' : ''}`}
                onClick={() => setWeeks(n)}
                aria-pressed={weeks === n}
              >
                {n} weeks
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Generating\u2026' : 'Generate my plan \u2192'}
        </button>
      </form>

      {clarification && (
        <div id="clarification-msg" className="clarification-msg" role="status">
          <span className="clarification-icon" aria-hidden="true">💡</span>
          {clarification}
        </div>
      )}

      {error && (
        <div className="error-banner" role="alert">
          <span className="error-text">{error}</span>
          <button type="button" className="retry-btn" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      <button
        type="button"
        className="api-key-link"
        onClick={onNeedKey}
        aria-label="Configure Anthropic API key"
      >
        Configure API key
      </button>
    </main>
  )
}
