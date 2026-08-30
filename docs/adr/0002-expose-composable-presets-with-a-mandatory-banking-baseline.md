---
status: accepted
---

# Expose composable presets with a mandatory Banking Baseline

The package exposes one named `configs` object from one root entrypoint. Its
sixteen values are consistently shaped Flat Config arrays. `recommended` is an
aggregate Banking Baseline that includes universally applicable type-aware,
security, documentation, structured-data, and stylistic controls. Runtime and
test-runner presets remain file-scoped capabilities because Node.js and browser
globals, and Vitest and AVA semantics, must not be applied to incompatible
files.

## Considered options

- A single opaque default export was rejected because it would hide policy
  boundaries and make mixed-runtime monorepos difficult to configure safely.
- Top-level named exports and per-preset subpaths were rejected because they
  duplicate the public surface and create multiple import conventions.
- Making every control opt-in was rejected because consumer repositories could
  silently omit required banking controls.
- Enabling Vitest and AVA over the same test files was rejected because runner
  rules and globals are mutually exclusive.

## Consequences

The public surface consists of `recommended`, `base`, `typescript`,
`typeChecked`, `disableTypeChecked`, `node`, `browser`, `stylistic`, `ignores`,
`security`, `testingLibrary`, `vitest`, `ava`, `json`, `packageJson`, and
`jsdoc`. There is no default export and no code subpath export. A conforming
repository applies `recommended`, scopes runtime presets to real runtime
boundaries, and selects at most one test runner per file scope.
