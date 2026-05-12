# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo shape

Monorepo with three top-level pieces — they are **not** an npm workspace, each package has its own `package.json` and `node_modules`. Run npm commands from inside `backend/` or `frontend/`.

- `backend/` — LoopBack 4 + TypeScript REST API (`:3000`)
- `frontend/` — React 18 + Vite + Tailwind SPA (`:5173`)
- `infra/mysql/` — `init.sql` mounted into the MySQL container on first boot
- `docker-compose.yml` — wires all three together; reads root `.env`

Package manager: **npm only** (a `package-lock.json` lives in each package). Never introduce yarn / pnpm / bun.

## Common commands

Both packages: `npm run dev | build | lint | format`. There is **no test suite** — don't claim tests pass; if asked to run tests, say there are none configured.

Backend specifics (run from `backend/`):
- `npm run dev` — `tsc-watch` rebuild + restart on `:3000`
- `npm run migrate` — apply LoopBack schema migration to MySQL (only meaningful when `DB_CONNECTOR=mysql`); add `--existing` to `alter` rather than `drop` tables
- `npm run clean` / `rebuild` — wipe and rebuild `dist/`

Frontend dev server uses `usePolling: true` and `strictPort: true` (port 5173) so it works inside the Docker bind mount.

Whole stack via Docker:
```
cp .env.example .env   # first time only
docker compose up --build
```
Frontend → `localhost:5173`, backend → `localhost:3000`, OpenAPI explorer → `localhost:3000/explorer`.

## Backend architecture (LoopBack 4)

Boot is auto-discovery driven (see [backend/src/application.ts](backend/src/application.ts)): controllers, repositories, datasources, and observers are picked up by filename suffix from `dist/` after compile. **Always rebuild** (`npm run dev` handles this) — adding a `*.controller.ts` won't register until TS emits to `dist/`.

Datasource selection is a single env-var switch in [backend/src/datasources/db.datasource.ts](backend/src/datasources/db.datasource.ts):
- `DB_CONNECTOR=memory` (default) → in-process juggler memory store, data lost on restart
- `DB_CONNECTOR=mysql` → connects via `DB_HOST/PORT/USER/PASSWORD/DATABASE`

Both bind to `datasources.db`, so repositories don't care which is active. The [`SeedObserver`](backend/src/observers/seed.observer.ts) inserts a fixed set of demo projects/tasks on boot **only if `projects.count() === 0`**, so it is safe against hot reloads and against MySQL (it seeds once and then no-ops). When wiping data manually, expect seeds to come back on next boot.

Domain models ([Project](backend/src/models/project.model.ts), [Task](backend/src/models/task.model.ts)):
- IDs are **client-supplied strings** (`generated: false, required: true`). POST bodies must include `id` — there is no autogeneration. The frontend forms enforce this.
- Status / priority enums are validated by `jsonSchema.enum`; sending anything else returns 422 with details surfaced in the response body's `error.details[]`.
- `Project hasMany Task` via `projectId`; access through the dedicated [project-task.controller.ts](backend/src/controllers/project-task.controller.ts) (`/projects/{id}/tasks`) rather than filtering `/tasks` manually.

Request validation errors come back in LoopBack's standard envelope: `{ error: { message, code, details: [{ path, message, code }] } }`. The frontend's `ApiError` ([frontend/src/lib/api.ts](frontend/src/lib/api.ts)) already parses this — preserve that shape on the backend side.

## Frontend architecture

- Path alias: `@/*` → `frontend/src/*` (configured in both [vite.config.ts](frontend/vite.config.ts) and `tsconfig.json`). Use it instead of long relative paths.
- Routing: a single `createBrowserRouter` in [frontend/src/routes/index.tsx](frontend/src/routes/index.tsx) — `Layout` is the shell, pages are nested children. Add new routes there.
- Data fetching: every call goes through `api<T>()` in [frontend/src/lib/api.ts](frontend/src/lib/api.ts). It throws `ApiError` (with `status` and parsed `details`) — components rely on this. The `useApi(fetcher, deps)` hook wraps the loading/error/refetch pattern; reuse it rather than rolling new `useEffect` fetches.
- Dates: HTML `<input type="date">` produces `YYYY-MM-DD`, but LoopBack's `type: 'date'` expects ISO 8601 datetime. Convert with `toIsoDateTime()` from `lib/api.ts` before sending.
- Type contract: shared shapes are duplicated between [frontend/src/types/index.ts](frontend/src/types/index.ts) and the backend models. When changing a model, update both — there's no codegen.
- Backend URL comes from `VITE_API_URL` (defaulted to `http://localhost:3000`). It's baked at build time.

## Environment

Root `.env` (copied from `.env.example`) feeds `docker-compose.yml`. Keys of note: `DB_CONNECTOR`, `MYSQL_*`, `BACKEND_PORT`, `FRONTEND_PORT`, `VITE_API_URL`. For local non-Docker runs, the same vars can sit in shell env or per-package `.env` files.

## Things intentionally absent

No auth, no CI, no cloud infra, no tests. Don't scaffold these proactively unless asked — README calls them out as deferred on purpose.
