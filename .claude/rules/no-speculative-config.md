---
paths:
  - "packages/eslint-config-yarapa/src/**/*.{ts,js}"
  - "packages/eslint-config-yarapa/*.{ts,json}"
  - "eslint.config.mjs"
  - "*.json"
  - ".changeset/*.json"
  - ".github/workflows/*.yml"
  - ".claude/rules/*.md"
---

# No Speculative Configuration Rules

Keep configuration demand-driven, observable, and aligned with real repository structure.

## Demand-Driven Configuration

- Add or modify ESLint rules, plugins, parser options, and environment flags only for active, verified requirements.
- Do not add configuration, options, or fallback branches for hypothetical future needs or imaginary consumers.

## File Globs and Match Patterns

- Repository-internal match patterns, extensions, and ignore globs must correspond to actual files and directory structures in this repository.
- Consumer-facing preset globs in publishable configs may target patterns intended for consumer projects even if those files do not exist in this repository, provided the pattern is part of the documented preset contract and verified by tests.

## Observable Verification

- Every configuration rule or override introduced must be backed by a test case or demonstrable lint behavior to prove necessity and correctness.
