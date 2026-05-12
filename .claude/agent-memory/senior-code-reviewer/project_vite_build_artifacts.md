---
name: Tracked vite.config build artifacts
description: vite.config.js and vite.config.d.ts appear as untracked outputs of `tsc` against vite.config.ts and should never be committed
type: project
---

`frontend/vite.config.js` and `frontend/vite.config.d.ts` show up as untracked files because they are emitted by `tsc` when compiling `vite.config.ts` (it's listed in `tsconfig.node.json`'s `include`). The source of truth is `vite.config.ts`.

**Why:** Committing the emitted JS/d.ts creates a parallel config that can silently drift from the TS source; Vite picks one or the other depending on resolution order. The current `frontend/.gitignore` already covers `*.tsbuildinfo` but not these two emitted artifacts.

**How to apply:** When reviewing/working on frontend tooling, suggest adding `vite.config.js` and `vite.config.d.ts` to `frontend/.gitignore` (or, better, set `noEmit: true` for that tsconfig) and removing the artifacts. Don't suggest editing the `.js`/`.d.ts` files directly — edits must go in `vite.config.ts`.
