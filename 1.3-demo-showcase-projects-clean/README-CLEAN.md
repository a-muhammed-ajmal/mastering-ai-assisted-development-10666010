# 1.3 Demo: Showcase Projects (Clean Starting Point)

This is the **starting point** for the Showcase Projects demo. Each project folder contains a `PROMPT.md` specification that you should use to generate the corresponding `index.html` file.

## Projects to Build

### 1. Retrowave Racing Game
- **Location**: `projects/retrowave-game/`
- **Spec File**: `PROMPT.md`
- **Goal**: A high-octane 3D racing game with synthwave aesthetics, neon visuals, and arcade driving action
- **Output**: Single HTML file using Three.js with arrow key steering and increasing difficulty
- **Key Features**: Neon grid road, synthwave sky, obstacles, distance-based score

### 2. Marketing Agency Landing Page
- **Location**: `projects/landing-page/`
- **Spec File**: `PROMPT.md`
- **Goal**: A beautiful, modern landing page for a creative marketing agency
- **Output**: Single HTML file with embedded CSS and JS, responsive design
- **Key Features**: Animated gradients, services grid, team section with emojis, testimonials carousel, contact form, smooth scroll navigation

### 3. Data Analytics Dashboard
- **Location**: `projects/data-dashboard/`
- **Spec File**: `PROMPT.md`
- **Goal**: An interactive analytics dashboard with charts and real-time metrics
- **Output**: Single HTML file using Chart.js with dark theme
- **Key Features**: Stat cards with animated counters, line chart, bar chart, donut chart, responsive grid layout

## Getting Started

For each project:

1. Read the `PROMPT.md` specification in the project folder
2. Ask Claude Code to generate the complete `index.html` using the spec
3. The generated HTML should be self-contained (all CSS/JS inline, CDN libraries only)
4. Run with: `npx serve` or similar HTTP server

## Example Prompts

**For Retrowave Game:**
```
Use the PROMPT.md in projects/retrowave-game/ to generate a complete index.html for a Three.js retrowave racing game
```

**For Landing Page:**
```
Use the PROMPT.md in projects/landing-page/ to generate a complete, responsive index.html for a marketing agency landing page
```

**For Data Dashboard:**
```
Use the PROMPT.md in projects/data-dashboard/ to generate a complete index.html for an analytics dashboard using Chart.js
```

## What's Different from the Complete Version

The complete version (1.3-demo-showcase-projects) includes finished `index.html` files in each project. This clean version provides ONLY the PROMPT.md specifications so you experience the full process of generating these from scratch.

## Key Learning Goals

- See how well-written specs enable AI to autonomously decide on architecture, styling, and interactions
- Understand how adjectives ("neon", "modern", "synthwave") guide design without dictating pixels
- Experience the power of "vibe coding": describe the goal, the AI figures out the implementation
- Learn that single-file constraints (no build tools, no external libraries except CDN) produce clean, deployable code

---

This demo teaches that **specification quality directly determines output quality**. A great spec requires no hand-holding and produces impressive, production-ready code.
