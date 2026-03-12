# Claude Tasks — Native Task Orchestration (Clean Starter)

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

## Your Task: User Import Pipeline

Implement three independent task functions using the Claude Tasks workflow:

### Tasks

**Task 1: CSV Parser** (`src/csv-parser.ts`)
- Parse a CSV string into an array of user objects
- Input: Raw CSV string
- Output: `Record<string, string>[]`
- Tests: `npm run test:task1`

**Task 2: Validator** (`src/validator.ts`)
- Validate each parsed user object
- Input: Array of parsed users from T1
- Output: `{ valid: User[], invalid: { user, errors }[] }`
- Tests: `npm run test:task2`
- Blocked by: T1

**Task 3: Deduplicator** (`src/deduplicator.ts`)
- Remove duplicate users from the valid list
- Input: Array of valid users from T2
- Output: `{ unique: User[], duplicates: User[] }`
- Tests: `npm run test:task3`
- Blocked by: T2

## How to Get Started

1. Open this directory in Claude Code
2. Ask Claude to hydrate tasks from `src/tasks-spec.md`:
   ```
   Read src/tasks-spec.md and create Claude Tasks for each unchecked item.
   Set up dependencies: T2 is blocked by T1, T3 is blocked by T2.
   ```

3. Claude will create tasks with dependencies
4. Implement Task 1 first (no blockers)
5. When T1 tests pass, Task 2 unblocks automatically
6. When T2 tests pass, Task 3 unblocks
7. Update `src/tasks-spec.md` to mark tasks complete
8. Commit to git

## Files in This Demo

- `src/tasks-spec.md` — Task specification (read this for full requirements)
- `src/types.ts` — Shared type definitions
- `src/csv-parser.ts` — Task 1 stub (needs implementation)
- `src/validator.ts` — Task 2 stub (needs implementation)
- `src/deduplicator.ts` — Task 3 stub (needs implementation)
- `tests/task-1-parser.test.ts` — Task 1 tests
- `tests/task-2-validator.test.ts` — Task 2 tests
- `tests/task-3-dedup.test.ts` — Task 3 tests

## Test Commands

```bash
# Run all tests
npm test

# Run individual task tests
npm run test:task1
npm run test:task2
npm run test:task3

# Build TypeScript
npm run build
```

## When to Use Claude Tasks

**Use Tasks when:**
- Multi-file features with dependencies
- Large-scale refactors across many files
- Independent features that can parallelize
- Sub-agent coordination across directories

## Getting Started

1. Read `src/tasks-spec.md` for full task descriptions and requirements
2. Ask Claude Code to hydrate the tasks
3. Implement each task in order (respecting dependencies)
4. Test each task before moving to the next
5. Sync progress back to `src/tasks-spec.md` when complete

Good luck!
