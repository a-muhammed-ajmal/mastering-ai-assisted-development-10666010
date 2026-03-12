# Hooks & Automation — Quality on Autopilot

## What Are Hooks?

**Hooks** are automatic triggers that run before or after Claude performs an action. They're your way of enforcing quality standards without asking Claude to remember them every time.

Think of hooks as:
- **Pre-flight checks** before dangerous operations
- **Post-action cleanup** (auto-lint, auto-test)
- **Notifications** when Claude finishes long tasks
- **Guardrails** that prevent mistakes

### Hooks vs. Skills

| Concept | Purpose | Example |
|---------|---------|---------|
| **Skills** | What Claude knows about your codebase | "Use semantic HTML in components" |
| **Hooks** | What Claude automatically does on your behalf | "Auto-lint after writing code" |
| **CLAUDE.md** | Strategic context about your project | "We're a React SaaS with 50K users" |

Hooks are the **automation layer** that turns standards into action.

---

## Three Types of Hooks

### 1. PreToolUse Hooks

Run **before** Claude executes a tool (Bash, Write, Edit, etc.)

**Use case:** Block dangerous commands

```
You ask: Claude, run rm -rf /
Hook intercepts: "This looks like a force delete. Require confirmation."
Result: Claude must acknowledge the danger before proceeding
```

### 2. PostToolUse Hooks

Run **after** Claude executes a tool

**Use case:** Auto-lint, auto-test, auto-format

```
Claude writes: src/Button.tsx
Hook runs: npx eslint --fix src/Button.tsx && npx jest --findRelatedTests src/Button.tsx
Result: Code is linted and tests run automatically
```

### 3. Notification Hooks

Send alerts when events occur

**Use case:** Desktop/Slack notifications for long tasks

```
Claude finishes: 30-minute refactoring task
Hook triggers: Send desktop notification "Claude finished your task"
Result: You get a ping instead of manually checking
```

---

## Four Concrete Examples

### Example 1: Auto-Lint on File Save

**Trigger:** PostToolUse + Write tool + TypeScript files

```json
{
  "event": "PostToolUse",
  "matcher": {
    "tool": "Write",
    "filePath": "src/**/*.ts"
  },
  "command": "npx eslint --fix $FILE_PATH"
}
```

**What happens:**
1. Claude writes `src/utils/format.ts`
2. Hook detects the write
3. Runs `npx eslint --fix src/utils/format.ts` automatically
4. Code is linted before you even see it

**Benefits:**
- No more "eslint failed" surprises
- Consistent formatting across the codebase
- Linting feedback loop is instant

---

### Example 2: Auto-Run Related Tests

**Trigger:** PostToolUse + Write tool + src/ files

```json
{
  "event": "PostToolUse",
  "matcher": {
    "tool": "Write",
    "filePath": "src/**/*.ts"
  },
  "command": "npx jest --findRelatedTests $FILE_PATH --passWithNoTests"
}
```

**What happens:**
1. Claude writes `src/api/users.ts`
2. Hook finds all related tests (`users.test.ts`, `api.test.ts`, etc.)
3. Runs tests automatically
4. If tests fail, you see the error immediately
5. Claude can fix the issue before handing off to you

**Benefits:**
- Catch bugs during development, not in production
- Red tests = immediate feedback loop
- Claude can self-correct based on test failures

---

### Example 3: Block Dangerous Commands

**Trigger:** PreToolUse + Bash tool + dangerous patterns

```json
{
  "event": "PreToolUse",
  "matcher": {
    "tool": "Bash",
    "command": "rm -rf|git push.*--force|DROP TABLE|DELETE FROM"
  },
  "command": "echo 'BLOCKED: Dangerous command detected. Require explicit confirmation.' && exit 1"
}
```

**What happens:**
1. You ask: "Delete all temp files with `rm -rf /tmp/*`"
2. Claude constructs the command
3. Hook detects the `-rf` pattern
4. Command is blocked before execution
5. You must explicitly confirm the dangerous operation

**Dangerous patterns to block:**
- `rm -rf` (force recursive delete)
- `git push --force` (rewrite history)
- `DROP TABLE` (delete database)
- `DELETE FROM WHERE` (unfiltered deletes)
- `chmod 777` (open permissions to everyone)

**Benefits:**
- Accidental destructive commands are prevented
- You maintain control over risky operations
- Good audit trail of what was prevented

---

### Example 4: Notifications on Task Completion

**Trigger:** Notification hook on taskComplete event

```json
{
  "event": "Notification",
  "matcher": {
    "event": "taskComplete"
  },
  "command": "osascript -e 'display notification \"Claude finished your task\" with title \"Claude Code\"'"
}
```

Or on macOS with sound:
```json
{
  "command": "osascript -e 'display notification \"Claude finished your task\" with title \"Claude Code\" sound name \"Glass\"'"
}
```

Or send to Slack (requires webhook):
```json
{
  "command": "curl -X POST $SLACK_WEBHOOK -d '{\"text\": \"Claude finished the refactoring task\"}'"
}
```

**What happens:**
1. Claude finishes a 20-minute refactoring
2. Hook detects task completion
3. Desktop notification appears
4. No need to manually check status

**Benefits:**
- Stay informed without constant monitoring
- Asynchronous workflow (start task, go get coffee)
- Multiple notification channels (desktop, Slack, email)

---

## Hook Configuration: .claude/hooks.json

Hooks are defined in `.claude/hooks.json`:

```json
{
  "hooks": [
    {
      "event": "PostToolUse",
      "matcher": {
        "tool": "Write",
        "filePath": "src/**/*.ts"
      },
      "command": "npx eslint --fix $FILE_PATH"
    },
    {
      "event": "PostToolUse",
      "matcher": {
        "tool": "Write",
        "filePath": "src/**/*.tsx"
      },
      "command": "npx prettier --write $FILE_PATH && npx eslint --fix $FILE_PATH"
    },
    {
      "event": "PreToolUse",
      "matcher": {
        "tool": "Bash",
        "command": "rm -rf|git push.*--force"
      },
      "command": "echo 'BLOCKED: Dangerous command. Require explicit confirmation.' && exit 1"
    },
    {
      "event": "Notification",
      "matcher": {
        "event": "taskComplete"
      },
      "command": "osascript -e 'display notification \"Claude finished\" with title \"Claude Code\"'"
    }
  ]
}
```

### Hook Schema

| Field | Type | Description |
|-------|------|-------------|
| `event` | `PreToolUse \| PostToolUse \| Notification` | When the hook triggers |
| `matcher` | Object | Conditions that must match to trigger the hook |
| `command` | String | Shell command to execute |

### Matcher Options

**For PostToolUse / PreToolUse:**
- `tool` — Name of the tool (Bash, Write, Edit, etc.)
- `filePath` — File path glob pattern (e.g., `src/**/*.ts`)
- `command` — Regex pattern to match command text

**For Notification:**
- `event` — Event type (e.g., `taskComplete`, `taskError`)

### Environment Variables

Hooks can access:
- `$FILE_PATH` — The file being operated on
- `$COMMAND` — The command being run
- `$PROJECT_ROOT` — Your project root directory
- `$HOOK_EVENT` — The hook event type (PostToolUse, PreToolUse)

Example:
```json
{
  "command": "echo 'File written: $FILE_PATH' >> /tmp/claude-log.txt"
}
```

---

## Real-World Hook System

A complete `.claude/hooks.json` for a React project:

```json
{
  "hooks": [
    {
      "event": "PostToolUse",
      "matcher": {
        "tool": "Write",
        "filePath": "src/**/*.tsx"
      },
      "command": "npx prettier --write $FILE_PATH && npx eslint --fix $FILE_PATH && npx jest --findRelatedTests $FILE_PATH --passWithNoTests"
    },
    {
      "event": "PostToolUse",
      "matcher": {
        "tool": "Write",
        "filePath": "src/**/*.ts"
      },
      "command": "npx eslint --fix $FILE_PATH && npx jest --findRelatedTests $FILE_PATH --passWithNoTests"
    },
    {
      "event": "PostToolUse",
      "matcher": {
        "tool": "Edit",
        "filePath": "CLAUDE.md"
      },
      "command": "echo 'CLAUDE.md updated on $(date)' >> /tmp/claude-updates.log"
    },
    {
      "event": "PreToolUse",
      "matcher": {
        "tool": "Bash",
        "command": "rm -rf|git push.*--force|DROP|DELETE FROM"
      },
      "command": "echo 'BLOCKED: Dangerous command' && exit 1"
    },
    {
      "event": "Notification",
      "matcher": {
        "event": "taskComplete"
      },
      "command": "osascript -e 'display notification \"Claude finished\" with title \"Claude Code\"'"
    }
  ]
}
```

**This system ensures:**
- All React components are formatted with Prettier
- All TypeScript files are linted with ESLint
- Related tests run automatically after code changes
- Dangerous operations are blocked
- Long tasks notify you when complete

---

## Composing Skills + MCP + Hooks

This is where the magic happens:

```
Feature Request: "Add dark mode support"

1. CLAUDE.md tells Claude:
   "We're a React SaaS, dark mode should use CSS variables"

2. Skills tell Claude:
   "Components must be accessible, tested, with TypeScript props"

3. MCP tells Claude:
   "Check if dark-mode feature flag is enabled before coding"

4. Hooks auto-run when Claude finishes:
   "Lint the code, run tests, notify me when done"

Result:
┌─────────────────────────────────────────┐
│ Dark Mode Feature (Fully Complete)      │
├─────────────────────────────────────────┤
│ ✓ Respects feature flags (MCP)          │
│ ✓ Follows component patterns (Skills)   │
│ ✓ Well-tested and accessible (Skills)   │
│ ✓ Code linted automatically (Hooks)     │
│ ✓ Tests passed (Hooks)                  │
│ ✓ You were notified (Hooks)             │
└─────────────────────────────────────────┘
```

---

## Advanced: Custom Hook Commands

Hooks can run any shell command. Examples:

**Run type checking:**
```json
{
  "command": "npx tsc --noEmit"
}
```

**Generate documentation:**
```json
{
  "command": "npx typedoc --out docs $FILE_PATH"
}
```

**Update metrics:**
```json
{
  "command": "curl -X POST https://metrics.example.com/files-updated -d '{\"file\": \"$FILE_PATH\"}'"
}
```

**Slack notification:**
```json
{
  "command": "curl -X POST $SLACK_WEBHOOK -d '{\"text\": \"$FILE_PATH updated\"}'"
}
```

**Custom validation script:**
```json
{
  "command": "bash ./scripts/validate-code.sh $FILE_PATH"
}
```

---

## Demo: Running the Example Project

This demo includes a simple Express server (`src/example-project/server.ts`) that demonstrates a typical project structure where hooks would be useful.

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure hooks:**
   - Copy `.claude/hooks.json` (provided in this demo)
   - Customize matchers for your file patterns

3. **Ask Claude to modify the example project:**
   ```
   "Add a new POST /notes endpoint to create notes"
   ```

4. **Watch hooks run:**
   - ESLint fixes formatting
   - Tests run and pass
   - Desktop notification when done

---

## Best Practices

1. **Start with post-hooks** — They're safer than pre-hooks
   - Post-hooks: Format, lint, test after Claude writes
   - Pre-hooks: Only for blocking truly dangerous operations

2. **Make hooks idempotent** — They can run multiple times
   - Good: `eslint --fix` (safe to run twice)
   - Bad: `git commit` (can't run twice safely)

3. **Fast hooks only** — Keep them under 10 seconds
   - If a hook takes 2 minutes, it defeats the purpose
   - Long tasks should be explicit, not automatic

4. **Log hook usage** — Audit what's being automated
   - Log to `/tmp/claude-hooks.log`
   - Helps debug hook issues

5. **Test hooks locally first** — Don't blind-enable them
   ```bash
   # Test a hook command manually
   npx eslint --fix src/example.ts
   ```

---

## When to Use Hooks

**Use hooks for:**
- Auto-formatting and linting
- Running fast tests
- Cache busting or rebuilds
- Logging and metrics
- Desktop/Slack notifications

**Don't use hooks for:**
- Slow operations (> 10 seconds)
- Destructive operations that need human review
- External API calls that might fail
- Building/deploying to production

---

## Troubleshooting Hooks

**Hook not running?**
- Check `.claude/hooks.json` syntax (JSON must be valid)
- Verify matcher conditions (filePath glob, command regex)
- Check that the tool name matches exactly (Bash, Write, Edit)

**Hook taking too long?**
- Add `--passWithNoTests` to jest calls
- Use `--max-workers=1` to parallelize less
- Consider splitting into faster hooks

**Hook command failing?**
- Test the command manually first: `npx eslint --fix src/file.ts`
- Add error handling: `command -f || echo "Failed but continuing"`
- Check environment variables are available

---

## Next Steps

1. **Create `.claude/hooks.json`** in your project
2. **Start with one post-hook** — ESLint or Prettier
3. **Add test automation** — Run tests after code writes
4. **Add notifications** — Know when Claude finishes
5. **Expand gradually** — Add more hooks as you discover needs

Hooks transform quality standards from "things Claude knows" into "things Claude does automatically."
