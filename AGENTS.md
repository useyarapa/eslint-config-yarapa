# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Code

- Follow the official Claude Code best practices at `https://code.claude.com/docs/en/best-practices` for instruction scope, concise guidance, progressive disclosure, and verification.
- Keep this file limited to project-wide commands, architecture, conventions, and non-obvious workflow constraints; use skills for task-specific procedures.
- Verify changes with the narrowest applicable repository check and report the command and pass/fail result before declaring them complete.

## Repository shape

- This is a pnpm 11 workspace managed by Turborepo. The workspace currently contains `packages/eslint-config-yarapa`, the publishable package.
- The package is an ESM-only ESLint Flat Config library. Source lives in `packages/eslint-config-yarapa/src`; `tsdown` emits the four public entrypoints (`.`, `./next`, `./nest`, and `./react`) plus declarations and source maps under `dist/`.
- `src/configs/recommended.ts` is the shared composition root. It layers the base JavaScript policy, TypeScript syntax and type-checked rules, import resolution, SonarJS, JSDoc, JSON, package metadata, stylistic, and natural-order presets. Framework entrypoints reuse that baseline: Nest adds Node settings, while React and Next add hooks/component naming and JSX runtime settings; Next also adds its framework rules.
- `src/configs/internal/` contains compatibility and required-value helpers used when adapting upstream plugin configs to Flat Config. Keep those adapters at the boundary rather than duplicating plugin conversion in individual presets.
- Tests import source entrypoints directly and use `test/helpers/eslint.ts` to create ESLint instances with an explicit config array. The test suite covers config shape, profile composition, lint behavior, autofixes, static rule policy, and the package public API. Fixtures under `fixtures/` provide valid/invalid projects and are ignored by repository linting where appropriate.
- The root `eslint.config.mjs` consumes built package output from `dist/`, then adds repository-only ignores and Node-tooling/file-I/O overrides. Root linting therefore requires a package build first; package-scoped linting uses the package's own config.
- `scripts/verify-tarball.mts` runs `publint`, packs the package, validates exports with `attw`, installs the tarball into a temporary consumer, and runs import, behavior, and profile smoke tests. Optional framework checks are selected with `FRAMEWORK_PROFILE`, `FRAMEWORK_VERSION`, and, for Next, `FRAMEWORK_REACT_VERSION`.

## Commands

Run these from the repository root after `pnpm install`:

```sh
pnpm --filter eslint-config-yarapa build
pnpm --filter eslint-config-yarapa lint
pnpm lint
pnpm --filter eslint-config-yarapa check-types
pnpm --filter eslint-config-yarapa test
pnpm --filter eslint-config-yarapa exec vitest run test/behavior.test.ts
pnpm --filter eslint-config-yarapa test:watch
pnpm --filter eslint-config-yarapa test:coverage
pnpm --filter eslint-config-yarapa test:consumer
pnpm --filter eslint-config-yarapa verify
```

- `pnpm build`, `pnpm check-types`, and `pnpm test` run the corresponding Turborepo task across workspaces. Use the package-filtered forms when working only on this package.
- `pnpm lint` builds the package and lints the repository through the root config. `pnpm --filter eslint-config-yarapa lint` lints package files only. `pnpm format` builds first, then applies ESLint fixes to the repository.
- `pnpm inspect` builds first and starts `eslint-config-inspector` for reviewing the generated config. `pnpm knip` checks unused files and dependencies; fixtures are excluded by `knip.json`.
- `pnpm changeset` creates release intent. Pull requests that change a publishable package are checked by CI with Changesets; `pnpm changeset:status` checks intent against `main`. Release automation versions packages and publishes from `main`.

## Development workflow

- Edit `src/` and tests, not generated `dist/` files. Rebuild after source changes before running root lint or inspection.
- When changing a preset, test both its config shape/profile composition and at least one observable lint behavior. When changing exports or package metadata, run `test:consumer` or the full `verify` flow because it validates the packed artifact rather than the working tree.
- The package requires Node 24 (`.nvmrc` is `24.20.0`) and TypeScript `>=5.0.0 <6.1.0` as a peer dependency. The repository package manager is pinned to pnpm `11.23.0`.
