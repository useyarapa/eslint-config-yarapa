# YARAPA Code Standard

[![CI Status](https://github.com/useyarapa/eslint-config-yarapa/actions/workflows/ci.yml/badge.svg)](https://github.com/useyarapa/eslint-config-yarapa/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/eslint-config-yarapa.svg?color=cb3837)](https://www.npmjs.com/package/eslint-config-yarapa)
[![node version](https://img.shields.io/badge/node-%3E%3D24.15.0-brightgreen.svg)](https://nodejs.org)
[![license](https://img.shields.io/github/license/useyarapa/eslint-config-yarapa.svg)](LICENSE)

Deterministic, opinionated ESLint Flat Config monorepo engineered for modern JavaScript and TypeScript applications.

This repository serves as the engineering baseline for YARAPA projects, enforcing strict code quality, consistent layout, and security standards suitable for high-integrity, regulated environments (such as financial technology and banking services).

---

## Workspace Packages

| Package                                                 | Version                                                                                                             | Description                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`eslint-config-yarapa`](packages/eslint-config-yarapa) | [![npm](https://img.shields.io/npm/v/eslint-config-yarapa.svg)](https://www.npmjs.com/package/eslint-config-yarapa) | Strict, full-stack ESLint Flat Config for JavaScript, TypeScript, and Node.js. |

---

## Core Architectural Pillars

1. **Static & Deterministic Flat Configs**
   - The configuration is a static, immutable Flat Config array.
   - Zero runtime sniffing or dynamic rule mutations based on installed ambient dependencies.
2. **Type-Aware First**
   - Direct integration with TypeScript's native `projectService`, eliminating custom AST divergence and manual `tsconfig` lookup overhead.
3. **Zero Inline Suppression**
   - Suppression directives (`// eslint-disable`, `// @ts-ignore`, `/* prettier-ignore */`) are strictly prohibited in repository source code. All issues must be solved at the root cause.
4. **Unified Capability Baseline**
   - Combines JavaScript, TypeScript, and Node.js runtime in one deterministic configuration.

For in-depth architecture, rule classifications, and plugin matrices, see [Architecture & Rules Overview](packages/eslint-config-yarapa/docs/RULES.md).

---

## Quick Start (For Consumers)

Install the package alongside ESLint and TypeScript:

```sh
pnpm add -D eslint eslint-config-yarapa typescript
```

Configure `eslint.config.mjs`:

```js
import yarapa from "eslint-config-yarapa";

export default yarapa;
```

Consumer repositories must keep this file unchanged and run `yarapa-eslint-config` as a required CI check before ESLint. Rules, ignores, globals, and file scopes are maintained in the package rather than overridden locally.

For CI enforcement, editor configuration, and troubleshooting, read the [Package Documentation](packages/eslint-config-yarapa/README.md).

---

## Repository Development & Contribution

### Prerequisites

- Node.js matching `.nvmrc` (`>=24.15.0`)
- pnpm `11.23.0` (managed via Corepack or package manager)

### Development Workflow

```sh
# 1. Install dependencies
pnpm install

# 2. Build the package distribution
pnpm build

# 3. Verify quality and test suites
pnpm lint           # Repository linting (builds package first)
pnpm check-types    # Workspace-wide TypeScript checks
pnpm test           # Unit and diagnostic tests
pnpm knip           # Dead code and unused dependency audit
pnpm verify         # Complete CI-parity pipeline including consumer tarball test
```

---

## Repository Governance

- [Contributing Guidelines](CONTRIBUTING.md) — Workflow, PR standards, and Changesets protocol
- [Code of Conduct](CODE_OF_CONDUCT.md) — Contributor Covenant v2.1 community standards
- [Security Policy](SECURITY.md) — Vulnerability reporting channel and response SLA

---

## License

[MIT](LICENSE) © YARAPA
