---
paths:
  - "packages/eslint-config-yarapa/src/**/*"
  - "packages/eslint-config-yarapa/test/**/*"
  - "packages/eslint-config-yarapa/scripts/**/*"
  - "packages/eslint-config-yarapa/*"
  - "scripts/**/*"
  - "*"
---

# No Plain JavaScript Files Rules

Prohibit plain `.js` files across repository code while allowing TypeScript (`.ts`, `.mts`, `.cts`) and explicit module formats (`.mjs`, `.cjs`).

## No Plain `.js` Files
- Never create or commit plain `.js` files for source code, tests, scripts, or configuration.
- Prefer TypeScript (`.ts`, `.mts`, `.cts`) for all repository code and utilities.

## Permitted Module Formats
- Explicit ESM (`.mjs`) and CommonJS (`.cjs`) files are permitted when required for configuration, tooling, or scripts (such as `eslint.config.mjs`).

## Fixtures Exemption
- Plain `.js` files are permitted only within read-only test fixtures under `packages/eslint-config-yarapa/fixtures/` to verify linting behavior on legacy JavaScript projects.
