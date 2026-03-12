# Risk Management & Human Oversight

## Overview

Autonomous agents are powerful but need guardrails. This demo covers five layers of safety to prevent agents from breaking things, hallucinating, or running away.

## The Five Layers of Safety

### Layer 1: Sandboxing

**Principle**: Agents run on feature branches, never main.

**How**:
```bash
# Agent never touches main
git checkout -b feature/new-feature
# ... agent does work ...
# Review happens before merging to main
```

**Benefits**:
- Easy rollback if something goes wrong
- Human review before code is live
- Multiple agents can work safely in parallel

### Layer 2: Permission Boundaries

**Principle**: Allowlist safe operations, block destructive commands.

**Example `.claude/settings.json`**:
```json
{
  "permissions": {
    "allow": [
      "Read(src/**)",
      "Glob(src/**)",
      "Grep(src/**)",
      "Write(src/**)",
      "Write(tests/**)",
      "Bash(npm test)",
      "Bash(npm run build)",
      "Bash(npm run lint)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)",
      "Bash(DROP TABLE *)",
      "Bash(curl * | bash)",
      "Write(.env)",
      "Write(*.key)"
    ]
  }
}
```

**What This Blocks**:
- Deleting files/directories without explicit permission
- Force-pushing to main
- Running untrusted network commands
- Modifying environment secrets

### Layer 3: Checkpoint Reviews

**Principle**: Human reviews code after each phase, before integration.

**Workflow**:
```
Phase 1: Agent implements feature
  ↓
Commit: feature/widget-v1 (agent makes clean commits)
  ↓
Code Review: Human reviews (can request changes)
  ↓
Approved
  ↓
Phase 2: Agent continues (if changes requested, agent iterates)
  ↓
Final Merge: Human approves, merges to main
```

**Checklist for humans reviewing agent code**:
- No hardcoded secrets
- No unexpected network calls
- Type checks pass
- Tests pass (don't assume agent's claims)
- Follows project patterns
- No scope creep

See `configs/review-checklist.md` for detailed checklist.

### Layer 4: Max Iteration Limits

**Principle**: Prevent infinite loops with a hard iteration cap.

**How**:
```bash
MAX_ITERATIONS=25 claude "Implement pagination utility with tests"
```

**What this does**:
- After 25 iterations, stops automatically
- Forces human to review progress
- Catches agents stuck in loops
- Prevents token waste

**When to set a low limit**:
- Complex refactors (use 20-30 iterations)
- Simple features (use 15-20 iterations)
- Small bug fixes (use 10 iterations)

### Layer 5: Emergency Stop

**Principle**: Kill switch for runaway agents.

**How**:
```bash
# If an agent is misbehaving:
Ctrl+C  # Stop execution immediately
git reset --hard HEAD  # Discard uncommitted changes
git branch -D bad-branch  # Delete the branch
```

**When to use**:
- Agent is making strange decisions
- Agent is deleting code that shouldn't be deleted
- Agent is making changes outside the scope
- Agent has been stuck for too long

## Handling Hallucinations

Agents sometimes "hallucinate"—they invent functions, imports, or patterns that don't exist.

**Detection**:
1. **At compile time**: TypeScript catches type mismatches
2. **At test time**: Tests fail when expected functions don't exist
3. **At review time**: Humans spot inconsistencies

**Prevention**:
1. **Detailed specs**: Give agents specific requirements
2. **Type safety**: Require TypeScript compilation
3. **Test coverage**: Make sure tests run for all code
4. **Code review**: Have humans verify logic

**Example**:
Agent writes:
```typescript
const user = await database.getUser(id);  // database doesn't exist!
```

**Caught by**:
```bash
npm run build
# Error: Cannot find module 'database'
# Agent fixes: const user = await userRepository.findById(id);
```

## Context Bloat

Large codebases exceed context windows. Agents get confused when they can't see the full picture.

**Prevention**:
1. **Summarize existing code**: Give agents overview, not full files
2. **Task-specific context**: Only include relevant files
3. **AGENTS.md**: Persistent memory across iterations
4. **Checkpoint commits**: Keep commits clean and reviewable

**Example of good context**:
```markdown
# Context for User Service Implementation

## Architecture
- Services: Business logic, validation
- Repositories: Data access
- Routes: HTTP handlers (thin wrappers)
- Types: Shared interfaces

## Key Files
- src/types.ts (50 lines) — User, ServiceResult types
- src/repositories/user-repository.ts (80 lines) — Data access
- src/routes/user-routes.ts (60 lines) — HTTP handlers

## Patterns
- All services return ServiceResult<T> = { data, error }
- Custom errors: ValidationError, NotFoundError
- Routes catch errors and convert to HTTP responses

## Your Task
Implement src/services/user-service.ts following these patterns.
```

## The "Trust But Verify" Workflow

**Trust**: Give agents autonomy to work

**Verify**: Review before merging

```
1. Agent Starts
   "Implement task X following these specs"
   ↓
2. Agent Works
   (commits, tests, iterates)
   ↓
3. Human Reviews
   git diff, npm test, code review
   ↓
4. Human Approves or Requests Changes
   If approved: merge
   If changes: agent iterates
   ↓
5. Merge & Deploy
   Code goes to production
```

## Files in This Demo

- `README.md` (this file)
- `configs/safe-settings.json` — Example restrictive settings
- `configs/review-checklist.md` — Checklist for humans reviewing agent code

## Getting Started

1. Review `configs/safe-settings.json` to understand permission boundaries
2. Read `configs/review-checklist.md` before reviewing agent code
3. Copy `safe-settings.json` to your project as `.claude/settings.json`
4. Customize permissions for your project
5. Use the checklist when reviewing agent pull requests

## Key Takeaway

Autonomous agents need guardrails: sandboxing, permission boundaries, checkpoint reviews, iteration limits, and an emergency stop. With these five layers, you can safely delegate code work to AI while maintaining control and quality standards.
