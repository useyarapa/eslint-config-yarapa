---
paths:
  - "packages/eslint-config-yarapa/**/*.{ts,mts,cts,js,mjs,cjs,json,md}"
  - "scripts/**/*.{ts,mts,js,mjs}"
  - "*.{js,mjs,cjs,ts,mts,json,md,yaml,yml}"
---

# No Prettier Ignore Rules

Enforce uniform formatting and prohibit formatter directives.

## Zero Format Suppression
- Never introduce `prettier-ignore`, `prettier-ignore-start`, or `prettier-ignore-end` comments.
- Do not bypass automated formatting or escape prettier layout rules via inline comment directives.

## Idiomatic Structuring
- When formatting breaks aesthetic or readability expectations, refactor the structure, extract intermediate variables, or break complex expressions into smaller, cohesive statements.
- Format code cleanly according to the repository's `.prettierrc.json` configuration without manual overrides.

## Repository-Level File Boundaries
- Formatting exclusions must be managed strictly at the workspace level in `.prettierignore` for generated artifacts and cache directories, never within tracked source files.
