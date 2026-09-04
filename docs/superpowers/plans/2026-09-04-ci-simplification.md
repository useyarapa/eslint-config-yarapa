# CI Simplification & Workflow Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize GitHub Actions workflows with upstream `actionlint`, align CI commands with canonical repository tasks, remove obsolete migration logic, and enforce consistent display naming across `.github/workflows/`.

**Architecture:** Maintain a parallel verification topology in `.github/workflows/ci.yml` that aggregates into a stable `ci` status check. Replace bespoke shims with upstream capabilities (official `actionlint` binary, official `actions/dependency-review-action`, canonical `pnpm` root commands), and remove obsolete runtime force flags from `ci.yml` and `release.yml`.

**Tech Stack:** GitHub Actions, `rhysd/actionlint` v1.7.12, Turborepo, pnpm 11, Node.js 24, ESLint 10, Gitleaks CLI.

## Global Constraints

- Native first, official upstream second, custom code last.
- All external actions must remain pinned to immutable full-length commit SHAs with version/tag comments.
- Do not bypass Turborepo or canonical root scripts for core package tasks (`build`, `test`, `check-types`, `lint`).
- Do not remove consumer matrix testing or specialized compatibility matrix jobs.
- Zero mutable tags (`@v*`, `@main`) for Actions.
- Conventional commits format enforced by commitlint (`type(scope): subject`, no body, no footer, max 50 chars).

---

### Task 1: Pre-Deletion Verification of Diagnostic Snapshot

**Files:**
- Test/Inspect: GitHub API via `gh` CLI

**Interfaces:**
- Consumes: Current repository branch rulesets and classic branch protection settings.
- Produces: Definitive confirmation that no required check depends on `diagnostic-snapshot`.

- [ ] **Step 1: Check GitHub Ruleset status checks**

Run:
```bash
gh api repos/useyarapa/eslint-config-yarapa/rulesets/21984697
```
Verify: Ensure no `required_status_checks` rule exists in the ruleset.

- [ ] **Step 2: Check Classic Branch Protection status checks**

Run:
```bash
gh api repos/useyarapa/eslint-config-yarapa/branches/main/protection/required_status_checks 2>&1 || true
```
Expected: Either HTTP 404 (Branch not protected / No status checks) or JSON without `diagnostic-snapshot`.

- [ ] **Step 3: Document verification result**

Verify: Confirm that neither system requires `diagnostic-snapshot`. (If any required check references it, halt and report to user).

---

### Task 2: Implement Workflow Linting (`actionlint`) in `ci.yml`

**Files:**
- Modify: `.github/workflows/ci.yml:19-20`

**Interfaces:**
- Consumes: Official release of `rhysd/actionlint` v1.7.12.
- Produces: New `actionlint` job verifying all `.github/workflows/*.yml` files.

- [ ] **Step 1: Add `actionlint` job to `.github/workflows/ci.yml`**

Add the `actionlint` job right before the `lint` job in `.github/workflows/ci.yml`:
```yaml
  actionlint:
    name: Actionlint
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
      - name: Download actionlint
        env:
          ACTIONLINT_SHA256: 8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8
          ACTIONLINT_VERSION: 1.7.12
        run: |
          set -euo pipefail
          archive="actionlint_${ACTIONLINT_VERSION}_linux_amd64.tar.gz"
          url="https://github.com/rhysd/actionlint/releases/download/v${ACTIONLINT_VERSION}/${archive}"
          curl --fail --location --silent --show-error --output "$archive" "$url"
          echo "${ACTIONLINT_SHA256}  ${archive}" | sha256sum --check
          tar -xzf "$archive" actionlint
      - name: Lint GitHub Actions workflows
        run: ./actionlint -color -pyflakes=
```

- [ ] **Step 2: Test actionlint locally**

Run:
```bash
actionlint -color -pyflakes=
```
Expected: PASS with no output/errors.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci(workflow): add actionlint job to ci workflow"
```

---

### Task 3: Align Core Tasks with Canonical Root Commands and Remove Obsolete Runtime Flags

**Files:**
- Modify: `.github/workflows/ci.yml:16-18, 41-75`
- Modify: `.github/workflows/release.yml:14-16`

**Interfaces:**
- Consumes: Canonical scripts from `package.json` (`pnpm lint`, `pnpm test`, `pnpm check-types`, `pnpm build`).
- Produces: Workflows without `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` and jobs aligned to the root task graph.

- [ ] **Step 1: Remove `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` from `ci.yml` and `release.yml`**

In `.github/workflows/ci.yml`, delete lines 16-18:
```yaml
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"
```

In `.github/workflows/release.yml`, delete lines 14-16:
```yaml
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"
```

- [ ] **Step 2: Update `lint`, `test`, `check-types`, and `build` jobs in `ci.yml` to canonical commands**

Update the run steps in `ci.yml`:
In `lint` job:
```yaml
    steps:
      - name: Checkout repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
      - name: Set up pnpm
        uses: pnpm/setup@703c52620218391530e48b9e8870d5c0082e1b9b # v2.1.0
        with:
          runtime: node@24.15.0
          cache: true
      - name: Lint repository
        run: pnpm lint
```

In `test` job:
```yaml
    steps:
      - name: Checkout repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
      - name: Set up pnpm
        uses: pnpm/setup@703c52620218391530e48b9e8870d5c0082e1b9b # v2.1.0
        with:
          runtime: node@24.15.0
          cache: true
      - name: Run tests
        run: pnpm test
```

In `check-types` job:
```yaml
    steps:
      - name: Checkout repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
      - name: Set up pnpm
        uses: pnpm/setup@703c52620218391530e48b9e8870d5c0082e1b9b # v2.1.0
        with:
          runtime: node@24.15.0
          cache: true
      - name: Check types
        run: pnpm check-types
```

In `build` job:
```yaml
    steps:
      - name: Checkout repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
      - name: Set up pnpm
        uses: pnpm/setup@703c52620218391530e48b9e8870d5c0082e1b9b # v2.1.0
        with:
          runtime: node@24.15.0
          cache: true
      - name: Build package
        run: pnpm build
      - name: Validate package metadata
        run: pnpm --filter eslint-config-yarapa check:publint
      - name: Validate type declarations
        run: pnpm --filter eslint-config-yarapa check:attw
```

- [ ] **Step 3: Run actionlint to verify workflow syntax**

Run:
```bash
actionlint -color -pyflakes=
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/release.yml
git commit -m "ci(workflow): use canonical commands in core tasks"
```

---

### Task 4: Simplify Dependency Review & Gitleaks

**Files:**
- Modify: `.github/workflows/ci.yml` (dependency-review & gitleaks jobs)

**Interfaces:**
- Consumes: Official `actions/dependency-review-action@a1d282b36b6f3519aa1f3fc636f609c47dddb294`.
- Produces: Direct first-party dependency review check without REST availability probe or lockfile fallback logic.

- [ ] **Step 1: Simplify `dependency-review` job in `ci.yml`**

Replace the `dependency-review` job definition with:
```yaml
  dependency-review:
    name: Dependency Review
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Checkout repository
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
        with:
          fetch-depth: 0
          persist-credentials: false
      - name: Review dependency changes
        uses: actions/dependency-review-action@a1d282b36b6f3519aa1f3fc636f609c47dddb294 # v5.0.0
```

- [ ] **Step 2: Standardize step names and display name in `gitleaks` job**

Update `gitleaks` job display name to `Gitleaks`, and ensure checkout step has `name: Checkout repository`.

- [ ] **Step 3: Run actionlint to verify workflow syntax**

Run:
```bash
actionlint -color -pyflakes=
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci(security): simplify dependency review workflow"
```

---

### Task 5: Remove `diagnostic-snapshot` & Update Aggregate `ci` Job

**Files:**
- Modify: `.github/workflows/ci.yml` (`diagnostic-snapshot` and `ci` jobs)

**Interfaces:**
- Consumes: Results of all 12 parallel verification jobs.
- Produces: Single stable aggregate `ci` check without legacy migration shim.

- [ ] **Step 1: Remove `diagnostic-snapshot` job from `ci.yml`**

Delete the entire `diagnostic-snapshot` job block.

- [ ] **Step 2: Update `ci` job dependencies and verification script**

Update `ci` job:
```yaml
  ci:
    name: CI
    if: always()
    needs:
      - actionlint
      - lint
      - test
      - check-types
      - build
      - consumer
      - compatibility
      - framework-compatibility
      - windows-consumer
      - dependency-review
      - gitleaks
      - changesets
    runs-on: ubuntu-latest
    steps:
      - name: Require all verification jobs
        env:
          ACTIONLINT_RESULT: ${{ needs.actionlint.result }}
          BUILD_RESULT: ${{ needs.build.result }}
          CHANGESETS_RESULT: ${{ needs.changesets.result }}
          CHECK_TYPES_RESULT: ${{ needs.check-types.result }}
          COMPATIBILITY_RESULT: ${{ needs.compatibility.result }}
          CONSUMER_RESULT: ${{ needs.consumer.result }}
          DEPENDENCY_REVIEW_RESULT: ${{ needs.dependency-review.result }}
          EVENT_NAME: ${{ github.event_name }}
          FRAMEWORK_COMPATIBILITY_RESULT: ${{ needs.framework-compatibility.result }}
          GITLEAKS_RESULT: ${{ needs.gitleaks.result }}
          LINT_RESULT: ${{ needs.lint.result }}
          TEST_RESULT: ${{ needs.test.result }}
          WINDOWS_CONSUMER_RESULT: ${{ needs.windows-consumer.result }}
        run: |
          if [ "$EVENT_NAME" = "pull_request" ]; then
            test "$DEPENDENCY_REVIEW_RESULT" = success
            test "$CHANGESETS_RESULT" = success
          else
            test "$DEPENDENCY_REVIEW_RESULT" = skipped
            test "$CHANGESETS_RESULT" = skipped
          fi

          for result in \
            "$ACTIONLINT_RESULT" \
            "$BUILD_RESULT" \
            "$CHECK_TYPES_RESULT" \
            "$COMPATIBILITY_RESULT" \
            "$CONSUMER_RESULT" \
            "$FRAMEWORK_COMPATIBILITY_RESULT" \
            "$GITLEAKS_RESULT" \
            "$LINT_RESULT" \
            "$TEST_RESULT" \
            "$WINDOWS_CONSUMER_RESULT"
          do
            test "$result" = success
          done
```

- [ ] **Step 3: Run actionlint to verify workflow syntax**

Run:
```bash
actionlint -color -pyflakes=
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci(workflow): remove diagnostic snapshot shim"
```

---

### Task 6: Standardize Display Names Across All Workflows

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `.github/workflows/release.yml`
- Modify: `.github/workflows/scorecard.yml`

**Interfaces:**
- Consumes: Workflows from previous tasks.
- Produces: Uniform Title Case job display names and concise action-oriented step names across all files.

- [ ] **Step 1: Update job display names in `ci.yml`**

Ensure every job has Title Case `name`:
- `actionlint` -> `name: Actionlint`
- `lint` -> `name: Lint`
- `test` -> `name: Test`
- `check-types` -> `name: Type Check`
- `build` -> `name: Build`
- `consumer` -> `name: Consumer Test`
- `compatibility` -> `name: Compatibility (${{ matrix.name }})`
- `framework-compatibility` -> `name: Framework Compatibility (${{ matrix.name }})`
- `windows-consumer` -> `name: Windows Consumer Test`
- `dependency-review` -> `name: Dependency Review`
- `gitleaks` -> `name: Gitleaks`
- `changesets` -> `name: Changesets`
- `ci` -> `name: CI`

Ensure steps across `ci.yml` have concise action names (`Checkout repository`, `Set up pnpm`, `Run consumer verification`, etc.).

- [ ] **Step 2: Update display names in `release.yml`**

Update job display names:
- `select-mode` -> `name: Select Mode`
- `version` -> `name: Version`
- `pack` -> `name: Pack`
- `publish` -> `name: Publish`

Ensure steps have concise action names (`Checkout repository`, `Set up pnpm`, `Select Changesets mode`, etc.).

- [ ] **Step 3: Update display names in `scorecard.yml`**

Update job display name:
- `analysis` -> `name: Scorecard Analysis`

Ensure steps have concise action names (`Checkout repository`, `Run Scorecard analysis`, `Upload SARIF artifact`, `Upload results to code scanning`).

- [ ] **Step 4: Run actionlint to verify all workflows**

Run:
```bash
actionlint -color -pyflakes=
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/release.yml .github/workflows/scorecard.yml
git commit -m "ci(workflow): standardize workflow display names"
```

---

### Task 7: Full Repository Verification

**Files:**
- Test/Inspect: Entire repository

**Interfaces:**
- Consumes: Modified workflows and repository code.
- Produces: Complete pass of all lint, typecheck, test, build, and consumer checks.

- [ ] **Step 1: Run actionlint**

Run:
```bash
actionlint -color -pyflakes=
```
Expected: PASS with zero errors.

- [ ] **Step 2: Run root lint**

Run:
```bash
pnpm lint
```
Expected: PASS with zero lint errors.

- [ ] **Step 3: Run root check-types**

Run:
```bash
pnpm check-types
```
Expected: PASS with zero type errors.

- [ ] **Step 4: Run root test**

Run:
```bash
pnpm test
```
Expected: PASS (all 29 tests across 6 files pass).

- [ ] **Step 5: Run root build and packaging checks**

Run:
```bash
pnpm build && pnpm --filter eslint-config-yarapa check:publint && pnpm --filter eslint-config-yarapa check:attw
```
Expected: PASS

- [ ] **Step 6: Run package consumer verification**

Run:
```bash
pnpm --filter eslint-config-yarapa test:consumer
```
Expected: PASS

- [ ] **Step 7: Check git status and diff**

Run:
```bash
git status
```
Expected: Clean working tree on branch `clean-code`.
