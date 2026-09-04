# Strict Official Presets Direct

## Status

Approved design for implementation planning.

## Context

`eslint-config-yarapa` is a deterministic ESLint Flat Config package for JavaScript and TypeScript projects. Several internal configuration modules currently reproduce upstream rule catalogs or adapt upstream configuration objects manually. This creates a second source of truth and increases maintenance cost whenever an upstream package changes.

The repository must use official APIs exposed by the dependency versions locked in this workspace. Custom code is allowed only for YARAPA policy that upstream packages do not provide. Custom code must not imitate an upstream preset, silently rewrite upstream severity, or add compatibility behavior for an API that is not present.

The installed dependency exports were inspected from the package workspace:

| Package                     | Locked version | Official export verified                                    |
| --------------------------- | -------------: | ----------------------------------------------------------- |
| `eslint-plugin-sonarjs`     |        `4.2.0` | `configs.recommended`                                       |
| `eslint-plugin-react-hooks` |        `7.1.1` | `configs.flat.recommended-latest`                           |
| `eslint-plugin-import-x`    |       `4.17.1` | `configs["flat/recommended"]`, `configs["flat/typescript"]` |

The verified exports are Flat Config objects rather than arrays. The migration must include those objects directly in the exported config arrays and must not reconstruct their rule maps.

## Problem

The current implementation contains three forms of bespoke upstream integration:

1. A large manually maintained SonarJS rule catalog.
2. A manually maintained React Hooks rule catalog.
3. Import-x configuration that copies rules and converts upstream warnings to errors.

The repository also contains compatibility helpers. Some may still be required for third-party type declarations, but they must not remain merely because they were used by the old integrations.

## Goals

- Use the verified official Flat Config exports directly.
- Remove manually enumerated upstream rule catalogs and severity transformations.
- Preserve only YARAPA-specific policy overlays that have an observable requirement.
- Keep framework profiles deterministic and composable.
- Make upstream integration failures fail at type-check or test time rather than silently falling back.
- Add repository governance that prevents new bespoke upstream integrations.
- Prove the migration with profile-shape, observable behavior, package, and consumer tests.

## Non-goals

- Do not expand framework support.
- Do not add a new CLI, plugin, dependency, or compatibility layer.
- Do not change stylistic policy unless the migration proves an existing overlay is redundant.
- Do not preserve old diagnostics solely because they came from a hand-maintained upstream catalog.
- Do not add a custom static scanner whose purpose is to duplicate ESLint, TypeScript, Knip, or package validation.

## Design

### 1. Official preset boundary

Each upstream integration will expose a small local array containing official config objects. The array is a composition boundary for the package; the rule and plugin contents remain owned by the upstream package.

The implementation will use these exports:

```ts
sonarjsPlugin.configs.recommended;
reactHooksPlugin.configs.flat["recommended-latest"];
importXConfigs["flat/recommended"];
importXConfigs["flat/typescript"];
```

The objects will be inserted directly into the relevant profile arrays. The implementation will not use `Object.entries`, spread an upstream `rules` object into a new object, map severities, or enumerate upstream rule identifiers.

If an official export is absent from the locked dependency version, implementation stops at that integration. It must not add a fallback, guess another export, or recreate the preset.

### 2. SonarJS integration

Replace the manually maintained SonarJS catalog in `src/configs/internal/sonarjs.ts` with the verified `eslint-plugin-sonarjs` recommended config object.

The existing `modernJavaScriptOwnership` overlay will be evaluated after the official preset is installed:

- Keep an override only when a current YARAPA requirement is demonstrated by a failing behavior test or an existing supported-source constraint.
- Remove an override when the official preset does not enable the rule or when no repository requirement justifies it.
- Do not add a replacement catalog to preserve an incidental old rule set.

The resulting integration must retain the official plugin registration and official rule severities without local rewriting.

### 3. React Hooks integration

Replace the manually maintained React Hooks rule list in `src/configs/internal/reactHooks.ts` with `eslint-plugin-react-hooks` `configs.flat.recommended-latest`.

The React profile will compose the official object directly with the existing React component naming and runtime layers. The `asFlatPlugin` adapter will be removed if no remaining consumer requires it.

No React Hooks rule names will be copied into repository source. Any additional React policy must be represented as a narrow, independently justified overlay and tested as YARAPA policy rather than presented as an upstream preset.

### 4. Import-x integration

Replace the current import-x reconstruction with the two verified official objects:

- `configs["flat/recommended"]` for JavaScript and general module rules.
- `configs["flat/typescript"]` for TypeScript module resolution and TypeScript-specific rules.

The migration will remove the local warning-to-error conversion. Official severities are part of the upstream contract and must remain unchanged.

The existing resolver settings will be retained only when they are part of the official TypeScript preset or are required by a verified repository integration. The local `required` helper will be removed from this path when direct official exports make it unnecessary.

### 5. Compatibility helpers

Audit each helper in `src/configs/internal/` after the preset migration:

- Remove `asFlatPlugin` if all plugin-shaped manual integrations are gone.
- Retain `asFlatConfigArray` only if an installed upstream export has a genuine type declaration mismatch that cannot be expressed through the official ESLint or TypeScript ESLint API.
- Remove `required` if no official integration needs a fail-fast assertion.

A retained helper must have a direct consumer, a narrow purpose, and a test or type-level reason. No helper will be retained as a speculative compatibility shim.

### 6. Existing YARAPA-owned layers

The following layers remain local because they express YARAPA policy rather than reproducing an upstream preset:

- `ignores.ts` for repository build and generated-output boundaries.
- `stylistic.ts` for YARAPA formatting choices through the official `@stylistic/eslint-plugin` customization API.
- `packageJson.ts`, `json.ts`, `jsdoc.ts`, and other package-owned composition layers when their purpose is documented by the profile contract.
- Framework-specific composition that selects an explicit entrypoint such as `/next`, `/react`, or `/nest`.

Each retained layer must remain narrow, named, and observable through tests.

## Governance

Add `.claude/rules/no-bespoke-official-only.md` for source and configuration files. The rule will establish these repository requirements:

- Read the official package API and inspect the locked version before integrating an upstream preset.
- Prefer the official Flat Config export directly.
- Never copy an upstream rule catalog into repository source.
- Never transform upstream rule severities without a documented YARAPA requirement and a behavior test.
- Never add a fallback for an absent or changed upstream export.
- Use existing repository helpers only when they have a current consumer and a verified type or runtime purpose.
- Keep custom overlays separate from official presets so ownership is visible during audit.

The rule will not require a bespoke scanner. Enforcement will come from source review, type checking, profile-shape tests, behavior tests, Knip, and package verification.

## Migration sequence

1. Record the current profile shape and observable behavior for default, React, Next.js, and NestJS profiles.
2. Add or update focused tests for the verified official export contracts.
3. Replace the SonarJS catalog with the official recommended object.
4. Replace the React Hooks catalog with the official latest Flat Config object.
5. Replace import-x rule reconstruction and severity mapping with the two official Flat Config objects.
6. Remove compatibility helpers that no longer have consumers.
7. Remove obsolete policy overlays only when tests demonstrate that they are redundant.
8. Add and validate the no-bespoke governance rule.
9. Run the complete verification suite.

Each integration is an independent checkpoint. If one official export fails to load or changes an unacceptable behavior, stop that checkpoint and fix the integration boundary. Do not weaken the preset or introduce a fallback to continue.

## Error handling and rollback

The package must fail clearly when an official export is unavailable or has an incompatible shape. A missing export is a dependency contract failure, not a signal to silently select another preset.

Rollback is limited to reverting the migration checkpoint that introduced the failure. No generated `dist` files are edited by hand. A rollback must preserve the governance rule and tests that describe the failure unless the design itself is revised and approved.

## Testing strategy

### Official export contract tests

Profile-shape tests will verify that each public profile contains the exact official config object from the installed dependency:

- SonarJS recommended config is included by reference.
- React Hooks latest recommended Flat Config is included by reference.
- Import-x recommended and TypeScript Flat Config objects are included by reference.

These tests verify that the package is composing upstream ownership directly instead of reconstructing it.

### Observable behavior tests

Behavior tests will cover at least one diagnostic from each migrated integration and will use the repository ESLint test helper. Assertions will describe the intended profile behavior, not an assumed count of upstream rules.

Tests will also confirm that TypeScript files receive the official import-x TypeScript layer and that React files receive the official React Hooks layer.

### Full verification

Run the narrow checkpoint tests after each migration and then the complete suite:

```sh
pnpm --filter eslint-config-yarapa test test/profiles.test.ts
pnpm --filter eslint-config-yarapa test test/behavior.test.ts
pnpm --filter eslint-config-yarapa test test/config-validation.test.ts
pnpm sort-package-json:check
pnpm lint:check
pnpm typecheck
pnpm knip
pnpm test
pnpm --filter eslint-config-yarapa test:consumer
pnpm exec actionlint .github/workflows/*.yml
```

## Acceptance criteria

- No manually enumerated `sonarjs/*` or `react-hooks/*` upstream rule catalog remains in source.
- No local import-x severity transformation remains.
- Verified official exports are included directly in the relevant profile arrays.
- Every retained compatibility helper has a current consumer and a verified reason.
- Official export contract tests pass.
- Observable behavior tests pass for each migrated integration.
- `pnpm knip` reports no unused file, export, or dependency.
- Package build, type check, consumer tarball verification, and workflow validation pass.
- No fallback or speculative configuration is introduced.
- No inline code comments or emojis are added.
