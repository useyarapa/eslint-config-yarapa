---
paths:
  - "packages/eslint-config-yarapa/src/**/*.{ts,mts,cts}"
  - "packages/eslint-config-yarapa/test/**/*.{ts,mts,cts}"
  - "packages/eslint-config-yarapa/scripts/**/*.{ts,mts,cts}"
  - "eslint.config.mjs"
---

# Prefer Existing Capabilities Rules

Use existing, maintained capabilities before writing bespoke implementations. Custom code is the last option, not the default.

## Selection Order

Before writing new code, follow this order:

1. Confirm that the requirement is real and define the smallest useful scope.
2. Search the repository for an existing helper, type, config layer, script, or dependency that already solves it.
3. Use the language standard library, native platform API, or native framework capability.
4. Reuse a trusted dependency already present in the lockfile.
5. If no existing dependency is suitable, evaluate a maintained ecosystem package or standard tool using its official documentation, compatibility, maintenance, license, and security record before adding it.
6. Write custom code only when the previous options cannot satisfy the verified requirement.

## Official APIs First

- Inspect the installed package export and locked version before integrating an upstream plugin or preset.
- Use the official API or Flat Config object directly when the package provides one.
- Do not infer export names from another package, an outdated document, or a package name.
- Do not recreate behavior that an official API, native framework, standard tool, or trusted dependency already provides.

## No Bespoke Implementations

- Do not copy upstream rule names, plugin registrations, settings, or severity maps into repository source.
- Do not transform upstream warning or error severities without a documented YARAPA requirement and an observable behavior test.
- Do not add fallback branches for absent or changed upstream exports.
- Do not create wrappers that only rename, re-export, adapt, or mechanically transform an existing API. Keep a boundary only when it adds a distinct YARAPA contract and has a test.
- Do not write custom parsers, resolvers, formatters, serializers, installers, package-manager operations, or CI behavior when a reliable native or maintained capability exists.

## Custom Code Exception

Custom code is acceptable only for verified domain-specific behavior that no suitable existing capability provides.

- Keep the implementation at the narrowest boundary with one clear owner.
- State in the issue or pull request which existing options were evaluated and why they were insufficient.
- Add a behavior test that proves the custom code is necessary and correct.
- Do not add a custom implementation to compensate for an unknown, missing, or changed upstream API; inspect the official contract and stop when it cannot be verified.
- Do not add a new dependency, abstraction, or script speculatively.

## Narrow YARAPA Overlays

- Keep YARAPA-owned policy in a separate, named config layer.
- Add an overlay only for a verified repository or consumer requirement that the official preset does not provide.
- Remove adapters and helpers when their last consumer is removed.

## Verification

- Test official config composition by reference.
- Test at least one observable diagnostic for each migrated integration.
- Run `pnpm knip` after source, export, or dependency changes.
- Run the narrowest relevant test before review and the full verification suite before merge.
- Confirm that the final diff does not duplicate an existing capability or introduce speculative code.

Apply this rule with `no-dead-code`, `no-redundancy`, and `no-speculative-config`.
