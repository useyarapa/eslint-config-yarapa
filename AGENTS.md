# AGENTS.md

Instructions for AI coding agents (Claude, Gemini, opencode, etc.) working in
this repository. `CLAUDE.md` and `GEMINI.md` point here; keep this file the
single source of truth for agent-facing repo conventions.

## What this repo is

`yarapa-code-standard` is a pnpm + Turborepo monorepo whose flagship
deliverable is **`eslint-config-yarapa`**: a strict, high-assurance ESLint
Flat Config package for JavaScript/TypeScript repositories in regulated Thai
banking environments. A second package, **`@repo/typescript-config-yarapa`**,
provides the shared `tsconfig.json` bases consumed by the first.

```text
.
├── docs/
│   ├── POLICY.md                 # THE spec — read this first
│   └── adr/0001-0003-*.md        # Accepted architecture decisions
├── CONTEXT.md                    # Terminology glossary — use these terms
├── packages/
│   ├── eslint-config-yarapa/     # Main deliverable
│   └── typescript-config-yarapa/ # Shared tsconfig bases (@repo/*)
├── knip.json, turbo.json, pnpm-workspace.yaml
```

## Read before writing any code

1. **`docs/POLICY.md`** — the full contract: the 16 required `configs`
   presets, the Banking Baseline composition rules for `recommended`, the
   mandatory plugin list (18 exact-pinned packages), the stylistic standard,
   waiver rules, and verification requirements. Every implementation
   decision must trace back to this document.
2. **`docs/adr/0001-0003-*.md`** — accepted ADRs that lock in:
   - ESLint 10 / Flat Config / ESM-only / Node.js `>=24.15.0`.
   - `typescript` peer range `>=5.0.0 <6.1.0`. **TypeScript 7 is explicitly
     unsupported** — do not let a TS7 toolchain leak into this package's own
     type-checking (see "Known toolchain gotcha" below).
   - One named export `configs` only — no default export, no subpath
     exports.
   - Exact-pinned (no `^`/`~`) direct dependencies for every
     plugin/parser/resolver/globals package the presets use.
3. **`CONTEXT.md`** — glossary (Preset, Capability Preset, Aggregate Preset,
   Banking Baseline, Waiver, Conforming Repository, etc.). Use these terms
   consistently in code comments, commit messages, and docs.

## The 16 required presets (`eslint-config-yarapa`)

`recommended`, `base`, `typescript`, `typeChecked`, `disableTypeChecked`,
`node`, `browser`, `stylistic`, `ignores`, `security`, `testingLibrary`,
`vitest`, `ava`, `json`, `packageJson`, `jsdoc`.

`recommended` is the aggregate **Banking Baseline** and deliberately
_excludes_ `node`, `browser`, `vitest`, `ava`, `ignores` — those need
repo-scoped `files` globs supplied by the consuming repository, so the
consumer composes them explicitly alongside `recommended`.

Source layout: `packages/eslint-config-yarapa/src/configs/*.ts` (one file per
public preset) plus `src/configs/internal/*.ts` for composition-only modules
(SonarJS all-rules, import-x resolution, Perfectionist ordering) that are
folded into `recommended` but are not themselves exported presets.
`src/index.ts` is the single entry point exporting `configs`.

## Known toolchain gotcha: root `typescript@7.0.2` vs. this package

The **root** `package.json` pins `"typescript": "7.0.2"` for the monorepo's
own tooling. `typescript-eslint@8.68.0` (a dependency of
`eslint-config-yarapa`) only supports TypeScript `>=4.8.4 <6.1.0`, and TS7
changed its public namespace exports (`SyntaxKind`, `Program`, `SourceFile`,
etc.), which breaks `@typescript-eslint/*` type declarations entirely if TS7
is what gets resolved for this package's own `tsc --noEmit`.

**Fix already applied**: `packages/eslint-config-yarapa/package.json` pins
its own `devDependencies.typescript` to `6.0.3` so pnpm's per-package
resolution picks a compatible compiler for this package's type-checking,
independent of the root's TS7. If you touch this package's dependencies,
keep that pin — do not let it silently resolve back to the root's TS7.

## pnpm quirk: `minimumReleaseAgeExclude` auto-injection

Running `pnpm install` or `pnpm add` in this workspace has repeatedly
auto-injected an unwanted `minimumReleaseAgeExclude: [eslint-plugin-jsdoc@64.3.1]`
entry into `pnpm-workspace.yaml`. This is pnpm's supply-chain policy gate
reacting to that package's release age, not an intentional config change.
**After any `pnpm install`/`pnpm add`, check `git diff pnpm-workspace.yaml`
and revert that entry if it reappears** unless a human explicitly asks for
it.

## Commit messages: commitlint + husky

Commit messages are enforced by `commitlint` via a husky `commit-msg` hook
(`.husky/commit-msg`, config in `.commitlintrc.json`). Every commit must be
Conventional Commits style **with a required scope** and **no body/footer**:

```text
<type>(<scope>): <subject>
```

- `type` — one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`,
  `refactor`, `revert`, `style`, `test`; lower-case.
- `scope` — required (not empty), lower-case.
- `subject` — required, max 50 characters, no trailing `!`.
- Body and footer must be **empty** (`body-empty`/`footer-empty` are set to
  `"always"` error) — keep the full context in the PR description instead of
  the commit body.

This is stricter than the platform's usual multi-paragraph commit message
convention (see the standing git workflow rules) — when this hook is active,
prefer a single short `type(scope): subject` line and put detail in the PR
body, not the commit message.

The hook runs via `npx --no -- commitlint --edit "$1"`; `husky` is wired
through `core.hooksPath = .husky/_` and the root `prepare` script (`husky`),
which pnpm runs automatically on `pnpm install`.

## Pre-commit: gitleaks + lint-staged

A husky `pre-commit` hook (`.husky/pre-commit`) runs before every commit:

1. Checks for the `gitleaks` binary (`command -v gitleaks`); if missing, it
   prints a platform-specific install hint (`brew install gitleaks` on
   macOS, the GitHub install docs link on Linux/other) and exits 1. This is
   a system-level Go binary, **not** an npm package — install it yourself,
   it is not managed by `pnpm install`.
2. Runs `gitleaks protect --staged --exit-code=1` to block commits that
   introduce secrets into staged changes.
3. Runs `npx lint-staged`, which applies `prettier --write` to staged
   `*.{ts,tsx}`, `*.{js,jsx,mjs,cjs}`, and `*.{json,md,yml,yaml}` files per
   the root `.lintstagedrc.json`.

## Vitest + Stryker mutation testing (`eslint-config-yarapa`)

- `vitest.config.ts` runs `test/**/*.test.ts` under the `node` environment
  with v8 coverage (`pnpm --filter eslint-config-yarapa test`, or
  `test:coverage` for the coverage report). Keep
  `@vitest/coverage-v8`'s version pinned to exactly match `vitest`'s.
- `stryker.config.json` runs Stryker mutation testing against
  `src/**/*.ts` using the `vitest` test runner
  (`pnpm --filter eslint-config-yarapa test:mutation`).
  - Under pnpm's isolated `.pnpm` virtual store, Stryker's default
    sibling-directory plugin auto-discovery cannot find
    `@stryker-mutator/vitest-runner`, so it must be listed explicitly in
    `stryker.config.json`'s `plugins` array.
  - `@stryker-mutator/core` has no direct `typescript` dependency of its
    own, so its dynamic `import('typescript')` otherwise resolves to the
    hoisted root `typescript@7.0.2`, which is incompatible with
    `typescript-eslint`'s peer range. `pnpm-workspace.yaml`'s
    `packageExtensions["@stryker-mutator/core"].dependencies.typescript`
    pins it to `6.0.3` to match this package's own `typescript` version.
  - Stryker writes a runtime cache/output directory,
    `packages/eslint-config-yarapa/.stryker-tmp/`, which is gitignored
    (`.stryker-tmp` in the root `.gitignore`) — never commit it.

## `knip` on this sandbox: raw-transfer OOM

`knip` (root devDependency, config in `knip.json`) depends on `oxc-parser`,
which on Node 22 tries to reserve a very large raw-transfer `ArrayBuffer`
per parse. On this memory-constrained sandbox that throws
`RangeError: Array buffer allocation failed`. Always run knip with the raw
transfer disabled:

```sh
KNIP_DISABLE_RAW_TRANSFER=1 npx knip
```

## Commands

Run everything from the repo root unless noted.

```sh
pnpm install                                        # install workspace deps
KNIP_DISABLE_RAW_TRANSFER=1 npx knip                 # unused deps/exports
pnpm --filter eslint-config-yarapa check-types       # tsc --noEmit
pnpm --filter eslint-config-yarapa build             # tsdown -> dist/
pnpm --filter eslint-config-yarapa test              # vitest run
pnpm --filter eslint-config-yarapa test:coverage      # vitest run --coverage
pnpm --filter eslint-config-yarapa test:mutation      # stryker run (mutation testing)
pnpm --filter eslint-config-yarapa lint              # eslint . (once self-lint is wired)
turbo run build / lint / check-types                 # workspace-wide via Turborepo
```

## Import style for flat-config plugin packages

Use plain static `import x from "pkg"` for CJS/mixed ESLint plugins to get
direct `.configs`/`.rules` access (e.g. `promisePlugin.configs["flat/recommended"]`).
Dynamic `import()` probing can surface a different shape (`.default.configs`)
that does not match what static import gives you at runtime — don't mix the
two conventions when reading a new plugin's exports; verify with static
import first.

## Git / PR workflow

Standard platform rules apply on top of the above:

- Work on `genspark_ai_developer`, rebase onto `origin/main` before pushing,
  resolve conflicts favoring remote, squash local commits into one
  comprehensive commit before opening/updating a PR, and always report the
  PR URL back to the user.
- Every code change must be committed; every commit must be reflected in an
  open PR (draft is fine while `check-types`/`build`/tests are not yet
  green — see `docs/POLICY.md` "Verification").
- Track outstanding implementation work against the checklist in
  [Issue #1](https://github.com/useyarapa/eslint-config-yarapa/issues/1) and
  keep PR #2's description in sync with actual progress; don't mark work
  "done" in a PR description until `check-types`, `build`, and the relevant
  parts of the verification suite actually pass.

## Current status (update this section as work progresses)

All 16 preset source files exist under
`packages/eslint-config-yarapa/src/configs/`. Outstanding before this can be
considered feature-complete (see Issue #1 for the live checklist):

- `tsc --noEmit` is not yet clean — remaining errors are `possibly undefined`
  narrowing on several upstream `flat/recommended`-style exports, and a
  structural mismatch between `@eslint/core` and `@types/eslint`'s
  `Linter.Config` types.
- No `tsdown` build has succeeded yet.
- A 19-test Vitest contract suite exists at
  `packages/eslint-config-yarapa/test/configs.test.ts`, covering the
  sixteen preset names/shapes plus targeted regressions (AVA's
  package.json entry, Testing Library's file scoping, `recommended`'s
  excluded stack presets). Outstanding per POLICY.md's Verification
  section: fixtures per preset, self-lint dogfooding, tarball smoke test,
  `publint`, `@arethetypeswrong/cli`.
- `scripts/generate-rule-inventory.ts` (referenced by `package.json`) does
  not exist yet.
- Root `turbo.json` / root scripts are not wired to the new package.
- Changesets tooling is not set up.
- `eslint-plugin-ava` has no upstream `@types` package; a local `.d.ts` shim
  is still needed. The package.json-specific `ava/no-ava-in-dependencies`
  rule (from `avaPlugin.configs.recommended[1]`) is now wired as
  `yarapa/ava/no-ava-in-dependencies` in `src/configs/ava.ts`.
