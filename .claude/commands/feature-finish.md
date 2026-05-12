---
description: "Merge the current feature branch back into development and delete it"
allowed-tools: ["Bash"]
---

# Finish a Feature Branch

## Your task

Rebase the current feature branch onto `development`, merge it back with a merge commit, and delete the branch. Read every instruction below before running any command.

## Pre-flight checks

Run the following checks in order. Stop and report to the user if any check fails — do not proceed until all pass.

**Check 1 — Must be on a feature branch, not `development` or `main`**
Run: `git branch --show-current`
Store the result as `FEATURE_BRANCH`.
- If `FEATURE_BRANCH` is `development` or `main`, stop immediately. Tell the user they must run this command from the feature branch they want to finish.
- If `FEATURE_BRANCH` does not start with `feature/`, `fix/`, or `chore/`, warn the user that the branch name does not follow project conventions and ask for explicit confirmation before continuing.

**Check 2 — Working tree must be clean**
Run: `git status --porcelain`
If output is non-empty, stop. Tell the user exactly which files are modified or untracked. They must commit all pending changes before finishing the branch. Do not offer to stash automatically — finishing a branch is a deliberate milestone and pending changes should be intentionally committed.

**Check 3 — Fetch latest remote state**
Run: `git fetch origin`
This ensures an accurate view of `origin/development` before rebasing.

**Check 4 — Show what will be merged**
Run: `git log --oneline origin/development..HEAD`
Show the user the commits that will be merged into `development`. If there are zero commits (the branch has no new commits beyond `development`), warn the user and ask if they want to continue or abort — merging an empty branch is almost always a mistake.

## Rebase

Ask the user to confirm before rebasing:
> "About to rebase `<FEATURE_BRANCH>` onto `origin/development`. This rewrites your local commits. Proceed? (yes/no)"

If confirmed, run:
```
git rebase origin/development
```

**If the rebase hits a conflict:**
- Report which files are conflicted.
- Do NOT attempt to resolve conflicts automatically. Tell the user:
  > "There are merge conflicts. Resolve them manually, then run `git rebase --continue`. To cancel, run `git rebase --abort`. Come back and run `/feature-finish` again once the rebase is clean."
- Stop here.

**If the rebase succeeds:** confirm to the user and show the updated log (`git log --oneline -5`).

## Merge into development

Run:
```
git checkout development
git pull origin development
git merge --no-ff <FEATURE_BRANCH> -m "Merge <FEATURE_BRANCH> into development"
```

`--no-ff` is required — it preserves the merge commit, matching this project's existing history style (all merges use explicit merge commits).

**If the merge fails:** report the full error, do NOT attempt force resolution, and run `git checkout <FEATURE_BRANCH>` to return the user to their feature branch before stopping.

**If the merge succeeds:** show `git log --oneline -4` on `development`.

## Delete the feature branch

Run in sequence:
```
git branch -d <FEATURE_BRANCH>
git push origin --delete <FEATURE_BRANCH>
```

Use `-d` (safe delete), NOT `-D`. If `-d` fails with "not fully merged", stop and report to the user — do not force-delete.

If the remote push-delete fails (branch doesn't exist remotely or no permission), treat it as a non-fatal warning, not an error.

## Summary

Report to the user:
- The feature branch that was merged
- The merge commit hash on `development` (`git rev-parse --short HEAD`)
- Whether the remote branch was successfully deleted
- Next step: "Push `development` to the remote when ready with `git push origin development`."

## Hard rules — never violate these

- Never use `git push --force` or `git push -f`
- Never use `--no-verify` on any git command
- Never merge into `main`
- Never use `git merge --ff-only` (this project uses explicit merge commits)
- Never use `git branch -D` (force delete)
