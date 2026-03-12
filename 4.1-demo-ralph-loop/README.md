# The RALPH Loop — Self-Improving Agents

## Overview

The RALPH Loop is an autonomous iteration pattern where an AI agent autonomously solves a problem by repeatedly running tests, seeing failures, implementing fixes, and re-running tests until the entire test suite passes.

**RALPH** is an acronym:
- **Request** — You provide the spec and initial scaffold
- **Act** — The agent implements code, run tests, refines based on failures
- **Log** — Each iteration is captured in progress logs and git commits
- **Persist** — Agent memory lives in AGENTS.md, a persistent knowledge base
- **Handle-next** — On the next invocation, the agent reads AGENTS.md and continues from where it left off

## How It Solves the Context Window Problem

Autonomous coding agents face a hard limit: context windows. Claude has 200k tokens, but large codebases quickly exceed that. The RALPH Loop solves this by:

1. **Each iteration starts fresh** — A new Claude instance, new context window
2. **But builds on committed work** — Previous iterations have committed code to git
3. **AGENTS.md as persistent memory** — The knowledge base survives across iterations
4. **Four channels of memory:**
   - Git commits (code history, branch structure)
   - Progress logs (what was attempted, what worked)
   - Task state files (current status, remaining work)
   - AGENTS.md (patterns discovered, gotchas, test coverage gaps)

## The Four Channels of Memory

### 1. Git Commits
Each phase produces a clean commit with a descriptive message:
```bash
git commit -m "pagination: implement cursor encoding and decoding"
```

The agent can run `git log` to see the history of what has been tried.

### 2. Progress Logs
Create a `PROGRESS.md` file that documents:
- What was attempted in each iteration
- Test failures and how they were resolved
- Blockers encountered and how they were overcome

### 3. Task State Files
Simple YAML/JSON files tracking:
```json
{
  "status": "in-progress",
  "completedTests": 6,
  "failingTests": 2,
  "nextSteps": ["handle invalid cursor", "test concurrent access"]
}
```

### 4. AGENTS.md — The Knowledge Base
This is the **most critical file**. It captures learnings that transcend code:

```markdown
# AGENTS.md — Pagination Utility

## Patterns & Conventions
- Cursor-based pagination, not offset-based
- Cursors are base64-encoded item IDs
- All functions use generics: <T extends { id: string }>

## Gotchas Discovered
- Empty datasets must return { data: [], nextCursor: null, hasMore: false }, not throw
- Cursor pointing to deleted item: fall back to beginning, don't error
- Page size of 0 should throw ValidationError

## Test Coverage Status
- ✅ Happy path
- ✅ Empty dataset
- ⬜ Concurrent modification
```

When a new Claude instance starts, it reads AGENTS.md first. This prevents re-solving the same problems.

## Compound Learning: Why Each Loop Iteration Makes the Next Better

1. **Loop 1**: Agent discovers validation rules → writes them to AGENTS.md
2. **Loop 2**: Agent reads AGENTS.md, avoids those mistakes, moves faster
3. **Loop 3**: Agent builds on previous discoveries, tackles harder edge cases

With each iteration, less time is wasted on re-discovering gotchas.

## Worked Example: Pagination Utility

### The Spec
Build a cursor-based pagination utility with:
- Generic type support
- Base64-encoded cursors
- Proper handling of empty datasets, single page, multi-page
- Response shape: `{ data, nextCursor, hasMore }`

### How to Run the RALPH Loop

**Initial request (Loop 1):**
```
You are building a pagination utility. Your task is to implement src/paginate.ts
to pass all tests in tests/pagination.test.ts.

After each change, run `npm test`. Keep iterating until ALL tests pass.
Do not stop until there are zero test failures.

Refer to src/pagination-spec.md for requirements.
After you finish, write a summary to AGENTS.md documenting patterns discovered.
```

**First iteration:**
1. Agent reads the spec
2. Agent runs tests, sees 8 failures
3. Agent implements paginate.ts
4. Agent runs tests, sees 5 failures
5. Agent fixes bugs iteratively
6. All tests pass
7. Agent writes findings to AGENTS.md

**Subsequent iterations (if needed):**
```
Read AGENTS.md to understand previous discoveries.
Refer to git log to see what was attempted.
Read PROGRESS.md to see what still needs work.

Now add support for [new feature]. Run tests after each change.
```

The agent reads AGENTS.md first, learns what pitfalls to avoid, and proceeds with confidence.

## Supervision & Safety

### Tailing Logs
Watch the agent's progress in real-time:
```bash
tail -f PROGRESS.md
tail -f npm-test-output.log
```

### Max Iterations
Set a hard limit to prevent infinite loops:
```bash
MAX_ITERATIONS=25 claude "Implement pagination utility..."
```

If the agent doesn't finish in 25 iterations, stop and review manually.

### Checkpoint Commits
Force a commit after every N iterations. This gives you safe rollback points:
```
After iteration 5, commit with:
git commit -m "checkpoint: 7 tests passing, 2 failing"
```

### Monitoring Loop Health
Signs the loop is healthy:
- Test count decreasing (progress toward zero failures)
- Clear error messages describing what's missing
- Commits with meaningful messages (not "fix", "try again")

Signs the loop is stuck:
- Same error repeating across multiple iterations
- Test count not changing
- Generic commit messages ("fix", "debug", "try again")

## When to Use RALPH vs. Interactive Sessions

### Use RALPH Loop when:
- You have clear acceptance criteria (tests)
- The task is self-contained (doesn't require decisions)
- You want fully autonomous execution
- You trust the agent to iterate intelligently

### Use interactive sessions when:
- The problem is ambiguous (you need to clarify mid-stream)
- There are architectural decisions to make
- You want to guide the agent's direction
- The task spans multiple unrelated concerns

## Example AGENTS.md

See `AGENTS.md` in this directory for a realistic example of persistent memory across iterations.

## Files in This Demo

- `src/pagination-spec.md` — Requirements specification
- `src/paginate.ts` — Stub implementation for the agent to complete
- `tests/pagination.test.ts` — Acceptance criteria (must pass)
- `AGENTS.md` — Persistent memory across RALPH iterations
- `package.json`, `tsconfig.json` — Build configuration

## Getting Started

1. Copy this directory as a starting point
2. Write your spec in `src/[name]-spec.md`
3. Create a stub implementation with `// TODO` comments
4. Write comprehensive tests in `tests/[name].test.ts`
5. Create an empty `AGENTS.md` file
6. Give Claude the Ralph Loop prompt (see above)
7. Watch the iterations unfold
8. After it finishes, review the AGENTS.md it created

## Key Takeaway

RALPH is not magic — it's a structured way to let autonomous agents make progress despite context window limits. By committing work frequently and documenting learnings in AGENTS.md, each iteration builds on previous success. The agent becomes smarter with each loop.
