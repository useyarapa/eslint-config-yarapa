# Unified Public Configuration Design

## Problem Statement

Previously, `eslint-config-yarapa` distributed framework- and runtime-specific capabilities through separate entrypoints and subpath exports:

- `eslint-config-yarapa` (universal default)
- `eslint-config-yarapa/react` (React Hooks, JSX syntax, browser globals)
- `eslint-config-yarapa/nest` (Node.js runtime rules with `eslint-plugin-n`)

Maintaining multiple profile entrypoints introduced cognitive friction for consumers, fragmented configuration matrices across downstream teams, and caused complexity in consumer-side project setups.

## Target Architecture

The package exposes exactly one consumer-facing Flat Config entrypoint:
`eslint-config-yarapa`

Consumers configure their ESLint setup with a single import:

```javascript
import yarapa from "eslint-config-yarapa";

export default yarapa;
```

This single default configuration serves standard JavaScript, TypeScript, Node.js, React, and mixed/full-stack projects deterministically.

## Exact Changes

### 1. Public Export Boundary

- `packages/eslint-config-yarapa/package.json` retains only:
  - `.` (pointing to `dist/index.mjs` and `dist/index.d.mts`)
  - `./package.json`
- Remove subpath exports `./react` and `./nest`.
- Delete dedicated profile source modules `src/react.ts` and `src/nest.ts`.
- Update build configuration (`tsdown.config.ts`) to compile only `src/index.ts`.

### 2. Capability Composition

The recommended composition in `src/configs/recommended.ts` bundles all capability layers into one array:

- Universal JavaScript (`@eslint/js`, promise, regexp)
- Node.js runtime (`eslint-plugin-n` recommended rules and `globals.node`)
- Browser globals (`globals.browser`)
- TypeScript syntax and strict type-aware rules via `projectService`
- Import hygiene via `eslint-plugin-import-x`
- Cognitive complexity and bug prevention via `eslint-plugin-sonarjs`
- Style, sorting, and modern hygiene via `@stylistic`, `eslint-plugin-perfectionist`, and `eslint-plugin-unicorn`
- Documentation and structured data via `eslint-plugin-jsdoc`, `@eslint/json`, and `eslint-plugin-package-json`

### 3. Consumer Tarball Verification

Update `scripts/verify-tarball/verify-tarball.mts` to:

- Test only the root `eslint-config-yarapa` import.
- Validate that the single default export lints JavaScript and TypeScript files simultaneously.
- Verify that violating code triggers expected diagnostic rules (`no-var`).
- Clean up unused profile definitions (`FRAMEWORK_DEFINITIONS`, `FRAMEWORK_PROFILE`, etc.).
- Fix formatting and lint violations under `unicorn/prefer-string-raw`.

## Acceptance Criteria

- [x] `eslint-config-yarapa` is the only public ESLint config entrypoint.
- [x] The default config contains the shared base rules.
- [x] The default config contains Node.js behavior, including `eslint-plugin-n` and Node globals.
- [x] The default config contains browser globals.
- [x] `./react` and `./nest` package exports no longer exist.
- [x] `src/react.ts` and `src/nest.ts` no longer exist.
- [x] No replacement framework/runtime profile is introduced.
- [x] Consumers do not need to install/configure `eslint-plugin-n` separately to receive Node rules.
- [x] Tarball-installed consumer verification covers the single default entrypoint.
- [x] Relevant tests prove JavaScript, TypeScript, and Node consumption through the root import.
- [x] Lint, type checking, tests, build/package verification, and tarball consumer verification pass.
