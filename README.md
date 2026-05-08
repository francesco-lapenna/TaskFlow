# TaskFlow

A modern project management web app — scaffold stage.

This repo is a monorepo containing a React frontend, a LoopBack 4 backend, and
infrastructure files for local Docker development. The goal at this stage is a
clean, opinionated foundation: routing, layout, models, REST endpoints, and a
working `docker compose up` — no business logic, no auth, no CI yet.

## Stack

| Layer    | Tech                                          |
| -------- | --------------------------------------------- |
| Frontend | React 18, Vite, TypeScript, TailwindCSS       |
| Backend  | Node.js, LoopBack 4, TypeScript               |
| Database | MySQL 8 (datasource wired, in-memory by default) |
| Infra    | Docker, docker-compose                        |

## Repository layout

```
TaskFlow/
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── components/   # layout + reusable UI primitives
│   │   ├── pages/        # route-level components
│   │   ├── routes/       # router configuration
│   │   ├── lib/          # api client, helpers
│   │   ├── types/        # shared TS types
│   │   └── data/         # mock data
│   └── ...
├── backend/              # LoopBack 4 application
│   └── src/
│       ├── controllers/  # REST endpoints
│       ├── models/       # Project, Task
│       ├── repositories/ # data access
│       └── datasources/  # in-memory + MySQL placeholder
├── infra/
│   └── mysql/
│       └── init.sql      # seeds on first container start
├── docker-compose.yml
├── .env.example
└── README.md
```

## Quick start (Docker — recommended)

```bash
cp .env.example .env
docker compose up --build
```

Then open:

- Frontend → http://localhost:5173
- Backend  → http://localhost:3000/ping
- API docs → http://localhost:3000/explorer
- MySQL   → localhost:3306 (user: `taskflow`, pass: `taskflow`, db: `taskflow`)

## Quick start (local, without Docker)

Run each package in its own terminal.

```bash
# backend
cd backend
npm install
npm run dev

# frontend
cd frontend
npm install
npm run dev
```

The backend defaults to the in-memory connector, so MySQL is **not** required
to develop against the API. To switch the backend to MySQL, set
`DB_CONNECTOR=mysql` in `backend/.env` and ensure MySQL is running.

## Useful commands

### Frontend (`/frontend`)

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start Vite dev server on `:5173`      |
| `npm run build`     | Type-check + production build         |
| `npm run preview`   | Serve the production build locally    |
| `npm run lint`      | ESLint over `src/`                    |
| `npm run format`    | Prettier write                        |

### Backend (`/backend`)

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Build + start with reload on `:3000`  |
| `npm run build`     | Compile TS to `dist/`                 |
| `npm run start`     | Run compiled output                   |
| `npm run lint`      | ESLint over `src/`                    |
| `npm run format`    | Prettier write                        |

## Environment variables

See `.env.example`. Each package also has its own `.env.example` for
package-scoped variables.

## What's intentionally NOT here yet

- Authentication / authorization
- GitLab CI / CD
- AWS / cloud provisioning
- Real business logic (validation rules, workflows, notifications)

These will be layered on top of the scaffold once the foundation is settled.
