# Workspace

Two independent applications live in this repository.

---

## TaskFlow — Task Manager (`frontend/` + `backend/`)

A full-stack task management application built with **React + TypeScript + Vite** on the frontend and **Express + TypeScript** on the backend.

### Features

- Create, read, update, and delete tasks via a REST API
- Set priority (low / medium / high), status (to-do / in-progress / done), due dates, and tags
- One-click status progression directly from each task card
- Live search and filter by priority or status
- Progress bar and overdue alerts on the stats dashboard
- Responsive, accessible UI with Tailwind CSS v4

### Getting Started

```bash
npm run install:all

# Terminal 1 – API server (http://localhost:4000)
npm run dev:backend

# Terminal 2 – Vite dev server (http://localhost:5173)
npm run dev:frontend
```

### API Reference

| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | `/api/tasks`      | List all tasks    |
| GET    | `/api/tasks/:id`  | Get a single task |
| POST   | `/api/tasks`      | Create a task     |
| PATCH  | `/api/tasks/:id`  | Update a task     |
| DELETE | `/api/tasks/:id`  | Delete a task     |
| GET    | `/health`         | Health check      |

### Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 19, TypeScript, Vite 6  |
| Styling   | Tailwind CSS v4, Lucide Icons |
| Backend   | Express 5, TypeScript         |
| Runtime   | Node.js 22                    |

---

## Momentum — AI Goal Planner (`momentum/`)

A client-side SPA that converts any goal into a structured weekly execution plan via the Anthropic API.

### Getting Started

```bash
cd momentum && npm install && npm run dev   # http://localhost:5173
```

**Requires:** `VITE_ANTHROPIC_API_KEY` environment variable (or enter your key in the app on first load).
