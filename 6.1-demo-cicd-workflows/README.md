# AI-Powered CI/CD Pipelines

## Overview

This demo shows how to integrate AI into your CI/CD workflows to automate code review, test generation, and other quality checks.

**Two key workflows**:
1. **AI Code Review** — Automatically reviews PRs for security, bugs, and style issues
2. **Test Coverage Gap Detection** — Identifies code paths that aren't covered by tests

## Workflow 1: AI Code Review

### How It Works

GitHub Action triggers on PR creation/update:
1. Checkout code
2. Get the PR diff
3. Send diff to Claude API for analysis
4. Parse findings (security issues, bugs, suggestions)
5. Post comments on the PR with findings

### Safety Features

- **Non-blocking**: Fails gracefully (PR can merge even if review fails)
- **Cost control**: Max token limit prevents runaway costs
- **Secrets protection**: API key in GitHub Secrets, never exposed
- **Limited scope**: Reviews code only, doesn't modify

### Example Workflow File

See `.github/workflows/ai-code-review.yml`

### Setup

1. Add `ANTHROPIC_API_KEY` to GitHub Secrets
2. Push workflow file to `.github/workflows/`
3. Create a PR to trigger the workflow

### What the Review Analyzes

- **Security**: Hardcoded secrets, SQL injection, unsafe operations
- **Bugs**: Type mismatches, logic errors, edge cases
- **Style**: Code style consistency, naming conventions
- **Performance**: N+1 queries, inefficient algorithms
- **Testing**: Missing test coverage, untested branches

## Workflow 2: Test Coverage Gap Detection

### How It Works

Runs on merge to main:
1. Generate coverage report
2. Identify untested code paths
3. Suggest what tests are needed
4. Post summary with recommendations

### Example Scenarios

**Before**:
```typescript
function processOrder(order) {
  if (!order) return null;  // NOT TESTED

  const total = calculateTotal(order.items);  // TESTED

  if (total > 1000) {  // NOT TESTED
    applyDiscount(0.1);
  }

  return createInvoice(total);  // TESTED
}
```

**Coverage Report**:
```
Coverage Report:
- processOrder: 67% (line coverage)
- Missing: empty order case, large order case

AI Suggestions:
1. Add test for empty order: processOrder(null) should return null
2. Add test for large order (>1000): should apply 10% discount
```

### Setup

1. Configure coverage thresholds in Jest config
2. Add workflow file to `.github/workflows/`
3. Workflow runs on every merge to main

## Beyond These Examples

You can extend this pattern with:

### 1. AI-Powered Changelog Generation

Automatically generate release notes from commits:
```
AI reviews commits since last tag
Groups by: features, bugs, breaking changes
Generates formatted changelog
```

### 2. Dependency Update Analysis

Analyze pull requests that update dependencies:
```
AI reviews dependency changes
Flags security vulnerabilities
Suggests migration guides if breaking
```

### 3. Security Scanning

Enhanced security scanning beyond linting:
```
AI analyzes code for:
- Authorization checks
- Input validation
- Error handling
- Cryptography usage
```

### 4. Performance Analysis

Detect performance regressions:
```
AI compares performance before/after
Flags algorithms with poor complexity
Suggests optimizations
```

## Cost Considerations

### Token Usage

**Typical PR review**:
- Diff: ~500-1000 tokens
- Analysis: ~1000-2000 tokens
- **Total: ~1500-3000 tokens per PR**

**Cost**: At $0.50/1M input tokens = ~$0.001-0.002 per review

**Monthly** (assuming 30 PRs/month): ~$0.03-0.06

**Cost Control**:
- Max tokens in prompt: cap review scope
- Only run on PRs (not every commit)
- Skip reviews for WIP or draft PRs
- Cache review results if possible

## Files in This Demo

- `README.md` (this file)
- `.github/workflows/ai-code-review.yml` — AI code review workflow
- `.github/workflows/test-coverage-gap.yml` — Test coverage detection workflow
- `src/example.ts` — Example code to review
- `tests/example.test.ts` — Example test suite
- `package.json`, `tsconfig.json` — Build configuration

## Getting Started

1. Read the workflow files in `.github/workflows/`
2. Study the example code in `src/example.ts`
3. Review the test suite in `tests/example.test.ts`
4. To run locally:
   ```bash
   npm install
   npm test
   npm run build
   ```

## Integration with Your Project

1. Copy `.github/workflows/` to your project
2. Add `ANTHROPIC_API_KEY` to GitHub Secrets
3. Configure coverage thresholds in your `jest.config.js`
4. Create a PR to test the workflow
5. Monitor GitHub Actions for results

## Real-World Results

Teams using AI code review report:

- **10-15% reduction** in code review time (AI handles routine checks)
- **20-30% faster** onboarding (new team members understand patterns quicker)
- **Security improvements** (catches edge cases humans miss)
- **Better test coverage** (AI identifies gaps)

## Key Takeaway

AI-powered CI/CD isn't about replacing human review—it's about automating routine checks, freeing humans to focus on architecture and logic. The AI catches style issues, obvious bugs, and coverage gaps; humans focus on design quality and business value.
