# AGENTS.md

Instructions for AI coding agents (Claude, Gemini, opencode, etc.) working in
this repository. `CLAUDE.md` and `GEMINI.md` point here; keep this file the
single source of truth for agent-facing repo conventions.

## What this repo is

`yarapa-code-standard` is a pnpm + Turborepo monorepo whose flagship
deliverable is **`eslint-config-yarapa`**: a strict, deterministic,
general-purpose ESLint Flat Config package for JavaScript and TypeScript
projects. It is a public npm library intended for developers worldwide, not an
organization-, industry-, or repository-specific policy package. A second
package, **`@repo/typescript-config-yarapa`**, provides shared `tsconfig.json`
bases used by this repository.

Public `eslint-config-yarapa` behavior must remain portable. Do not encode
YARAPA-internal paths, legal metadata, CI assumptions, branch policy,
package-manager policy, or industry-specific conformance requirements into its
public presets. Consumer projects own those boundaries.

```text
.
├── CONTEXT.md                    # Public-package terminology
├── packages/
│   ├── eslint-config-yarapa/     # Main public deliverable
│   └── typescript-config-yarapa/ # Repository TypeScript support
├── knip.json, turbo.json, pnpm-workspace.yaml
```

## Read before writing any code

1. **`CONTEXT.md`** — neutral terminology for the public package: Preset,
   Capability Preset, Aggregate Preset, Consumer Project, Rule Inventory, and
   related concepts.
2. **`packages/eslint-config-yarapa/README.md`** — public package entrypoint,
   supported API, composition model, and consumer-facing usage.
3. **`packages/eslint-config-yarapa/test/`**, `fixtures/`, and
   `generated/rule-inventory.json` — executable verification and the resolved
   rule contract. Behavioral changes must remain consistent with these gates.

When repository-maintainer conventions conflict with portability of the public
npm package, keep the public package generic and scope the maintainer convention
to this repository only.

## The 16 required presets (`eslint-config-yarapa`)

`recommended`, `base`, `typescript`, `typeChecked`, `disableTypeChecked`,
`node`, `browser`, `stylistic`, `ignores`, `security`, `testingLibrary`,
`vitest`, `ava`, `json`, `packageJson`, `jsdoc`.

`recommended` is the canonical aggregate preset and deliberately _excludes_
`node`, `browser`, `vitest`, `ava`, and `ignores`. Runtime, runner, and ignore
boundaries belong to the consuming project, so consumers compose those presets
explicitly with appropriate `files` or ignore scopes.

Source layout: `packages/eslint-config-yarapa/src/configs/*.ts` (one file per
public preset) plus `src/configs/internal/*.ts` for shared support modules —
composition-only control sets (SonarJS coverage, import-x resolution,
Perfectionist ordering) and upstream-extraction helpers (`required.ts`,
`eslintCompat.ts`) — all folded into public presets and none exported as
public presets themselves. `src/index.ts` is
the single entry point exporting `configs`.

## Public package design rules

- Prefer standards-based ESLint Flat Config behavior over repository-specific
  convenience.
- Keep public presets deterministic and composable.
- Do not require consumers to use pnpm, this monorepo layout, this CI workflow,
  or YARAPA-specific governance.
- Do not hard-code consumer paths, organization names, legal headers, or
  infrastructure assumptions into public presets.
- Treat runtime, browser, test-runner, and project boundaries as consumer-owned
  unless ESLint itself provides a portable default.
- Validate package behavior using clean packed consumers, not only this
  repository's workspace.
- Treat diagnostic and autofix behavior as part of compatibility and review
  behavioral changes accordingly.

## Known toolchain gotcha: root `typescript@7.0.2` vs. this package

The **root** `package.json` pins `"typescript": "7.0.2"` for the monorepo's
own tooling. `typescript-eslint@8.68.0` only supports TypeScript
`>=4.8.4 <6.1.0`, and TS7 changed public namespace exports in ways that break
`@typescript-eslint/*` type declarations if TS7 is resolved for this package's
own `tsc --noEmit`.

`packages/eslint-config-yarapa/package.json` therefore pins its own
`devDependencies.typescript` to `6.0.3`. If you touch this package's
dependencies, keep that pin unless the compatibility boundary is intentionally
changed and verified. This is a repository toolchain implementation detail,
not a requirement that should leak into unrelated consumer tooling beyond the
package's declared peer range.

## pnpm quirk: `minimumReleaseAgeExclude` auto-injection

Running `pnpm install` or `pnpm add` in this workspace has repeatedly
auto-injected an unwanted
`minimumReleaseAgeExclude: [eslint-plugin-jsdoc@64.3.1]` entry into
`pnpm-workspace.yaml`. This is a repository-local pnpm supply-chain policy
effect, not a public consumer requirement. After any install, check
`git diff pnpm-workspace.yaml` and revert that entry if it reappears unless a
human explicitly asks for it.

Never make consumers configure pnpm-specific build policy merely to work around
this repository's verification harness. Clean-consumer tests must model normal
package installation without imposing YARAPA-specific package-manager settings.

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

These are repository-maintainer controls; they are not requirements imposed on
projects that install `eslint-config-yarapa`.

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
- Reply to review findings with the verified disposition and commit evidence
  before resolving the review thread.
- Before reporting completion, verify the final diff and required CI jobs
  against the exact commit proposed for merge.
- Do not publish to npm, create publication tags/releases, or configure npm
  publishing credentials unless a human explicitly authorizes that separate
  operation.
