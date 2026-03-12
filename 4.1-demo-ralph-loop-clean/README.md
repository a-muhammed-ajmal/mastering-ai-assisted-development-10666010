# Chapter 3.1: The RALPH Loop — Autonomous Iteration

## Starting Point

This is a clean starting point for the RALPH Loop demo. Use this to demonstrate how an AI agent autonomously iterates on code until all tests pass.

## Your Task

Implement the `paginate` function in `src/paginate.ts` to pass all tests in `tests/pagination.test.ts`.

### The RALPH Loop Workflow

1. **Read** the requirements in `src/pagination-spec.md`
2. **Ask** Claude (or your AI agent) to implement the function
3. **Loop** — Have the agent run `npm test` after each change
4. **Help** the agent debug failures
5. **Keep going** until all tests pass (zero failures)

### Quick Start

```bash
npm install
npm test
```

You should see 7 test failures. This is expected! The agent's job is to fix them all.

### The Implementation

The agent should implement a cursor-based pagination utility with:
- Generic type safety (`<T extends { id: string }>`)
- Base64-encoded cursors
- Support for multi-page navigation
- Proper handling of edge cases (empty data, invalid cursors)

### Success Criteria

All 7 tests must pass:
- ✓ Returns correct data for first page
- ✓ Returns correct nextCursor for subsequent pages
- ✓ Returns `hasMore: false` on last page
- ✓ Handles empty dataset
- ✓ Is type-safe — generic T matches item type
- ✓ Works with different page sizes
- ✓ Cursor decodes correctly for continuation

### Learning Goals

After completing this, document in `AGENTS.md`:
- What patterns and conventions you discovered
- Gotchas you encountered
- Test coverage status
- Learnings for future iterations
