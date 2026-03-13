# Chapter 6.1: CI/CD Workflows - Automated Testing and Quality Checks

## Starting Point

This is a clean starting point for the CI/CD demo. You have example source code and tests, but no workflows yet.

## Your Task

Create GitHub Actions workflows that automate:

1. **Testing** — Run tests on every PR and push
2. **Code Quality** — TypeScript compilation and linting
3. **Coverage** — Track and report test coverage
4. **AI-Powered Code Review** — Have Claude review PRs for patterns and best practices

## The Workflows to Implement

### 1. test.yml

Run tests on every push and PR:

```yaml
name: Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20.x
      - run: npm ci
      - run: npm test
      # TODO: Add coverage reporting
```

**What it does:**
- Triggers on every push to main/develop and every PR
- Tests against Node.js 18 and 20
- Fails the build if tests fail
- Reports coverage (optional enhancement)

### 2. lint.yml

Check code quality:

```yaml
name: Lint
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build  # TypeScript type checking
      # TODO: Add linting (ESLint, Prettier)
```

**What it does:**
- Runs TypeScript compiler
- Checks for type errors
- Fails build if errors found
- Optional: Add ESLint, Prettier checks

### 3. ai-review.yml (Optional)

Have Claude automatically review PRs:

```yaml
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      # TODO: Use Claude API to review changed files
      # - Read diff from PR
      # - Send to Claude for review
      # - Post comments on PR
```

**What it does:**
- Triggers on PR creation/update
- Reviews code changes with Claude
- Posts feedback as PR comments
- Highlights patterns, security issues, improvements

## Success Criteria

- [ ] `test.yml` runs `npm test` on every PR
- [ ] Tests are required to pass before merging
- [ ] `lint.yml` checks TypeScript compilation
- [ ] Build fails if code doesn't compile
- [ ] Coverage reporting (optional enhancement)
- [ ] AI code review on PRs (optional enhancement)

## Quick Start

All workflows are automatically triggered by GitHub Events:

1. Create a PR → runs test.yml and lint.yml
2. Push to main → runs test.yml and lint.yml
3. Merge PR → code is deployed

No manual steps needed! The workflows automate everything.

## File Structure

```
.github/
└── workflows/
    ├── test.yml        (Run tests)
    ├── lint.yml        (Code quality)
    └── ai-review.yml   (AI code review - optional)
```

## Testing the Workflows

Push to a branch and create a PR:

```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
# Go to GitHub and create a PR
# Workflows automatically run
```

## Next Steps

1. **Implement test.yml** — Runs `npm test`
2. **Implement lint.yml** — Runs `npm run build` + optional linting
3. **Optional: AI Review** — Use Claude API to review PRs
4. **Optional: Coverage** — Report coverage percentages
5. **Optional: Deployment** — Add deploy.yml to deploy on merge

## Example Workflow Structure

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
```

## Key Workflows Concepts

1. **on:** — When the workflow triggers (push, pull_request, schedule, etc.)
2. **jobs:** — Units of work that run in parallel
3. **runs-on:** — GitHub-hosted or self-hosted runner
4. **steps:** — Individual tasks in a job
5. **actions:** — Reusable workflow components (checkout, setup-node, etc.)
6. **matrix:** — Test multiple configurations (Node versions, OS, etc.)

## Tips for Implementation

- Keep workflows simple and focused
- Use actions from GitHub Marketplace
- Cache dependencies for faster builds
- Set up branch protection rules to require workflow status
- Use secrets for sensitive data (API keys, tokens)
- Add status badges to README.md

## Enhancement Ideas

1. **Code Coverage** — Report coverage to PR comments
2. **Performance Testing** — Track performance regressions
3. **Security Scanning** — Scan dependencies for vulnerabilities
4. **Documentation** — Generate API docs automatically
5. **Deployment** — Auto-deploy on merge to main
6. **Release** — Auto-create releases with changelog
