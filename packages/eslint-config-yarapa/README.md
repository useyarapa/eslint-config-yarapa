# eslint-config-yarapa

Opinionated, deterministic ESLint Flat Config standards for modern JavaScript and TypeScript projects.

`eslint-config-yarapa` provides a shared, zero-compromise linting baseline across JavaScript, TypeScript, Node.js, React, Next.js, and NestJS. Framework profiles extend this unified baseline rather than introducing separate, fragmented rulesets.

## Requirements

- Node.js `>=24.15.0 <25`
- ESLint `^10.0.0`
- TypeScript `>=5.0.0 <6.1.0` (for TypeScript projects)

## Installation

Install the package alongside ESLint and TypeScript:

```sh
pnpm add -D eslint eslint-config-yarapa typescript
```

Or using npm / yarn:

```sh
npm install --save-dev eslint eslint-config-yarapa typescript
# or
yarn add -D eslint eslint-config-yarapa typescript
```

## Basic Configuration

Create an `eslint.config.mjs` file in your project root:

```js
import yarapa from "eslint-config-yarapa";

export default yarapa;
```

The default profile applies the baseline rules for JavaScript and TypeScript, including type-aware linting powered by TypeScript's `projectService`.

## Framework Profiles

Select the profile that matches your project runtime:

### Next.js (`eslint-config-yarapa/next`)

Baseline plus Next.js (`@next/next`), React Hooks, and JSX rules.

```js
import next from "eslint-config-yarapa/next";

export default next;
```

### React (`eslint-config-yarapa/react`)

Baseline plus React Hooks, JSX syntax, and browser globals for Single-Page Applications or React libraries.

```js
import react from "eslint-config-yarapa/react";

export default react;
```

### NestJS & Node.js (`eslint-config-yarapa/nest`)

Baseline plus Node.js runtime and environment rules (`eslint-plugin-n`).

```js
import nest from "eslint-config-yarapa/nest";

export default nest;
```

## Available Profiles Summary

| Profile Entrypoint | Target Environment | Key Features |
| ------------------ | ------------------ | ------------ |
| `eslint-config-yarapa` | Universal JS / TS | Baseline JS, strict TypeScript with `projectService`, Imports, SonarJS, JSDoc, Perfectionist sorting, JSON |
| `eslint-config-yarapa/next` | Next.js Applications | Baseline + Next.js Core Web Vitals & rules, React Hooks |
| `eslint-config-yarapa/react` | React (SPA / UI) | Baseline + React Hooks, JSX rules, browser globals |
| `eslint-config-yarapa/nest` | NestJS / Node.js | Baseline + Node.js runtime rules (`eslint-plugin-n`) |

All profiles are static Flat Config arrays. Rules remain deterministic and do not fluctuate based on local ambient dependencies.

For architectural decisions, rule layers, and plugin design philosophies, see [Architecture & Rules Matrix](docs/RULES.md).

## Running ESLint

Run ESLint from your project root:

```sh
pnpm exec eslint .
```

*Note: When using type-aware rules, ensure you run ESLint from the directory containing your `tsconfig.json`.*

## Inspecting Rules

To visually inspect active rules, plugins, and overrides in your project using ESLint's interactive inspector:

```sh
pnpm dlx @eslint/config-inspector
```

## License

[MIT](https://github.com/useyarapa/eslint-config-yarapa/blob/main/LICENSE)
