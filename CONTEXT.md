# YARAPA ESLint Configuration

This context defines the language used to describe a strict, high-assurance
linting standard for repositories in regulated Thai banking environments.

## Language

**Consumer Repository**:
A repository that adopts the YARAPA linting standard and its conformance
requirements.
_Avoid_: Client, downstream app, generic user

**Preset**:
A public, named ESLint Flat Config array exposed by the package.
_Avoid_: Config object, ruleset file

**Capability Preset**:
A preset that adds one bounded concern, such as a runtime, language, security
policy, or test stack.
_Avoid_: Optional plugin, feature flag

**Aggregate Preset**:
A preset that composes multiple capability presets into one policy baseline.
`recommended` is the canonical aggregate preset.
_Avoid_: Default config, starter config

**Applicable File**:
A file whose language, content, runtime, and test stack place it within a
preset's declared scope. A sanctioned, file-scoped control such as
`disableTypeChecked` changes which type-aware rules apply; it does not make the
file exempt from the rest of the Banking Baseline.
_Avoid_: Every file, included file

**Banking Baseline**:
The mandatory high-assurance policy applied by the `recommended` aggregate
preset to each applicable file in a conforming consumer repository.
_Avoid_: General-purpose defaults, beginner preset

**Stack Preset**:
A capability preset selected according to a file's actual runtime or test
stack, such as `node`, `browser`, `vitest`, or `ava`.
_Avoid_: Universal preset, convenience config

**Type-Aware Preset**:
A preset whose rules use TypeScript project information rather than syntax
alone.
_Avoid_: TypeScript preset, typed style

**Upstream Baseline**:
The complete set of rules enabled by each applicable recommended Flat Config
selected from a plugin, together with the non-rule settings required for those
rules to operate correctly. Every enabled rule is mandatory coverage.
_Avoid_: Suggested rules, plugin defaults

**Rule Inventory**:
The resolved, versioned record of every rule, severity, option, and preset in
the package.
_Avoid_: Rule documentation, plugin list

**Waiver**:
A targeted, documented suppression of one named rule over the smallest
justified code range. A waiver does not remove a rule from the Banking
Baseline.
_Avoid_: Exception, disabled rule, blanket suppression

**Conforming Repository**:
A consumer repository that applies the Banking Baseline, selects the correct
stack presets, uses only sanctioned file-scoped controls, does not otherwise
weaken rules, and limits suppressions to auditable waivers.
_Avoid_: Installed repository, compatible project
