# Claude Tasks — Native Task Orchestration

## Overview

**Claude Tasks** is Claude Code's native system for managing complex, multi-step work within a coding session. Tasks are session-scoped — they track dependencies, enable parallel execution, and coordinate sub-agents — but disappear when the session ends.

The **hydration pattern** bridges sessions: persistent specification files (like `src/tasks-spec.md`) are "hydrated" into live Claude Tasks at session start, and progress is synced back to the spec files before the session ends.

## Why Claude Tasks Over Monolithic Prompts

### Monolithic Approach (fragile)
```
"Implement a user import system that parses CSV, validates emails,
deduplicates users, and commits to database — all at once."
```

Problems:
- Agent gets lost in complexity
- No dependency tracking
- Can't parallelize independent work
- No progress visibility

### Claude Tasks Approach (robust)
```
T1: CSV Parser         → Ready (no dependencies)
T2: Validator          → Blocked by T1
T3: Deduplicator       → Blocked by T2
```

Benefits:
- Automatic dependency resolution
- Real-time progress tracking
- Parallel execution of independent tasks
- Sub-agent coordination via shared task list

## The Four Task Tools

| Tool | Purpose |
|------|---------|
| `TaskCreate` | Create a task with subject, description, metadata |
| `TaskUpdate` | Change status, add dependencies (blockedBy/blocks) |
| `TaskGet` | Retrieve full details for a specific task |
| `TaskList` | Show all tasks with status and dependencies |

## The Hydration Pattern

```
Session Start:  tasks-spec.md → TaskCreate() for each item → Live Tasks
During Work:    TaskUpdate(status: "in_progress") → work → TaskUpdate(status: "completed")
Session End:    Update tasks-spec.md checkboxes → git commit
```

1. **Hydrate**: Read spec file, create Claude Tasks for each unchecked item
2. **Work**: Tasks track progress in real-time with dependency resolution
3. **Sync back**: Update spec file with completed status, commit to git

This makes tasks effectively persistent through git-versioned specification files.

## Worked Example: User Import Pipeline

### The Tasks

**Task 1: CSV Parser**
- Subject: "Parse CSV into structured user objects"
- Input: Raw CSV string
- Output: `Record<string, string>[]`
- Tests: `npm run test:task1`

**Task 2: Validator** (blocked by T1)
- Subject: "Validate parsed users with email and role checks"
- Input: Array of parsed users from T1
- Output: `{ valid: User[], invalid: { user, errors }[] }`
- Tests: `npm run test:task2`

**Task 3: Deduplicator** (blocked by T2)
- Subject: "Deduplicate valid users by email"
- Input: Array of valid users from T2
- Output: `{ unique: User[], duplicates: User[] }`
- Tests: `npm run test:task3`

### Hydration in Action

```
> Read src/tasks-spec.md and create Claude Tasks for each unchecked item.
> Set up dependencies: T2 blocked by T1, T3 blocked by T2.

✔ Task #1 created: T1 — Parse CSV into structured user objects
✔ Task #2 created: T2 — Validate parsed users
✔ Task #3 created: T3 — Deduplicate valid users
✔ Task #2 updated: blockedBy [#1]
✔ Task #3 updated: blockedBy [#2]

◼ #1 T1: Parse CSV                    ← Ready to start
◼ #2 T2: Validate parsed users        ⚠ blocked by #1
◼ #3 T3: Deduplicate valid users      ⚠ blocked by #2
```

### Working Through Tasks

```bash
# Task 1 starts automatically (no blockers)
TaskUpdate(taskId: "#1", status: "in_progress")
# ... implement src/csv-parser.ts ...
npm run test:task1   # All pass
TaskUpdate(taskId: "#1", status: "completed")

# Task 2 automatically unblocks
TaskUpdate(taskId: "#2", status: "in_progress")
# ... implement src/validator.ts ...
npm run test:task2   # All pass
TaskUpdate(taskId: "#2", status: "completed")

# Task 3 automatically unblocks
TaskUpdate(taskId: "#3", status: "in_progress")
# ... implement src/deduplicator.ts ...
npm run test:task3   # All pass
TaskUpdate(taskId: "#3", status: "completed")
```

### Sync Back

After all tasks complete, update `src/tasks-spec.md`:
```markdown
- [x] T1: Parse CSV into structured user objects
- [x] T2: Validate parsed users (blocked by T1)
- [x] T3: Deduplicate valid users (blocked by T2)
```

## When to Use Claude Tasks

**Use Tasks when:**
- Multi-file features with dependencies
- Large-scale refactors across many files
- Independent features that can parallelize
- Sub-agent coordination across directories

**Skip Tasks when:**
- Single-function fixes
- Simple bugs or trivial edits
- Fewer than 3 related steps
- Linear work with no parallelism opportunity

## Parallel Execution

For independent features, spawn parallel agents:

```
Feature A (React UI):     T1-A, T2-A, T3-A → Agent A (src/ui/)
Feature B (API backend):  T1-B, T2-B, T3-B → Agent B (src/api/)
```

Each agent has scoped access to its directory. When Agent A completes a task, the shared task list reflects it immediately.

## Files in This Demo

- `src/tasks-spec.md` — Persistent task specification (hydration source)
- `src/types.ts` — Shared type definitions (contract between tasks)
- `src/csv-parser.ts` — Task 1 implementation
- `src/validator.ts` — Task 2 implementation
- `src/deduplicator.ts` — Task 3 implementation
- `tests/task-1-parser.test.ts` — Task 1 tests
- `tests/task-2-validator.test.ts` — Task 2 tests
- `tests/task-3-dedup.test.ts` — Task 3 tests

## Getting Started

1. Open this directory in Claude Code
2. Ask Claude to hydrate tasks from `src/tasks-spec.md`
3. Watch Claude create tasks with dependencies
4. Tasks execute in dependency order, tests verify each one
5. Sync completed status back to spec file
6. Commit to git — next session picks up where you left off

## Key Takeaway

Claude Tasks transform Claude Code from a reactive assistant into a project orchestrator. Combined with the hydration pattern, you get session-scoped execution speed with persistent project memory. Tasks are lightweight, dependency-aware, and designed for parallel agent workflows.
