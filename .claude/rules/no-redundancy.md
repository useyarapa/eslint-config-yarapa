---
paths:
  - "packages/eslint-config-yarapa/**/*.{ts,mts,cts,js,mjs,cjs,json}"
  - "scripts/**/*.{ts,mts,js,mjs}"
  - "*.{js,mjs,ts,mts,json}"
---

# No Redundancy & Strict DRY Rules

Apply zero-tolerance for code duplication and redundant logic in this repository.

## 1. Zero Duplicated Logic (Strict DRY)
- Never duplicate logic, calculations, conditional branches, or transformations.
- If identical or near-identical logic appears in two or more places, extract it immediately into a shared helper function, utility module, or constant.

## 2. Single Source of Truth
- Do not hardcode recurring values, rule names, preset names, test file globs, or config options across files.
- Reuse existing central definitions (such as `presetNames.ts`, `canonicalTestFileGlobs.ts`).

## 3. Reuse Existing Utilities First
- Before creating any new helper or adapter, inspect existing codebase utilities:
  - Flat Config compatibility helpers in `packages/eslint-config-yarapa/src/configs/internal/`
  - Test harness helpers in `test/helpers/eslint.ts`
- Extend or reuse existing utilities instead of introducing redundant parallel implementations.

## 4. No Redundant Abstractions or Dead Code
- Avoid passthrough functions or unnecessary wrappers that add no behavior.
- Immediately remove dead code, unused imports, unused type declarations, and unreachable logic.

## 5. No Redundant Test Logic
- All test ESLint instances must use `test/helpers/eslint.ts` rather than building custom ESLint test configs from scratch.
- Replace duplicate assertion chains with parameterized (table-driven) tests or shared assertion helpers.
