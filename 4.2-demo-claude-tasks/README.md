# Task Specs & the Hydration Pattern

## Overview

**Task specs** are structured markdown files that define multi-step work with dependencies and acceptance criteria. Claude reads the spec, works through tasks in dependency order, and checks them off as it goes. The spec file lives in git, so progress persists across sessions.

This is the **hydration pattern**: at session start, Claude reads the spec and picks up where you left off. Session state is ephemeral, but the spec file is permanent.

## Why Task Specs Over Monolithic Prompts

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
- No dependency tracking
- Can't resume across sessions

### Task Spec Approach (structured)
```markdown
- [ ] T1: CSV parser (string -> User[])
- [ ] T2: Validator (User[] -> { valid, invalid }) — blocked by T1
- [ ] T3: Deduplicator (User[] -> { unique, duplicates }) — blocked by T2
- [ ] T4: Report Generator (stats -> ImportReport) — (no dependencies)
```

Benefits:
- Claude reads the spec and works through tasks in dependency order
- Each completed task gets checked off in the spec
- Commit the spec to git — next session resumes from where you left off
- Acceptance criteria let Claude self-verify before moving on
- Auditable record of what was done and when

## How It Works

### Step 1: Write the Task Spec

Create a `tasks-spec.md` file with:
- Tasks as unchecked boxes (`- [ ]`)
- Dependency annotations (`blocked by T1`)
- Acceptance criteria for each task (test commands, expected outputs)

### Step 2: Ask Claude to Execute

```
Read tasks-spec.md and implement all unchecked tasks in order,
running tests after each one. Check off completed tasks in the spec.
```

Claude will:
1. Read the spec and identify unblocked tasks
2. Implement the first unblocked task
3. Run tests to verify (self-check against acceptance criteria)
4. Check off the completed task in the spec
5. Move to the next unblocked task
6. Repeat until all tasks are complete

### Step 3: Commit and Resume

```bash
git add src/tasks-spec.md
git commit -m "progress: tasks 1-3 complete"
```

Next session, Claude reads the spec, sees checked items, and only works on what's left.

## Worked Example: User Import Pipeline

### The Task Spec

See `src/tasks-spec.md` for the full specification. Four tasks:

**Task 1: CSV Parser**
- Input: Raw CSV string
- Output: Array of user objects
- Handles: quoted fields, empty rows, whitespace trimming
- Acceptance: `npm run test:task1` passes all 7 tests

**Task 2: Validator** (blocked by T1)
- Input: Array of parsed users
- Output: `{ valid: User[], invalid: { user, errors }[] }`
- Rules: email format, role enum, non-empty name
- Acceptance: `npm run test:task2` passes all 7 tests

**Task 3: Deduplicator** (blocked by T2)
- Input: Array of valid users
- Output: `{ unique: User[], duplicates: User[] }`
- Logic: same email (case-insensitive), keep last occurrence
- Acceptance: `npm run test:task3` passes all 7 tests

**Task 4: Report Generator** (no dependencies)
- Input: Pipeline statistics (counts for each stage)
- Output: `ImportReport` with summary string and timestamp
- Logic: calculates validation and uniqueness rates
- Acceptance: `npm run test:task4` passes all 7 tests
- Key insight: since T4 has no dependencies, Claude can start it alongside T1

### The Hydration Pattern in Action

**Session 1**: Claude reads spec, implements T1 and T2, checks them off. You commit.

**Session 2**: Claude reads spec, sees T1 and T2 are checked, starts at T3. Completes it.

No context from Session 1 is needed — the spec file IS the context.

## Files in This Demo

- `src/tasks-spec.md` — The task specification with dependencies and acceptance criteria
- `src/types.ts` — Shared type definitions (the contract between tasks)
- `src/csv-parser.ts` — Task 1 implementation (stub)
- `src/validator.ts` — Task 2 implementation (stub)
- `src/deduplicator.ts` — Task 3 implementation (stub)
- `src/reporter.ts` — Task 4 implementation (stub, no dependencies)
- `tests/task-1-parser.test.ts` — Task 1 tests
- `tests/task-2-validator.test.ts` — Task 2 tests
- `tests/task-3-dedup.test.ts` — Task 3 tests
- `tests/task-4-reporter.test.ts` — Task 4 tests

## Getting Started

1. Review `src/tasks-spec.md` to understand the task structure
2. Review `src/types.ts` for the shared data contract
3. Run `npm install`
4. Ask Claude: "Read tasks-spec.md and implement all unchecked tasks in order, running tests after each one."
5. Watch Claude work through the dependency chain
6. Commit the updated spec file to preserve progress

## Key Takeaway

Task specs give you structured single-agent work with cross-session persistence. The hydration pattern — persistent spec + ephemeral session — means your project state lives in git, not in Claude's context window. Notice how T4 (Report Generator) has no dependencies — Claude identifies it as unblocked and can start it immediately alongside T1, showing how dependency annotations control execution order even for independent tasks. For multi-agent parallel work, see Chapter 5 (Subagents and Agent Teams).
