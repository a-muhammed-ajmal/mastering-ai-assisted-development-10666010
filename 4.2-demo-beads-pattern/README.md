# The Beads Pattern — Modular Agent Chains

## Overview

The **Beads Pattern** breaks a complex task into a sequence of atomic, independently testable units of work. Each "bead" is a small, focused task that can be implemented, tested, and committed in isolation.

Think of it as "beads on a string": each bead is solid and complete, connected to the next bead. If one bead fails, you can roll back to the previous bead without losing earlier work.

## The Metaphor: Beads on a String

A single monolithic task is risky:
- If the agent fails at step 8 of 10, all work up to that point is lost
- Hard to verify correctness incrementally
- Difficult to assign to multiple agents

The Beads Pattern mitigates this:
- Each bead is a complete, working unit
- Each bead has clear input and output types
- Each bead is tested before commit
- If bead 3 fails, beads 1-2 are safely committed

## Why Beads Over Monolithic Prompts

### ❌ Monolithic Approach
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
- Difficult to test intermediate results
- Can't assign steps to different agents

### ✅ Beads Pattern
```
Bead 1: CSV parser (string → User[])
Bead 2: Validator (User[] → { valid, invalid })
Bead 3: Deduplicator (User[] → { unique, duplicates })
```

Benefits:
- Each bead is small and focused
- Each has clear input/output types
- Easy to test each independently
- Can parallelize or assign to different agents
- Rollback is safe (commit after each bead)

## The Atomic Commit Pattern: Implement → Test → Commit

For each bead:

1. **Implement** — Write the code for the bead
2. **Test** — Run the bead's test suite (must have 100% pass rate)
3. **Commit** — `git commit -m "bead-X: [description]"`

Example workflow:

```bash
# Bead 1: CSV Parser
npm run test:bead1  # Fails
# ... implement src/csv-parser.ts ...
npm run test:bead1  # Passes
git commit -m "bead-1: CSV parser with quoted field handling"

# Bead 2: Validator
npm run test:bead2  # Fails
# ... implement src/validator.ts ...
npm run test:bead2  # Passes
git commit -m "bead-2: user validator with email regex"

# Bead 3: Deduplicator
npm run test:bead3  # Fails
# ... implement src/deduplicator.ts ...
npm run test:bead3  # Passes
git commit -m "bead-3: deduplicator (case-insensitive email matching)"
```

At the end, each bead is a clean commit. If you discover a bug in bead 2, you can:
```bash
git log
# bead-3: deduplicator
# bead-2: user validator
# bead-1: CSV parser
git revert bead-2  # Rollback just bead 2, keep bead 1 and 3
```

## Worked Example: User Import Pipeline

### The Beads

**Bead 1: CSV Parser**
- Input: Raw CSV string (`"name,email,role\nAlice,alice@example.com,admin\n..."`)
- Output: Array of user objects (`[{ name: 'Alice', email: '...', role: 'admin' }, ...]`)
- Handles: quoted fields, empty rows, whitespace trimming
- Tests: `npm run test:bead1` (3 test cases)
- Commit: `git commit -m "bead-1: CSV parser"`

**Bead 2: Validator**
- Input: Array of parsed users
- Output: `{ valid: User[], invalid: { user, errors }[] }`
- Rules:
  - Email must match standard regex (simple validation, not exhaustive)
  - Role must be one of: 'admin', 'editor', 'viewer'
  - Name must be non-empty
- Tests: `npm run test:bead2` (5 test cases covering valid and invalid data)
- Commit: `git commit -m "bead-2: user validator"`

**Bead 3: Deduplicator**
- Input: Array of valid users
- Output: `{ unique: User[], duplicates: User[] }`
- Logic: Duplicate = same email (case-insensitive)
- Keep the LAST occurrence (most recent in CSV)
- Tests: `npm run test:bead3` (4 test cases)
- Commit: `git commit -m "bead-3: deduplicator"`

### How to Run the Beads Pattern

**Initial instruction:**
```
You are implementing a user import pipeline using the Beads Pattern.
Each bead is a small, independently testable unit.

Work through the beads in order:

1. Implement Bead 1 (CSV Parser)
   - Implement src/csv-parser.ts
   - Run: npm run test:bead1
   - When all tests pass: git commit -m "bead-1: CSV parser"

2. Implement Bead 2 (Validator)
   - Implement src/validator.ts (uses output from bead 1)
   - Run: npm run test:bead2
   - When all tests pass: git commit -m "bead-2: user validator"

3. Implement Bead 3 (Deduplicator)
   - Implement src/deduplicator.ts (uses output from bead 2)
   - Run: npm run test:bead3
   - When all tests pass: git commit -m "bead-3: deduplicator"

Do NOT move to the next bead until the current bead has all tests passing.
```

## Designing Bead Boundaries

Good bead boundaries:
- **Clear input/output types** — Each bead has well-defined interface
- **Single responsibility** — Bead does one thing well
- **Independently testable** — Can test without running previous beads
- **Shareable output** — Next bead consumes this bead's output

Bad bead boundaries:
- **Fuzzy inputs/outputs** — Hard to know what data flows between beads
- **Multiple concerns** — Bead does parsing AND validation AND database access
- **Interdependent logic** — Can't test bead 2 without bead 1 running
- **Implicit data flow** — Data passed via global variables or side effects

## Failure Recovery: Safe Rollback

If bead 3 fails:

```bash
git log
# bead-3: deduplicator (failing, not yet committed)
# bead-2: user validator (✅ committed)
# bead-1: CSV parser (✅ committed)

git reset --hard bead-2  # Roll back to bead 2
# Now beads 1 and 2 are complete, bead 3 is not started
```

Or if you realize bead 2 has a bug:

```bash
# Fix bead 2
git add src/validator.ts
git commit --amend -m "bead-2: user validator (fixed email regex)"
# Now bead 3 can use the corrected bead 2
```

This is **why atomic commits matter**: each bead is a known-good state you can return to.

## Comparison: When to Use Beads vs. RALPH vs. Interactive

### Use Beads when:
- Task has clear intermediate milestones
- Each milestone is independently testable
- You want safe rollback at each stage
- You might assign different beads to different agents

### Use RALPH when:
- Single task, iterative refinement
- Clear acceptance criteria (tests)
- No intermediate milestones
- Full autonomy from start to finish

### Use interactive when:
- Problem is ambiguous
- You need to make architectural decisions mid-stream
- Requirements may change
- You want to guide the agent's approach

## Example: Multi-Agent Beads

The Beads Pattern scales to teams:

```
Bead 1 (CSV Parser) → Agent A
Bead 2 (Validator)  → Agent B
Bead 3 (Deduplicator) → Agent C

Agents work in sequence:
- Agent A implements bead 1, commits
- Agent B pulls the updated code, implements bead 2 using bead 1's output
- Agent C implements bead 3 using bead 2's output
```

Each agent's context is smaller (only their bead), so they're faster and more focused.

## Files in This Demo

- `src/beads-spec.md` — Specification for all three beads
- `src/types.ts` — Shared type definitions
- `src/csv-parser.ts` — Bead 1 implementation (stub)
- `src/validator.ts` — Bead 2 implementation (stub)
- `src/deduplicator.ts` — Bead 3 implementation (stub)
- `tests/bead-1-parser.test.ts` — Bead 1 tests
- `tests/bead-2-validator.test.ts` — Bead 2 tests
- `tests/bead-3-dedup.test.ts` — Bead 3 tests
- `package.json`, `tsconfig.json` — Build configuration

## Getting Started

1. Copy this directory as a starting point
2. Define your beads in a `SPEC.md`
3. Create shared types in `src/types.ts`
4. Create stubs with `// TODO` comments for each bead
5. Write comprehensive tests for each bead
6. Give Claude the Beads Pattern prompt (see above)
7. Watch each bead get implemented and committed

## Key Takeaway

The Beads Pattern is about **atomic progress**. Each bead is a complete, testable, committable unit of work. This makes autonomous agent work safer, more verifiable, and easier to integrate. It's not magic — it's disciplined decomposition paired with frequent commits.
