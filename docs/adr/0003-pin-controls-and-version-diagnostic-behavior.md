---
status: accepted
---

# Pin controls and version diagnostic behavior

ESLint and TypeScript are required peers, while every plugin, parser, resolver,
language implementation, and globals package is an exact-pinned direct
dependency. Every plugin contributes its applicable Upstream Baseline, recommended
warnings become errors, and SonarJS contributes every rule in its pinned
`rules` export without deduplication or package-level exceptions. The published
peer ranges and the exact direct pins jointly constrain the diagnostic behavior
under the package version; a release is blocked if the compatibility intersection
cannot support the published ranges.

## Considered options

- Making every plugin a peer was rejected because it shifts compatibility and
  installation correctness onto each consumer repository.
- Caret ranges on direct dependencies were rejected because a fresh installation
  could acquire new diagnostics without changing the `eslint-config-yarapa`
  version.
- Using only SonarJS recommended was rejected because the banking control
  baseline explicitly requires all SonarJS rules.
- Deduplicating overlapping diagnostics was rejected because it would weaken a
  plugin's declared baseline and make coverage dependent on local curation.
- Treating new lint failures as minor or patch changes was rejected because
  they can break consumer CI and require code remediation.
- Autofix changes that alter program behavior are rejected unless separate
  evidence establishes safety; such changes are breaking.

## Consequences

Dependency updates require a reviewed package release and a generated Rule
Inventory diff. New diagnostics, stricter options, changed automatic fixes, or
removed presets are breaking changes. A fix that restores an autofix's semantic
safety without adding diagnostics is a patch. SonarJS deprecated and overlapping
rules remain errors while present in the pinned release. Consumer repositories
may record narrowly targeted, described inline waivers; the package configuration
makes no exceptions. A downstream global rule disable or severity reduction is a
policy violation.
