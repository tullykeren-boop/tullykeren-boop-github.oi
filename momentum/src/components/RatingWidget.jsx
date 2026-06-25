import { useState } from 'react'

export default function RatingWidget({ rating, onRate, onRegenerate }) {
  const [feedback, setFeedback] = useState('')
  const [regenerating, setRegenerating] = useState(false)

  const handleRegenerate = async () => {
    if (!feedback.trim()) return
    setRegenerating(true)
    await onRegenerate(feedback.trim())
    setFeedback('')
    setRegenerating(false)
  }

  return (
    <section className="rating-section" aria-label="Rate this plan">
      <p className="rating-label">How's this plan?</p>

      <div className="rating-buttons" role="group" aria-label="Rating options">
        <button
          type="button"
          className={`rating-btn positive${rating === 'positive' ? ' active' : ''}`}
          onClick={() => onRate('positive')}
          aria-pressed={rating === 'positive'}
        >
          <span aria-hidden="true">👍</span> Looks good
        </button>
        <button
          type="button"
          className={`rating-btn negative${rating === 'negative' ? ' active' : ''}`}
          onClick={() => onRate('negative')}
          aria-pressed={rating === 'negative'}
        >
          <span aria-hidden="true">👎</span> Needs changes
        </button>
      </div>

      {rating === 'negative' && (
        <div className="feedback-section">
          <label htmlFor="feedback-input" className="feedback-label">
            What would you like to change?
          </label>
          <textarea
            id="feedback-input"
            className="feedback-textarea"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g. Make week 1 easier, add more specific resources, focus on practice over theory…"
            rows={3}
          />
          <button
            type="button"
            className="regenerate-btn"
            onClick={handleRegenerate}
            disabled={!feedback.trim() || regenerating}
          >
            {regenerating ? 'Regenerating…' : 'Regenerate plan'}
          </button>
        </div>
      )}
    </section>
  )
}
