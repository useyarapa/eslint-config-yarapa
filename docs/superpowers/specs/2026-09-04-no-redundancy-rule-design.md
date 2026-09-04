# Spec: Add No-Redundancy Rule for Claude Code

## Overview
Add `.claude/rules/no-redundancy.md` to establish strict anti-redundancy and DRY (Don't Repeat Yourself) engineering standards for Claude Code across the repository.

## Rule File Specification

- **File Path**: `.claude/rules/no-redundancy.md`
- **Scope**: Applied to all source code, test files, scripts, and configuration files via frontmatter paths:
  ```markdown
  ---
  paths:
    - "packages/eslint-config-yarapa/**/*.{ts,mts,js,mjs,json}"
    - "scripts/**/*.{ts,mts}"
    - "*.{js,mjs,ts,mts,json}"
  ---
  ```

## Rule Content & Guidelines

1. **Strict DRY — Zero Duplicated Logic**
   - Never duplicate logic, expressions, conditional checks, or data transformations.
   - If logic or structure appears in two or more places, extract it immediately into a shared utility, helper function, or shared module.

2. **Single Source of Truth**
   - Do not hardcode repeated constants, configuration keys, rule IDs, preset names, or file glob patterns.
   - Reuse centralized constants from existing modules (such as `presetNames.ts`, `canonicalTestFileGlobs.ts`).

3. **Reuse Existing Utilities First**
   - Inspect existing codebase helpers before creating new ones.
   - Reuse Flat Config compatibility adapters in `packages/eslint-config-yarapa/src/configs/internal/` and test helpers in `test/helpers/`.

4. **No Redundant Abstractions & Dead Code**
   - Eliminate unnecessary wrapper functions, boilerplate pass-throughs, and over-abstracted layers.
   - Remove unused imports, dead variables, unreachable branches, and redundant type declarations immediately.

5. **No Redundant Test Logic**
   - Re-use `test/helpers/eslint.ts` and shared test fixtures instead of re-instantiating ESLint configurations.
   - Collapse repeated assertion blocks across test cases into parameterized tests or shared verification functions.

## Verification
- Verify that `.claude/rules/no-redundancy.md` is formatted properly with valid YAML frontmatter.
- Verify path matching behavior in Claude Code.
