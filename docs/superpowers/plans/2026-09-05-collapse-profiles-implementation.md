# Collapse Public Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the single public config consolidation (Issue #59) by resolving the tarball verification script lint defect and verifying the full test and package delivery pipeline.

**Architecture:** `eslint-config-yarapa` exports a single Flat Config array with no subpath framework profiles. The consumer verification script verifies that the packed tarball lints JS and TS files via the single root import.

**Tech Stack:** TypeScript, ESLint 9/10 Flat Config, `eslint-plugin-n`, Vitest, pnpm, tsdown, publint, arethetypeswrong.

## Global Constraints

- Never suppress or disable a lint rule to make checks pass; fix root causes.
- No emojis in source files, messages, or commits.
- Commit messages must comply with conventional commits and commitlint (`subject-max-length <= 50`, no commit body/footer if not allowed).

---

### Task 1: Fix String Literal Lint Error in `verify-tarball.mts`

**Files:**

- Modify: `packages/eslint-config-yarapa/scripts/verify-tarball/verify-tarball.mts:145`

**Interfaces:**

- Consumes: Node.js `fs.writeFileSync` in consumer directory verification routine.
- Produces: Clean, lint-compliant `verify-tarball.mts` source file.

- [ ] **Step 1: Check the failing lint rule**

Run: `pnpm lint:check`
Expected: FAIL with `unicorn/prefer-string-raw` at line 145 of `verify-tarball.mts`.

- [ ] **Step 2: Fix the unnecessary `String.raw` template tag**

In `packages/eslint-config-yarapa/scripts/verify-tarball/verify-tarball.mts` at line 145, replace:

```typescript
String.raw`    "const useEffect = callback => callback();",`,
```

with:

```typescript
"    \"const useEffect = callback => callback();\",",
```

- [ ] **Step 3: Run linter to verify it passes**

Run: `pnpm -w lint:check`
Expected: PASS with 0 errors and 0 warnings.

- [ ] **Step 4: Commit the fix**

```bash
git add packages/eslint-config-yarapa/scripts/verify-tarball/verify-tarball.mts
git commit -m "fix(scripts): remove raw string in verify-tarball"
```

---

### Task 2: Verify Complete Pipeline & Acceptance Criteria

**Files:**

- Test: `packages/eslint-config-yarapa/scripts/verify-tarball/verify-tarball.mts`
- Test: `packages/eslint-config-yarapa/test/*.test.ts`

**Interfaces:**

- Consumes: `pnpm verify` script (`tsdown build`, `lint:check`, `typecheck`, `publint`, `attw`, `vitest`, `verify-tarball`).
- Produces: 100% passing verification pipeline for issue #59 acceptance criteria.

- [ ] **Step 1: Run type checking**

Run: `pnpm typecheck`
Expected: PASS with no errors.

- [ ] **Step 2: Run unit and behavior test suite**

Run: `pnpm test`
Expected: PASS with all 7 test files and 36 tests passing.

- [ ] **Step 3: Run tarball consumer verification**

Run: `pnpm --filter eslint-config-yarapa test:consumer`
Expected: PASS with successful publint, attw, and real ESLint execution on JS, TS, and React files via `eslint-config-yarapa`.

- [ ] **Step 4: Run full workspace verification**

Run: `pnpm verify`
Expected: PASS across all build, lint, typecheck, packaging, unit test, and consumer test gates.
