# Chapter 4.2: Claude Tasks

## Starting Point

This is a clean starting point for the Claude Tasks demo. Implement the three tasks one at a time, each delegated to a subagent with its own fresh context.

## Your Task

Build a CSV processing pipeline by implementing three independent tasks (functions):

1. **Task 1 (csv-parser.ts)** — Parse CSV string -> array of objects
2. **Task 2 (validator.ts)** — Validate users -> separate into valid/invalid
3. **Task 3 (deduplicator.ts)** — Remove duplicates -> unique/duplicates

## The Claude Tasks Workflow

1. **Delegate Task 1** (CSV Parser)
   - Parse CSV into objects
   - Handle quoted fields, whitespace, empty rows
   - Run `npm run test:task1` — must pass all 7 tests
   - Commit your work

2. **Delegate Task 2** (Validator)
   - Validate email format, role enum, non-empty name
   - Collect multiple errors per user
   - Run `npm run test:task2` — must pass all 7 tests
   - Commit your work

3. **Delegate Task 3** (Deduplicator)
   - Deduplicate by email (case-insensitive)
   - Keep last occurrence
   - Maintain order of unique entries
   - Run `npm run test:task3` — must pass all 7 tests
   - Commit your work

## Quick Start

```bash
npm install
npm run test:task1  # Should fail until you implement csv-parser.ts
npm run test:task2  # Should fail until you implement validator.ts
npm run test:task3  # Should fail until you implement deduplicator.ts
npm test            # Run all tests
```

## Key Points

- Each task is **independent** and testable
- Each task gets its own **fresh subagent context**
- Tests ARE the acceptance criteria
- `src/types.ts` defines the data contract between tasks
- One task at a time — commit each one
- The pipeline composition happens at a higher level (not part of this demo)

## Success Criteria

All 21 tests must pass:
- 7 tests for Task 1 (CSV Parser)
- 7 tests for Task 2 (Validator)
- 7 tests for Task 3 (Deduplicator)
