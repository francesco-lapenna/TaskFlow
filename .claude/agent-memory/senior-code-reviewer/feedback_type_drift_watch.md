---
name: Frontend type drift watch
description: Backend model changes require manual updates to frontend/src/types/index.ts and lib/api.ts payload types — there is no codegen
type: feedback
---

When a LoopBack model in `backend/src/models/` adds/changes/removes a property, also update:
- `frontend/src/types/index.ts` (the shared `Project`/`Task` shapes used by the UI)
- `frontend/src/lib/api.ts` (`CreateProjectPayload` / `CreateTaskPayload` and any new helpers)

**Why:** Per `CLAUDE.md`, "shared shapes are duplicated between `frontend/src/types/index.ts` and the backend models. When changing a model, update both — there's no codegen." Drift here will not be caught at compile time on the frontend because the JSON is untyped at the network boundary.

**How to apply:** During reviews of any backend model diff, grep the frontend types/api file for the affected fields and flag a MEDIUM if the frontend wasn't updated in the same change. Also remember that the `dueDate` round-trip is special: the API returns ISO 8601 datetime strings, but the frontend currently types `dueDate?: string` and renders it verbatim, which displays a raw ISO timestamp rather than a formatted date — flag this when relevant.
