# YARAPA ESLint Policy

## Purpose

`eslint-config-yarapa` is a public npm package that provides strict,
high-assurance ESLint Flat Config presets for JavaScript and TypeScript
repositories in regulated Thai banking environments.

The package is intentionally opinionated. It optimizes for consistent control,
auditability, deterministic diagnostics, and defect prevention rather than
broad adoption or low-friction onboarding.

## Initial platform contract

The initial `0.1.0` release has these boundaries:

- ESLint 10 only.
- ESLint Flat Config only; legacy `.eslintrc` formats are unsupported.
- ESM package consumption only; the presets may still lint CommonJS files.
- Node.js `>=24.15.0`.
- TypeScript `>=5.0.0 <6.1.0`.
- TypeScript 7 is unsupported until the TypeScript ESLint ecosystem can use its
  compiler API reliably.
- JavaScript, TypeScript, JSX, TSX, declaration files, JSON, JSONC, JSON5, and
  package manifests are in scope.

ESLint and TypeScript are required peer dependencies. Plugins, parsers,
resolvers, language implementations, and global definitions are exact-pinned
direct dependencies.

The Node.js engine range expresses the installation floor. A release certifies
only the Node.js lines named in its tested compatibility matrix; a future Node.js
major is not certified merely because it satisfies the open-ended engine range.
The public ESLint and TypeScript peer ranges are authoritative and must be
subsets of the compatibility intersection supported by the policy-controlled
dependencies. A release is blocked if that intersection cannot support the
published ranges.

## Public API

The package exposes one named export and no default export:

```ts
import { configs } from "eslint-config-yarapa";
```

The root entrypoint is the only code entrypoint. `configs` contains sixteen
preset arrays:

1. `recommended`
2. `base`
3. `typescript`
4. `typeChecked`
5. `disableTypeChecked`
6. `node`
7. `browser`
8. `stylistic`
9. `ignores`
10. `security`
11. `testingLibrary`
12. `vitest`
13. `ava`
14. `json`
15. `packageJson`
16. `jsdoc`

Every preset is represented by the same public shape: an ESLint Flat Config
array. Capability presets are additive. Presets with prerequisites document
the required order instead of silently duplicating their prerequisites.

## Composition contract

The conforming adoption path has this order:

1. Apply `ignores` first only when its documented repository boundaries are
   appropriate. It is optional and is never included in `recommended`.
2. Apply `recommended` as the Banking Baseline.
3. Add `node`, `browser`, and test-stack presets in later entries constrained to
   the files that actually use those stacks.
4. Apply `disableTypeChecked` last and only to an explicit tooling-file scope
   that intentionally has no TypeScript project.

ESLint 10 `defineConfig` and `extends` preserve array presets while assigning a
consumer-owned file scope. For example:

```ts
import { defineConfig } from "eslint/config";

import { configs } from "eslint-config-yarapa";

export default defineConfig(
  configs.recommended,
  {
    files: ["apps/api/**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: [configs.node],
  },
  {
    files: ["apps/web/**/*.{js,mjs,jsx,ts,mts,tsx}"],
    extends: [configs.browser],
  },
  {
    files: ["apps/web/**/*.test.{js,jsx,ts,tsx}"],
    extends: [configs.vitest, configs.testingLibrary],
  },
  {
    files: ["tools/*.ts"],
    extends: [configs.disableTypeChecked],
  },
);
```

The paths above illustrate repository-owned boundaries; they are not package
defaults. A repository using AVA substitutes `ava` for `vitest`. A repository
with separate AVA and Vitest suites creates disjoint entries. Omitting a runner
preset from files that use that runner is non-conforming.

Consumers composing capability presets instead of `recommended` must follow
the prerequisite graph published with the preset reference. The release gate
verifies that graph and the example above against the built package.

## Banking Baseline

`configs.recommended` is the aggregate Banking Baseline. It applies all
universally relevant controls, including:

- ESLint core recommended coverage;
- TypeScript recommended and type-aware recommended coverage;
- TypeScript Project Service;
- import resolution and dependency-boundary checks;
- Promise and asynchronous control-flow checks;
- regular-expression checks;
- SonarJS high-assurance coverage with the documented project-specific
  exception;
- security recommended coverage;
- unused-import controls;
- auditable ESLint suppression comments;
- JSDoc recommended-error coverage for JavaScript and TypeScript;
- JSON, JSONC, and JSON5 recommended coverage;
- package manifest validity and consistency checks;
- the mandatory stylistic standard; and
- Perfectionist recommended natural ordering.

`typeChecked`, `security`, `json`, `packageJson`, `jsdoc`, and `stylistic`
remain independently exported capability presets for inspection, testing, and
explicit composition, even though the aggregate preset already contains them.

Type-aware linting is mandatory for TypeScript source files. Project Service
selects the nearest TypeScript project. A source file missing from its intended
project is a configuration defect and must be added to the appropriate
`tsconfig.json`.

`disableTypeChecked` is the sole sanctioned exception. It is reserved for
explicitly listed tooling files that intentionally have no TypeScript project,
must follow `recommended`, and disables only controls that require type
information. Syntax-only TypeScript, security, documentation, and stylistic
controls continue to apply. This prescribed use is part of the Banking Baseline
and is not a downstream weakening.

## Stack-dependent presets

Runtime and test-stack controls must follow the repository's real boundaries:

- Apply `node` to Node.js files.
- Apply `browser` to browser files.
- A mixed-runtime monorepo may apply both with non-overlapping file scopes.
- Select `vitest` or `ava` for a given test-file scope, never both.
- Add `testingLibrary` when the files use DOM Testing Library.

Each selected plugin-backed stack preset contains its applicable Upstream
Baseline. `browser` has no rule plugin; it supplies browser globals and language
semantics, so no plugin baseline applies to it.

The Vitest and AVA convenience scopes cover files named `*.test.*` or
`*.spec.*`, and files under `test`, `tests`, or `__tests__` directories, for the
supported JavaScript and TypeScript extensions. Runner-specific names such as
`test.js` and `test-*.js` are also covered. The implementation publishes the
canonical glob list in the preset reference and tests every pattern. Explicit
consumer scopes take precedence when a repository uses different conventions
or more than one runner.

Repositories with mixed stacks must use explicit file-scoped composition so
globals and runner-specific rules do not leak across boundaries. Shared helper
files receive a runner preset only when they use that runner's globals or APIs.

`ignores` is separately exported because ignoring source is a repository
boundary decision. It is not part of `recommended` and is never required for
conformance. Every ignored path must be an intentional boundary rather than a
way to evade the Banking Baseline.

## Mandatory plugin policy

A plugin is mandatory within each capability or stack scope that uses it; this
does not make Node.js, browser, test-runner, or DOM-specific controls universal.
For every plugin included in the package:

1. The package explicitly selects every applicable recommended Flat Config
   variant. Every rule that those variants enable remains enabled, and every
   non-rule setting required for the rules to work is preserved.
2. Recommended warnings are promoted to errors.
3. A plugin-namespaced rule is not disabled merely because another plugin
   reports a similar diagnostic.
4. Compatibility replacements explicitly made by an upstream TypeScript
   preset, such as replacing a core rule with its TypeScript-aware extension,
   are preserved.
5. If a plugin has no recommended preset, the package defines the complete rule
   set needed for its declared package purpose, enables those rules as errors,
   and records the rationale in the generated Rule Inventory.
6. Plugin updates cannot change an Upstream Baseline under an existing package
   version; updates require an explicit package release.

Language-specific recommended variants apply to their corresponding file types.
Typed and syntax-only variants both apply where the Banking Baseline requires
them. Mutually exclusive runtime, framework, or runner variants apply only when
the matching public stack preset is selected. The Rule Inventory records every
selected upstream variant, required support setting, and fallback rationale so
that selection is reviewable rather than inferred.

The mandatory plugin set includes:

- `@eslint/js`
- `typescript-eslint`
- `eslint-plugin-import-x`
- `eslint-plugin-promise`
- `eslint-plugin-regexp`
- `eslint-plugin-n`
- `eslint-plugin-sonarjs`
- `eslint-plugin-unused-imports`
- `@eslint-community/eslint-plugin-eslint-comments`
- `@stylistic/eslint-plugin`
- `eslint-plugin-perfectionist`
- `eslint-plugin-security`
- `eslint-plugin-testing-library`
- `@vitest/eslint-plugin`
- `eslint-plugin-ava`
- `eslint-plugin-package-json`
- `eslint-plugin-jsonc`
- `eslint-plugin-jsdoc`

`@eslint/json`, the TypeScript import resolver, parsers, and `globals` support
these controls but are not themselves treated as rule plugins.

## SonarJS coverage policy

SonarJS is deliberately stricter than its upstream recommended preset. The
package enables every generally applicable rule present in the exact-pinned
`sonarjs.rules` export as an error.

This includes:

- rules omitted from SonarJS recommended;
- type-aware rules;
- rules that overlap other plugins;
- rules with known false-positive potential; and
- deprecated rules that remain present in the pinned plugin release.

`sonarjs/file-header` is the single package-level exception. The rule verifies a
repository-specific copyright or license header, so it cannot be configured
correctly by a public shared config without inventing consumer-owned legal
metadata. Consumers with a mandatory source-header policy must configure that
rule in their repository-owned Flat Config with the exact approved header.

No other SonarJS rule is removed or downgraded in the package configuration.
The release gate verifies the exception explicitly and verifies every remaining
exported SonarJS rule at `error`. Deprecated rules disappear only when an
intentional plugin upgrade removes them. Removing any other diagnostic coverage
is a breaking change and requires a reviewed release.

## Waivers and conformance

A consumer repository may use a targeted inline waiver when a diagnostic is a
reviewed false positive or an externally constrained case. Every waiver must:

- name the exact rule;
- affect the smallest justified code range;
- include a meaningful description that identifies the reason;
- avoid blanket or unlimited disable directives; and
- remain subject to unused-directive detection.

`disableTypeChecked` is the only sanctioned file-scoped control that disables
type-aware rules. Any other global rule disable, severity reduction, or
incompatible stack preset applied to the same file scope makes the repository
non-conforming. Undocumented suppressions are also non-conforming.

The npm package cannot prevent a later Flat Config entry from weakening a rule.
Organizational CI and code review must treat such downstream overrides as policy
violations.

## TypeScript controls

The Banking Baseline:

- rejects explicit `any` in favor of `unknown` and narrowing;
- rejects non-null assertions by default;
- permits `@ts-expect-error` only with a description;
- rejects `@ts-ignore`;
- requires separate `import type` declarations; and
- lints declaration files with ambient-declaration-aware overrides rather than
  ignoring them.

TypeScript support is the intersection of the supported ranges declared by all
required plugins. Expanding that range is a minor release. Narrowing it is a
major release.

## Stylistic standard

The mandatory stylistic standard is equivalent to these settings:

```json
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

It also imposes an 80-character line limit. URLs, string literals, template
literals, and regular expressions that cannot be split without changing their
value are exempt. Trailing commas are required only where the file format's
grammar permits them.

The standard applies to JavaScript, TypeScript, JSON, JSONC, JSON5, and package
manifests. Package property ordering is part of the stylistic preset. Imports
use semantic groups and natural ascending order. Type-like declarations use
`type` as the standard object-shape form. Naming rules cover only categories
with stable meaning, while externally controlled property names remain valid.

Repository files use LF on every platform. A repository-level `.gitattributes`
file enforces the line-ending contract. This repository dogfoods the published
stylistic preset through ESLint fixes and does not add Prettier or Biome.

## Rule changes and autofixes

Automatic fixes must preserve program semantics. Formatting, deterministic
ordering, and removal of demonstrably unused imports or bindings may be fixed
automatically. Behaviour-changing transformations must remain suggestions or
stay disabled unless separate evidence establishes their safety.

Every behavioural rule change requires:

- a written rationale;
- valid and invalid fixtures;
- overlap and compatibility analysis;
- autofix-impact analysis; and
- a Changeset with the correct behavioural SemVer impact.

Enabling a new diagnostic, tightening an option, changing an automatic fix, or
removing a public preset is a breaking change. Adding a new opt-in preset is a
minor change. A correction that does not add diagnostics is a patch.

## Verification

The release gate includes:

- public export and declaration tests;
- ESLint config validation;
- valid and invalid fixtures for every preset;
- typed and untyped TypeScript scenarios;
- out-of-project tooling-file scenarios;
- JavaScript, TypeScript, JSX, TSX, declaration, JSON, JSONC, JSON5, and
  package-manifest fixtures;
- mixed Node.js and browser monorepo fixtures;
- isolated Vitest and AVA scopes;
- DOM Testing Library composition;
- every-rule severity checks;
- SonarJS universal-rule export-to-inventory completeness checks plus the
  explicit project-specific exception assertion;
- automatic-fix safety and idempotence checks;
- generated Rule Inventory drift checks;
- self-linting and type checking;
- tarball installation in a simulated consumer;
- `publint`;
- `@arethetypeswrong/cli`; and
- a Windows tarball smoke test.

The compatibility matrix covers the minimum and current supported Node.js,
ESLint 10 boundaries, and the minimum and maximum supported TypeScript lines.

## Release and maintenance

The repository uses pnpm, Vitest, Changesets, strict behavioural SemVer, and
exact dependency pins. Dependabot proposes grouped ESLint-ecosystem updates
without auto-merge. Every update must expose its resolved Rule Inventory diff.

The first public `0.1.0` release is published interactively with two-factor
authentication after the tarball passes the complete release gate. Later
releases use npm Trusted Publishing through GitHub Actions OIDC and include npm
provenance.

Public documentation is written in English. Security reports use GitHub Private
Vulnerability Reporting. The package remains public while its intended audience
and conformance language remain explicitly banking-focused.
