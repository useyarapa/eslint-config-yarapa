---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

# Index Barrel Export Rules

Keep entrypoint `index` files strictly dedicated to public exports and orchestration. Do not place business logic, implementation details, or execution algorithms directly inside `index` files.

## Pure Export Boundaries

- Entrypoint `index.ts`, `index.mts`, or `index.js` files must act only as re-export barrels or dispatchers.
- Re-export modules and types from dedicated internal sibling files (e.g. `doctor.mts`, `verify-tarball.mts`).
- Never author core business logic, helpers, check routines, or algorithm steps directly in an `index` file.
- Keep implementation files focused on a single responsibility with descriptive names matching their domain role.

## Structure & Symmetric Layout

- When structuring scripts, utilities, or components as a folder, maintain a uniform folder wrap:
  ```
  scripts/<task-name>/
  ├── <task-name>.mts   # Implementation and execution logic
  └── index.mts         # Re-export and public entrypoint
  ```
- Import and execute/export named symbols explicitly from sibling files:
  ```ts
  export { runDoctor } from "./doctor.mts";
  ```

## Verification

- Inspect newly created or modified `index` files to ensure they contain zero implementation logic.
- Confirm all underlying routines live in dedicated sibling source files with corresponding unit or smoke tests.
- Run `pnpm lint:check` and type checks to ensure export contracts are clean and resolved without cycles.
