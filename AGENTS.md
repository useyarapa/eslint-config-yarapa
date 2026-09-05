# Repository Guidelines

Architectural and workflow constraints when working in this repository.

## Agent Guidelines

- Verify changes with the narrowest applicable check and report the command and result before declaring completion.
- Never suppress or disable a check to make it pass; fix root causes.
- Point pull-request preparation to `CONTRIBUTING.md` and package release intent to `.changeset/README.md`.

## Architecture & Build Boundaries

- `packages/eslint-config-yarapa` is a strict, deterministic ESLint Flat Config package. Source lives in `packages/eslint-config-yarapa/src/`; generated artifacts live in `packages/eslint-config-yarapa/dist/`.
- Edit `src/` and tests, never generated `dist/` files.
- The root `eslint.config.mjs` consumes built package output from `packages/eslint-config-yarapa/dist/index.mjs`. Root linting therefore requires a package build first. Use `pnpm lint` (which builds first) or build the package before invoking ESLint directly at repository root. Package-scoped linting (`pnpm --filter eslint-config-yarapa lint`) lints source files directly.

## Verification Requirements

- Preset changes: add or update tests for both config composition / profile shape and at least one observable lint behavior in `packages/eslint-config-yarapa/test/`.
- Export or package metadata changes: run `pnpm --filter eslint-config-yarapa test:consumer` (or `verify`), which tests the packed tarball against a real consumer project.

## Testing Architecture & Fixture Policy

- Fixtures in `packages/eslint-config-yarapa/fixtures/` are static declarative test inputs for ESLint Flat Config integration testing.
- Type-aware testing requires concrete disk fixtures with `tsconfig.json` to configure TypeScript compiler services deterministically.
- Do not replace static declarative fixtures with bespoke dynamic setup, temporary filesystem generation, or bespoke mock harnesses.
- Follow official ESLint test patterns and maintained capabilities.
