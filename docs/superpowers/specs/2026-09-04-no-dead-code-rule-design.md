# Spec: Add No-Dead-Code Rule for Claude Code

## Overview
Add `.claude/rules/no-dead-code.md` to establish strict zero-tolerance policies for dead code, unused exports, dead dependencies, and commented-out code across the repository.

## Rule File Specification

- **File Path**: `.claude/rules/no-dead-code.md`
- **Scope**: Applied to all package source files, tests, scripts, and root configs via frontmatter paths:
  ```markdown
  ---
  paths:
    - "packages/eslint-config-yarapa/**/*.{ts,mts,cts,js,mjs,cjs,json}"
    - "scripts/**/*.{ts,mts,js,mjs}"
    - "*.{js,mjs,ts,mts,json}"
  ---
  ```

## Rule Content & Guidelines

1. **No Unused Files or Exports (Strict YAGNI)**
   - Never create files, functions, classes, interfaces, types, or constants that are not actively used in the codebase or part of the explicit public API contract.
   - Do not design or code for speculative future requirements.

2. **No Dead Dependencies**
   - Never introduce dependencies or devDependencies that are not imported and used.
   - When removing code that was the sole consumer of a dependency, remove that dependency from `package.json` immediately.

3. **No Dead Code Artifacts**
   - Eliminate unused imports, unused local variables, unused parameters, and unreachable execution paths.
   - Never leave commented-out code in the repository; rely on git history instead.
   - Remove dead wrappers, deprecated shims, and empty stubs.

4. **Verification via Knip**
   - When modifying files, exports, or dependencies, verify with `pnpm knip` to ensure zero unused items are introduced.

## Verification
- Verify that `.claude/rules/no-dead-code.md` follows Claude Code documentation rules format.
- Ensure YAML frontmatter is valid.
