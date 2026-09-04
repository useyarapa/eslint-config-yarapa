# Rules & Architecture Overview

Overview of profiles, plugins, and key design principles enforced by `eslint-config-yarapa`.

## Philosophy: Deterministic & Opinionated

`eslint-config-yarapa` is designed as a strict, deterministic ESLint Flat Config baseline for modern JavaScript and TypeScript applications, with particular emphasis on regulated, high-integrity environments (such as banking and fintech services).

1. **Static Flat Configs**: Profiles are static Flat Config arrays. They do not conditionally sniff runtime environments or dynamically alter rules based on installed dependencies.
2. **Type-Aware First**: Type-aware rules run through TypeScript's native `projectService`, avoiding ad-hoc or incomplete AST assumptions.
3. **Root-Cause Fixes Only**: Suppressing rules via inline comments (`eslint-disable`, `@ts-ignore`, `prettier-ignore`) is strictly forbidden by repository standards. Issues must be resolved at the root cause.

## Profiles Matrix

| Profile     | Entrypoint                   | Target Runtime      | Key Layers Included                                                                                        |
| ----------- | ---------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Default** | `eslint-config-yarapa`       | Universal JS/TS     | Base JS, TS syntax, TS type-checked, Imports, SonarJS, JSDoc, JSON, Package.json, Stylistic, Perfectionist |
| **Next.js** | `eslint-config-yarapa/next`  | Next.js Apps        | Baseline + React Hooks, Component Naming, Next.js framework rules (`@next/next`)                           |
| **React**   | `eslint-config-yarapa/react` | React (SPA/Library) | Baseline + React Hooks, Component Naming, Browser Globals, JSX syntax                                      |
| **NestJS**  | `eslint-config-yarapa/nest`  | Node.js / NestJS    | Baseline + Node.js runtime rules (`eslint-plugin-n`)                                                       |

## Layered Plugins

| Layer             | Plugin                                | Purpose                                                                    |
| ----------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| **Core JS**       | `@eslint/js`                          | Recommended baseline syntax and runtime errors                             |
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
