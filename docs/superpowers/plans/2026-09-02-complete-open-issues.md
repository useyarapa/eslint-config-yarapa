# Complete Open Issues Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining implementation gaps behind the open v1 readiness issues without redoing behavior already merged by PRs #37–#40, while preserving one semantic API, one YARAPA handwriting, OSS-only verification, real packed-consumer evidence, and standard GitHub/npm release/security conventions.

**Architecture:** Keep the existing package architecture and semantic `/next`, `/nest`, `/react` entrypoints. Add only repository-facing documentation, compatibility evidence, CI/security/release workflows, and narrow stale-terminology cleanup. Use GitHub Actions as the authoritative execution environment because the agent runtime cannot reach the public package registry; every behavior-bearing change must be exercised through the existing real ESLint/packed-consumer path rather than repository-governance unit tests.

**Tech Stack:** Node.js 24, pnpm 11, ESLint 10 Flat Config, TypeScript 5/6 compatibility, Vitest 4, tsdown, publint, AreTheTypesWrong, GitHub Actions, GitHub Dependency Review, OpenSSF Scorecard, Gitleaks CLI, release-please, npm Trusted Publishing/OIDC.

**Spec:** GitHub issues #13–#23 and #25–#36 in `useyarapa/eslint-config-yarapa`, with later maintainer decisions in merged PRs #37–#40 taking precedence where issue text is stale.

## Global Constraints

- Work only on `feat/complete-open-issues`, based on `main` commit `ceaee0554a0b17ef82b5196a40e45aefdcafe019`.
- Do not merge, tag, publish, close issues, change issue metadata, or change GitHub repository/ruleset/security settings in this change set.
- Do not weaken public rule DNA to make repository CI pass; use narrow repository-local exceptions only if conventional code otherwise conflicts with an intentional public rule.
- Do not reintroduce plugin-shaped public presets or a custom YARAPA policy/certification framework.
- Do not reintroduce Stryker mutation testing: PR #38 explicitly removed mutation testing by maintainer decision after issue #30 was written.
- Do not create custom CodeQL workflow configuration; issue #17 explicitly requires GitHub CodeQL default setup unless a concrete unsupported need exists.
- New required third-party tools/actions must be OSS or GitHub-native free-for-public-OSS features, pinned/reproducible, and materially non-duplicative.
- New GitHub Actions must use least privilege and immutable full commit SHAs.
- Gitleaks must use the OSS CLI directly, not `gitleaks/gitleaks-action`.
- Consumer-visible compatibility claims must not exceed CI evidence.
- Public technical documentation is English-first.
- Framework profiles remain adapters over one shared handwriting; test-runner choice remains independent.

---

## Issue Reconciliation Matrix

| Issue | Current main evidence | Remaining implementation in this branch |
| --- | --- | --- |
| #13 | bespoke enterprise/inventory tests and inventory subsystem already absent; real behavior and packed-consumer tests remain | preserve architecture; remove only stale certification-like CI diagnostic if it dynamically inspects rule universes |
| #14 | semantic root + `/next` + `/nest` + `/react` exports and packed import smoke already exist | document migration/usage and strengthen packed framework evidence |
| #15 | `.github` already reduced to bug form, Dependabot and CI | remove stale banking/preset wording from bug form |
| #16 | no release automation | add release-please PR/release automation and OIDC npm publish workflow; document npm Trusted Publisher as external prerequisite |
| #17 | no `SECURITY.md`; no dependency-review workflow in repo | add `SECURITY.md` and dependency review job; leave CodeQL default setup/PVR/Dependency Graph/alerts as external settings blockers |
| #18 | aggregate `ci` job exists, but ruleset still requires implementation jobs and CI contains stale diagnostic job | make aggregate include all repository CI gates; ruleset change remains external settings blocker |
| #19 | Discussions disabled; no org `.github` repository | clean local issue routing language only; Discussions/org-default work remains external/cross-repo blocker |
| #20 | no Scorecard workflow | add official OpenSSF Scorecard workflow with SARIF upload and least privilege |
| #21 | source architecture is conventional but `recommended.ts` contains `Banking Baseline` terminology | neutralize source comments without behavior change |
| #22 | shared handwriting composition/tests exist | preserve and document; no new rule churn without failing evidence |
| #23 | repository already dogfoods built config | preserve dogfood path and avoid architecture distortion |
| #25–#29 | major rule ownership/static policy work merged in #38/#39/#40 | preserve tests and remove the remaining dynamic CI snapshot that conflicts with #29 |
| #30 | dogfood exists; no Gitleaks; Stryker later rejected in #38 | add pinned/checksummed Gitleaks CLI; do not restore mutation testing |
| #31 | `@stylistic` ownership and autofix/idempotence tests exist | document `eslint --fix` as canonical formatter path |
| #32 | no plugin-shaped public test presets; stale internal comments mention removed test presets | document generic test handwriting contract and remove stale preset terminology; no runtime package detection |
| #33 | Node/ESLint/TS packed matrix exists; framework-version contract absent | narrow Node engine to tested major and add packed framework compatibility cases |
| #34 | no canonical README/examples | add README + executable Next/Nest/React examples and lint them with built YARAPA config |
| #35 | naming/complexity/JSDoc/suppression work substantially merged in #38 | preserve behavior; document resulting expectations; no metric-driven source refactors |
| #36 | current package path is OSS; CI actions are pinned | add dependency/tool audit rationale in docs and ensure new tools satisfy OSS/$0 constraints |

---

### Task 1: Establish Branch Record and Acceptance Evidence

**Files:**
- Create: `docs/superpowers/plans/2026-09-02-complete-open-issues.md`

**Interfaces:**
- Consumes: open issue bodies, merged PR decisions, current `main` state.
- Produces: one auditable execution plan and issue-to-change mapping used by every later task.

- [x] **Step 1: Create isolated branch**

Create `feat/complete-open-issues` from `ceaee0554a0b17ef82b5196a40e45aefdcafe019`.

- [x] **Step 2: Record plan before production changes**

Commit this document before any source/CI/release implementation change.

- [ ] **Step 3: Open a Draft PR after the first RED test/config validation commit**

The Draft PR body must identify the covered issue set, explicit non-goals, external settings blockers, and the fact that no merge/publish is authorized.

---

### Task 2: Remove Stale Internal/Public Terminology Without Changing Runtime Behavior

**Files:**
- Modify: `packages/eslint-config-yarapa/src/configs/recommended.ts`
- Modify: `packages/eslint-config-yarapa/src/configs/internal/canonicalTestFileGlobs.ts`
- Modify: `.github/ISSUE_TEMPLATE/bug.yml`

**Interfaces:**
- Consumes: existing semantic profiles and generic shared handwriting.
- Produces: neutral public-library terminology consistent with #14/#15/#21/#32.

- [ ] **Step 1: Verify no runtime policy change is required**

Read the three files immediately before modification and compare their blobs to `main`.

- [ ] **Step 2: Replace stale source comments only**

In `recommended.ts`, replace `The aggregate Banking Baseline` and obsolete public test-preset narration with language describing the shared YARAPA recommended rule set and explicitly saying runtime/test-library semantics are consumer/file-scope concerns rather than public plugin-shaped presets.

- [ ] **Step 3: Replace stale test-glob comment only**

In `canonicalTestFileGlobs.ts`, remove claims that the list is shared by `vitest`, `ava`, and `testingLibrary` public presets. Describe it only as a canonical internal test-file naming scope available to internal composition where needed.

- [ ] **Step 4: Simplify bug intake**

Keep version/environment/reproduction/expected/actual fields. Replace `Presets` with semantic `YARAPA profile: default, next, nest, or react` language and replace banking-specific safety wording with `credentials, secrets, personal/customer data, and proprietary source code`.

- [ ] **Step 5: Verify diff is comments/form metadata only**

No rules, exports, dependencies, file scopes, severity, options, or runtime config objects may change in this task.

---

### Task 3: Make the Supported Runtime Contract Match Existing Evidence

**Files:**
- Modify: `packages/eslint-config-yarapa/package.json`
- Modify: `packages/eslint-config-yarapa/scripts/verify-tarball.mts`
- Modify: `.github/workflows/ci.yml`
- Test: existing packed-consumer execution in GitHub Actions

**Interfaces:**
- Consumes: package tarball, semantic exports, environment variables describing framework/tool versions.
- Produces: explicit bounded support contract and real consumer verification for generic + framework profiles.

- [ ] **Step 1: RED — add framework-aware packed consumer expectations**

Extend `verify-tarball.mts` so CI-selected framework cases install the exact framework packages needed for the selected profile and execute representative valid/invalid files through the packed `eslint-config-yarapa` tarball. The script must support an explicit `FRAMEWORK_PROFILE` value (`next`, `nest`, `react`, or unset) and version environment variables; it must never inspect the consumer's installed packages to select public lint behavior.

For each profile, verify:

- semantic subpath imports successfully;
- valid representative source lints with zero errors;
- an intentional shared-handwriting violation is reported;
- a framework-specific rule/plugin can load without duplicate plugin/parser errors;
- TypeScript project-service behavior succeeds for the typed consumer file;
- resolver/package loading succeeds from the packed install.

- [ ] **Step 2: RED — add CI framework matrix before script implementation is complete**

Add `framework-compatibility` matrix jobs using boundary-focused cases rather than Cartesian combinations. Initial declared framework contract:

- Next.js: `>=16.0.0 <17`, prove `16.0.0` and `16.3.4`.
- React: `>=19.0.0 <20`, prove `19.0.0` and current 19.x selected at implementation time.
- NestJS: `>=12.0.0 <13`, prove `12.0.0` and current 12.x selected at implementation time.

The exact current versions must be verified from official upstream tags/releases immediately before writing the matrix.

- [ ] **Step 3: Observe RED in GitHub Actions**

Push the test/matrix change while implementation is intentionally incomplete and confirm the framework job fails for the missing behavior rather than YAML syntax or unrelated repository failure.

- [ ] **Step 4: GREEN — implement minimal packed framework consumer setup**

Add only the install/config/sample generation needed by the RED cases. Reuse existing temp-directory, pack, pnpm, ESLint, and TypeScript machinery. Do not add a second consumer harness.

- [ ] **Step 5: Bound the Node engine to evidence**

Change package `engines.node` from `>=24.15.0` to `>=24.15.0 <25` unless CI is expanded to a newer Node major in the same task. This prevents an untested future-major compatibility claim.

- [ ] **Step 6: GREEN verification**

Require generic consumer, toolchain compatibility matrix, framework compatibility matrix, and Windows consumer to pass.

---

### Task 4: Add Canonical Consumer Documentation and Executable Examples

**Files:**
- Create: `README.md`
- Create: `examples/tsconfig.json`
- Create: `examples/next/eslint.config.mjs`
- Create: `examples/next/app/page.tsx`
- Create: `examples/nest/eslint.config.mjs`
- Create: `examples/nest/src/example.service.ts`
- Create: `examples/react/eslint.config.mjs`
- Create: `examples/react/src/example.tsx`
- Modify: root `eslint.config.mjs` only if a narrow repository-local file-scope exception is proven necessary by real lint output
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: built package `dist` entrypoints and shared repository lint command.
- Produces: copyable semantic-profile configs and source examples that are linted by the actual built package.

- [ ] **Step 1: Write examples from existing valid behavior patterns**

Examples must demonstrate type-only imports where applicable, async/Promise handling, explicit error handling, naming, framework-shaped code, and YARAPA formatting. Do not add framework packages solely so repository examples can compile; actual framework package compatibility is proven by Task 3's packed consumer jobs.

- [ ] **Step 2: Add a shared examples tsconfig**

Include the TypeScript/TSX examples so `typescript-eslint` Project Service can resolve them during repository dogfood lint.

- [ ] **Step 3: Add semantic profile config examples**

Each `eslint.config.mjs` must use the built local package entrypoint matching the README's published-package snippet and normal Flat Config composition.

- [ ] **Step 4: Write root README**

Document:

- one shared YARAPA handwriting objective;
- installation and Node/ESLint/TypeScript requirements;
- default, `/next`, `/nest`, `/react` quick starts;
- framework compatibility ranges proven by Task 3;
- normal Flat Config overrides;
- type-aware Project Service expectation and tsconfig troubleshooting;
- `eslint --fix` as the canonical formatting path with `@stylistic` ownership;
- generic test-code handwriting and explicit runner independence;
- resolver/project-service troubleshooting;
- SemVer significance of consumer-visible rule changes;
- Airbnb as design heritage/reference, never a runtime dependency/clone;
- examples as executable canonical reference;
- security reporting link to `SECURITY.md`;
- external admin prerequisites that repository files cannot enable automatically.

- [ ] **Step 5: Make CI lint examples via existing dogfood job**

Prefer no new example-specific linter. The existing lint job already builds then runs the real repository config. Add an explicit example verification command/job only if current lint ignores or cannot reach the example files.

- [ ] **Step 6: Verify README snippets agree with executable files**

No alternate API names or removed plugin-shaped presets may appear.

---

### Task 5: Add Public Security Reporting and Dependency Review

**Files:**
- Create: `SECURITY.md`
- Create or integrate: `.github/workflows/dependency-review.yml` or `dependency-review` job in `.github/workflows/ci.yml`
- Modify: `.github/workflows/ci.yml` aggregate dependencies if dependency review is integrated there

**Interfaces:**
- Consumes: GitHub dependency graph/API for public repositories.
- Produces: standard private vulnerability reporting guidance and PR dependency vulnerability gate.

- [ ] **Step 1: Add concise `SECURITY.md`**

Tell reporters not to disclose vulnerabilities in public issues and to use GitHub Private Vulnerability Reporting / Security Advisories. Do not claim PVR is enabled until settings evidence confirms it.

- [ ] **Step 2: Add official Dependency Review Action**

Use `actions/dependency-review-action` v5.0.0 pinned to commit `a1d282b36b6f3519aa1f3fc636f609c47dddb294`. Use only `contents: read`. Trigger on pull requests.

- [ ] **Step 3: Fail only on introduced vulnerable dependencies by default**

Do not add a bespoke license allowlist or dependency policy without evidence.

- [ ] **Step 4: Feed result into aggregate `ci`**

If kept in `ci.yml`, add the job to `needs`. If kept as a separate workflow, document that the current connector cannot atomically change the branch ruleset and therefore it cannot become a required branch check in this approved change set.

---

### Task 6: Replace Dynamic Diagnostic CI with Portable Gitleaks Defense-in-Depth

**Files:**
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: repository git history and official Gitleaks release archive.
- Produces: one OSS secret-scan job included in aggregate CI.

- [ ] **Step 1: Remove `diagnostic-snapshot`**

Delete the CI-only dynamic `Object.keys(sonarjs.rules)`/upstream rule-surface probe. Static policy is already protected by `static-rule-policy.test.ts`; a CI rule-universe enumerator contradicts #29's direction and adds no consumer contract.

- [ ] **Step 2: Add Gitleaks CLI v8.30.1 install**

Download official `gitleaks_8.30.1_linux_x64.tar.gz` and `gitleaks_8.30.1_checksums.txt` from the upstream release. Verify checksum before extraction. The Linux x64 archive SHA256 is `551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb`.

- [ ] **Step 3: Scan history appropriate to PR/push**

Checkout with full history for this job (`fetch-depth: 0`) and run Gitleaks against git history so a leaked secret is not hidden by later deletion. Use the CLI directly; do not use the separately licensed action wrapper.

- [ ] **Step 4: Add `gitleaks` to aggregate `ci` needs and result loop**

A failed secret scan must make aggregate `ci` fail.

---

### Task 7: Add OpenSSF Scorecard on the Standard Security Surface

**Files:**
- Create: `.github/workflows/scorecard.yml`

**Interfaces:**
- Consumes: public repository metadata and GitHub OIDC.
- Produces: Scorecard results published to OpenSSF and SARIF uploaded to GitHub code scanning.

- [ ] **Step 1: Use official Scorecard action**

Pin `ossf/scorecard-action` v2.4.4 to commit `2d1146689b8cda280b9bc96326124645441f03bc`.

- [ ] **Step 2: Use minimal permissions**

At workflow/job scope grant only what the official action requires: `security-events: write`, `id-token: write`, `contents: read`. Do not grant repository write permissions.

- [ ] **Step 3: Generate SARIF and publish results**

Configure the action with `results_file`, `results_format: sarif`, and `publish_results: true` following upstream guidance.

- [ ] **Step 4: Upload SARIF**

Use `github/codeql-action/upload-sarif` v4 pinned to commit `cdf488f595d80d6e07e03d4674febd5ab45fa938`.

- [ ] **Step 5: Trigger conventionally**

Run on default-branch push and a weekly schedule. Do not make Scorecard a bespoke YARAPA score gate.

---

### Task 8: Add Conventional Release Automation and OIDC Publish Workflow

**Files:**
- Create: `release-please-config.json`
- Create: `.release-please-manifest.json`
- Create: `.github/workflows/release-please.yml`
- Create: `.github/workflows/publish.yml`
- Modify: `README.md` release/security section only as needed to document prerequisites

**Interfaces:**
- Consumes: Conventional Commit history and GitHub releases.
- Produces: release PR/version/changelog automation and npm publish from a GitHub Release via Trusted Publishing.

- [ ] **Step 1: Configure release-please for the package path**

Use a manifest config for `packages/eslint-config-yarapa` and the existing version `0.1.0`. Keep release state conventional; no custom certification manifest.

- [ ] **Step 2: Add release-please workflow**

Pin `googleapis/release-please-action` v5 to commit `45996ed1f6d02564a971a2fa1b5860e934307cf7`. Trigger on pushes to `main`. Grant only `contents: write` and `pull-requests: write` required to create/update the release PR and GitHub Release.

- [ ] **Step 3: Add publish-on-release workflow**

Trigger only on `release.published`. Grant `contents: read` and `id-token: write`. Setup the repository's declared Node/pnpm toolchain, install with frozen lockfile, rebuild, run package `verify`, then run `npm publish` from `packages/eslint-config-yarapa` using npm Trusted Publishing/OIDC with no `NPM_TOKEN`.

- [ ] **Step 4: Preserve consumer-oriented release confidence**

The publish workflow must execute the existing build, typecheck, tests, `publint`, `attw`, pack/install consumer smoke before publishing.

- [ ] **Step 5: Do not claim external npm configuration is complete**

README must state that npm Trusted Publisher configuration is a registry-side prerequisite. The connector has no npm settings write capability, so acceptance criterion `Trusted Publisher configured` remains blocked until registry evidence exists.

---

### Task 9: Make Aggregate CI Represent Every Repository Gate

**Files:**
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: lint, test, check-types, build, consumer, toolchain compatibility, framework compatibility, Windows consumer, Gitleaks, and dependency review results that live in the workflow.
- Produces: one stable `ci` conclusion.

- [ ] **Step 1: Keep individual diagnostic jobs visible**

Do not collapse jobs into an opaque script/controller.

- [ ] **Step 2: Update `ci.needs`**

Remove `diagnostic-snapshot`. Add `framework-compatibility`, `gitleaks`, and dependency review if implemented in this workflow.

- [ ] **Step 3: Update result validation**

Expose each `needs.*.result` into environment variables and require every expected result to equal `success`. Never use `continue-on-error` to greenwash a required gate.

- [ ] **Step 4: Verify ruleset mismatch remains explicitly external**

The current `main` ruleset still requires old implementation job names. Do not modify it through unsupported endpoints or weaken CI to match it. Record exact required-check migration needed after PR merge authorization.

---

### Task 10: Full GitHub Engineering Loop and Evidence Closure

**Files:**
- Modify only files implicated by observed CI/review failures and already inside approved scope.
- Update: Draft PR body with final evidence matrix.

**Interfaces:**
- Consumes: GitHub Actions jobs, job logs, CodeRabbit/review threads, changed-file diff.
- Produces: green implementation branch and precise list of external settings blockers.

- [ ] **Step 1: Open Draft PR**

Target `main`, keep branch `feat/complete-open-issues`, describe all issue mappings and non-goals.

- [ ] **Step 2: Observe RED before GREEN for behavior-bearing compatibility work**

Fetch workflow runs/jobs/logs for the RED commit and record the expected failing assertion/path.

- [ ] **Step 3: Implement GREEN and push**

Make minimal production changes needed by the failing evidence.

- [ ] **Step 4: Loop CI failures**

For every failing job: fetch job steps/logs, classify root cause, make the smallest approved fix, push, and rerun. Do not create a new issue or branch for symptoms in the same causal chain.

- [ ] **Step 5: Loop review feedback**

Fetch review threads and top-level PR comments. Address only concrete correctness/security/maintainability findings supported by code/upstream behavior. Reply with evidence and resolve threads only after the corresponding change is present.

- [ ] **Step 6: Verification-before-completion**

Before claiming implementation complete, verify:

- branch head SHA is known;
- all expected CI jobs on that SHA are successful;
- aggregate `ci` is successful;
- changed-file list matches the approved scope;
- no public rules/API changed unintentionally;
- no `NPM_TOKEN`, secret, paid SaaS, mutation service, plugin-shaped preset, or custom certification layer was introduced;
- release workflow contains no publish operation on pull requests or ordinary pushes;
- issue #30's superseded Stryker requirement was not reintroduced;
- external/admin acceptance criteria are clearly separated from repository-file completion.

- [ ] **Step 7: Update Draft PR body with final issue evidence**

For each open issue, classify `implemented in branch`, `already satisfied by main`, `superseded by later maintainer decision`, or `blocked by external admin capability`, with concrete file/job/settings evidence.

- [ ] **Step 8: Stop before destructive actions**

Do not merge the PR, publish npm, create tags/releases manually, close issues, or change GitHub ruleset/settings without a separately approved destructive/admin Change Set.
