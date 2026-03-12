# AI Code Review Checklist

## Before Merging Agent Output

Use this checklist when reviewing code that was written or modified by an AI agent. It's not just about code quality—it's about verifying the agent didn't introduce security issues, hallucinations, or scope creep.

---

## Security

- [ ] **No hardcoded secrets** — Check for API keys, passwords, tokens in code
- [ ] **No new environment variables** — Agent shouldn't add new .env vars without documentation
- [ ] **No new network calls** — Verify agent didn't add unexpected HTTP calls to unknown services
- [ ] **No eval() or dynamic code execution** — Check for `eval()`, `Function()`, or similar
- [ ] **File permissions unchanged** — Agent shouldn't modify file permissions or .gitignore
- [ ] **No new external dependencies** — Check package.json for new packages (flag for approval)
- [ ] **SQL injection safe** — If database queries added, verify parameterization
- [ ] **Input validation present** — User inputs should be validated before use

---

## Correctness

- [ ] **All tests pass** — Don't trust agent's claim; run `npm test` yourself
- [ ] **Types check cleanly** — Run `npx tsc --noEmit` with no errors
- [ ] **Linter passes** — Run `npm run lint` with zero NEW warnings (existing warnings OK)
- [ ] **Builds successfully** — Run `npm run build` with clean output
- [ ] **Edge cases handled** — null checks, empty arrays, boundary values tested
- [ ] **Error messages are clear** — Errors should tell users what went wrong, not be vague
- [ ] **Async/await properly handled** — No unhandled promise rejections, proper error catching
- [ ] **No infinite loops** — Review loops for exit conditions

---

## Architecture & Patterns

- [ ] **Follows existing patterns** — Code matches project conventions (don't let agent introduce new patterns)
- [ ] **Single Responsibility** — Each function/class has one clear purpose
- [ ] **No dead code** — All implemented code is used somewhere
- [ ] **No unnecessary abstractions** — Sometimes the simplest solution is best
- [ ] **Types are specific** — Not just `any` everywhere; proper TypeScript usage
- [ ] **Comments explain why, not what** — Code should be self-documenting; comments explain reasoning
- [ ] **No code duplication** — Duplicated logic should be extracted to helpers

---

## Tests

- [ ] **Tests exist** — All new code has corresponding tests
- [ ] **Tests are meaningful** — Tests verify behavior, not just that code exists
- [ ] **Happy path tested** — Normal operation works
- [ ] **Edge cases tested** — Empty inputs, null, boundary values
- [ ] **Error cases tested** — Invalid inputs, expected failures
- [ ] **No skipped tests** — `xit`, `xdescribe`, `skip` indicates unfinished work
- [ ] **Coverage reasonable** — 80%+ for new code (see coverage report)
- [ ] **Mocks are appropriate** — External dependencies properly mocked, not calling real services

---

## Diff Review (The Big Picture)

- [ ] **Every line of diff reviewed** — Yes, every single line (it's tedious but crucial)
- [ ] **No large deletions without reason** — If whole files deleted, understand why
- [ ] **Scope matches the request** — Did agent implement exactly what was asked? No more, no less?
- [ ] **No unrelated refactoring** — Agent shouldn't "helpfully" refactor unrelated code
- [ ] **File structure sensible** — New files in right places, good organization
- [ ] **Dependencies are minimal** — Each file imports only what it needs

---

## Commit Quality

- [ ] **Commits are atomic** — Each commit is one logical change
- [ ] **Commit messages descriptive** — Messages explain *why*, not just *what*
- [ ] **No "work in progress" commits** — Messages like "fix", "debug", "try again" are red flags
- [ ] **No merge commits** — Branch should be rebased on main, not merged
- [ ] **Commit history is clean** — Related changes grouped together

---

## Documentation

- [ ] **README updated** — If functionality changed, README reflects it
- [ ] **JSDoc/comments added** — Complex functions documented
- [ ] **Type definitions clear** — Interfaces/types are well-named and sensible
- [ ] **Examples included** — Complex features should have usage examples
- [ ] **Changelog updated** — If using CHANGELOG.md, it's current

---

## Performance

- [ ] **No N+1 queries** — Database queries not in loops
- [ ] **No unnecessary re-renders** — React components not over-rendering
- [ ] **Caching used appropriately** — Expensive operations cached when needed
- [ ] **No memory leaks** — Event listeners/subscriptions cleaned up
- [ ] **No large bundles** — No mega-files, code reasonably split

---

## Accessibility & Compliance

- [ ] **Semantic HTML used** — If web frontend, proper HTML elements
- [ ] **ARIA labels present** — For custom components, accessibility supported
- [ ] **Keyboard navigation works** — If interactive, usable without mouse
- [ ] **Dark mode considered** — If styling, dark mode compatibility checked
- [ ] **No hardcoded text** — UI text ready for internationalization

---

## Final Checks

- [ ] **Run full test suite locally** — `npm test` passes with 0 failures
- [ ] **Try the feature manually** — If UI, actually use it
- [ ] **No console errors** — Browser console clean (if web app)
- [ ] **No deployment blockers** — Can confidently deploy to production

---

## Red Flags (Stop and Ask Questions)

If you see any of these, **stop and investigate**:

- ❌ Multiple warnings/errors from type checking or linter
- ❌ Tests that are skipped or commented out
- ❌ Large chunks of code with zero comments
- ❌ Files that are >500 lines long
- ❌ Functions with 10+ parameters
- ❌ Comments that say "TODO" or "FIXME"
- ❌ `any` type used frequently
- ❌ Dependencies added without clear reason
- ❌ Git history that doesn't make sense or has weird commits
- ❌ Code that contradicts documented patterns
- ❌ Security checks that pass but feel suspicious

---

## If Something Looks Wrong

1. **Don't approve**
2. **Document the issue clearly**
3. **Link to specific code examples**
4. **Suggest how to fix it** (if obvious)
5. **Re-request changes** (GitHub PR feature)
6. **Agent will iterate** and push fixes

---

## Approval Statement

If all checks pass, you can confidently write:

> Reviewed and approved. Code follows project patterns, all tests pass, security is solid, and the feature is correctly implemented. Ready to merge.

---

## Notes

- This checklist might feel tedious for small changes, but it catches real issues
- As you review more agent code, you'll develop intuition for what to look for
- The goal isn't perfection—it's catching issues before production
- Trust, but verify
