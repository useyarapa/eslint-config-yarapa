# Rules & Architecture Overview

Overview of the canonical configuration, internal capabilities, and enforced design principles.

## Philosophy: Deterministic & Opinionated

`eslint-config-yarapa` is designed as a strict, deterministic ESLint Flat Config baseline for modern JavaScript and TypeScript applications, with particular emphasis on regulated, high-integrity environments (such as banking and fintech services).

1. **Static Flat Config**: The canonical configuration is a static Flat Config array. It does not conditionally sniff runtime environments or dynamically alter rules based on installed dependencies.
2. **Type-Aware First**: Type-aware rules run through TypeScript's native `projectService`, avoiding ad-hoc or incomplete AST assumptions.
3. **Root-Cause Fixes Only**: Suppressing rules via inline comments (`eslint-disable`, `@ts-ignore`, `prettier-ignore`) is strictly forbidden by repository standards. Issues must be resolved at the root cause.

## Unified Architecture

`eslint-config-yarapa` exports one canonical Flat Config array containing every internal capability:

| Capability           | Entrypoint             | Target Scope     | Key Inclusions                                                                                                                          |
| -------------------- | ---------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Unified Baseline** | `eslint-config-yarapa` | Full-stack JS/TS | Base JS, Node.js runtime, Browser globals, TS syntax, TS type-checked, Imports, SonarJS, JSDoc, JSON, Stylistic, Perfectionist, Unicorn |

## Included Plugins

| Capability        | Plugin                                | Purpose                                                                    |
| ----------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| **Core JS**       | `@eslint/js`                          | Baseline syntax and runtime errors                                         |
| **Node.js**       | `eslint-plugin-n`                     | Node.js runtime checks and globals                                         |
| **TypeScript**    | `typescript-eslint`                   | Type checking, syntax rules, strict type-aware rules via `projectService`  |
| **Promises**      | `eslint-plugin-promise`               | Asynchronous correctness, avoids unhandled rejections and nesting          |
| **RegExp**        | `eslint-plugin-regexp`                | Regular expression correctness, optimization, and anti-ReDoS patterns      |
| **Clean Imports** | `eslint-plugin-unused-imports`        | Zero unused imports and variables enforcement                              |
| **Resolution**    | `eslint-plugin-import-x`              | Safe ESM and TypeScript module resolution                                  |
| **Code Quality**  | `eslint-plugin-sonarjs`               | Bug detection, cognitive complexity limits, code smell prevention          |
| **Documentation** | `eslint-plugin-jsdoc`                 | Strict JSDoc formatting and syntax validation                              |
| **Configuration** | `@eslint/json`, `eslint-plugin-jsonc` | Safe JSON/JSONC linting and sorting                                        |
| **Manifests**     | `eslint-plugin-package-json`          | Strict `package.json` property order and validity                          |
| **Stylistic**     | `@stylistic/eslint-plugin`            | Deterministic stylistic rules                                              |
| **Sorting**       | `eslint-plugin-perfectionist`         | Natural, deterministic ordering of imports, exports, and object properties |
| **Unicorn**       | `eslint-plugin-unicorn`               | Modern language capabilities, file conventions, and idiomatic utilities    |

## Canonical Utility Layer

To eliminate fragmentation and decision surface across AI-generated and human-written code, `eslint-config-yarapa` enforces a single canonical utility standard:

1. **Native Array & Object Methods**: Always use native ECMAScript methods (`map`, `filter`, `find`, `some`, `every`, `reduce`, `Object.hasOwn`, etc.).
2. **Approved Shared Utilities**: For operations beyond native capabilities (e.g. `debounce`, `throttle`, `groupBy`, `keyBy`, `uniqBy`, `cloneDeep`), standardize on `es-toolkit`.
3. **Restricted Alternative Libraries**: Alternative general-purpose utility libraries (`lodash`, `lodash-es`, `underscore`, `ramda`) are restricted at the lint layer via `no-restricted-imports`.

Because `eslint-config-yarapa` integrates hundreds of upstream rules across multiple plugins, the authoritative and up-to-date way to explore exact rule configurations is via `@eslint/config-inspector`:

```sh
# Inside this repository
pnpm inspect

# In any consumer project
pnpm dlx @eslint/config-inspector
```

## Architectural Benchmarking

To understand the engineering rationale behind our strict defaults compared to other industry configs (Antfu, Airbnb, Vercel, Shopify, Google), see [Global Landscape & Architectural Comparison](COMPARISON.md).
