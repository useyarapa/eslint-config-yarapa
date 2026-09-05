# eslint-config-yarapa

[![npm version](https://img.shields.io/npm/v/eslint-config-yarapa.svg?color=cb3837)](https://www.npmjs.com/package/eslint-config-yarapa)
[![npm downloads](https://img.shields.io/npm/dm/eslint-config-yarapa.svg)](https://www.npmjs.com/package/eslint-config-yarapa)
[![node version](https://img.shields.io/badge/node-%3E%3D24.15.0-brightgreen.svg)](https://nodejs.org)
[![license](https://img.shields.io/github/license/useyarapa/eslint-config-yarapa.svg)](https://github.com/useyarapa/eslint-config-yarapa/blob/main/LICENSE)

Opinionated, deterministic ESLint Flat Config standards for modern JavaScript and TypeScript projects.

`eslint-config-yarapa` provides a shared, zero-compromise linting baseline across modern JavaScript, TypeScript, and Node.js. All capabilities are bundled into a single unified Flat Config.

---

## Features

- **Strict Flat Config First**: Pre-configured, deterministic arrays compatible with ESLint 9+ and 10+.
- **Unified Baseline**: Integrates JavaScript, TypeScript, Node.js runtime (`eslint-plugin-n`), and Node/Browser globals in one setup.
- **Type-Aware First**: Native integration with TypeScript's `projectService` for accurate, AST-driven type analysis without manual `tsconfig.json` overhead.
- **Unified Style**: Integrated `@stylistic/eslint-plugin` rules with zero format suppression allowed.
- **Natural Ordering**: Automated, deterministic sorting of imports, exports, and object keys via `eslint-plugin-perfectionist`.
- **Security & Bug Prevention**: Built-in cognitive complexity analysis and anti-ReDoS rules with `eslint-plugin-sonarjs` and `eslint-plugin-regexp`.

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

---

## Configuration Architecture

`eslint-config-yarapa` exports a single static Flat Config array containing all capability layers:

| Capability Layer     | Scope / Files                  | Key Inclusions                                          |
| -------------------- | ------------------------------ | ------------------------------------------------------- |
| Universal JavaScript | All matching files             | Core JS, modern builtins, imports (`import-x`), SonarJS |
| Node.js Runtime      | All matching files             | Node globals, `eslint-plugin-n` runtime checks          |
| Browser Environment  | All matching files             | Browser globals                                         |
| TypeScript Syntax    | `**/*.{ts,tsx,mts,cts}`        | `@typescript-eslint` syntax and hygiene policies        |
| Type-Checked Rules   | `**/*.{ts,tsx,mts,cts}`        | `projectService` type-aware analysis                    |
| Style & Formatting   | All matching files             | Stylistic rules, Perfectionist natural sorting, Unicorn |
| Structural Data      | `**/*.json`, `**/package.json` | `@eslint/json`, `eslint-plugin-package-json`            |

All rules are deterministic and do not mutate based on ambient runtime conditions.

For full architecture details and rule philosophies, refer to the [Architecture & Rules Overview](docs/RULES.md).

---

## Canonical Configuration Contract

`eslint.config.mjs` must contain the Quick Start template exactly. Consumer repositories must not append rules, ignores, globals, mutations, imports, or side effects. Changes to ESLint policy belong in `eslint-config-yarapa` so every repository receives the same configuration.

Add the validator to the consumer's CI scripts:

```json
{
  "scripts": {
    "lint:config": "yarapa-eslint-config"
  }
}
```

Run `pnpm lint:config` before ESLint. The command exits with status `1` when `eslint.config.mjs` is missing or differs from the canonical template. A repository must make this command a required CI check for enforcement.

---

## Formatting & Prettier Integration

`eslint-config-yarapa` includes deterministic code styling via `@stylistic/eslint-plugin` (semi, quotes, 2-space indentation, max line length).

- Run ESLint directly with `--fix` to format and lint your entire repository deterministically.
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

The package owns `projectService` and file-scope policy. Unsupported repository layouts require a central change to `eslint-config-yarapa`, not a consumer override.

### 2. Can I use `eslint-disable` comments?

Inline rule suppressions are prohibited. Fix diagnostics at their source. Generated-file ignores and project-wide policy changes must be added to `eslint-config-yarapa`, not to a consumer's `eslint.config.mjs`.

---

## Inspecting Active Rules

To visually explore every rule, plugin, and active configuration:

```sh
pnpm dlx @eslint/config-inspector
```

---

## License

[MIT](https://github.com/useyarapa/eslint-config-yarapa/blob/main/LICENSE) (c) YARAPA
