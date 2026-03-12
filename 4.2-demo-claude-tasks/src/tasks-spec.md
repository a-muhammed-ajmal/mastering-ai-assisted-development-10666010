# Claude Tasks: User Import Pipeline

## Video 4.2: Claude Tasks — Native Modular Agent Chains

Each "task" is delegated to a Claude subagent with its own fresh context. The subagent implements, tests, and reports back. The parent agent commits after each task passes.

## Task 1: CSV Parser

**Goal**: Parse a CSV string into an array of user objects.

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

**Commit Message**: `git commit -m "task-1: CSV parser with quoted field support"`

---

## Task 2: Validator

**Goal**: Validate each parsed user object.

**Input**: Array of user objects from Task 1

**Output**:
```typescript
{
  valid: User[],
  invalid: Array<{ user: Record<string, string>, errors: string[] }>
}
```

**Validation Rules**:
- Email must match pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$` (simple email validation)
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

**Commit Message**: `git commit -m "task-2: user validator with email and role checks"`

---

## Task 3: Deduplicator

**Goal**: Remove duplicate users from the valid list.

**Input**: Array of valid user objects from Task 2

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

**Example**:
```
Input: [
  { name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { name: 'Alice V2', email: 'ALICE@EXAMPLE.COM', role: 'editor' },
  { name: 'Bob', email: 'bob@example.com', role: 'editor' }
]

Output: {
  unique: [
    { name: 'Alice V2', email: 'ALICE@EXAMPLE.COM', role: 'editor' },  // Later Alice
    { name: 'Bob', email: 'bob@example.com', role: 'editor' }
  ],
  duplicates: [
    { name: 'Alice', email: 'alice@example.com', role: 'admin' }  // Earlier Alice
  ]
}
```

**Requirements**:
- Case-insensitive email matching
- Preserve original case of email in output
- Maintain order: unique users in order they first appear (except duplicates removed)

**Test Command**: `npm run test:task3`

**Commit Message**: `git commit -m "task-3: deduplicator with case-insensitive email matching"`

---

## Running the Full Pipeline

After all three tasks pass their tests, you can wire them together:

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

## Notes for Claude Code

Use the Task tool to delegate each step to a subagent. Work through the tasks in order. Do NOT start the next task until the current one passes all tests.

After each task passes:
```bash
npm run test:taskX  # Verify all tests pass
git commit -m "task-X: [description]"
```

If a subagent gets stuck, review:
1. The input and output type definitions in `src/types.ts`
2. The test cases in `tests/task-X-*.test.ts` (they show expected behavior)
3. The requirements above (they're detailed and specific)

You're done when `git log` shows three commits:
```
task-3: deduplicator with case-insensitive email matching
task-2: user validator with email and role checks
task-1: CSV parser with quoted field support
```
