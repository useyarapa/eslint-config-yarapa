# Post-Merge Issue Reconciliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile the v1-readiness issues against merged `main`, close only acceptance-complete issues with evidence, and finish the remaining repository-code gap in canonical examples without changing repository/admin or npm registry settings.

**Architecture:** Treat merged PRs #37–#41 and current `main` as the source of implementation truth. Separate repository-code acceptance from GitHub/npm administrative acceptance; never simulate missing admin features in code. The only repository-code follow-up identified by reconciliation is #34, whose canonical examples need richer executable patterns while remaining dependency-light.

**Tech Stack:** TypeScript, ESLint 10 Flat Config, pnpm, GitHub Actions, GitHub Issues.

**Spec:** `docs/superpowers/plans/2026-09-02-complete-open-issues.md`

## Global Constraints

- Base all repository changes on `main@70e9108440675768038006bf7b3d22f527ff1ca5`.
- Do not change GitHub repository/ruleset/security settings in this change set.
- Do not change npm registry Trusted Publisher settings, publish packages, create tags, or create releases.
- Do not restore Stryker/mutation testing; PR #38 is the later maintainer decision.
- Close an issue only when its current acceptance criteria are satisfied by merged implementation/runtime evidence.
- Keep framework examples dependency-light; do not add React, Next.js, or NestJS packages solely for documentation examples.

---

### Task 1: Reconcile and close acceptance-complete issues

**Files:**
- None.

**Interfaces:**
- Consumes: merged PRs #37, #38, #39, #40, #41; current `main`; current ruleset/repository metadata.
- Produces: evidence comments and completed issue states for acceptance-complete issues.

- [ ] **Step 1: Verify the issue remains open immediately before writing.**

Use the GitHub issue API for each candidate issue.

- [ ] **Step 2: Add an evidence comment.**

Reference the merged PR(s), current `main` behavior, tests/workflow evidence, and any relevant runtime evidence. Do not claim admin acceptance for repository settings that were not verified.

- [ ] **Step 3: Close the issue as completed.**

Close only these candidates after the evidence check confirms no acceptance gap: #13, #14, #15, #20, #21, #22, #23, #25, #26, #27, #28, #29, #31, #32, #33, #35.

- [ ] **Step 4: Leave blockers open and document their exact remaining acceptance gaps.**

Keep #16, #17, #18, #19, #30, #34, and #36 open. Record: Release Please cannot create its PR because repository Actions PR creation is disabled (#16); GitHub-native security settings remain admin acceptance (#17); ruleset still requires implementation-specific checks and CodeRabbit (#18/#36); Discussions/org defaults remain absent (#19); mutation requirement is superseded by PR #38 while the issue text remains stale (#30); canonical examples remain too minimal (#34).

### Task 2: Enrich canonical executable examples for #34

**Files:**
- Create: `examples/next/lib/query.ts`
- Create: `examples/next/types.ts`
- Modify: `examples/next/app/page.tsx`
- Create: `examples/react/src/greeting.ts`
- Create: `examples/react/src/types.ts`
- Modify: `examples/react/src/example.tsx`
- Create: `examples/nest/src/message.repository.ts`
- Modify: `examples/nest/src/example.service.ts`

**Interfaces:**
- Consumes: existing example `eslint.config.mjs` files and `examples/tsconfig.json`.
- Produces: dependency-light source examples showing value imports, type-only imports, TypeScript narrowing, async/error handling, Next App-Router-shaped input, React component/custom-hook composition, and Nest service/repository boundaries.

- [ ] **Step 1: Add local type/value modules and update examples to consume them.**

Next.js:
- `types.ts` exports `SearchValue` and `PageInput` types.
- `lib/query.ts` exports `readSingleQueryValue(value: SearchValue): string | undefined` and imports `SearchValue` with `import type`.
- `app/page.tsx` imports the helper and `PageInput`, awaits `searchParams`, validates a required `name`, and returns a deterministic page string.

React:
- `types.ts` exports readonly `GreetingProps`.
- `greeting.ts` exports `formatGreeting(name: string): string`.
- `example.tsx` uses value + type-only imports, exposes `useGreeting(name: string): string`, and calls that hook at the top level of `Greeting`.

NestJS:
- `message.repository.ts` exports `MessageRepository`.
- `example.service.ts` imports the repository type and keeps explicit async/error handling.

- [ ] **Step 2: Verify examples with the same commands used by CI.**

Run through GitHub Actions on the pull request:

```sh
pnpm --filter eslint-config-yarapa build
pnpm exec eslint --config examples/next/eslint.config.mjs examples/next/app/page.tsx examples/next/lib/query.ts examples/next/types.ts
pnpm exec eslint --config examples/nest/eslint.config.mjs examples/nest/src/example.service.ts examples/nest/src/message.repository.ts
pnpm exec eslint --config examples/react/eslint.config.mjs examples/react/src/example.tsx examples/react/src/greeting.ts examples/react/src/types.ts
```

Expected: all commands pass with zero warnings/errors.

- [ ] **Step 3: Update the CI example job to lint every canonical example source file.**

Replace single-file commands with directory globs/paths that include the new helper/type files. Keep the built package as the config source.

- [ ] **Step 4: Update README canonical-example wording only if needed.**

State that the examples demonstrate imports/type-only imports, typed boundaries, async/error handling, and framework-shaped composition while real framework package loading remains covered by packed-consumer jobs.

### Task 3: Verify and prepare the follow-up PR

**Files:**
- Modify only if review evidence requires it: files from Task 2.

**Interfaces:**
- Consumes: Task 2 branch head and GitHub Actions/CodeRabbit feedback.
- Produces: one reviewable PR that closes #34 only when exact-head CI and review evidence pass.

- [ ] **Step 1: Open a PR from `docs/complete-canonical-examples` to `main`.**

Title: `docs: complete canonical executable examples`

Body must state that it targets the remaining repository-code acceptance gap in #34 and does not alter admin/security/npm settings.

- [ ] **Step 2: Wait for exact-head required checks and review.**

Required evidence: `lint`, `test`, `check-types`, `build`, `consumer`, `windows-consumer`, `diagnostic-snapshot`, `ci`, and CodeRabbit under the current ruleset.

- [ ] **Step 3: Address only valid review findings.**

Do not weaken checks or add dependencies to satisfy review convenience.

- [ ] **Step 4: Close #34 only after the PR is merged.**

Until merge, leave #34 open and comment with the follow-up PR link/status.
