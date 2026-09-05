# Prefer Existing Capabilities Rules

Use existing, maintained capabilities before writing bespoke implementations. Custom code is the last option, not the default.

## Selection Order

Before writing new code:

1. Confirm the requirement is real and define the smallest useful scope.
2. Search the repository for an existing helper, type, configuration, script, or dependency that solves it.
3. Use the language standard library, native platform API, or native framework capability.
4. Reuse a trusted dependency already present in the lockfile.
5. Evaluate a maintained ecosystem package or standard tool through its official documentation, compatibility, maintenance, license, and security record before adding it.
6. Write custom code only when the previous options cannot satisfy the verified requirement.

## Official APIs First

- Inspect the installed package export and locked version before integrating an upstream library, plugin, or preset.
- Use the official API directly when it provides the required capability.
- Do not infer an API from a package name, outdated documentation, or another project's implementation.
- Do not recreate behavior already provided by an official API, native capability, standard tool, or trusted dependency.

## No Bespoke Implementations

- Do not create a wrapper that only renames, re-exports, adapts, or mechanically transforms an existing API.
- Do not copy an upstream rule catalog, plugin registration, setting, schema, or severity map into local source.
- Do not add fallback branches for an absent, changed, or unverified upstream API.
- Do not write custom parsers, resolvers, formatters, serializers, installers, package-manager operations, or workflow behavior when a reliable maintained capability exists.
- Do not add a dependency when the standard library, native platform, framework, or existing dependency is sufficient.

## Custom Code Exception

Custom code is acceptable only for verified domain-specific behavior that no suitable existing capability provides:

- Keep it at the narrowest boundary with one clear owner.
- Record which existing options were evaluated and why they were insufficient.
- Add a behavior test proving the custom code is necessary and correct.
- Do not use custom code to compensate for an unknown or changed upstream API.
- Do not add speculative dependencies, abstractions, scripts, or compatibility modes.

## Verification

- Test official integrations by using the official API or config object directly.
- Test at least one observable behavior for each custom boundary.
- Run the configured unused-code, dependency, type, and lint checks after changes.
- Confirm the final diff does not duplicate an existing capability or introduce speculative code.
