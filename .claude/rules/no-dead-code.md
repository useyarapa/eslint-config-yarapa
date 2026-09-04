---
paths:
  - "packages/eslint-config-yarapa/src/**/*.{ts,js}"
  - "packages/eslint-config-yarapa/test/**/*.{ts,js}"
  - "packages/eslint-config-yarapa/scripts/**/*.{ts,mts}"
  - "packages/eslint-config-yarapa/*.{ts,json}"
  - "*.{mjs,json}"
---

# No Dead Code Rules

Eliminate unused code, dead exports, and unnecessary dependencies.

## Unused Code and Exports

- Do not introduce files, functions, types, or variables that are not used in the codebase or part of the public API contract.
- Eliminate unused imports, unused local variables, unused parameters, and unreachable execution paths.
- Remove dead wrappers, deprecated shims, and empty stubs. Do not leave commented-out code in the repository.

## Dependencies

- Do not introduce dependencies or devDependencies that are not imported and used in the workspace.
- When removing code that was the sole consumer of a dependency, remove that dependency from `package.json` immediately.

## Verification

- When modifying files, exports, or dependencies, run `pnpm knip` to verify zero unused items are introduced.
