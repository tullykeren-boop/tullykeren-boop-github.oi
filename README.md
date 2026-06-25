# Workspace

Two independent full-stack applications live in this repository.

---

## GoalCoach — AI Coaching System (`coaching/`)

Converts vague user goals into structured, week-by-week execution plans using GPT-4o mini.
See [`coaching/README.md`](coaching/README.md) for full setup instructions.

**Requires:** `OPENAI_API_KEY` environment variable.

```bash
cd coaching && npm run install:all
npm run dev:api   # http://localhost:4001
npm run dev:app   # http://localhost:5174
```

---

# TaskFlow

A modern full-stack task management application built with **React + TypeScript + Vite** on the frontend and **Express + TypeScript** on the backend.

## Features

- Create, read, update, and delete tasks via a REST API
- Set priority (low / medium / high), status (to-do / in-progress / done), due dates, and tags
- One-click status progression directly from each task card
- Live search and filter by priority or status
- Progress bar and overdue alerts on the stats dashboard
- Responsive, accessible UI with Tailwind CSS v4

## Project Structure

```
taskflow/
├── frontend/   # React + TypeScript + Vite + Tailwind CSS v4
└── backend/    # Express + TypeScript (in-memory store)
```

## Getting Started

### Prerequisites

- Node.js 18+

### Install dependencies

```bash
npm run install:all
```

### Run in development

Open two terminals:

```bash
# Terminal 1 – API server (http://localhost:4000)
npm run dev:backend

# Terminal 2 – Vite dev server (http://localhost:5173)
npm run dev:frontend
```

### Production build

```bash
npm run build:backend   # compiles to backend/dist
npm run build:frontend  # compiles to frontend/dist
```

## API Reference

| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | `/api/tasks`      | List all tasks    |
| GET    | `/api/tasks/:id`  | Get a single task |
| POST   | `/api/tasks`      | Create a task     |
| PATCH  | `/api/tasks/:id`  | Update a task     |
| DELETE | `/api/tasks/:id`  | Delete a task     |
| GET    | `/health`         | Health check      |

### Task schema

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "priority": "low | medium | high",
  "status": "todo | in_progress | done",
  "tags": ["string"],
  "dueDate": "ISO 8601 (optional)",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

## Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | React 19, TypeScript, Vite 6    |
| Styling   | Tailwind CSS v4, Lucide Icons   |
| Backend   | Express 5, TypeScript           |
| Runtime   | Node.js 22                      |
