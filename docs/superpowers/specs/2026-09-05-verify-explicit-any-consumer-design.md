# Verify Explicit `any` in Published Consumer Design

## Purpose

Prove that a real consumer installing the packed default `eslint-config-yarapa` export rejects explicit `any` through the official `typescript-eslint` recommended preset.

## Scope

Extend the existing tarball consumer behavior verification in `packages/eslint-config-yarapa/scripts/verify-tarball/verify-tarball.mts`. Do not change configuration, dependencies, or unrelated tests unless the new assertion proves that the published default config is wired incorrectly.

## Design

Add one call to the existing generated `expectRule` helper beside the JavaScript behavior assertion. The call uses:

- the tarball-installed default `yarapa` config;
- `sample-invalid.ts` as the lint path;
- `export const value: any = 1;` as invalid source;
- `@typescript-eslint/no-explicit-any` as the expected diagnostic.

`ESLint.lintText` resolves the TypeScript configuration from the file path. The generated consumer already contains a compatible `tsconfig.json`, so the existing project service setup remains authoritative.

Enforcement remains inherited from `typescript-eslint`'s official recommended preset. No upstream rule catalog or local duplicate rule entry will be added.

## Failure Behavior

The existing helper throws when the expected diagnostic is absent and reports the rule IDs returned by ESLint. A failure therefore exposes whether the packed default export omitted or overrode the upstream rule.

If the assertion fails, diagnose the packed artifact and default-config composition, then fix only the smallest proven wiring defect.

## Verification

The primary check is:

```sh
pnpm --filter eslint-config-yarapa test:consumer
```

It builds and packs the package, installs the tarball into an isolated consumer, runs the generated behavior assertions, and lints the valid JavaScript and TypeScript fixtures.

Before completion, run the repository checks required for the changed package boundary: formatting, linting, type checking, tests, and package verification. Existing JavaScript behavior and valid consumer fixtures must continue to pass.

## Acceptance Criteria

- A tarball-installed consumer using the default export rejects `export const value: any = 1;`.
- The diagnostic includes `@typescript-eslint/no-explicit-any`.
- Enforcement comes from the official `typescript-eslint` preset.
- Existing supported consumer behavior remains intact.
- Relevant consumer and package checks pass.
