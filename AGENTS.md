# AGENTS.md

## Purpose

`eslint-config-yarapa` is a public OSS ESLint Flat Config package whose product goal is to make code written by different human developers and AI coding agents converge on one recognizable YARAPA handwriting.

The implementation must remain conventional and recognizable to maintainers familiar with the JavaScript/TypeScript/ESLint ecosystem. The consumer-facing rule policy is intentionally opinionated.

## Source of truth

Before changing behavior, read the latest relevant GitHub issues. The current v1-readiness design is defined primarily by issues #14 and #21 through #36.

Do not resurrect superseded requirements from older issues when they conflict with the latest approved direction.

## Hard product rules

- One shared YARAPA handwriting across `/next`, `/nest`, and `/react` wherever technically valid.
- Framework profiles are environment adapters, not separate coding philosophies.
- A plugin is an implementation detail, not a reason to create a public preset.
- Prefer normal ESLint Flat Config composition over custom policy engines, registries, resolvers, or DSLs.
- Consumer-visible rule policy must be static and explicit. Do not enable rules dynamically from plugin exports or an `all` preset whose contents can expand silently.
- Use official maintained recommended rule sets as the primary eligibility baseline, but YARAPA may intentionally add stricter or non-recommended rules.
- Resolve overlapping concerns to a canonical rule owner. Do not keep duplicate diagnostics merely because multiple upstream configs enable them.
- For semantically equivalent candidates, prefer the maintained, stable, ecosystem-established/popular owner after semantic correctness and type-awareness are considered.
- Prefer `@stylistic/eslint-plugin` for maintained formatting/style concerns.
- Prefer type-aware `typescript-eslint` rules over weaker JavaScript/core equivalents when the TypeScript extension is the correct semantic owner; disable the replaced core equivalent.
- Prefer `eslint-plugin-import-x` for import/module correctness, with one separate canonical ordering owner where needed.
- SonarJS is the explicit breadth exception: enable all generally applicable accepted SonarJS rules strictly, but keep the final list static and explicit. Do not use `Object.keys(plugin.rules)` or equivalent dynamic discovery.
- Test-runner choice is independent from `/next`, `/nest`, and `/react`.
- Do not dynamically detect installed test/framework packages to change consumer-visible behavior.
- Prefer safe deterministic autofix where it materially reduces human/agent variance; verify second-pass idempotence.

## Airbnb heritage

Airbnb JavaScript Style Guide is a handwriting/design input only.

- Do not add or extend `eslint-config-airbnb`.
- Keep durable patterns; replace legacy enforcement with maintained 2026 rule owners.
- Prefer `@stylistic` for formatting/style equivalents.
- YARAPA severity/options remain final authority.

## Dogfood first

The repository must prove the package on itself before trusting downstream behavior.

For a behavior-bearing change:

1. build the package;
2. load the built YARAPA config from the repository ESLint config;
3. lint the repository itself;
4. typecheck;
5. run focused behavior tests;
6. run packed-consumer and compatibility verification;
7. run applicable security/supply-chain gates.

Self-lint must not force bespoke implementation architecture. If a public rule is intentionally strict but a narrow conventional repository implementation is clearer, use the narrowest justified repository-local exception rather than weakening the public rule or inventing abstractions to game lint metrics.

## TDD and verification

For executable behavior changes:

- write or update the failing behavior test first when practical;
- confirm the expected failure;
- implement the smallest conventional change;
- run the focused test until green;
- run related tests;
- finish with the repository verification gates.

Do not claim a check passed without fresh evidence from the exact branch/head being reviewed.

## Tests

Prefer tests of observable package behavior:

- real ESLint config loading and linting;
- valid/invalid representative fixtures;
- resolved config assertions where useful;
- autofix output and idempotence;
- TypeScript/type-aware behavior;
- cross-profile shared-rule invariance;
- framework-specific deltas;
- packed tarball consumer behavior;
- supported Node/ESLint/TypeScript/framework compatibility.

Do not recreate bespoke repository-certification or generated rule-inventory systems.

## Formatting

The target is one formatting source of truth around ESLint + `@stylistic` where technically supported.

Do not introduce or retain a formatter path that rewrites the same concerns into a shape that conflicts with YARAPA output. A second tool needs a distinct, evidence-backed responsibility.

## Documentation and examples

Public technical documentation is English-first.

Canonical examples should be executable, non-trivial, and linted by the real built package. Humans and AI agents should be able to copy the same examples and obtain the same YARAPA handwriting.

Avoid a large bespoke policy/document hierarchy when normal OSS README/examples/contribution/security surfaces are sufficient.

## Compatibility

Do not claim support that CI does not prove.

Use a small evidence-backed matrix covering representative minimum/current/latest supported combinations rather than an exhaustive Cartesian product. New framework majors are supported only after explicit verification and delta review.

## OSS and zero-cost requirement

The entire required development, testing, security, and verification path must remain usable at $0 for this public OSS project.

Required non-GitHub-native tools must be open source under a suitable license. Do not make any of the following required:

- paid SaaS;
- commercial-only tooling;
- a commercial license key;
- proprietary free-tier-only services;
- paid GitHub entitlements.

GitHub-native features may be part of the baseline only while they are free for public repositories. Prefer portable OSS CLIs when they add meaningful independent coverage.

Before adding a required tool, verify that it is necessary, OSS, $0, maintained, compatible, materially useful, and reproducibly pinnable.

## Security and supply chain

Use established free OSS/public-repository practices:

- least-privilege workflow permissions;
- immutable commit-SHA pins for third-party Actions where used;
- dependency review and free GitHub-native dependency/security features where available;
- CodeQL default setup before custom CodeQL workflows unless a concrete need exists;
- Gitleaks OSS CLI directly for portable secret-scanning defense-in-depth; do not require a separately licensed wrapper action or license key;
- exact/pinned dependencies where deterministic lint behavior requires it.

Do not add overlapping scanners for checklist optics.

## Scope boundary

This repository owns ESLint-level code handwriting and its package quality.

Do not force folder architecture, application architecture, scaffolding conventions, or other non-lintable concerns into ESLint. Use generators/templates/codemods in the appropriate project when those concerns need standardization.

Deployment and release execution are out of scope for the current v1-readiness implementation unless the user explicitly requests them separately.

## Change workflow

- Fetch the latest source of truth immediately before writing.
- Work on a dedicated branch; do not write directly to protected `main`.
- Keep changes traceable to approved issues.
- Prefer small reviewable commits/tasks with focused verification.
- Do not merge, publish, tag, or deploy unless explicitly authorized.
- Do not weaken failing checks merely to make CI green.

## Merge readiness protocol

Merge-readiness evidence is valid only for the exact pull-request head SHA on which it was collected.

- Any new push, force-push, rebase, merge-from-base, or other head-SHA change invalidates all previous merge-readiness evidence immediately.
- While implementation is still changing, prefer Draft/WIP mode and batch fixes instead of repeatedly treating intermediate commits as merge-ready.
- After the last intended implementation push, wait for required CI and configured review bots to finish reviewing that head before deciding merge readiness.
- Fetch the current PR head SHA and evaluate required checks only for that exact head.
- Inspect every current review thread after the latest reviews have completed. Reply to actionable findings, fix valid issues, and resolve only threads that are actually addressed or explicitly tracked as accepted follow-up work.
- `unresolved_review_threads` MUST equal `0` before merge readiness can be declared.
- Required status checks MUST be successful for the exact current head. Optional successful checks do not substitute for required gates.
- Required review-bot checks and repository ruleset requirements MUST be satisfied before merge.
- Immediately before calling the merge API, re-fetch the PR head SHA, required checks, review state, and review threads. If the head SHA changed at any point, ABORT the merge attempt and restart the entire merge-readiness verification from the current head.
- Never reuse a prior `unresolved = 0`, prior green CI run, or prior review result after a new push.

Canonical merge-readiness sequence:

1. freeze implementation changes;
2. fetch current head SHA;
3. wait for exact-head CI and review bots;
4. verify all required checks are successful;
5. inspect, reply to, and resolve all current review threads;
6. verify `unresolved_review_threads = 0`;
7. verify all repository ruleset requirements;
8. re-fetch the head SHA and merge state immediately before merge;
9. if the SHA changed, abort and restart from step 2;
10. merge only when explicitly authorized.

## v1 readiness map

- #14 semantic `/next`, `/nest`, `/react` API
- #21 conventional source implementation
- #22 shared YARAPA handwriting
- #23 dogfood without distorting source
- #24 Airbnb-derived modern patterns
- #25 TypeScript handwriting
- #26 import/module handwriting
- #27 async/error/correctness ownership
- #28 framework delta audit
- #29 static explicit rule policy
- #30 zero-cost dogfood/security gates
- #31 formatter ownership
- #32 test-code handwriting
- #33 compatibility contract
- #34 consumer docs and executable canonical examples
- #35 naming/complexity/JSDoc/suppression audit
- #36 OSS/$0 dependency admission

When these issues conflict with older requirements, follow the latest approved issue direction and preserve the North Star: conventional library implementation, one deterministic YARAPA consumer handwriting.
