---
paths:
  - "**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"
---

# No Plain JavaScript Files Rules

Use typed source files by default and introduce plain JavaScript only for a verified compatibility boundary.

## Typed Source by Default

- Prefer TypeScript for application code, libraries, tests, scripts, and configuration utilities.
- Use `.ts`, `.tsx`, `.mts`, or `.cts` when the toolchain supports TypeScript.
- Do not create a plain `.js` file merely because it is shorter or familiar.

## Explicit Module Formats

- Use `.mjs` or `.cjs` only when an explicit ESM or CommonJS boundary is required by the runtime, tool, or published contract.
- Keep module format decisions consistent with the repository's package metadata and build configuration.

## Compatibility Fixtures

- Plain `.js` or `.jsx` files are acceptable in read-only fixtures when they represent a supported legacy consumer or are required to test JavaScript behavior.
- Keep compatibility fixtures isolated from editable source and do not use them as a reason to weaken typed source standards.

## Verification

- Confirm that each new JavaScript file has a documented compatibility or tooling reason before adding it.
- Run the configured type check and linter after changing source-file formats.
