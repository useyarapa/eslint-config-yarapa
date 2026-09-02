# eslint-config-yarapa

Strict, deterministic ESLint 10 Flat Config presets for JavaScript and
TypeScript projects. `eslint-config-yarapa` is a general-purpose public npm
library intended for developers worldwide; its presets do not require a
particular organization, industry, repository layout, CI provider, or package
manager.

## Requirements

- Node.js `>=24.15.0`
- ESLint `^10.0.0`
- TypeScript `>=5.0.0 <6.1.0` when TypeScript presets are used
- ESM configuration (`eslint.config.mjs`, `eslint.config.js` in a `type: module` package, or equivalent)

The package is ESM-only. Its JavaScript API has one named export, `configs`, and no default export.

## Installation

Install the config together with its peer dependencies using the package
manager used by your project. For example with pnpm:

```sh
pnpm add -D eslint-config-yarapa eslint typescript
```

Equivalent npm, Yarn, or other standards-compatible package-manager workflows
are valid. Consumers should not need YARAPA-specific package-manager settings
to install the package. Use versions inside the supported peer ranges; the
package's compatibility boundaries are certified by its own CI matrix.

## Quick start

```js
// eslint.config.mjs
import { defineConfig } from "eslint/config";
import { configs } from "eslint-config-yarapa";

export default defineConfig(
  configs.ignores,
  configs.recommended,
);
```

`recommended` is the canonical aggregate high-assurance preset. It includes
core JavaScript controls, syntax-only and type-aware TypeScript coverage,
import/dependency checks, Promise and async checks, regular-expression checks,
SonarJS/security controls, JSDoc, JSON/JSONC/JSON5, package-manifest checks,
stylistic rules, and deterministic ordering.

Runtime, test-runner, ignore, project-layout, and organizational boundaries are
intentionally not inferred from YARAPA's own repository. Consumers scope those
concerns to their actual files and environments.

## Presets

All values under `configs` are Flat Config arrays and can be passed directly to `defineConfig()`.

| Preset | Purpose |
| --- | --- |
| `recommended` | Aggregate high-assurance baseline for general JavaScript and TypeScript projects. |
| `base` | Core JavaScript correctness baseline. |
| `typescript` | TypeScript syntax-level controls that do not require project type information. |
| `typeChecked` | Type-aware TypeScript controls using TypeScript Project Service. |
| `disableTypeChecked` | Turns off type-aware parsing/rules for explicitly out-of-project tooling files. |
| `node` | Node.js runtime globals and runtime-specific rules. |
| `browser` | Browser runtime globals and browser-specific scope. |
| `stylistic` | Canonical ESLint-based formatting/stylistic policy. |
| `ignores` | Common generated/build-output ignores only. |
| `security` | Security-focused plugin coverage. |
| `testingLibrary` | Testing Library rules for applicable tests. |
| `vitest` | Vitest test-runner rules scoped to the canonical test-file globs. |
| `ava` | AVA test-runner rules. |
| `json` | JSON, JSONC, and JSON5 linting. |
| `packageJson` | `package.json` validity, consistency, and style checks. |
| `jsdoc` | JSDoc correctness/documentation checks. |

The package deliberately exposes composable deterministic presets rather than a
stateful options factory. This keeps the resolved rule set reviewable and makes
Rule Inventory drift meaningful without baking a specific project's layout or
workflow into the public API.

## Consumer-owned boundaries

The package can be opinionated about reusable lint behavior while consumers
retain control of project-specific concerns. Public presets do not require:

- YARAPA-specific directory names or monorepo structure;
- a specific CI provider or branch policy;
- organization-specific legal headers or metadata;
- pnpm-specific installation policy;
- a particular runtime or test runner unless its corresponding preset is
  explicitly selected.

If a control cannot be configured correctly without consumer-owned information,
the consumer should configure that control in its own Flat Config rather than
the public package inventing a default.

## Node and browser boundaries

Do not apply both runtime environments globally when a repository contains mixed targets. Scope each environment to its real files:

```js
import { defineConfig } from "eslint/config";
import { configs } from "eslint-config-yarapa";

export default defineConfig(
  configs.ignores,
  configs.recommended,
  {
    files: ["server/**/*.{js,mjs,ts,mts}"],
    extends: [configs.node],
  },
  {
    files: ["web/**/*.{js,jsx,ts,tsx}"],
    extends: [configs.browser],
  },
);
```

This prevents Node globals from leaking into browser code and browser globals from masking server-side defects.

## Type-aware linting

`typeChecked` is part of `recommended` for TypeScript source files. It uses TypeScript Project Service:

```js
languageOptions: {
  parserOptions: {
    projectService: true,
    tsconfigRootDir: process.cwd(),
  },
}
```

A normal TypeScript source file therefore needs to belong to the intended
`tsconfig.json`. If Project Service reports that a file is outside every
project, fix the consumer project's project boundary rather than disabling
type-aware linting globally.

### Out-of-project tooling files

Some project tooling files intentionally sit outside application `tsconfig.json` files. Scope `disableTypeChecked` narrowly:

```js
export default defineConfig(
  configs.recommended,
  {
    files: ["scripts/**/*.{ts,mts}", "*.config.{ts,mts}"],
    extends: [configs.disableTypeChecked],
  },
);
```

Do not use `disableTypeChecked` as a blanket workaround for source files that should be part of a TypeScript project.

## Test runners

### Vitest

```js
export default defineConfig(
  configs.recommended,
  {
    files: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
    extends: [configs.vitest],
  },
);
```

### AVA

```js
export default defineConfig(
  configs.recommended,
  {
    files: ["test/**/*.{js,mjs,ts,mts}"],
    extends: [configs.ava],
  },
);
```

### Testing Library

```js
export default defineConfig(
  configs.recommended,
  {
    files: ["web/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    extends: [configs.testingLibrary, configs.vitest, configs.browser],
  },
);
```

Only compose runner/framework presets where their APIs are actually present.

## Ignores

`configs.ignores` covers common generated output such as `dist`, `build`, `out`, coverage output, `.next`, `.turbo`, and `node_modules`.

It intentionally does not ignore arbitrary source, fixtures, migrations, or
project-specific directories. Those boundaries belong to the consumer and
should be explicit in the consumer's Flat Config.

## JSON and package manifests

`recommended` includes JSON-family and package-manifest controls. Standalone consumers can also compose `configs.json` or `configs.packageJson` when they want those controls without the complete baseline.

The package-manifest preset is intentionally strict: a publishable manifest is expected to carry coherent metadata rather than merely parse as JSON.

## Rule Inventory

`generated/rule-inventory.json` is a deterministic audit artifact generated from the built package. It records enabled rule controls with preset/config provenance, severity, options, and source.

Maintainers use it to detect behavioral drift caused by source edits or dependency upgrades:

```sh
pnpm --filter eslint-config-yarapa inventory:check
```

A Rule Inventory change is review evidence, not an automatically acceptable update. Review why each changed diagnostic exists.

## Behavioral SemVer

Lint behavior is part of compatibility. Changes may be breaking even if the `configs` JavaScript shape does not change.

Treat the following as behavioral breaking changes unless a release policy explicitly establishes otherwise:

- newly enabled errors for existing consumer files;
- tighter rule options;
- broader preset/file applicability;
- material automatic-fix changes;
- supported Node.js, ESLint, or TypeScript boundary changes.

An opt-in preset addition can normally be minor; a fix that restores already-documented behavior without new diagnostics can normally be patch-level. Review the actual diagnostic impact rather than relying only on API shape.

## Troubleshooting

### Project Service says a TypeScript file is not part of a project

Confirm that the file belongs to the intended consumer `tsconfig.json`. Use a dedicated tooling tsconfig or a narrowly scoped `disableTypeChecked` override only when the file is intentionally outside the typed application graph.

### A Node global is undefined in server code

Add `configs.node` only to the server-side file boundary. Do not make Node globals global to a mixed browser/server repository.

### A browser global is undefined in frontend code

Add `configs.browser` to that frontend boundary rather than weakening undefined-variable checks.

### A test-runner global is undefined

Compose the matching runner preset (`vitest` or `ava`) only for that runner's test files.

### A generated directory is still linted

`configs.ignores` is intentionally conservative. Add a consumer-owned ignore entry for project-specific generated output.

### A dependency update changes many diagnostics

Regenerate/review the Rule Inventory and behavioral fixtures. Do not accept a dependency update solely because package installation succeeds.

### Installation requires project-specific package-manager policy

Treat this as a portability problem to investigate. The public package should
install as an ordinary dependency on its supported package managers without
requiring YARAPA-specific consumer configuration.

## Maintainer verification

The repository's release-readiness gate is intentionally non-publishing:

```sh
pnpm --filter eslint-config-yarapa check-types
pnpm --filter eslint-config-yarapa build
pnpm --filter eslint-config-yarapa lint
pnpm --filter eslint-config-yarapa test
pnpm --filter eslint-config-yarapa inventory:check
pnpm --filter eslint-config-yarapa test:consumer
```

`test:consumer` builds and packs the package, runs `publint`, runs Are The Types
Wrong with the ESM-only profile, installs the tarball into a clean temporary
consumer, verifies the public `configs` export, and executes ESLint against the
packed artifact. The temporary consumer is intended to model normal public npm
usage rather than a YARAPA-specific repository. It does not publish anything
to npm.
