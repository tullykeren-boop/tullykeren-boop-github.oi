import { useState, useEffect, useRef } from 'react'

export default function ApiKeyModal({ onSave, onClose }) {
  const [key, setKey] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Trap focus and close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSave = (e) => {
    e.preventDefault()
    const trimmed = key.trim()
    if (trimmed) onSave(trimmed)
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <h2 id="modal-title" className="modal-title">
          Anthropic API Key
        </h2>
        <p className="modal-desc">
          Momentum calls the Anthropic API directly from your browser. Your key is stored only in{' '}
          <code>localStorage</code> and is never sent to any server other than Anthropic.
        </p>
        <p className="modal-desc">
          Get a key at{' '}
          <a
            href="https://console.anthropic.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="modal-link"
          >
            console.anthropic.com/keys
          </a>
          . You can also set <code>VITE_ANTHROPIC_API_KEY</code> as an environment variable to skip
          this step.
        </p>

        <form onSubmit={handleSave}>
          <input
            ref={inputRef}
            type="password"
            className="modal-input"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            aria-label="Anthropic API key"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-save-btn" disabled={!key.trim()}>
              Save &amp; continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
