---
paths:
  - "packages/eslint-config-yarapa/**/*.{ts,mts,cts,js,mjs,cjs,json}"
  - "scripts/**/*.{ts,mts,js,mjs}"
  - "*.{js,mjs,ts,mts,json}"
---

# No Speculative Configuration Rules

Apply zero-tolerance for speculative configuration, phantom patterns, and unverified flags in this repository.

## 1. Demand-Driven Configuration (No "Just in Case" Config)
- Never add ESLint rules, plugins, parser options, or environment flags speculatively or for hypothetical future needs.
- Every rule or configuration modification must satisfy an active, verified requirement.

## 2. No Phantom File Globs or Patterns
- Do not define file match patterns, extensions, or ignore globs for file types or directory structures that do not exist within the intended operational scope of the preset or repository.

## 3. No Speculative Options or Fallback Branches
- Do not build custom configuration options, fallback toggles, or abstraction layers for consumers that do not exist yet.
- Maintain minimum viable, strictly typed, and observable Flat Configs.

## 4. Required Observable Verification
- Any configuration rule or override introduced must be backed by a test case or demonstrable lint behavior to prove necessity and correctness.
