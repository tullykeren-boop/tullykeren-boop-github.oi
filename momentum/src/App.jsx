import { useState, useEffect, useCallback } from 'react'
import GoalInput from './components/GoalInput'
import PlanView from './components/PlanView'
import ProgressBar from './components/ProgressBar'
import ApiKeyModal from './components/ApiKeyModal'
import { generatePlan } from './api/generate'
import { regeneratePlan } from './api/regenerate'
import { loadState, saveState, clearState } from './utils/storage'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

function getApiKey() {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env.VITE_ANTHROPIC_API_KEY) ||
    localStorage.getItem('momentum_api_key') ||
    ''
  )
}

export default function App() {
  const [view, setView] = useState('input') // 'input' | 'loading' | 'plan'
  const [goalText, setGoalText] = useState('')
  const [weeksCount, setWeeksCount] = useState(3)
  const [plan, setPlan] = useState(null)
  const [checked, setChecked] = useState({})
  const [rating, setRating] = useState(null)
  const [clarification, setClarification] = useState(null)
  const [error, setError] = useState(null)
  const [loadingDone, setLoadingDone] = useState(false)
  const [apiKey, setApiKey] = useState(getApiKey)
  const [showKeyModal, setShowKeyModal] = useState(false)

  // Restore saved plan on mount
  useEffect(() => {
    const saved = loadState()
    if (saved?.plan) {
      setGoalText(saved.goal ?? '')
      setWeeksCount(saved.weeks ?? 3)
      setPlan(saved.plan)
      setChecked(saved.checked ?? {})
      setRating(saved.rating ?? null)
      setView('plan')
    }
  }, [])

  // Persist plan + checked + rating whenever they change
  useEffect(() => {
    if (plan) {
      saveState({ goal: goalText, weeks: weeksCount, plan, checked, rating })
    }
  }, [plan, checked, rating, goalText, weeksCount])

  const handleSubmit = useCallback(
    async (text, weeks) => {
      const key = apiKey || getApiKey()
      if (!key) {
        setShowKeyModal(true)
        return
      }

      setGoalText(text)
      setWeeksCount(weeks)
      setClarification(null)
      setError(null)
      setLoadingDone(false)
      setView('loading')

      try {
        const result = await generatePlan(text, weeks, key)

        if (result.needs_clarification) {
          setClarification(result.prompt)
          setView('input')
          return
        }

        setLoadingDone(true)
        await delay(380)
        setPlan(result)
        setChecked({})
        setRating(null)
        setView('plan')
      } catch (err) {
        setError(err.message)
        setView('input')
      }
    },
    [apiKey]
  )

  const handleRegenerate = useCallback(
    async (feedback) => {
      const key = apiKey || getApiKey()
      if (!key) {
        setShowKeyModal(true)
        return
      }

      setError(null)
      setLoadingDone(false)
      setView('loading')

      try {
        const result = await regeneratePlan(goalText, plan, rating, feedback, key)

        setLoadingDone(true)
        await delay(380)
        setPlan(result)
        setChecked({})
        setRating(null)
        setView('plan')
      } catch (err) {
        setError(err.message)
        setView('plan')
      }
    },
    [apiKey, goalText, plan, rating]
  )

  const handleCheckToggle = useCallback((key) => {
    setChecked((prev) => {
      const next = { ...prev }
      if (next[key]) {
        delete next[key]
      } else {
        next[key] = true
      }
      return next
    })
  }, [])

  const handleRate = useCallback((value) => {
    setRating(value)
  }, [])

  const handleNewGoal = useCallback(() => {
    clearState()
    setPlan(null)
    setGoalText('')
    setWeeksCount(3)
    setChecked({})
    setRating(null)
    setClarification(null)
    setError(null)
    setView('input')
  }, [])

  const handleSaveKey = useCallback((key) => {
    localStorage.setItem('momentum_api_key', key)
    setApiKey(key)
    setShowKeyModal(false)
  }, [])

  return (
    <div className="app">
      {showKeyModal && (
        <ApiKeyModal onSave={handleSaveKey} onClose={() => setShowKeyModal(false)} />
      )}

      {view === 'input' && (
        <GoalInput
          defaultGoal={goalText}
          defaultWeeks={weeksCount}
          onSubmit={handleSubmit}
          clarification={clarification}
          error={error}
          onClearError={() => setError(null)}
          onNeedKey={() => setShowKeyModal(true)}
        />
      )}

      {view === 'loading' && <ProgressBar isComplete={loadingDone} />}

      {view === 'plan' && plan && (
        <PlanView
          plan={plan}
          checked={checked}
          rating={rating}
          onCheckToggle={handleCheckToggle}
          onRate={handleRate}
          onRegenerate={handleRegenerate}
          onNewGoal={handleNewGoal}
          error={error}
          onClearError={() => setError(null)}
        />
      )}
    </div>
  )
}
