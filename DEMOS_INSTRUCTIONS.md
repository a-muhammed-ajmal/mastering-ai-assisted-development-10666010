# Demo Walkthrough Instructions

Step-by-step guide for every demo in Mastering AI-Assisted Development. Each section includes setup, prompts, what to show on screen, and key talking points.

## General Setup

```bash
# Install all dependencies at once
./setup.sh

# Or individually
cd <demo-dir> && npm install
```

**Terminal Setup for Recording:** Use a dark theme, 18pt+ font, and clear your terminal history before each recording. Split pane: left = Claude Code, right = file explorer or browser.

---

## Chapter 1: Advanced Vibe Coding

### 1.1 — What's Possible: Advanced Vibe Coding
**Demo:** `1.1-demo-orchestrator-intro`
**Start from:** `1.1-demo-orchestrator-intro-clean`

1. Open the clean directory and show the `CLAUDE.md` spec file
2. Point out: technology constraints (Three.js CDN), visual requirements (desert terrain, low-poly animals), performance target (60 FPS)
3. Run Claude Code: paste the spec or say "Build the Three.js scene described in CLAUDE.md"
4. Watch the AI generate 400+ lines of index.html
5. Open in browser — show the interactive 3D scene with the animal count slider
6. **Key talking point:** The AI made hundreds of micro-decisions (geometry, colors, animation curves) — that's vibe coding

### 1.2 — Claude Code Power User Setup
**Demo:** `1.2-demo-power-user-setup`
**Start from:** `1.2-demo-power-user-setup-clean`

1. Show the Express app and tests (no .claude/ directory yet)
2. Create `.claude/hooks.json` — add auto-lint on file write, auto-test on commit
3. Create `.claude/settings.json` — add permission allowlists
4. Create `.claude/commands/review.md` — custom slash command
5. Demonstrate each feature: write a file (lint triggers), commit (tests run), type /review
6. **Key talking point:** These small optimizations compound — hooks, memory, slash commands

### 1.3 — Building Impressive Projects Fast
**Demo:** `1.3-demo-showcase-projects`
**Start from:** `1.3-demo-showcase-projects-clean`

1. Show the three PROMPT.md files — game, landing page, dashboard
2. Pick one (the retrowave game is most visual) and run Claude Code with the spec
3. Open the result in a browser — 3D racing game with neon grid and keyboard controls
4. Briefly show the other two outputs (landing page with animations, dashboard with Chart.js)
5. **Key talking point:** The pattern — technology constraints + visual references + interaction model = reliable vibe coding

---

## Chapter 2: Agent Skills Deep Dive

### 2.1 — Agent Skills: The Frontend Design Skill
**Demo:** `2.1-demo-frontend-design-skill`
**Start from:** `2.1-demo-frontend-design-skill-clean`

1. Open `before/index.html` in a browser — show the generic, forgettable landing page
2. Point out the "AI slop" markers: Inter font, purple gradient, white background, boring layout
3. Open `.claude/skills/frontend-design.md` — walk through the skill structure: Purpose, Core Principles, Anti-Patterns
4. Ask Claude: "Apply the frontend design skill to transform before/index.html into a polished page"
5. Open the result (or show `after/index.html`) — dramatic transformation: Google Fonts, CSS variables, staggered animations, glassmorphic effects
6. **Key talking point:** One skill file, 277K+ installs, transforms every UI Claude generates

### 2.2 — The PPTX Skill & Writing Your Own
**Demo:** `2.2-demo-pptx-skill-authoring`
**Start from:** `2.2-demo-pptx-skill-authoring-clean`

1. Open `.claude/skills/pptx-presentation.md` — study the skill structure
2. Open `.claude/skills/api-design.md` — this is the skill we'll walk through writing
3. Show `examples/api-before/server.ts` — messy API with 10+ anti-patterns
4. Walk through the API Design skill's principles: RESTful conventions, error handling, pagination, status codes
5. Show `examples/api-after/server.ts` — the same API transformed by following the skill
6. Reference `SKILL_AUTHORING_GUIDE.md` for the complete guide to writing your own
7. **Key talking point:** Five sections make a skill: Purpose, Principles, Patterns, Anti-Patterns, Checklist

### 2.3 — Hooks & Automation
**Demo:** `2.3-demo-hooks-automation`
**Start from:** `2.3-demo-hooks-automation-clean`

1. Show the Express project (no .claude/ directory)
2. Create `.claude/hooks.json` with four hooks: auto-lint, auto-test, block dangerous commands, notifications
3. Make a file change — show auto-lint triggering
4. Try a dangerous command — show the block hook preventing it
5. Commit — show auto-tests running
6. **Key talking point:** Skills tell Claude HOW to code; Hooks verify AFTER — together they form a quality feedback loop

---

## Chapter 3: MCP — Extending Your Agent

### 3.1 — MCP & Context7 — Live Documentation
**Demo:** `3.1-demo-context7-mcp`
**Start from:** `3.1-demo-context7-mcp-clean`

1. Explain MCP: "USB-C for AI" — universal interface between Claude and external tools
2. Show `.claude/settings.json` with Context7 configured
3. Setup: `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest`
4. Ask Claude: "Create a Next.js middleware that checks for JWT in cookies. use context7"
5. Watch Claude call resolve-library-id, then fetch-documentation, then generate code using CURRENT APIs
6. Show the result vs what Claude would have generated without Context7 (outdated APIs)
7. **Key talking point:** Context7 keeps Claude current — no more hallucinated APIs

### 3.2 — Chrome DevTools MCP — Browser Debugging
**Demo:** `3.2-demo-devtools-mcp`
**Start from:** `3.2-demo-devtools-mcp-clean`

1. Start the debug app: `cd examples/debug-app && node server.js`
2. Open localhost:3000 in Chrome
3. Show `.claude/settings.json` with DevTools MCP configured
4. Ask Claude: "Take a screenshot of localhost:3000 and analyze the page for issues"
5. Watch Claude identify layout thrashing, console errors, slow API calls, unoptimized images
6. Ask Claude: "Run a performance trace and identify the top 3 performance issues"
7. **Key talking point:** Claude can now SEE your app, not just read your code

### 3.3 — Building a Custom MCP Server
**Demo:** `3.3-demo-custom-mcp-server`
**Start from:** `3.3-demo-custom-mcp-server-clean`

1. Show the MCP SDK boilerplate (stub server.ts)
2. Build three tools: get-feature-flag, check-service-health, list-feature-flags
3. Each tool uses Zod for input validation and returns structured JSON
4. Register in `.claude/settings.json`
5. Ask Claude: "Is the dark-mode feature flag enabled?" — watch it call the MCP tool
6. **Key talking point:** MCP turns Claude from a code-only tool into a system-aware agent

---

## Chapter 4: Autonomous Agent Patterns

### 4.1 — The RALPH Loop
**Demo:** `4.1-demo-ralph-loop`
**Start from:** `4.1-demo-ralph-loop-clean`

1. Show the spec and test file (7 tests) — no implementation yet
2. Explain RALPH: Request → Act → Log → Persist → Handle-next
3. Run Claude Code with the spec — watch it iterate: implement → test → fix → log in AGENTS.md → repeat
4. Show AGENTS.md building up with learnings from each cycle
5. All 7 tests pass after multiple iterations
6. **Key talking point:** AGENTS.md is the breakthrough — persistent memory across iterations

### 4.2 — The Beads Pattern
**Demo:** `4.2-demo-beads-pattern`
**Start from:** `4.2-demo-beads-pattern-clean`

1. Show the three-bead spec: CSV parsing → validation → deduplication
2. Each bead has its own test file
3. Watch Claude implement bead 1 (parser), run its tests, commit
4. Then bead 2 (validator), test, commit. Then bead 3 (deduplicator), test, commit
5. If bead 3 fails, beads 1 and 2 are safely committed
6. **Key talking point:** Atomic commits mean partial progress is preserved

### 4.3 — Multi-Phase Planning
**Demo:** `4.3-demo-multi-phase-planning`
**Start from:** `4.3-demo-multi-phase-planning-clean`

1. Show the monolithic routes.ts (150+ lines of mixed concerns)
2. Show the migration plan: 5 phases with checkpoints
3. Watch Claude work through: plan → scaffold file structure → implement repositories → implement services → implement routes → integrate
4. Compare before (one file, mixed concerns) vs after (clean architecture with separation)
5. **Key talking point:** Checkpoint commits at each phase boundary — safe rollback

---

## Chapter 5: The Orchestrator Paradigm

### 5.1 — From Conductor to Orchestrator
**Demo:** `5.1-demo-orchestrator-paradigm` (conceptual — no clean version)

1. This is primarily a talking head + slides video
2. Show the README with the three paradigms comparison
3. Walk through modern orchestrator tools: Copilot Agent, Jules, Codex, Claude Code for Web, Cursor Background Agents
4. **Key talking point:** Conductors guide one agent step-by-step; orchestrators define goals and review PRs

### 5.2 — Subagents
**Demo:** `5.2-demo-subagents`
**Start from:** `5.2-demo-subagents-clean`

1. Show the feature spec for an invitation service
2. The orchestration script defines three subagents: data layer, business logic, API layer
3. Watch the parent spawn each subagent, collect outputs, integrate
4. 13 passing tests at the end
5. **Key talking point:** Define clear interfaces upfront so subagents work independently

### 5.3 — Agent Swarms
**Demo:** `5.3-demo-agent-swarms`
**Start from:** `5.3-demo-agent-swarms-clean`

1. Show TASKS.md with 6 components and agent assignments
2. Watch multiple agents claim tasks, implement components, update PROGRESS.md
3. Complete component library with 50+ tests
4. **Key talking point:** File-based coordination (TASKS.md, PROGRESS.md) is the simplest parallel pattern

### 5.4 — Fullstack App with Agent Teams
**Demo:** `5.4-demo-fullstack-agent-team`
**Start from:** `5.4-demo-fullstack-agent-team-clean`

1. Show the spec and shared types (the contract between agents)
2. Three agents: backend (Express routes), frontend (React components), testing
3. Walk through the complete app: API with auth, React with state management, test coverage
4. **Key talking point:** Shared types file is the interface contract — agree upfront, work independently

---

## Chapter 6: Production Workflows

### 6.1 — AI-Powered CI/CD Pipelines
**Demo:** `6.1-demo-cicd-workflows`
**Start from:** `6.1-demo-cicd-workflows-clean`

1. Show two GitHub Actions workflows: ai-code-review.yml and test-coverage-gap.yml
2. Walk through how they trigger Claude to review PRs and analyze coverage
3. Show the example code with intentional coverage gaps
4. **Key talking point:** Start advisory (comments only), gradually increase strictness

### 6.2 — Risk Management & Human Oversight
**Demo:** `6.2-demo-risk-management` (no clean version — configs ARE the deliverable)

1. Walk through safe-settings.json: permission allowlists and denylists
2. Walk through review-checklist.md: 30-point AI code review checklist
3. **Key talking point:** Autonomous doesn't mean unsupervised — agents submit PRs, you review

### 6.3 — Scaling AI Development Across Teams
**Demo:** `6.3-demo-team-scaling` (no clean version — templates ARE the deliverable)

1. Walk through the CLAUDE.md template — standardized starting point for every project
2. Show how Skills compose: frontend-design + component-library + testing = comprehensive quality stack
3. **Key talking point:** Start with one skill file — the compound effect will surprise you

---

## Recording Tips

- **Pacing:** Pause 2-3 seconds after each significant output before explaining
- **Failures:** Don't cut failures — they're teaching moments. Show how the agent recovers
- **Terminal:** Dark theme, large font (18pt+), clear history before recording
- **Browser:** Full screen, hide bookmarks bar, use a clean profile
- **Split screen:** Left = Claude Code terminal, Right = browser or file explorer
- **Branch strategy:** For LinkedIn Learning, create `CHAPTER#_MOVIE#_b` and `CHAPTER#_MOVIE#_e` branches
