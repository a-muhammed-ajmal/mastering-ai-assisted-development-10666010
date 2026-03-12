# Changelog

## [3.0.0] — 2026-03-10: Skills & MCP Deep Dive Expansion

### Why This Changed

The previous structure crammed Skills, MCP, and Hooks into a single chapter (old Chapter 2). User feedback indicated that Skills and MCP each deserved deeper coverage with real-world examples rather than a surface-level introduction.

### What Changed

**Chapter 2: "Customizing Your Agent" → "Agent Skills Deep Dive"**
- **2.1** expanded from generic skills to the **Frontend Design Skill** specifically — before/after walkthrough showing a generic "AI slop" page transformed into a polished, professional interface
- **2.2** is now **The PPTX Skill & Writing Your Own** — study the PPTX presentation skill, understand skill anatomy, then write a custom API Design skill from scratch
- **2.3** Hooks & Automation stays as-is

**NEW Chapter 3: "MCP — Extending Your Agent"** (previously part of old Chapter 2)
- **3.1** MCP & Context7 — Live Documentation: use Context7 MCP to pull up-to-date library docs (Next.js 15, Supabase realtime)
- **3.2** Chrome DevTools MCP — Browser Debugging: screenshots, console, network inspection, performance traces
- **3.3** Building a Custom MCP Server: the old 2.2 MCP demo, renumbered (feature flags, service health)

**All subsequent chapters renumbered:**
- Old Chapter 3 (Autonomous Patterns) → Chapter 4
- Old Chapter 4 (Orchestrator Paradigm) → Chapter 5
- Old Chapter 5 (Production Workflows) → Chapter 6

### Demo Directory Changes

| Old | New | Notes |
|-----|-----|-------|
| 2.1-demo-agent-skills | 2.1-demo-frontend-design-skill | Rebuilt with before/after HTML, frontend-design.md skill |
| 2.2-demo-mcp-server | 3.3-demo-custom-mcp-server | Moved to MCP chapter |
| — | 2.2-demo-pptx-skill-authoring | NEW: PPTX skill + API design skill authoring |
| — | 3.1-demo-context7-mcp | NEW: Context7 MCP with Next.js and Supabase examples |
| — | 3.2-demo-devtools-mcp | NEW: Chrome DevTools MCP with debug app |
| 3.x demos | 4.x demos | Renumbered |
| 4.x demos | 5.x demos | Renumbered |
| 5.x demos | 6.x demos | Renumbered |

### New Course Structure (6 chapters, 21 videos)

```
Chapter 1: Advanced Vibe Coding (unchanged)
  1.1 What's Possible: Advanced Vibe Coding
  1.2 Claude Code Power User Setup
  1.3 Building Impressive Projects Fast

Chapter 2: Agent Skills Deep Dive (expanded from old 2.1)
  2.1 Agent Skills: The Frontend Design Skill (NEW)
  2.2 The PPTX Skill & Writing Your Own (NEW)
  2.3 Hooks & Automation (unchanged)

Chapter 3: MCP — Extending Your Agent (NEW chapter)
  3.1 MCP & Context7 — Live Documentation (NEW)
  3.2 Chrome DevTools MCP — Browser Debugging (NEW)
  3.3 Building a Custom MCP Server (was 2.2)

Chapter 4: Autonomous Agent Patterns (was Ch 3)
  4.1 The RALPH Loop (was 3.1)
  4.2 The Beads Pattern (was 3.2)
  4.3 Multi-Phase Planning (was 3.3)

Chapter 5: The Orchestrator Paradigm (was Ch 4)
  5.1 From Conductor to Orchestrator (was 4.1)
  5.2 Subagents (was 4.2)
  5.3 Agent Swarms (was 4.3)
  5.4 Fullstack App with Agent Teams (was 4.4)

Chapter 6: Production Workflows (was Ch 5)
  6.1 AI-Powered CI/CD (was 5.1)
  6.2 Risk Management (was 5.2)
  6.3 Scaling Across Teams (was 5.3)
```

### Scripts

21 scripts regenerated (was 18): 2 intro + 19 chapter videos.

New scripts:
- Script_2_1_Skills_Frontend_Design.docx
- Script_2_2_PPTX_Skill_Writing_Your_Own.docx
- Script_3_1_MCP_Context7.docx
- Script_3_2_DevTools_MCP.docx
- Script_3_3_Custom_MCP_Server.docx

All remaining scripts renumbered to match new chapter numbering.

---

## [2.0.0] — 2026-03-10: Complete Course Restructure

### Why This Changed

The first half of the original course (Chapters 1–2) overlapped significantly with *AI-Native Engineering Foundations* (Course 1). Specifically:

- **1.1 Context at Scale** rehashed CLAUDE.md and project context concepts already taught in Course 1 (Video 5.1)
- **1.2 Writing Specs AI Can Execute** repeated the spec-driven approach from Course 1 (Video 4.1 — vague vs. detailed prompts)
- **1.3 Context Pipelines** extended context management ideas already covered in Course 1 (Videos 4.2, 5.1)

The differentiated material — MCP servers, Skills, agent loops, and CI/CD — didn't appear until Chapter 3 or later. Students coming from Course 1 would spend the first 30+ minutes reviewing familiar concepts.

### Design Principles for the Restructure

1. **No rehash** — assume students know prompting patterns, CLAUDE.md, iterative refinement, and spec-driven development from Course 1
2. **Impressive projects up front** — show what orchestration can achieve *before* diving into how it works
3. **Claude Code pro tips throughout** — hooks, subagents, parallel sessions, and power-user workflows woven into every chapter
4. **New advanced content** — multi-agent teams, swarms, subagents, risk management, and team scaling
5. **Fun, visual demos** — Three.js scenes, racing games, landing pages, and fullstack apps replace utility-library examples

### Removed (Redundant with Course 1)

| Old Video | Topic | Covered In Course 1 |
|-----------|-------|---------------------|
| 1.1 Context at Scale | CLAUDE.md for large codebases | 5.1 Context API |
| 1.2 Notification Spec | Writing specs AI can execute | 4.1 Effective Prompts (vague vs. detailed) |
| 1.3 Context Pipelines | Automated context generation | 4.2 Prompt Patterns, 5.1 Context API |

### Renumbered (Moved Earlier)

| Old Location | New Location | Topic |
|-------------|-------------|-------|
| 4.1-demo-agent-skills | 2.1-demo-agent-skills | Agent Skills framework |
| 3.1-demo-mcp-server | 2.2-demo-mcp-server | MCP Servers |
| 5.1-demo-ralph-loop | 3.1-demo-ralph-loop | RALPH autonomous loop |
| 5.2-demo-beads-pattern | 3.2-demo-beads-pattern | Beads modular chains |
| 6.1-demo-cicd-workflows | 5.1-demo-cicd-workflows | AI-powered CI/CD |

### Added (New Content)

| Video | Topic | What's New |
|-------|-------|-----------|
| **1.1** Orchestrator Intro | Mindset shift + Three.js showcase | From "help me code" to "build this for me" — single-prompt Three.js animal herd |
| **1.2** Power User Setup | Claude Code pro tips deep dive | Hooks, slash commands, model switching, AGENTS.md, parallel sessions, settings |
| **1.3** Showcase Projects | Three impressive builds | Retrowave racing game, marketing landing page, analytics dashboard |
| **2.3** Hooks & Automation | Quality automation | PreToolUse/PostToolUse hooks, auto-lint, auto-test, dangerous command blocking |
| **3.3** Multi-Phase Planning | Large refactor strategy | 5-phase migration: Plan → Scaffold → Implement → Test → Integrate |
| **4.1** Subagents | Specialist delegation | Research, testing, and documentation subagents with orchestrator coordination |
| **4.2** Agent Swarms | Parallel coordination | Team lead + teammates, shared TASKS.md, parallel component development |
| **4.3** Fullstack Agent Team | Capstone project | React + Express + Supabase task manager built by coordinated agent team |
| **5.2** Risk Management | Safety guardrails | Sandboxing, permissions, checkpoints, max iterations, emergency stops |
| **5.3** Team Scaling | Organizational adoption | Shared conventions, skill libraries, MCP catalogs, governance, metrics |

### New Course Structure

```
Chapter 1: Advanced Vibe Coding
  1.1 What's Possible: Advanced Vibe Coding (NEW)
  1.2 Claude Code Power User Setup (NEW)
  1.3 Building Impressive Projects Fast (NEW)

Chapter 2: Customizing Your Agent (Conductor Mindset)
  2.1 Agent Skills (was 4.1 — moved earlier)
  2.2 MCP Servers (was 3.1 — moved earlier)
  2.3 Hooks & Automation (NEW)

Chapter 3: Autonomous Agent Patterns
  3.1 The RALPH Loop (was 5.1 — enhanced with AGENTS.md)
  3.2 The Beads Pattern (was 5.2 — enhanced)
  3.3 Multi-Phase Planning (NEW)

Chapter 4: The Orchestrator Paradigm
  4.1 From Conductor to Orchestrator (NEW — conceptual intro)
  4.2 Subagents (NEW)
  4.3 Agent Swarms (NEW)
  4.4 Fullstack App with Agent Teams (NEW)

Chapter 5: Production Workflows
  5.1 AI-Powered CI/CD (was 6.1 — moved)
  5.2 Risk Management & Human Oversight (NEW)
  5.3 Scaling AI Development Across Teams (NEW)
```

### Old → New Mapping (Complete)

| Old | New | Status |
|-----|-----|--------|
| 1.1-demo-context-at-scale | — | Removed (redundant) |
| 1.2-demo-notification-spec | — | Removed (redundant) |
| 1.3-demo-context-pipelines | — | Removed (redundant) |
| 3.1-demo-mcp-server | 2.2-demo-mcp-server | Renumbered + enhanced README |
| 4.1-demo-agent-skills | 2.1-demo-agent-skills | Renumbered + enhanced README |
| 5.1-demo-ralph-loop | 3.1-demo-ralph-loop | Renumbered + added AGENTS.md |
| 5.2-demo-beads-pattern | 3.2-demo-beads-pattern | Renumbered + enhanced README |
| 6.1-demo-cicd-workflows | 5.1-demo-cicd-workflows | Renumbered + enhanced README |
| — | 1.1-demo-orchestrator-intro | New |
| — | 1.2-demo-power-user-setup | New |
| — | 1.3-demo-showcase-projects | New |
| — | 2.3-demo-hooks-automation | New |
| — | 3.3-demo-multi-phase-planning | New |
| — | 4.1-demo-subagents | New |
| — | 4.2-demo-agent-swarms | New |
| — | 4.3-demo-fullstack-agent-team | New |
| — | 5.2-demo-risk-management | New |
| — | 5.3-demo-team-scaling | New |

### Demo File Counts

- **Old structure:** 8 demos across 6 chapters (with 3 redundant)
- **New structure:** 15 demos across 5 chapters (10 new, 5 enhanced)
- **Net new content:** 10 entirely new demo directories
- **Redundant content removed:** 3 directories

### Key Sources for New Content

The new material draws from:
- `claude-code-pro-tips/` — Claude Code power user techniques, hooks, subagents
- `ai-coding/claude-code/claude-code-pro-tips.md` — Comprehensive playbook for Claude Code
- `ai-coding/addys-posts/2026-02-05-claude-code-agent-teams.md` — Agent teams and swarms
- `ai-coding/addys-posts/2026-01-31-self-improving-agents.md` — RALPH loop and autonomous patterns
- `ai-coding/addys-posts/2026-02-04-agentic-engineering.md` — Agentic engineering mindset
- `ai-coding/addys-posts/2026-01-02-future-agentic-coding.md` — Conductor vs. orchestrator paradigm

---

## [2.0.1] — 2026-03-10: Course Content Alignment

Updated all course-content materials (scripts, TOC, handouts, articles) to align with the restructured demo directories.

### TOC (Table of Contents)

- **Replaced** `Mastering_Agentic_Engineering_DRAFT_PTOC.xlsx` with new version reflecting all 17 videos across 5 chapters
- Columns: Chapter, Video, Title, Duration, Format, Learning Objective, Demo Project, Status
- Status column tracks which videos are New, Updated, or Moved from old numbering

### Scripts (Video Lecture Scripts)

**Removed 19 old scripts** aligned to the previous 7-chapter structure.

**Kept and renumbered 4 scripts:**
- Script_4_1 → Script_2_1_Agent_Skills_Packaging_Expertise.docx
- Script_5_1 → Script_3_1_The_Ralph_Loop_Self_Improving_Agents.docx
- Script_5_2 → Script_3_2_The_Beads_Pattern_Modular_Agent_Chains.docx
- Script_6_2 → Script_5_1_AI_Powered_CICD_Pipelines.docx

**Created 13 new scripts:**
- Script_0_1_Leveling_Up_Your_AI_Workflow.docx (updated for new structure)
- Script_0_2_Course_Overview.docx (updated for new structure)
- Script_1_1_From_Assistant_to_Orchestrator.docx
- Script_1_2_Claude_Code_Power_User_Setup.docx
- Script_1_3_Building_Impressive_Projects_Fast.docx
- Script_2_2_MCP_Servers_Extending_Your_Agent.docx (consolidated from old 3.1-3.3)
- Script_2_3_Hooks_and_Automation.docx
- Script_3_3_Multi_Phase_Planning_Large_Refactors.docx
- Script_4_1_Subagents_Delegating_to_Specialists.docx
- Script_4_2_Agent_Swarms_Parallel_Coordination.docx
- Script_4_3_Fullstack_App_with_Agent_Teams.docx
- Script_5_2_Risk_Management_Human_Oversight.docx
- Script_5_3_Scaling_AI_Development_Across_Teams.docx

**Total: 17 scripts** (2 intro + 15 chapter videos), each with: learning objective, voiceover script, screencast directions table, and demo walkthrough.

### Exercise Handouts

- **Removed** Handout_Spec_Writing_Template.docx (covered in Course 1)
- **Kept** 4 existing handouts (CI/CD, Resources, MCP Config, Skill Authoring)
- **Added** Handout_Claude_Code_Pro_Tips_Reference.docx (new)
- **Added** Handout_Agent_Patterns_Quick_Reference.docx (new)

### Text Articles

- **Removed** Article_01 (Spec Writing) and Article_02 (Context Strategies) — covered in Course 1
- **Renumbered** remaining 10 articles (03→01, 04→02, etc.)
- **Added** Article_11_Multi_Agent_Orchestration_Patterns.docx (new)
- **Added** Article_12_Claude_Code_Hooks_Complete_Guide.docx (new)

### Learning Bites

- **Kept** Learning_Bite_The_Ralph_Loop.docx (still relevant for Ch 3.1)
- **Kept** Learning_Bite_Alternatives.docx (still relevant)

---

## [2.1.0] — 2026-03-10: Conductor vs Orchestrator Reframing

### Problem

The previous restructure conflated "orchestration" with "advanced vibe coding." Chapter 1 was titled "The Orchestrator Mindset" and framed single-prompt Three.js demos as orchestration — but these are fundamentally single-agent, single-prompt workflows. That's advanced vibe coding, not orchestration.

**Orchestration** has a specific, important meaning: coordinating multiple autonomous agents working in parallel, asynchronously — like a tech lead delegating to a team of AI developers and reviewing their pull requests.

### The Three Paradigms

The course now explicitly teaches three paradigms:

1. **Advanced Vibe Coding** (Chapter 1) — Push single-prompt, single-agent development to its limits. Impressive results from well-crafted specs.
2. **Conductor** (Chapters 2-3) — One AI "musician," deeply enhanced with Skills, MCP, Hooks, and autonomous patterns (RALPH, Beads). You guide a single powerful agent.
3. **Orchestrator** (Chapter 4) — A symphony of multiple AI agents working in parallel. You set high-level goals, agents execute independently, and you review the output as pull requests.

### Changes Made

**Chapter 1: "The Orchestrator Mindset" → "Advanced Vibe Coding"**
- 1.1 renamed from "From Assistant to Orchestrator" to "What's Possible: Advanced Vibe Coding"
- All "orchestrator" language removed from Chapter 1 demos, scripts, and READMEs
- Three.js demos reframed as spec-driven vibe coding (the AI makes hundreds of autonomous micro-decisions, but you're still working with one agent)

**Chapter 2: Added "Conductor Mindset" subtitle**
- Explicitly positioned as the conductor paradigm: one AI agent, deeply enhanced

**Chapter 4: "Multi-Agent Teams & Orchestration" → "The Orchestrator Paradigm"**
- NEW Video 4.1: "From Conductor to Orchestrator" — conceptual video covering:
  - The conductor ceiling: one agent, one context window, sequential work
  - The orchestrator shift: multiple autonomous agents, parallel execution, async workflows
  - Key characteristics: agents have full agency (clone repos, create branches, edit files, run tests)
  - Modern tools: GitHub Copilot Coding Agent, Google Jules, OpenAI Codex, Claude Code for Web, Cursor Background Agents
- Old 4.1 (Subagents) → 4.2
- Old 4.2 (Swarms) → 4.3
- Old 4.3 (Fullstack Team) → 4.4
- New demo directory: `4.1-demo-orchestrator-paradigm/`

**Scripts updated:**
- Script_0_1 and Script_0_2: Reframed for vibe coding → conductor → orchestrator progression
- Script_1_1: Rewritten as "What's Possible: Advanced Vibe Coding"
- Script_1_2 and Script_1_3: Orchestrator references removed
- NEW Script_4_1_From_Conductor_to_Orchestrator.docx: Full script with modern tool survey
- Script_4_1 → Script_4_2 (Subagents), Script_4_2 → Script_4_3 (Swarms), Script_4_3 → Script_4_4 (Fullstack)

**TOC spreadsheet:** Regenerated with 18 videos (was 17), new Chapter 4 structure

**Total videos:** 18 (2 intro + 3 + 3 + 3 + 4 + 3)
