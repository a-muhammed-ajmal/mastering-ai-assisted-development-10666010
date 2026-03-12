# Agent Swarms — Parallel Coordination

## Overview

An **Agent Swarm** is a team of AI agents working on the same project simultaneously, coordinating via shared files in git rather than direct communication. Unlike subagents (which report to an orchestrator), swarm agents communicate with each other through a shared TASKS.md file and progress updates.

**Key difference from subagents**: Swarm agents can see each other's work in real-time and adjust their own work accordingly. Subagents work in isolation and report back.

## When to Use Swarms

Use swarms when:
- Multiple agents work on related tasks in parallel
- Tasks are somewhat interdependent (they need to see each other's progress)
- You want agents to collaborate and adjust course as needed
- The overall timeline is tight (parallel >> sequential)

Don't use swarms when:
- Tasks are completely independent (use subagents)
- Tasks are heavily interdependent (need more coordination, use interactive)
- The codebase is small enough for one agent

## The Team Structure

A swarm typically has:

1. **Team Lead** — Oversees progress, resolves conflicts, makes decisions
2. **Agent A** — Specialized in Component Area 1
3. **Agent B** — Specialized in Component Area 2
4. **Agent C** — Specialized in Component Area 3 (tests, documentation, etc.)

All agents:
- Share a git repository
- Monitor TASKS.md for assignments and status
- Update PROGRESS.md as they work
- Make atomic commits for each feature
- Watch git log to see what others are doing

## Coordination via TASKS.md

TASKS.md is the source of truth. It tracks:

```markdown
# Task Board

## In Progress
- [ ] **Agent A**: Component 1 (Button, Input, Select)
- [ ] **Agent B**: Component 2 (Modal, Toast)
- [ ] **Agent C**: Test suite for all components

## Conventions (All Agents Follow)
- TypeScript, functional components
- Named exports
- Tailwind CSS for styling
- Each component in ComponentName.tsx
- Tests in tests/ComponentName.test.tsx

## Completed
- [x] **Agent A**: Setup project structure
- [x] **Agent B**: Create types/interfaces

## Blocked/Issues
(nothing yet)
```

All agents check this file multiple times during their work. It's the coordination hub.

## Communication via PROGRESS.md

Agents log their progress in real-time:

```markdown
# Progress Log

## Agent A (Components - Buttons, Inputs, Selects)
- 09:00 — Started Button component
- 09:15 — Button tests passing, committed
- 09:30 — Started Input component
- 09:45 — Input component done, tests passing, committed
- 10:00 — Testing found reusable pattern, updating both components
- 10:15 — Refactor complete, all tests passing, committed

## Agent B (Components - Modal, Toast)
- 09:00 — Started Modal component
- 09:20 — Modal needs types from shared. Waiting on Agent C.
- 09:30 — Agent C updated types, now I can continue.
- 10:00 — Modal complete, tests passing, committed

## Agent C (Tests)
- 09:00 — Created shared test utilities
- 09:15 — Created types/interfaces.ts
- 09:30 — Started writing tests for Agent A's components
- 10:00 — 50% of tests done, writing Toast tests next
```

Agents can see blockers, dependencies, and progress at a glance.

## The Three-Phase Swarm Workflow

### Phase 1: Planning (Team Lead)
- Define the overall goal (e.g., "build component library")
- Break work into agent assignments
- Create TASKS.md with all tasks
- Define conventions and patterns
- Create starter directory structure

### Phase 2: Parallel Work (All Agents)
- Each agent claims their task in TASKS.md
- Agents implement in parallel
- Agents monitor TASKS.md and PROGRESS.md for dependency updates
- Agents commit frequently (e.g., after each component)
- If blocked, agents flag it in PROGRESS.md
- Team Lead resolves blockers when asked

### Phase 3: Integration (Team Lead)
- All agents finish their work
- Team Lead reviews git log and all commits
- Team Lead runs full test suite
- Team Lead resolves any merge conflicts
- Team Lead creates final merge commit

## Real Example: React Component Library

### Phase 1: Planning

Team Lead creates TASKS.md:

```markdown
# React Component Library — Task Board

## Task Assignments

### Agent A: Form Components
- [ ] Button component (with variants: primary, secondary, danger)
- [ ] Input component (with labels, validation, placeholders)
- [ ] Select component (with options, multi-select variant)

### Agent B: Dialog Components
- [ ] Modal component (header, footer, close button)
- [ ] Toast/Alert component (success, error, warning)
- [ ] Dropdown component (with keyboard navigation)

### Agent C: Tests & Polish
- [ ] Unit tests for all components (80%+ coverage)
- [ ] Storybook stories for all components
- [ ] README with usage examples

## Conventions (All Agents Must Follow)
- TypeScript with strict mode
- Functional components with hooks
- Named exports (not default export)
- Props interfaces named `${ComponentName}Props`
- Tailwind CSS for styling (no inline styles)
- Each component in src/components/${ComponentName}.tsx
- Tests mirror structure: tests/${ComponentName}.test.tsx
- No external state management (Props only, for now)

## Completed
- [x] Project setup with TypeScript, Jest, Tailwind
- [x] Created src/components/ and tests/ directories

## In Progress
- [ ] **Agent A**: Form components (starting now)
- [ ] **Agent B**: Dialog components (starting now)
- [ ] **Agent C**: Tests and Storybook (starting now)

## Blocked/Issues
(none yet)
```

### Phase 2: Parallel Work

**Agent A** (Form Components):
```bash
# Day 1, Hour 1
npm run test:watch  # Watch for test failures
# Implement Button component
git commit -m "feat: Button component with primary/secondary/danger variants"

# Day 1, Hour 2
# Implement Input component
git commit -m "feat: Input component with validation and label support"

# Day 1, Hour 3
# Implement Select component
git commit -m "feat: Select component with multi-select variant"
# Add to PROGRESS.md: "Agent A - All 3 form components done, tests passing"
```

**Agent B** (Dialog Components):
```bash
# Day 1, Hour 1
# Start Modal, realize need to coordinate types with Agent C
# Add to PROGRESS.md: "Agent B - Blocked on type definitions, need Modal Props interface"

# Day 1, Hour 2
# Agent C updates types, sees the request
# Agent C adds Modal, Toast, Dropdown types
# Agent B continues with Modal implementation
git commit -m "feat: Modal component with header/footer support"

# Day 1, Hour 3
# Continue with Toast
git commit -m "feat: Toast/Alert component with success/error/warning variants"
```

**Agent C** (Tests & Documentation):
```bash
# Day 1, Hour 1
# Create test utilities and shared types
git commit -m "test: shared test utilities and component types"

# Day 1, Hour 2
# See Agent A and B making commits
# Start testing Agent A's components
# Also see Agent B's blocker about types
# Quickly create type definitions
git commit -m "types: Modal, Toast, Dropdown prop interfaces"

# Day 1, Hour 3
# Continue with test suite
git commit -m "test: Button and Input unit tests (80% coverage)"
```

### Phase 3: Integration

Team Lead reviews progress:

```bash
git log --oneline -20
# Shows all commits from the three agents

npm test
# All tests pass (Agent C made sure of it)

git diff main...HEAD
# Shows all changes in the feature branch

npm run build
# Clean build, no errors
```

Everything looks good, so Team Lead creates final commit:

```bash
git checkout main
git merge component-library
git commit -m "feat: React component library with 12 components

Delivered via parallel agent swarm:
- Agent A: 3 form components (Button, Input, Select)
- Agent B: 3 dialog components (Modal, Toast, Dropdown)
- Agent C: Comprehensive tests (85% coverage) and documentation

All tests passing, clean build, ready for production."
```

## Handling Conflicts in Swarms

### File Conflicts (Rare, If Design is Good)

**Problem**: Agent A and Agent B both edit src/components/index.ts

**Solution**: Each agent adds their own exports to a single file.

```typescript
// src/components/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';
// Agent B's exports below
export { Modal } from './Modal';
export { Toast } from './Toast';
export { Dropdown } from './Dropdown';
```

Git handles this as a simple merge (both adds).

### Logic Conflicts (Catch Early)

**Problem**: Agent A uses `handleClick` in Button, Agent B expects `onClick` in the same file.

**Solution**: TASKS.md defines conventions BEFORE work starts. Agents follow conventions.

If conflicts arise:
1. Flag in PROGRESS.md immediately
2. Team Lead resolves (e.g., "use onClick everywhere")
3. Affected agents update their code

### Dependency Conflicts (Communicate)

**Problem**: Agent A's component needs a utility from Agent B.

**Solution**: Agents monitor git log and PROGRESS.md.

When Agent A needs something:
1. Add to PROGRESS.md: "Agent A waiting on utility X from Agent B"
2. Agent B sees this and prioritizes
3. Agent B implements and commits utility
4. Agent A continues with their work

## Monitoring Swarm Health

**Good signs**:
- Multiple commits per hour (agents making progress)
- Commits are atomic and descriptive
- PROGRESS.md shows forward momentum
- No blockers lasting >15 minutes

**Bad signs**:
- Few commits, long gaps (agents stuck)
- Merge conflicts appearing
- PROGRESS.md not updated (agents not communicating)
- Agents working on the same file (poor task division)

## Files in This Demo

- `README.md` (this file)
- `TASKS.md` — Task board with assignments
- `PROGRESS.md` — Real-time progress log (agents update this)
- `src/components/Button.tsx` — Example completed component
- `tests/Button.test.tsx` — Example completed tests
- `package.json` — Build configuration

## Getting Started

1. Review `TASKS.md` to understand the assignments
2. Review `PROGRESS.md` to see how agents log progress
3. Study the example Button component in `src/components/Button.tsx`
4. Study the example tests in `tests/Button.test.tsx`
5. Give Claude the swarm prompt (instructions for acting as multiple agents)
6. Watch as Claude acts as Agent A, B, C in parallel

## Key Differences: Swarms vs. Subagents

| Aspect | Subagents | Swarms |
|--------|-----------|--------|
| **Communication** | Agent → Orchestrator | Agent ↔ Agent (via shared files) |
| **Coordination** | Orchestrator decides | Agents self-coordinate |
| **Task Dependencies** | Independent | Interdependent, communicating |
| **Timeline** | Sequential (faster for small tasks) | Parallel (faster for large tasks) |
| **Complexity** | Lower (simpler oversight) | Higher (need good conventions) |
| **Scalability** | Up to 3 agents max | Up to 10 agents (with good structure) |

## Key Takeaway

Swarms are for teams of agents working collaboratively on a large, decomposable task. They communicate through shared files (TASKS.md, PROGRESS.md) and git commits. If you design clear boundaries and conventions upfront, swarms can deliver complex features in parallel with minimal overhead.
