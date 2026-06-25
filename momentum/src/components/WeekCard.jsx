export default function WeekCard({ week, weekIdx, checked, onCheckToggle }) {
  return (
    <div className="week-card">
      <div className="week-header">
        <span className="week-label">Week {week.week}</span>
        <h3 className="week-theme">{week.theme}</h3>
      </div>
      <ul className="task-list" role="list">
        {week.tasks.map((task, taskIdx) => {
          const key = `${weekIdx}-${taskIdx}`
          const done = Boolean(checked[key])
          return (
            <li key={taskIdx} className={`task-item${done ? ' done' : ''}`}>
              <input
                type="checkbox"
                id={`task-${key}`}
                className="task-checkbox"
                checked={done}
                onChange={() => onCheckToggle(key)}
              />
              <label htmlFor={`task-${key}`} className="task-label">
                {task}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
