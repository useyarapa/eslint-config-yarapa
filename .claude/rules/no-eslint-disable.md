---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

# No ESLint Disable Rules

Resolve lint diagnostics at their source and keep inline suppression out of production code.

## Root-Cause Fixes

- Resolve each lint diagnostic in the code, types, configuration, imports, or architecture that caused it.
- Prefer a clearer structure, narrower scope, correct type, or verified configuration over a suppression directive.
- Keep repository-wide policy changes in the appropriate configuration layer rather than in source comments.

## Suppression Policy

- Do not add `eslint-disable`, `eslint-disable-line`, or `eslint-disable-next-line` directives to source, tests, scripts, or configuration.
- Do not add equivalent comments or flags whose purpose is to hide a lint diagnostic.
- Do not leave existing suppression directives in newly modified code.

## Verification

- Run the configured linter with its warning threshold after resolving diagnostics.
- Inspect the final diff for inline suppression before review.
