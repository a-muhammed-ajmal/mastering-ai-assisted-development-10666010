# Claude Tasks: User Import Pipeline

## Video 4.2: Claude Tasks — Native Task Orchestration

This specification file is designed to be "hydrated" into Claude Code's native Task system at the start of each session. Tasks are session-scoped — they disappear when the session ends — but this file persists and tracks cumulative progress.

## How to Hydrate

Ask Claude Code:
```
Read src/tasks-spec.md and create Claude Tasks for each unchecked item.
Set up dependencies: T2 is blocked by T1, T3 is blocked by T2.
```

Claude will call TaskCreate for each task and TaskUpdate to wire dependencies.

---

## Tasks

### Feature: User Import Pipeline

- [ ] T1: Parse CSV into structured user objects
- [ ] T2: Validate parsed users (blocked by T1)
- [ ] T3: Deduplicate valid users (blocked by T2)

---

## Task Details

### T1: CSV Parser

**Subject**: Parse CSV into structured user objects
**ActiveForm**: Parsing CSV into user objects
**Metadata**: `{"feature": "import", "phase": "1"}`

**Description**: Parse a raw CSV string into an array of user objects.

**Input**: Raw CSV string
```
name,email,role
Alice,alice@example.com,admin
Bob,bob@example.com,editor
"Smith, Charlie",charlie@example.com,viewer
```

**Output**: Array of objects
```typescript
[
  { name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { name: 'Bob', email: 'bob@example.com', role: 'editor' },
  { name: 'Smith, Charlie', email: 'charlie@example.com', role: 'viewer' }
]
```

**Requirements**:
- Parse header row (name, email, role)
- Handle quoted fields (fields may contain commas)
- Trim whitespace from all fields
- Skip empty rows
- Handle various line endings (CRLF, LF)

**Test Command**: `npm run test:task1`

**Acceptance Criteria**: All tests in `tests/task-1-parser.test.ts` pass.

---

### T2: Validator

**Subject**: Validate parsed users with email and role checks
**ActiveForm**: Validating parsed users
**Metadata**: `{"feature": "import", "phase": "2"}`
**Blocked By**: T1

**Description**: Validate each parsed user object.

**Input**: Array of user objects from T1

**Output**:
```typescript
{
  valid: User[],
  invalid: Array<{ user: Record<string, string>, errors: string[] }>
}
```

**Validation Rules**:
- Email must match pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Role must be exactly one of: `'admin'`, `'editor'`, `'viewer'`
- Name must be non-empty (after trimming)

**Error Messages**:
- Invalid email: `"Invalid email format"`
- Invalid role: `"Role must be one of: admin, editor, viewer"`
- Empty name: `"Name is required"`

**Requirements**:
- Return all errors for a user (not just the first error)
- Separate valid users from invalid ones
- Include the original user data in the invalid result

**Test Command**: `npm run test:task2`

**Acceptance Criteria**: All tests in `tests/task-2-validator.test.ts` pass.

---

### T3: Deduplicator

**Subject**: Deduplicate valid users by email
**ActiveForm**: Deduplicating valid users
**Metadata**: `{"feature": "import", "phase": "3"}`
**Blocked By**: T2

**Description**: Remove duplicate users from the valid list.

**Input**: Array of valid user objects from T2

**Output**:
```typescript
{
  unique: User[],
  duplicates: User[]
}
```

**Deduplication Rules**:
- Duplicate = same email address (case-insensitive comparison)
- When duplicates are found, **keep the LAST occurrence** (most recent in the CSV)
- Put duplicates in the `duplicates` array
- Return the unique set in the `unique` array

**Requirements**:
- Case-insensitive email matching
- Preserve original case of email in output
- Maintain order: unique users in order they first appear (except duplicates removed)

**Test Command**: `npm run test:task3`

**Acceptance Criteria**: All tests in `tests/task-3-dedup.test.ts` pass.

---

## Running the Full Pipeline

After all three tasks pass their tests, wire them together:

```typescript
import { parseCSV } from './csv-parser';
import { validateUsers } from './validator';
import { deduplicateUsers } from './deduplicator';

const csv = `name,email,role\nAlice,alice@example.com,admin\n...`;

const parsed = parseCSV(csv);
const { valid } = validateUsers(parsed);
const { unique } = deduplicateUsers(valid);

console.log('Imported:', unique.length, 'unique users');
```

---

## Sync-Back

After completing work, update this file:
- Change `- [ ]` to `- [x]` for completed tasks
- Commit: `git commit -m "tasks: sync back completed import pipeline"`

This ensures the next session knows where you left off.

---

## Notes for the AI Agent

Hydrate tasks at session start. Work through them respecting dependencies — T1 first, then T2 (blocked by T1), then T3 (blocked by T2).

After each task passes:
```bash
npm run test:taskX       # Verify all tests pass
TaskUpdate(taskId, status: "completed")
```

You're done when TaskList() shows all three tasks completed.
