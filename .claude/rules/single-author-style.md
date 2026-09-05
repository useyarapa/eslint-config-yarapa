# Single Author Style Rules

Write code as if one careful engineer owns the entire repository. Similar code should share the same structure, naming, ordering, and level of abstraction.

## Consistent Structure

- Use one predictable file skeleton for each category of module, profile, helper, script, configuration, and test.
- Keep imports, constants, types, implementation, exports, and tests in a consistent order across similar files.
- Keep related behavior at the same abstraction level. Separate orchestration, policy, parsing, and side effects into focused units.
- Prefer symmetrical composition: parallel modules, profiles, commands, and tests should expose comparable layers in the same order.
- Make the smallest structural change that preserves the established pattern. Do not introduce a new pattern for a one-off case.

## Consistent Naming

- Use one term for one concept across filenames, symbols, configuration names, tests, and documentation.
- Name related symbols with parallel forms and matching grammatical structure.
- Prefer names that describe the domain contract and ownership rather than implementation mechanics.
- Do not shorten, rename, or rearrange an established pattern without a repository-wide reason.

## Consistent Abstraction

- Keep equivalent operations equivalent across modules: use the same API, error behavior, return shape, and validation boundary.
- Do not introduce a wrapper, factory, adapter, or alternate calling convention for superficial stylistic preference.
- Keep custom policy separate from upstream, platform, and framework-owned behavior so ownership remains visible.

## Consistent Tests

- Give similar tests the same Arrange, Act, and Assert shape.
- Parameterize cases that differ only by data, input, or supported variant.
- Use the repository's shared test setup and helpers for equivalent tests.
- Assert stable public behavior and diagnostics, not incidental implementation details.
- Keep fixtures, test names, and failure messages parallel with the behavior they verify.

## Consistent Changes

- Before editing, inspect neighboring files and follow the dominant local pattern.
- When a pattern must change, update every equivalent site in the same change or state why a site is intentionally different.
- Do not leave mixed conventions, transitional aliases, duplicate styles, or partially migrated structures.
- Treat formatter and linter configuration as the source of truth for mechanical formatting; do not duplicate those settings in source guidance.

## Verification

- Compare each changed file with its closest sibling before finishing.
- Run the narrowest relevant check and confirm that the change does not create a second pattern.
- Run the configured unused-code, dependency, type, lint, and test checks before declaring a structural change complete.
