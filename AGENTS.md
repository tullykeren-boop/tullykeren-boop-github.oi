# AGENTS.md

## Cursor Cloud specific instructions

This repo contains **two independent full-stack apps**. Each has a separate API + web client; they do not share code or `node_modules`.

### TaskFlow (`backend/` + `frontend/`)
- Task manager with an in-memory store (no database, no secrets required).
- Backend (Express, port `4000`): `npm run dev:backend` from repo root.
- Frontend (Vite + React, port `5173`): `npm run dev:frontend` from repo root.
- The frontend hits the backend directly at `http://localhost:4000` (see `frontend/src/api/tasks.ts`) and Vite also proxies `/api`; backend CORS only allows origin `http://localhost:5173`, so run the frontend on that port.
- The in-memory store re-seeds sample tasks on every backend restart; data does not persist.

### GoalCoach (`coaching/api/` + `coaching/app/`)
- AI coaching planner. Run commands from the `coaching/` directory.
- API (Express, port `4001`): `npm run dev:api`. Web (Vite + React, port `5174`): `npm run dev:app`.
- **Requires `OPENAI_API_KEY`** (add as a Secret). Without it the API boots fine and `/health` returns `{"openai":false}`, but `POST /api/coaching/generate` returns `503`. Plan generation cannot be tested without the key.

### Lint / build / test
- Lint (frontends only, oxlint): `npm --prefix frontend run lint`, `npm --prefix coaching/app run lint`.
- Build: `npm --prefix backend run build` / `npm --prefix coaching/api run build` (tsc) and `npm --prefix frontend run build` / `npm --prefix coaching/app run build` (tsc + vite).
- There is no automated test suite in this repo.
- Backends use `nodemon` + `ts-node` for hot reload; editing `src/*.ts` auto-restarts the server.
