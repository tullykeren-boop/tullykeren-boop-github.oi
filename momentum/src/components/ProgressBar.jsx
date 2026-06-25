import { useState, useEffect, useRef } from 'react'

const MESSAGES = [
  'Analyzing your goal\u2026',
  'Breaking it into milestones\u2026',
  'Sequencing your weeks\u2026',
  'Crafting concrete tasks\u2026',
  'Finalizing your plan\u2026',
]

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ProgressBar({ isComplete }) {
  const [progress, setProgress] = useState(0)
  const [msgIdx, setMsgIdx] = useState(0)
  const rafRef = useRef(null)

  // Animate 0 → ~85% over ~5s
  useEffect(() => {
    if (reducedMotion) return

    const startTime = Date.now()
    const DURATION = 5000
    const TARGET = 85

    const frame = () => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(TARGET, TARGET * (elapsed / DURATION))
      setProgress(pct)
      if (elapsed < DURATION) {
        rafRef.current = requestAnimationFrame(frame)
      }
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Jump to 100% on completion
  useEffect(() => {
    if (isComplete) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setProgress(100)
    }
  }, [isComplete])

  // Rotate status messages every ~900ms
  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length)
    }, 900)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="loading-screen" aria-live="polite" aria-label="Generating your plan">
      <div className="loading-icon" aria-hidden="true">
        <div className="loading-spinner" />
      </div>
      <h2 className="loading-title">Building your plan</h2>
      <p className="loading-msg">{MESSAGES[msgIdx]}</p>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Plan generation progress"
      >
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </main>
  )
}
