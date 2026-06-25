# GoalCoach

A productized AI coaching system that converts vague user goals into simple, realistic weekly execution plans.

## How it works

1. User enters a goal in plain language
2. The system sends it to GPT-4o mini with a strict coaching system prompt
3. The model returns a structured JSON plan (2–4 weeks, 3–5 tasks per week)
4. The UI displays the plan as a card-based timeline and lets users download the raw JSON

## Project structure

```
coaching/
├── api/    # Express 5 + TypeScript — POST /api/coaching/generate
└── app/    # React 19 + TypeScript + Vite + Tailwind CSS v4
```

## Getting started

### 1. Add your OpenAI API key

Set the `OPENAI_API_KEY` environment variable. In Cursor Cloud Agents, add it as a **Secret** in the dashboard.

```bash
export OPENAI_API_KEY=sk-...
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Run in development

```bash
# Terminal 1 — API (http://localhost:4001)
npm run dev:api

# Terminal 2 — UI  (http://localhost:5174)
npm run dev:app
```

## API

### `POST /api/coaching/generate`

**Request**
```json
{ "goal": "Learn to code in Python from zero" }
```

**Response**
```json
{
  "plan": {
    "goal": "Learn to code in Python from zero",
    "weeks": [
      {
        "week": 1,
        "focus": "Set up environment and build first script",
        "tasks": [
          "Install Python and VS Code on your machine",
          "Complete Python.org official tutorial sections 1–3",
          "Write a script that prints your name 10 times",
          "Run the script from the terminal"
        ]
      }
    ]
  }
}
```

**Errors**
| Status | Meaning |
|--------|---------|
| 400    | `goal` missing or empty |
| 503    | `OPENAI_API_KEY` not configured |
| 500    | Model or parsing error |

### `GET /health`
Returns `{ "status": "ok", "openai": true|false }`.

## Coaching rules applied

| Rule | Behaviour |
|------|-----------|
| Week 1 is easiest | Lowest-friction entry point |
| Gradual progression | Each week builds on the last |
| 3–5 tasks per week | Never overwhelming |
| Concrete tasks only | Max 12 words, no vague advice |
| No motivation | Focus on behaviour, not theory |
| 2–4 weeks total | Achievable, not open-ended |
