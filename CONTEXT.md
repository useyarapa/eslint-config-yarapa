# YARAPA ESLint Configuration

This document defines terminology for the public `eslint-config-yarapa`
package. The package is a general-purpose ESLint Flat Config library for
JavaScript and TypeScript projects and is intended for developers worldwide.

Public presets must not encode assumptions that belong to a particular
organization, industry, legal regime, repository layout, CI provider, or
package manager. Consumers own those project-specific boundaries.

## Language

**Consumer Project**:
A JavaScript or TypeScript project that installs and composes
`eslint-config-yarapa`.

**Preset**:
A public, named ESLint Flat Config array exposed by the package.

**Capability Preset**:
A preset that adds one bounded concern, such as a runtime, language, security
control, documentation format, or test stack.

**Aggregate Preset**:
A preset that composes multiple generally useful capability presets.
`recommended` is the canonical aggregate preset.

**Applicable File**:
A file whose language, content, runtime, and test stack place it within a
preset's declared scope. Consumer-owned `files` and `ignores` entries define
project-specific boundaries.

**Stack Preset**:
A capability preset selected according to a file's actual runtime or test
stack, such as `node`, `browser`, `vitest`, or `ava`.

**Type-Aware Preset**:
A preset whose rules use TypeScript project information rather than syntax
alone.

**Upstream Baseline**:
The rules and support settings inherited from an upstream ESLint or plugin
configuration and intentionally included in a YARAPA preset.

**Rule Inventory**:
The deterministic record of resolved rules, severities, options, sources, and
preset provenance used to review behavioral changes.

**Suppression**:
A consumer-owned ESLint suppression for a specific diagnostic. The public
package may encourage narrow, documented suppressions, but it does not impose
organization-specific approval or conformance processes.

## Product boundary

`eslint-config-yarapa` may be opinionated about lint behavior while remaining
general-purpose. Public presets can define correctness, security, TypeScript,
style, documentation, data-format, runtime, and test-runner behavior when that
behavior is reusable across unrelated projects.

The package must not require consumers to adopt YARAPA-specific paths,
headers, CI workflows, branch policies, legal metadata, package-manager
settings, or internal governance conventions. Repository-maintainer controls
used to develop this package are not part of its consumer API.
