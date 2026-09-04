# Design Specification: GitHub Actions CI Simplification & Workflow Standardization

- **Issue**: [#53](https://github.com/useyarapa/eslint-config-yarapa-resover/issues/53)
- **Status**: Approved
- **Date**: 2026-09-04
- **Branch Target**: `clean-code`

---

## 1. Context & Objectives

A focused audit of `.github/` revealed that while the core building blocks exist, CI implementation contains:
1. Inconsistent job/step display naming conventions.
2. Divergence between local developer commands (which use Turborepo / canonical root scripts) and CI jobs (which bypassed the root task graph and directly executed package-filtered commands).
3. Missing linting for GitHub Actions workflows themselves via `actionlint`.
4. Obsolete migration shims (`diagnostic-snapshot`).
5. Overly complex custom REST API probe and fallback logic in the Dependency Review job for public repositories.

This design standardizes workflow linting, removes unnecessary bespoke shims, aligns CI commands with canonical repository tasks, and establishes consistent, professional human-facing naming across all GitHub Actions workflows.

---

## 2. Architecture & Topology

### Workflow Topology (`.github/workflows/ci.yml`)

The aggregate CI outcome remains stable and deterministic: individual verification jobs run concurrently and aggregate into a single required status check job (`ci`).

```text
Parallel Verification Jobs:
├── actionlint                (Actionlint - Official rhysd/actionlint v1.7.12)
├── lint                      (Lint - Canonical root `pnpm lint`)
├── test                      (Test - Canonical root `pnpm test`)
├── check-types               (Type Check - Canonical root `pnpm check-types`)
├── build                     (Build - Canonical root `pnpm build` + package checks)
├── consumer                  (Consumer Test)
├── compatibility             (Compatibility Matrix)
├── framework-compatibility   (Framework Compatibility Matrix)
├── windows-consumer          (Windows Consumer Test)
├── dependency-review         (Dependency Review - Native First-party Action, PR only)
├── gitleaks                  (Gitleaks - OSS CLI, Zero-cost license exception)
└── changesets                (Changesets - Release intent validation, PR only)
        │
        └───► ci              (CI Aggregate Check)
```

The legacy `diagnostic-snapshot` job is removed entirely. The `ci` job lists all 12 active verification jobs in `needs:` and validates their results directly.

---

## 3. Detailed Component Specifications

### 3.1. Workflow Linting (`actionlint`)
- **Job ID**: `actionlint`
- **Job Name**: `Actionlint`
- **Target**: Validate all `.github/workflows/*.yml` for syntax, expressions, and action contract violations.
- **Implementation**:
  - Maintain upstream `rhysd/actionlint` CLI (`v1.7.12`).
  - Download official Linux x64 binary archive and verify against SHA256 checksum (`194b3c95964f40f2f3d6db875150fb319df6b2a0c647b9bf22718e27cce97c11`).
  - Execute `actionlint -color -shellcheck= -pyflakes=` directly without intermediate wrapper actions or external SaaS.
  - Lightweight runner execution (~1-2 seconds) with no Node.js or Go toolchain setup overhead.

### 3.2. Canonical Command & Turborepo Alignment
Eliminate dual-orchestration models by using repository-defined canonical commands:
- **`lint` Job**:
  - Execute canonical `pnpm lint` (`pnpm --filter eslint-config-yarapa build && eslint .`).
  - Preserves end-to-end repository self-dogfooding without duplicating scripts in YAML.
- **`test` Job**:
  - Execute canonical `pnpm test` (delegates through `turbo run test`).
- **`check-types` Job**:
  - Execute canonical `pnpm check-types` (delegates through `turbo run check-types`).
- **`build` Job**:
  - Execute `pnpm build` (delegates through `turbo run build`) followed by package packaging checks `pnpm --filter eslint-config-yarapa check:publint` and `pnpm --filter eslint-config-yarapa check:attw`.
- **Specialized Matrix Testing (`consumer`, `compatibility`, `framework-compatibility`, `windows-consumer`)**:
  - Maintain direct execution of `pnpm --filter eslint-config-yarapa test:consumer` with matrix-injected environment variables (`ESLINT_VERSION`, `TYPESCRIPT_VERSION`, `FRAMEWORK_PROFILE`, etc.).
  - Retains environment and version isolation as designed per Finding 2.

### 3.3. Dependency Review Simplification
- Remove custom curl REST probe (`Probe GitHub Dependency Review availability`) and fallback orchestration (`Detect dependency graph changes`, `pnpm audit`).
- Use official first-party `actions/dependency-review-action@a1d282b36b6f3519aa1f3fc636f609c47dddb294 # v5.0.0` directly.
- Runs exclusively on `pull_request` events with `contents: read` permission.

### 3.4. Gitleaks Direct CLI Exception
- Retain the official Gitleaks OSS CLI direct download with SHA256 checksum verification.
- Documented zero-cost OSS licensing exception (Finding 5) to avoid commercial license constraints required by `gitleaks/gitleaks-action` on organization repositories.
- Standardize step names.

### 3.5. Removal of `diagnostic-snapshot` & Updating Aggregate `ci`
- Remove the `diagnostic-snapshot` job. GitHub ruleset check confirmed no required status check depends on `diagnostic-snapshot`.
- Update the `ci` aggregate job:
  - `needs` array updated:
    ```yaml
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
    ```
  - Verification script checks `ACTIONLINT_RESULT: ${{ needs.actionlint.result }}`.
  - Ensures any failure in any upstream job immediately causes `ci` to fail.

### 3.6. Naming Conventions Across Workflows
Standardize naming across `ci.yml`, `release.yml`, and `scorecard.yml`:
1. **Workflow Names**: Keep human-readable (`CI`, `Release`, `OpenSSF Scorecard`).
2. **Job IDs**: Keep stable kebab-case identifiers (`actionlint`, `lint`, `test`, `check-types`, `build`, `consumer`, `compatibility`, `framework-compatibility`, `windows-consumer`, `dependency-review`, `gitleaks`, `changesets`, `ci`, `select-mode`, `version`, `pack`, `publish`, `analysis`).
3. **Job Display Names**: Title Case format consistently:
   - `ci.yml`: `Actionlint`, `Lint`, `Test`, `Type Check`, `Build`, `Consumer Test`, `Compatibility (${{ matrix.name }})`, `Framework Compatibility (${{ matrix.name }})`, `Windows Consumer Test`, `Dependency Review`, `Gitleaks`, `Changesets`, `CI`.
   - `release.yml`: `Select Mode`, `Version`, `Pack`, `Publish`.
   - `scorecard.yml`: `Scorecard Analysis`.
4. **Step Names**: Concise, consistent imperative/action phrases (e.g., `Checkout repository`, `Set up pnpm`, `Lint GitHub Actions workflows`, `Run repository lint`, `Run tests`, `Check types`, `Build package`).

### 3.7. Action Pinning & Security
- Every external action must strictly adhere to full-length commit SHA references with human-readable release comments (e.g. `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7`).
- Zero mutable tags (`@v*`, `@main`) permitted.

---

## 4. Verification & Testing Plan

1. **Workflow Syntax & Semantic Validation**:
   - Run `actionlint` locally on all `.github/workflows/*.yml` to ensure zero syntax or linting errors.
2. **Repository Consistency**:
   - Run `pnpm lint`
   - Run `pnpm check-types`
   - Run `pnpm test`
   - Run `pnpm build`
   - Run `pnpm --filter eslint-config-yarapa check:publint`
   - Run `pnpm --filter eslint-config-yarapa check:attw`
   - Run `pnpm --filter eslint-config-yarapa test:consumer`
3. **Diff & Surface Audit**:
   - Verify `git diff` touches only intended workflow files (`.github/workflows/ci.yml`, `.github/workflows/release.yml`, `.github/workflows/scorecard.yml`) and spec documentation.
