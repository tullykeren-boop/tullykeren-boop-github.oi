import WeekCard from './WeekCard'
import RatingWidget from './RatingWidget'

export default function PlanView({
  plan,
  checked,
  rating,
  onCheckToggle,
  onRate,
  onRegenerate,
  onNewGoal,
  error,
  onClearError,
}) {
  const totalTasks = plan.weeks.reduce((sum, w) => sum + w.tasks.length, 0)
  const doneTasks = Object.keys(checked).filter((k) => checked[k]).length
  const pct = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0

  return (
    <main className="plan-screen">
      <h1 className="plan-heading">{plan.goal_summary}</h1>

      <div className="completion-bar" aria-label={`${doneTasks} of ${totalTasks} tasks done`}>
        <span className="completion-text">
          {doneTasks} of {totalTasks} tasks done
        </span>
        <div
          className="completion-track"
          role="progressbar"
          aria-valuenow={doneTasks}
          aria-valuemin={0}
          aria-valuemax={totalTasks}
        >
          <div className="completion-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="weeks-grid">
        {plan.weeks.map((week, weekIdx) => (
          <WeekCard
            key={weekIdx}
            week={week}
            weekIdx={weekIdx}
            checked={checked}
            onCheckToggle={onCheckToggle}
          />
        ))}
      </div>

      <RatingWidget rating={rating} onRate={onRate} onRegenerate={onRegenerate} />

      {error && (
        <div className="error-banner" role="alert">
          <span className="error-text">{error}</span>
          <button type="button" className="retry-btn" onClick={onClearError}>
            Dismiss
          </button>
        </div>
      )}

      <button type="button" className="new-goal-btn" onClick={onNewGoal}>
        Start a new goal
      </button>
    </main>
  )
}
