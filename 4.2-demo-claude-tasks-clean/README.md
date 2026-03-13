# Chapter 4.2: Task Specs & the Hydration Pattern

## Starting Point

This is a clean starting point for the task specs demo. Write a task specification, then ask Claude to read it and implement all unchecked tasks in dependency order.

## Your Task

Build a CSV processing pipeline by implementing four tasks — three with dependencies, one independent:

1. **Task 1 (csv-parser.ts)** — Parse CSV string -> array of objects
2. **Task 2 (validator.ts)** — Validate users -> separate into valid/invalid (blocked by T1)
3. **Task 3 (deduplicator.ts)** — Remove duplicates -> unique/duplicates (blocked by T2)
4. **Task 4 (reporter.ts)** — Generate import summary report (no dependencies)

## The Task Spec Workflow

1. **Read the spec** — Claude reads `src/tasks-spec.md` and identifies unchecked tasks
2. **Execute in order** — Claude works through tasks respecting dependency annotations
3. **Self-verify** — After each task, Claude runs the acceptance tests
4. **Check off** — Claude marks completed tasks with checked boxes
5. **Commit** — Spec file updates are committed to git for cross-session persistence

## Quick Start

```bash
npm install
npm run test:task1  # Should fail until you implement csv-parser.ts
npm run test:task2  # Should fail until you implement validator.ts
npm run test:task3  # Should fail until you implement deduplicator.ts
npm run test:task4  # Should fail until you implement reporter.ts
npm test            # Run all tests
```

## Prompt for Claude

```
Read src/tasks-spec.md and implement all unchecked tasks in order,
running tests after each one. Check off completed tasks in the spec.
Do NOT start a blocked task until its dependency is checked off.
```

## Key Points

- The task spec is the persistent state — commit it to git
- Dependency annotations control execution order
- Acceptance criteria let Claude self-verify
- The hydration pattern: next session reads the spec and picks up where you left off
- `src/types.ts` defines the data contract between tasks

## Success Criteria

All 28 tests must pass:
- 7 tests for Task 1 (CSV Parser)
- 7 tests for Task 2 (Validator)
- 7 tests for Task 3 (Deduplicator)
- 7 tests for Task 4 (Report Generator)
