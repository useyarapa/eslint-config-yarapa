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
├── CONTEXT.md                    # Terminology glossary — use these terms
├── packages/
│   ├── eslint-config-yarapa/     # Main deliverable
│   └── typescript-config-yarapa/ # Shared tsconfig bases (@repo/*)
├── knip.json, turbo.json, pnpm-workspace.yaml
```

## Read before writing any code

1. **`CONTEXT.md`** — glossary (Preset, Capability Preset, Aggregate Preset,
   Banking Baseline, Waiver, Conforming Repository, etc.). Use these terms
   consistently in code comments, commit messages, and repository text.
2. **`packages/eslint-config-yarapa/README.md`** — public package entrypoint
   and consumer-facing API summary.
3. **`packages/eslint-config-yarapa/test/`**, `fixtures/`, and
   `generated/rule-inventory.json` — executable verification and the resolved
   rule contract. Behavioral changes must remain consistent with these gates.

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
(SonarJS high-assurance coverage, import-x resolution, Perfectionist ordering)
that are folded into `recommended` but are not themselves exported presets.
`src/index.ts` is the single entry point exporting `configs`.

## Known toolchain gotcha: root `typescript@7.0.2` vs. this package

The **root** `package.json` pins `"typescript": "7.0.2"` for the monorepo's
own tooling. `typescript-eslint@8.68.0` only supports TypeScript
`>=4.8.4 <6.1.0`, and TS7 changed public namespace exports in ways that break
`@typescript-eslint/*` type declarations if TS7 is resolved for this package's
own `tsc --noEmit`.

`packages/eslint-config-yarapa/package.json` therefore pins its own
`devDependencies.typescript` to `6.0.3`. If you touch this package's
dependencies, keep that pin unless the compatibility boundary is intentionally
changed and verified.

## pnpm quirk: `minimumReleaseAgeExclude` auto-injection

Running `pnpm install` or `pnpm add` in this workspace has repeatedly
auto-injected an unwanted
`minimumReleaseAgeExclude: [eslint-plugin-jsdoc@64.3.1]` entry into
`pnpm-workspace.yaml`. This is pnpm's supply-chain policy gate reacting to that
package's release age, not an intentional config change. After any install,
check `git diff pnpm-workspace.yaml` and revert that entry if it reappears
unless a human explicitly asks for it.

## Commit messages: commitlint + husky

Commit messages are enforced by `commitlint` via a husky `commit-msg` hook
(`.husky/commit-msg`, config in `.commitlintrc.json`). Every commit must be
Conventional Commits style **with a required scope** and **no body/footer**:

```text
<type>(<scope>): <subject>
```

- `type` — one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`,
  `refactor`, `revert`, `style`, `test`; lower-case.
- `scope` — required, lower-case.
- `subject` — required, max 50 characters, no trailing `!`.
- Body and footer must be empty; keep detailed context in the PR description.

## Pre-commit: gitleaks + lint-staged

A husky `pre-commit` hook (`.husky/pre-commit`) runs before every commit:

1. Checks for the `gitleaks` binary and exits if it is unavailable.
2. Runs `gitleaks protect --staged --exit-code=1`.
3. Runs `npx lint-staged` using the root `.lintstagedrc.json`.

## Vitest + Stryker mutation testing (`eslint-config-yarapa`)

- `vitest.config.ts` runs `test/**/*.test.ts` under the `node` environment
  with v8 coverage. Keep `@vitest/coverage-v8` pinned to exactly the same
  version as `vitest`.
- `stryker.config.json` runs mutation testing against `src/**/*.ts` using the
  Vitest runner.
- Under pnpm's isolated store, `@stryker-mutator/vitest-runner` must remain
  explicitly listed in Stryker's `plugins` array.
- `pnpm-workspace.yaml` pins TypeScript for `@stryker-mutator/core` to `6.0.3`
  so Stryker does not resolve the incompatible root TS7 toolchain.
- `packages/eslint-config-yarapa/.stryker-tmp/` is runtime output and must not
  be committed.

## `knip` on this sandbox: raw-transfer OOM

Run knip with raw transfer disabled on memory-constrained environments:

```sh
KNIP_DISABLE_RAW_TRANSFER=1 npx knip
```

## Commands

Run everything from the repo root unless noted.

```sh
pnpm install
KNIP_DISABLE_RAW_TRANSFER=1 npx knip
pnpm --filter eslint-config-yarapa check-types
pnpm --filter eslint-config-yarapa build
pnpm --filter eslint-config-yarapa test
pnpm --filter eslint-config-yarapa test:coverage
pnpm --filter eslint-config-yarapa test:mutation
pnpm --filter eslint-config-yarapa lint
turbo run build lint check-types test
```

## Import style for flat-config plugin packages

Use plain static `import x from "pkg"` for CJS/mixed ESLint plugins to get
direct `.configs`/`.rules` access. Dynamic `import()` probing can surface a
different shape (`.default.configs`) than static import gives at runtime; do
not mix the conventions when inspecting a plugin's exports.

## Git / PR workflow

- Work on a dedicated branch from the latest `main` unless a human explicitly
  names another branch.
- Re-read the latest state before modifying shared repository objects.
- Keep changes limited to the approved scope and do not weaken CI/security to
  obtain a green run.
- Every code change must be committed and reflected in an open PR; draft is
  acceptable while `check-types`, `build`, or relevant tests are not green.
- Before reporting completion, verify the final diff and the required CI jobs
  against the exact commit proposed for merge.
