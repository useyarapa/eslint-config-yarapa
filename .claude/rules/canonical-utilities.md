---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

# Canonical Utility Rules

Standardize on native ECMAScript and `es-toolkit` as the single canonical utility layer. Eliminate dialect fragmentation, bespoke generic helpers, and unapproved libraries.

## Utility Hierarchy

Apply this priority order for utility operations:

1. **Native ECMAScript First**: Use standard language methods supported by the target runtime (`map`, `filter`, `find`, `some`, `every`, `reduce`, `Object.hasOwn`, `structuredClone`).
2. **Approved Library (`es-toolkit`)**: Use `es-toolkit` for operations beyond native capabilities (`debounce`, `throttle`, `groupBy`, `keyBy`, `uniqBy`, `cloneDeep`, `merge`).
3. **Domain-Specific Helpers**: Implement helper functions only when they encode concrete business rules or domain models.
4. **No Bespoke Utilities**: Reuse native methods or `es-toolkit` instead of writing local general-purpose utilities or wrappers.

## Import Conventions

- Use explicit named imports directly from the package root:
  ```ts
  import { debounce, groupBy, uniqBy } from "es-toolkit";
  ```
- Keep imports direct; avoid namespace imports (`* as`), local re-exports, or alias layers.

## Restricted Libraries

General-purpose utility alternatives (`lodash`, `lodash-es`, `underscore`, `ramda`) are prohibited. All attempts to import them must fail at the `no-restricted-imports` linting gate.

## Verification

- Confirm all generic utilities originate from either native ECMAScript or `es-toolkit`.
- Confirm no custom helpers duplicate operations provided by `es-toolkit`.
- Run `pnpm lint:check` to verify that `no-restricted-imports` passes.
