# Claude Tasks — Native Modular Agent Chains

## Overview

**Claude Tasks** use Claude Code's built-in Task tool to break a complex job into independent subtasks, each executed by its own subagent. Every subagent gets a fresh context window, works autonomously, and returns a summary when done. If one task fails, the others are unaffected.

This is not a custom pattern you have to invent — it is how Claude Code already works. The Task tool spawns subagents that can read files, run commands, edit code, and verify results, all without bloating the parent conversation's context.

## Why Tasks Over Monolithic Prompts

### Monolithic Approach (fragile)
```
"Implement a user import system that:
  1. Parses CSV
  2. Validates emails
  3. Deduplicates users
  4. Logs results
  5. Commits to database"
```

Problems:
- Agent gets lost in complexity
- Hard to know which step failed
- Context window fills up fast
- Can't parallelize anything

### Claude Tasks Approach (resilient)
```
Task 1: CSV parser (string → User[])
Task 2: Validator (User[] → { valid, invalid })
Task 3: Deduplicator (User[] → { unique, duplicates })
```

Benefits:
- Each task gets its own fresh context — no bloat
- Tasks run independently and return summaries
- A failing task doesn't corrupt others
- Tasks can run in parallel when there are no dependencies
- Atomic commits after each task passes its tests

## How Claude Tasks Work

When you give Claude Code a complex job, it can use the **Task tool** to spawn subagents:

```
Parent agent (orchestrator):
  → Task 1: "Implement the CSV parser in src/csv-parser.ts. Run npm run test:task1."
  → Task 2: "Implement the validator in src/validator.ts. Run npm run test:task2."
  → Task 3: "Implement the deduplicator in src/deduplicator.ts. Run npm run test:task3."
```

Each subagent:
1. Gets its own context window (fresh, focused)
2. Has access to all the same tools (Read, Edit, Bash, etc.)
3. Works autonomously until done
4. Returns a summary to the parent

The parent agent orchestrates: it decides order, handles dependencies, and commits after each task passes.

## The Workflow: Implement → Test → Commit

For each task:

1. **Delegate** — Parent spawns a subagent with a focused prompt
2. **Implement** — Subagent writes the code
3. **Test** — Subagent runs the task's test suite
4. **Report** — Subagent returns pass/fail summary
5. **Commit** — Parent commits the working code

Example workflow:

```bash
# Task 1: CSV Parser
npm run test:task1  # Fails (stub)
# Claude subagent implements src/csv-parser.ts
npm run test:task1  # Passes
git commit -m "task-1: CSV parser with quoted field handling"

# Task 2: Validator
npm run test:task2  # Fails (stub)
# Claude subagent implements src/validator.ts
npm run test:task2  # Passes
git commit -m "task-2: user validator with email regex"

# Task 3: Deduplicator
npm run test:task3  # Fails (stub)
# Claude subagent implements src/deduplicator.ts
npm run test:task3  # Passes
git commit -m "task-3: deduplicator (case-insensitive email matching)"
```

## Worked Example: User Import Pipeline

### The Tasks

**Task 1: CSV Parser**
- Input: Raw CSV string (`"name,email,role\nAlice,alice@example.com,admin\n..."`)
- Output: Array of user objects (`[{ name: 'Alice', email: '...', role: 'admin' }, ...]`)
- Handles: quoted fields, empty rows, whitespace trimming
- Tests: `npm run test:task1` (7 test cases)
- Commit: `git commit -m "task-1: CSV parser"`

**Task 2: Validator**
- Input: Array of parsed users
- Output: `{ valid: User[], invalid: { user, errors }[] }`
- Rules:
  - Email must match standard regex
  - Role must be one of: 'admin', 'editor', 'viewer'
  - Name must be non-empty
- Tests: `npm run test:task2` (7 test cases)
- Commit: `git commit -m "task-2: user validator"`

**Task 3: Deduplicator**
- Input: Array of valid users
- Output: `{ unique: User[], duplicates: User[] }`
- Logic: Duplicate = same email (case-insensitive), keep LAST occurrence
- Tests: `npm run test:task3` (7 test cases)
- Commit: `git commit -m "task-3: deduplicator"`

### How to Run with Claude Code

**Initial instruction:**
```
You are implementing a user import pipeline using Claude Tasks.
Each task is delegated to a subagent with its own context.

Work through the tasks in order:

1. Spawn a task to implement the CSV Parser
   - Implement src/csv-parser.ts
   - Run: npm run test:task1
   - When all tests pass, report success

2. Spawn a task to implement the Validator
   - Implement src/validator.ts
   - Run: npm run test:task2
   - When all tests pass, report success

3. Spawn a task to implement the Deduplicator
   - Implement src/deduplicator.ts
   - Run: npm run test:task3
   - When all tests pass, report success

Commit after each task succeeds.
Do NOT start the next task until the current one passes all tests.
```

## Context Isolation: Why Tasks Beat Long Conversations

In a single long conversation, Claude's context fills up. Early instructions get compacted away. By task 3, Claude may have forgotten the type definitions from task 1.

With Tasks, each subagent starts fresh:
- Task 1 agent only sees the CSV parser code and tests
- Task 2 agent only sees the validator code and tests
- Task 3 agent only sees the deduplicator code and tests

No context pollution. No forgotten instructions. Each task is laser-focused.

## Parallel Tasks

When tasks don't depend on each other, Claude can run them simultaneously:

```
# These could run in parallel:
Task A: "Add unit tests for the auth module"
Task B: "Update the README with the new API docs"
Task C: "Lint and fix all files in src/"

# These must run sequentially:
Task 1: "Parse the CSV" (output needed by Task 2)
Task 2: "Validate the parsed data" (output needed by Task 3)
Task 3: "Deduplicate the valid data"
```

Our pipeline is sequential (each task uses the previous task's output types), but Claude Code supports parallel execution when the dependency graph allows it.

## Failure Recovery

If Task 3 fails:

```bash
git log
# task-3: deduplicator (failing, not yet committed)
# task-2: user validator (committed)
# task-1: CSV parser (committed)

# Tasks 1 and 2 are safely committed
# Retry Task 3, or fix and re-run
```

The parent agent can retry a failed task with additional context, or you can intervene and steer.

## Files in This Demo

- `src/tasks-spec.md` — Specification for all three tasks
- `src/types.ts` — Shared type definitions (the contract between tasks)
- `src/csv-parser.ts` — Task 1 implementation (stub)
- `src/validator.ts` — Task 2 implementation (stub)
- `src/deduplicator.ts` — Task 3 implementation (stub)
- `tests/task-1-parser.test.ts` — Task 1 tests
- `tests/task-2-validator.test.ts` — Task 2 tests
- `tests/task-3-dedup.test.ts` — Task 3 tests
- `package.json`, `tsconfig.json` — Build configuration

## Getting Started

1. Copy this directory as a starting point
2. Define your tasks in a spec file
3. Create shared types in `src/types.ts` (the contract between tasks)
4. Create stubs with `// TODO` comments for each task
5. Write comprehensive tests for each task
6. Give Claude the task-based prompt (see above)
7. Watch each task get delegated, implemented, and committed

## Key Takeaway

Claude Tasks are the native way to decompose complex work in Claude Code. Each subagent gets fresh context, works independently, and reports back. The parent orchestrates. You get atomic commits, context isolation, and the option to parallelize — all built into the tool, no custom patterns required.
