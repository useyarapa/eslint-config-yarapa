---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
  - "**/package.json"
  - "**/tsconfig*.json"
---

# No Dead Code Rules

Keep the codebase free of unreachable, unused, and obsolete implementation.

## Live Code Only

- Introduce files, functions, types, variables, and exports only when they have a current consumer or are part of a documented public API.
- Remove unused imports, locals, parameters, exports, unreachable branches, empty stubs, and commented-out code.
- Remove obsolete wrappers, deprecated shims, and compatibility layers after their consumers are gone.
- Keep one authoritative implementation for each behavior.

## Dependencies

- Add a dependency only when active code, tests, build tooling, or a documented public contract uses it.
- Remove a dependency when its last consumer is removed.
- Keep runtime dependencies, development dependencies, optional dependencies, and peer dependencies in the section that matches their actual role.

## Verification

- Run the repository's configured unused-code and dependency analyzer after changing files, exports, or dependencies.
- Treat unused-file, unused-export, and unused-dependency findings as defects to resolve rather than suppress.
