# No Redundancy Rules

Maintain one source of truth and reuse existing logic, configuration, and test infrastructure.

## Single Source of Truth

- Define recurring values, names, patterns, and options once in the narrowest shared location.
- Reference shared definitions instead of copying literals across modules, tests, documentation, or configuration.
- Keep equivalent configuration in one layer; do not maintain parallel versions for convenience.

## Reuse Before Adding

- Search the workspace for an existing internal helper, type, utility, or test helper before creating another implementation.
- Extend an existing abstraction when the concept is the same and the change belongs to its contract.
- Create a new abstraction only when it owns a distinct responsibility and has more than superficial reuse.
- Evaluate third-party dependencies and official platform APIs strictly according to `prefer-existing-capabilities.md`.

## Consistent Test Infrastructure

- Use the repository's shared test helpers and setup for equivalent tests.
- Parameterize cases that differ only by data, input, or supported variant.
- Keep assertions focused on stable public behavior rather than duplicating implementation details.

## Verification

- Search for duplicated definitions when changing a shared concept.
- Run the configured unused-code and dependency checks after modifying shared logic or package metadata.
