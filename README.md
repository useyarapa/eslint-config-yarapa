# YARAPA Code Standard

Deterministic, opinionated ESLint Flat Config monorepo for modern JavaScript and TypeScript projects.

This repository hosts the shared code standards, lint configurations, and baseline rules enforced across YARAPA applications and libraries, designed with strict safety baselines for regulated and high-integrity environments.

## Workspace Packages

| Package | Version | Description |
| ------- | ------- | ----------- |
| [`eslint-config-yarapa`](packages/eslint-config-yarapa) | `0.3.0` | Production-ready ESLint Flat Config profiles (Universal, React, Next.js, NestJS). |

## Key Architectural Principles

1. **Static Flat Configs**: Profiles are immutable, deterministic arrays of ESLint Flat Config objects. They do not guess or conditionally toggle rules based on installed environment packages.
2. **Type-Aware First**: Leverages TypeScript's native `projectService` for accurate, AST-driven type analysis without manual `tsconfig` gymnastics.
3. **Zero Inline Suppression**: Directives such as `// eslint-disable`, `// @ts-ignore`, and `/* prettier-ignore */` are strictly prohibited across repository source files. All issues must be solved at the root cause.
4. **Natural Symmetry**: Consistent layout, rule layering, and formatting across every supported framework.

Detailed rules breakdown and plugin matrices are documented in [Architecture & Rules Matrix](packages/eslint-config-yarapa/docs/RULES.md).

## Quick Start (Consumers)

To use the config in your application, install `eslint-config-yarapa`:

```sh
pnpm add -D eslint eslint-config-yarapa typescript
```

Configure `eslint.config.mjs`:

```js
import yarapa from "eslint-config-yarapa";

export default yarapa;
```

For complete installation instructions, framework profile options (`next`, `react`, `nest`), and usage examples, refer to the [Package Documentation](packages/eslint-config-yarapa/README.md).

## Monorepo Development

### Prerequisites

- Node.js matching `.nvmrc` (`>=24.15.0`)
- pnpm `11.23.0`

### Setup & Verification

```sh
# Install dependencies
pnpm install

# Build the configuration package
pnpm build

# Run comprehensive workspace checks
pnpm lint           # Builds package and runs repository linting
pnpm check-types    # Workspace-wide TypeScript checks
pnpm test           # Unit and diagnostic tests
pnpm knip           # Dead code and unused dependency audit
pnpm verify         # Full verification pipeline (build, test, consumer tarball smoke test)
```

## Contributing & Governance

- [Contributing Guidelines](CONTRIBUTING.md) — Workflow, testing standards, and changesets
- [Code of Conduct](CODE_OF_CONDUCT.md) — Community pledges and enforcement standards
- [Security Policy](SECURITY.md) — Vulnerability reporting guidelines and response timeline

## License

[MIT](LICENSE)
