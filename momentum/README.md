# Momentum — AI-Powered Goal Execution Planner

Momentum is a React single-page app that helps you set ambitious goals and build concrete, AI-powered execution plans to achieve them.

## Features

- **AI Goal Planning** — Paste your goal and let AI generate a full milestone-and-task execution plan
- **Milestone & Task Management** — Break goals into milestones with granular tasks; tick them off as you go
- **Progress Tracking** — Visual progress bars, completion stats, and check-in logs with mood tracking
- **AI Coach Chat** — Chat with your AI coach for motivation, guidance, and accountability on any goal
- **Goal Categories** — Health, Career, Learning, Finance, Relationships, Creativity, Mindfulness, and more
- **Dashboard** — Overview of all active goals, upcoming tasks, and recent activity
- **Data Persistence** — All data lives in localStorage; export/import as JSON for backups

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool |
| Tailwind CSS v4 | 4 | Utility-first styling |
| Framer Motion | 12 | Animations |
| React Router | 7 | Client-side routing |
| Lucide React | latest | Icons |
| OpenAI API | gpt-4o-mini | AI plan generation & chat |

## Getting Started

```bash
cd momentum
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## OpenAI Integration

Momentum works out of the box with built-in fallback templates for goal planning and coaching. To enable fully personalized AI responses:

1. Go to **Settings** in the sidebar
2. Paste your [OpenAI API key](https://platform.openai.com/api-keys)
3. Your key is stored only in your browser's localStorage

With an API key, goal plan generation uses `gpt-4o-mini` to create personalized milestones and tasks, and the AI Coach chat becomes context-aware.

## Project Structure

```
src/
├── components/
│   ├── goals/         # AIChat component
│   ├── layout/        # Sidebar, Layout wrapper
│   └── ui/            # Reusable: Button, Card, Modal, Input, Badge, Toast, ...
├── pages/
│   ├── Dashboard.tsx  # Overview with stats and goal cards
│   ├── GoalsList.tsx  # Filterable list of all goals
│   ├── GoalDetail.tsx # Milestone/task management, check-ins, AI chat
│   ├── CreateGoal.tsx # 3-step wizard with AI plan generation
│   └── Settings.tsx   # API key, notifications, data export
├── store/
│   └── useStore.ts    # Global state with localStorage persistence
├── types/
│   └── index.ts       # TypeScript types for goals, tasks, milestones
└── utils/
    ├── aiService.ts   # OpenAI API integration + fallback templates
    └── goalUtils.ts   # Progress calculation, formatting helpers
```

## Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Lint with oxlint
```
