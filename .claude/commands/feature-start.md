---
description: "Start a new feature branch off development. Usage: /feature-start feature/short-description"
argument-hint: "feature/short-name  |  fix/bug-name  |  chore/task-name"
allowed-tools: ["Bash"]
---

# Start a Feature Branch

## Your task

Create a new feature branch following this project's git conventions. Read every instruction below before running any command.

## Branch name

The user supplied: `$ARGUMENTS`

If `$ARGUMENTS` is empty, ask the user to provide a branch name before continuing.

Apply these naming rules to whatever the user supplied:
- Allowed prefixes: `feature/`, `fix/`, `chore/`. If the user omitted the prefix, infer the most appropriate one and confirm with them before proceeding.
- The slug after the prefix must be lowercase, hyphen-separated words. Convert spaces or underscores to hyphens. Strip special characters.
- Maximum 40 characters total (including prefix). Truncate the slug if needed and confirm the result with the user.

Valid examples: `feature/task-detail-page`, `fix/422-on-post-tasks`, `chore/update-dependencies`

## Pre-flight checks

Run the following checks in order. Stop and report to the user if any check fails — do not proceed to branch creation until all pass.

**Check 1 — Working tree must be clean**
Run: `git status --porcelain`
If output is non-empty, the working tree is dirty. Tell the user exactly which files are modified or untracked, then ask whether they want to:
  a) Stash the changes (`git stash push -m "WIP before <branch-name>"`) and continue
  b) Commit the changes first (stop so they can do that)
  c) Abort

If they choose (a), stash and continue. Remind them to `git stash pop` when ready.

**Check 2 — Must be on `development`**
Run: `git branch --show-current`
If not on `development`, stop. Tell the user the current branch and explain that all feature branches must be created off `development`. Ask whether they want to switch to `development` first. If yes, run `git checkout development` then continue; if no, abort.

**Check 3 — Pull latest `development`**
Run: `git pull origin development`
Report the result. If the pull fails, stop and report the full error. Do not create the branch until this succeeds.

**Check 4 — Branch name must not already exist**
Run: `git branch --list <branch-name>` and `git ls-remote --heads origin <branch-name>`
If either returns output, the branch already exists locally or on the remote. Tell the user and ask whether they want to:
  a) Check out the existing branch (`git checkout <branch-name>`)
  b) Choose a different name
  c) Abort

## Branch creation

Once all checks pass, run:
```
git checkout -b <branch-name>
```

Confirm success by telling the user:
- The new branch name
- The base commit hash (`git rev-parse --short HEAD`)
- A reminder: "Push your first commit with `git push -u origin <branch-name>`. Never force-push this branch."

## Hard rules — never violate these

- Never use `git push --force` or `git push -f`
- Never use `--no-verify` on any git command
- Never branch off `main`
