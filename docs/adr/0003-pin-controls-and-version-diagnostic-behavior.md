---
status: accepted
---

# Pin controls and version diagnostic behavior

ESLint and TypeScript are required peers, while every plugin, parser, resolver,
language implementation, and globals package is an exact-pinned direct
dependency. Every plugin contributes at least its complete upstream recommended
Flat Config, recommended warnings become errors, and SonarJS contributes every
rule in its pinned `rules` export without deduplication or exceptions. This
makes the package version, rather than transitive dependency resolution, the
versioned unit of diagnostic behavior.

## Considered options

- Making every plugin a peer was rejected because it shifts compatibility and
  installation correctness onto each consumer repository.
- Caret ranges were rejected because a fresh installation could acquire new
  diagnostics without changing the `eslint-config-yarapa` version.
- Using only SonarJS recommended was rejected because the banking control
  baseline explicitly requires all SonarJS rules.
- Deduplicating overlapping diagnostics was rejected because it would weaken a
  plugin's declared baseline and make coverage dependent on local curation.
- Treating new lint failures as minor or patch changes was rejected because
  they can break consumer CI and require code remediation.

## Consequences

Dependency updates require a reviewed package release and a generated Rule
Inventory diff. New diagnostics, stricter options, changed automatic fixes, or
removed presets are breaking changes. SonarJS deprecated and overlapping rules
remain errors while present in the pinned release. Consumer repositories may
record narrowly targeted, described inline waivers, but a downstream global
rule disable or severity reduction is a policy violation.
