---
paths:
  - "packages/eslint-config-yarapa/**/*.{ts,mts,cts,js,mjs,cjs}"
  - "scripts/**/*.{ts,mts,js,mjs}"
  - "*.{js,mjs,cjs,ts,mts}"
---

# No ESLint Disable Rules

Enforce root-cause fixes and maintain zero inline rule suppression.

## Zero Inline Suppression

- Never introduce `eslint-disable`, `eslint-disable-line`, or `eslint-disable-next-line` comments.
- Never add inline directive comments to bypass, silence, or work around lint diagnostics.

## Root-Cause Resolution

- When a lint diagnostic or type check fails, resolve the underlying defect in source code or configuration.
- Re-architect code, adjust imports, or refine type definitions rather than masking the violation.

## Exceptions and Overrides

- In-source suppression is strictly prohibited.
- Necessary environment-level rule adjustments (such as repository tooling or fixture boundary exemptions) must be declared explicitly in `eslint.config.mjs` with clear architectural justification, never inline.
