---
paths:
  - "packages/eslint-config-yarapa/src/**/*.{ts,js}"
  - "packages/eslint-config-yarapa/test/**/*.{ts,js}"
  - "packages/eslint-config-yarapa/scripts/**/*.{ts,mts}"
  - "packages/eslint-config-yarapa/*.{ts,json}"
  - "eslint.config.mjs"
---

# No Redundancy Rules

Maintain single sources of truth and reuse existing shared logic.

## Single Source of Truth

- Do not hardcode recurring values, test file globs, or config options across files.
- Reuse central definitions and shared configuration profiles.

## Reuse Existing Utilities

- Inspect existing utilities before introducing new adapters or helpers:
  - Flat Config compatibility helpers in `packages/eslint-config-yarapa/src/configs/internal/`
  - Test harness helpers in `packages/eslint-config-yarapa/test/helpers/eslint.ts`
- Extend existing utilities instead of creating parallel implementations.

## Test Harness Consistency

- Configure test ESLint instances through `packages/eslint-config-yarapa/test/helpers/eslint.ts` rather than constructing ad-hoc ESLint instances.
- Parameterize duplicate test assertion patterns with table-driven tests.

## Shared Abstractions

- Extract shared helpers when two or more sites share a single underlying concept that must change together.
- Do not introduce premature abstractions or passthrough wrappers solely for superficial code similarity.
