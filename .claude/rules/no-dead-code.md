---
paths:
  - "packages/eslint-config-yarapa/**/*.{ts,mts,cts,js,mjs,cjs,json}"
  - "scripts/**/*.{ts,mts,js,mjs}"
  - "*.{js,mjs,ts,mts,json}"
---

# No Dead Code Rules

Apply zero-tolerance for dead code, unused assets, and speculative implementations in this repository.

## 1. No Unused Files or Exports (Strict YAGNI)
- Never create files, functions, classes, interfaces, types, or constants that are not actively used in the codebase or part of the explicit public API contract.
- Do not design or code for speculative future requirements. If it is not needed now, do not write it.

## 2. No Dead Dependencies
- Never introduce dependencies or devDependencies that are not imported and used in the workspace.
- When removing code that was the sole consumer of a dependency, remove that dependency from `package.json` immediately.

## 3. No Dead Code Artifacts
- Eliminate unused imports, unused local variables, unused parameters, and unreachable execution paths.
- Never leave commented-out code in the repository; rely on git history instead.
- Remove dead wrappers, deprecated shims, and empty stubs.

## 4. Verification via Knip
- When modifying files, exports, or dependencies, run `pnpm knip` to verify zero unused items are introduced.
