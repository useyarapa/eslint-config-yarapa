# eslint-config-yarapa Release Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete Issue #1's release-hardening requirements so `eslint-config-yarapa@0.1.0` has executable behavioral verification, a generated Rule Inventory, consumer-package validation, self-linting, CI evidence, and release-ready documentation without changing the sixteen-preset public API.

**Architecture:** Keep production configuration modules under `packages/eslint-config-yarapa/src/configs/` unchanged unless a failing verification proves a defect. Add verification as separate `test/`, `fixtures/`, `generated/`, and `scripts/` boundaries. GitHub Actions is the authoritative execution environment because the current ChatGPT sandbox cannot resolve github.com for a local clone.

**Tech Stack:** ESLint 10 Flat Config, TypeScript 6.0.3 for package development, Vitest 4.1.11, tsdown 0.22.14, pnpm 11.23.0, Changesets, publint, @arethetypeswrong/cli, GitHub Actions.

**Spec:** `docs/POLICY.md`, ADRs 0001-0003, and GitHub Issue #1.

## Global Constraints

- ESLint 10 only; Flat Config only; ESM consumption only.
- Node.js `>=24.15.0`; the release matrix must explicitly test the certified Node lines.
- TypeScript peer range remains `>=5.0.0 <6.1.0`; package-local development compiler remains exactly `6.0.3`.
- Public API remains one named export, `configs`, containing exactly sixteen array presets.
- No default export and no code subpath exports.
- Exact pins remain mandatory for plugins, parsers, resolvers, language implementations, and globals.
- Keep `src/configs/*.ts` as public-preset modules and `src/configs/internal/*.ts` as non-public composition helpers.
- Do not add framework presets or unrelated rule expansion.
- The first `0.1.0` publish remains interactive with 2FA; CI added here verifies release readiness but does not publish npm.
- Final branch must be squashed to one Conventional Commit with required scope and no body/footer.

---

### Task 1: Establish executable CI and failing release-gate tests

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `packages/eslint-config-yarapa/test/release-gate.test.ts`

**Interfaces:**
- Consumes: existing package scripts `test`, `check-types`, `build`.
- Produces: independent CI evidence for tests, type checking, and build; structural release-gate tests that fail until required artifacts exist.

- [ ] **Step 1: Add structural tests before implementation**

```ts
const requiredPaths = [
  "generated/rule-inventory.json",
  "scripts/generate-rule-inventory.mts",
  "scripts/verify-tarball.mts",
];

for (const relativePath of requiredPaths) {
  expect(existsSync(resolve(packageRoot, relativePath))).toBe(true);
}
```

Also assert that package scripts expose `inventory:check`, `test:consumer`, and `verify`, and that the root repository contains an ESLint Flat Config.

- [ ] **Step 2: Run CI and verify RED**

GitHub Actions must run these independently so one failure does not hide another:

```sh
pnpm --filter eslint-config-yarapa test
pnpm --filter eslint-config-yarapa check-types
pnpm --filter eslint-config-yarapa build
```

Expected before implementation: release-gate tests fail because required artifacts/scripts do not exist; typecheck/build may expose existing source typing defects.

### Task 2: Make package source type-safe and build-clean without changing behavior

**Files:**
- Modify only source files named by fresh `tsc --noEmit` failures.
- Test: existing contract suite plus new config-validation tests.

**Interfaces:**
- Consumes: upstream plugin config objects.
- Produces: the same runtime Flat Config arrays with ESLint-compatible public types.

- [ ] **Step 1: Capture exact compiler diagnostics from CI**
- [ ] **Step 2: Add the smallest type guards/casts needed at upstream package boundaries**
- [ ] **Step 3: Re-run `check-types`, `test`, and `build`**

No rule severity, option, preset ordering, or public export changes are allowed as part of type cleanup.

### Task 3: Add behavioral ESLint validation and fixtures

**Files:**
- Create: `packages/eslint-config-yarapa/test/config-validation.test.ts`
- Create: `packages/eslint-config-yarapa/test/composition.test.ts`
- Create: `packages/eslint-config-yarapa/test/type-aware.test.ts`
- Create: `packages/eslint-config-yarapa/test/runtime-scopes.test.ts`
- Create: `packages/eslint-config-yarapa/test/test-runners.test.ts`
- Create: `packages/eslint-config-yarapa/fixtures/valid/**`
- Create: `packages/eslint-config-yarapa/fixtures/invalid/**`
- Create: `packages/eslint-config-yarapa/fixtures/projects/**`

**Interfaces:**
- Consumes: `configs` from source/build and ESLint's programmatic API.
- Produces: fixtures covering JavaScript, TypeScript, JSX, TSX, declaration files, JSON, JSONC, JSON5, package manifests, mixed runtimes, Vitest, AVA, Testing Library, typed TS, and sanctioned out-of-project tooling files.

- [ ] **Step 1: Write invalid fixtures tied to deterministic rule IDs**
- [ ] **Step 2: Verify each invalid fixture reports the intended rule**
- [ ] **Step 3: Write matching valid fixtures and require zero errors**
- [ ] **Step 4: Verify scoped composition prevents Node/browser and runner globals/rules from leaking**

### Task 4: Generate and verify the Rule Inventory

**Files:**
- Create: `packages/eslint-config-yarapa/scripts/generate-rule-inventory.mts`
- Create: `packages/eslint-config-yarapa/generated/rule-inventory.json`
- Create: `packages/eslint-config-yarapa/test/inventory.test.ts`
- Modify: `packages/eslint-config-yarapa/package.json`

**Interfaces:**
- Consumes: built `configs` and pinned SonarJS plugin exports.
- Produces: deterministic JSON entries with `preset`, `configName`, `rule`, `severity`, `options`, and `source`.

- [ ] **Step 1: Generate entries deterministically and sort them**
- [ ] **Step 2: Add `--check` mode that fails on drift**
- [ ] **Step 3: Assert every exported SonarJS rule appears enabled as `error` in the relevant inventory coverage**
- [ ] **Step 4: Commit the generated inventory and verify regeneration is byte-identical**

### Task 5: Verify autofix safety and idempotence

**Files:**
- Create: `packages/eslint-config-yarapa/test/autofix.test.ts`
- Add focused stylistic/unused-import fixtures under `fixtures/`.

**Interfaces:**
- Consumes: ESLint `fix: true` execution against deterministic fixable rules.
- Produces: proof that a second fix pass has no additional changes and that fixes preserve the tested program behavior boundary.

- [ ] **Step 1: Run first fix pass and assert expected formatting/removal only**
- [ ] **Step 2: Run second fix pass and assert byte-identical output**

### Task 6: Add tarball consumer and package-shape verification

**Files:**
- Create: `packages/eslint-config-yarapa/scripts/verify-tarball.mts`
- Create: `packages/eslint-config-yarapa/test/tarball-consumer.test.ts`
- Modify: `packages/eslint-config-yarapa/package.json`

**Interfaces:**
- Consumes: `pnpm pack`, the produced tarball, explicit ESLint/TypeScript versions from environment variables.
- Produces: a temporary consumer install that imports `configs`, validates the single public entrypoint, and executes ESLint against representative JS/TS input.

- [ ] **Step 1: Build and pack the package**
- [ ] **Step 2: Install tarball with explicit peer versions in an isolated temp directory**
- [ ] **Step 3: Import `eslint-config-yarapa` and assert exactly the sixteen presets**
- [ ] **Step 4: Run publint and ATTW against the packed package**
- [ ] **Step 5: Exercise Windows in CI**

### Task 7: Self-lint the repository and remove the Prettier contradiction

**Files:**
- Create: `eslint.config.mjs`
- Modify: `package.json`
- Modify: `.lintstagedrc.json`
- Modify: `packages/eslint-config-yarapa/package.json`
- Modify: `turbo.json` only where needed for test/release tasks.

**Interfaces:**
- Consumes: the built workspace package and its published stylistic/Banking Baseline presets.
- Produces: ESLint-based repository lint/fix workflow with no Prettier/Biome dependency.

- [ ] **Step 1: Remove root Prettier dependency and `format` script**
- [ ] **Step 2: Configure staged source/config files to use ESLint fixes rather than Prettier**
- [ ] **Step 3: Add a root Flat Config that composes YARAPA with explicit repository-owned scopes**
- [ ] **Step 4: Run self-lint in CI after build**

### Task 8: Add Changesets, Dependabot policy, and CI compatibility matrix

**Files:**
- Create: `.changeset/config.json`
- Create: `.changeset/README.md`
- Modify: `.github/dependabot.yml`
- Modify: `.github/workflows/ci.yml`
- Modify: root `package.json`

**Interfaces:**
- Produces: reviewed SemVer workflow, grouped ESLint-ecosystem dependency proposals without auto-merge, and CI matrix evidence for supported boundaries.

- [ ] **Step 1: Add exact-pinned `@changesets/cli` and root scripts**
- [ ] **Step 2: Configure Dependabot grouped updates without auto-merge**
- [ ] **Step 3: Test Node minimum/current supported line, ESLint 10 minimum/current, TypeScript minimum/maximum supported lines, plus Windows tarball smoke**

### Task 9: Replace starter/WIP docs with consumer-grade documentation

**Files:**
- Modify: `README.md`
- Modify: `packages/eslint-config-yarapa/README.md`
- Modify: `AGENTS.md` current-status section.

**Interfaces:**
- Produces: accurate installation, composition, conformance, supported-platform, verification, and release documentation.

- [ ] **Step 1: Replace Turborepo starter text with repository-specific documentation**
- [ ] **Step 2: Replace package WIP/target wording with verified current behavior only**
- [ ] **Step 3: Document composition order and `defineConfig`/`extends` example from POLICY**
- [ ] **Step 4: Document release-gate commands and compatibility boundaries**

### Task 10: Final verification and PR/Issue synchronization

**Files:**
- Update PR description and Issue #1 checklist only after fresh evidence.

- [ ] **Step 1: Run the full CI release gate**
- [ ] **Step 2: Inspect every job and record exact pass/fail evidence**
- [ ] **Step 3: Compare branch to `main` and ensure no unrelated API/rule expansion**
- [ ] **Step 4: Squash branch to one `type(scope): subject` commit**
- [ ] **Step 5: Re-run CI on the squashed SHA**
- [ ] **Step 6: Mark only evidenced checklist items complete; do not close Issue #1 unless every POLICY gate is green**
