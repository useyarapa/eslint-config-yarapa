# eslint-config-yarapa

[![npm version](https://img.shields.io/npm/v/eslint-config-yarapa.svg?color=cb3837)](https://www.npmjs.com/package/eslint-config-yarapa)
[![npm downloads](https://img.shields.io/npm/dm/eslint-config-yarapa.svg)](https://www.npmjs.com/package/eslint-config-yarapa)
[![node version](https://img.shields.io/badge/node-%3E%3D24.15.0-brightgreen.svg)](https://nodejs.org)
[![license](https://img.shields.io/github/license/useyarapa/eslint-config-yarapa.svg)](https://github.com/useyarapa/eslint-config-yarapa/blob/main/LICENSE)

Opinionated, deterministic ESLint Flat Config standards for modern JavaScript and TypeScript projects.

`eslint-config-yarapa` provides a shared, zero-compromise linting baseline across JavaScript, TypeScript, Node.js, React, Next.js, and NestJS. Framework profiles extend this unified baseline rather than introducing separate, fragmented rulesets.

---

## Features

- **Strict Flat Config First**: Pre-configured, deterministic arrays compatible with ESLint 9+ and 10+.
- **Type-Aware First**: Native integration with TypeScript's `projectService` for accurate, AST-driven type analysis without manual `tsconfig.json` overhead.
- **Unified Style**: Integrated `@stylistic/eslint-plugin` rules with zero format suppression allowed.
- **Natural Ordering**: Automated, deterministic sorting of imports, exports, and object keys via `eslint-plugin-perfectionist`.
- **Security & Bug Prevention**: Built-in cognitive complexity analysis and anti-ReDoS rules with `eslint-plugin-sonarjs` and `eslint-plugin-regexp`.
- **Modular Framework Profiles**: First-class profiles for Next.js, React, and NestJS/Node.js.

---

## Requirements

- **Node.js**: `>=24.15.0 <25`
- **ESLint**: `^10.0.0`
- **TypeScript**: `>=5.0.0 <6.1.0` (for TypeScript projects)

---

## Installation

Install `eslint-config-yarapa` along with required peer dependencies:

```sh
pnpm add -D eslint eslint-config-yarapa typescript
```

Or using npm / yarn:

```sh
npm install --save-dev eslint eslint-config-yarapa typescript
# or
yarn add -D eslint eslint-config-yarapa typescript
```

---

## Quick Start

Create an `eslint.config.mjs` in the root of your project:

```js
import yarapa from "eslint-config-yarapa";

export default yarapa;
```

The default profile applies universal baseline rules for JavaScript and TypeScript, including type-aware rules through `projectService`.

---

## Framework Profiles

Select the profile that matches your project runtime:

### Next.js Applications (`eslint-config-yarapa/next`)

Baseline plus Next.js Core Web Vitals, React Hooks, and JSX rules.

```js
import next from "eslint-config-yarapa/next";

export default next;
```

### React Applications & Libraries (`eslint-config-yarapa/react`)

Baseline plus React Hooks, JSX syntax, and browser globals for Single-Page Applications (Vite, CRA) or UI libraries.

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

---

## Profiles Matrix

| Profile Entrypoint           | Target Environment  | Key Rule Layers Included                                                                  |
| ---------------------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `eslint-config-yarapa`       | Universal JS / TS   | Base JS, TS syntax, TS type-checked, Imports, SonarJS, JSDoc, Perfectionist sorting, JSON |
| `eslint-config-yarapa/next`  | Next.js Apps        | Baseline + `@next/next` rules, React Hooks, JSX rules                                     |
| `eslint-config-yarapa/react` | React (SPA/Library) | Baseline + React Hooks, JSX syntax, Browser globals                                       |
| `eslint-config-yarapa/nest`  | Node.js / NestJS    | Baseline + Node.js runtime rules (`eslint-plugin-n`)                                      |

All profiles are static Flat Config arrays. Rules do not mutate based on ambient runtime conditions.

For full architecture details and rule philosophies, refer to the [Architecture & Rules Overview](docs/RULES.md).

---

## Customization & Overriding Rules

Because all profiles export standard Flat Config arrays, you can compose, add project-specific rules, or ignore files using standard JavaScript array operations:

```js
import yarapa from "eslint-config-yarapa";

export default [
  ...yarapa,
  {
    // Global ignore patterns
    ignores: ["**/dist/**", "**/build/**", "**/.next/**", "**/coverage/**"],
  },
  {
    // Custom project-level overrides
    files: ["src/**/*.ts"],
    rules: {
      // Add or adjust specific rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
```

---

## Formatting & Prettier Integration

`eslint-config-yarapa` includes deterministic code styling via `@stylistic/eslint-plugin` (semi, quotes, 2-space indentation, max line length).

- **Recommended**: Run ESLint directly with `--fix` to format and lint your entire repository deterministically.
- **If using Prettier**: If your workflow requires Prettier for non-JS files (e.g. Markdown, CSS, HTML), ensure that Prettier is configured with matching options:
  - `"semi": true`
  - `"singleQuote": false`
  - `"tabWidth": 2`
  - `"trailingComma": "all"`

---

## Editor Integration

### Visual Studio Code

1. Install the official [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).
2. Configure `.vscode/settings.json`:

```json
{
  "eslint.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```

### JetBrains IDEs (WebStorm / IntelliJ IDEA)

1. Open **Settings / Preferences** (`Cmd+,` or `Ctrl+Alt+S`) → **Languages & Frameworks** → **JavaScript** → **Code Quality Tools** → **ESLint**.
2. Select **Manual ESLint configuration**.
3. Choose your Node.js interpreter and set **ESLint package** to your project's local `eslint` package.
4. Check **Run eslint --fix on save**.

### Neovim

Using `nvim-lspconfig` and `null-ls` / `conform.nvim` with ESLint Language Server (`eslint-lsp`):

```lua
-- Using conform.nvim or nvim-lspconfig
vim.api.nvim_create_autocmd("BufWritePre", {
  pattern = { "*.js", "*.jsx", "*.ts", "*.tsx" },
  command = "EslintFixAll",
})
```

---

## Architectural Comparison

Wondering how YARAPA compares to industry standards like `@antfu/eslint-config`, Airbnb, Vercel, Shopify, and Google (`gts`)? Read our comprehensive [Global Landscape & Architectural Comparison](docs/COMPARISON.md) covering determinism, type-aware defaults, anti-ReDoS security, and zero-suppression engineering standards.

---

## Monorepo & Troubleshooting FAQ

### 1. `projectService` fails to find `tsconfig.json`

When running type-aware rules, ESLint must resolve project configuration relative to your project's `tsconfig.json`.

**Solution**: Run ESLint from the root directory containing your `tsconfig.json`:

```sh
pnpm exec eslint .
```

In monorepo setups, run ESLint within each workspace package or configure `tsconfigRootDir`:

```js
import yarapa from "eslint-config-yarapa";

export default [
  ...yarapa,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

### 2. Can I use `eslint-disable` comments?

By repository philosophy, inline rule suppressions (`// eslint-disable`) are prohibited. All diagnostics should be resolved at the root cause. If a project-wide exemption is genuinely required (e.g., generated files), configure it explicitly in `eslint.config.mjs` under `ignores` or `rules`.

---

## Inspecting Active Rules

To visually explore every rule, plugin, and active override in your configuration:

```sh
pnpm dlx @eslint/config-inspector
```

---

## License

[MIT](https://github.com/useyarapa/eslint-config-yarapa/blob/main/LICENSE) (c) YARAPA
