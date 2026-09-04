---
paths:
  - "packages/eslint-config-yarapa/src/**/*.{ts,mts,cts}"
  - "packages/eslint-config-yarapa/test/**/*.{ts,mts,cts}"
  - "packages/eslint-config-yarapa/scripts/**/*.{ts,mts,cts}"
  - "eslint.config.mjs"
---

# Official Integration Rules

Keep upstream integrations owned by their official packages and keep YARAPA policy explicit.

## Official APIs First

- Inspect the installed package export and locked version before integrating an upstream plugin or preset.
- Use the official Flat Config object directly when the package provides one.
- Do not infer export names from another package, an outdated document, or a package name.

## No Bespoke Upstream Catalogs

- Do not copy upstream rule names, plugin registrations, settings, or severity maps into repository source.
- Do not transform upstream warning or error severities without a documented YARAPA requirement and an observable behavior test.
- Do not add fallback branches for absent or changed upstream exports.

## Narrow YARAPA Overlays

- Keep YARAPA-owned policy in a separate, named config layer.
- Add an overlay only for a verified repository or consumer requirement that the official preset does not provide.
- Remove adapters and helpers when their last consumer is removed.

## Verification

- Test official config composition by reference.
- Test at least one observable diagnostic for each migrated integration.
- Run `pnpm knip` after source, export, or dependency changes.
