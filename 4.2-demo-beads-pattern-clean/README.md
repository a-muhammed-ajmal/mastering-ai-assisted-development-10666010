# Chapter 3.2: The Beads Pattern

## Starting Point

This is a clean starting point for the Beads Pattern demo. Implement the three beads one at a time and test each independently.

## Your Task

Build a CSV processing pipeline by implementing three independent "beads" (functions):

1. **Bead 1 (csv-parser.ts)** — Parse CSV string → array of objects
2. **Bead 2 (validator.ts)** — Validate users → separate into valid/invalid
3. **Bead 3 (deduplicator.ts)** — Remove duplicates → unique/duplicates

## The Beads Pattern Workflow

1. **Implement Bead 1** (CSV Parser)
   - Parse CSV into objects
   - Handle quoted fields, whitespace, empty rows
   - Run `npm run test:bead1` — must pass all 7 tests
   - Commit your work

2. **Implement Bead 2** (Validator)
   - Validate email format, role enum, non-empty name
   - Collect multiple errors per user
   - Run `npm run test:bead2` — must pass all 8 tests
   - Commit your work

3. **Implement Bead 3** (Deduplicator)
   - Deduplicate by email (case-insensitive)
   - Keep last occurrence
   - Maintain order of unique entries
   - Run `npm run test:bead3` — must pass all 8 tests
   - Commit your work

## Quick Start

```bash
npm install
npm run test:bead1  # Should fail until you implement csv-parser.ts
npm run test:bead2  # Should fail until you implement validator.ts
npm run test:bead3  # Should fail until you implement deduplicator.ts
npm test            # Run all tests
```

## Key Points

- Each bead is **independent** and testable
- Tests ARE the acceptance criteria
- `src/types.ts` defines the data contract
- One bead at a time — commit each one
- The pipeline composition happens at a higher level (not part of this demo)

## Success Criteria

All 23 tests must pass:
- 7 tests for Bead 1 (CSV Parser)
- 8 tests for Bead 2 (Validator)
- 8 tests for Bead 3 (Deduplicator)
