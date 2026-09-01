# YARAPA Code Standard

Monorepo for YARAPA's high-assurance JavaScript and TypeScript engineering standards. The primary deliverable is [`eslint-config-yarapa`](./packages/eslint-config-yarapa), an ESLint 10 Flat Config package designed for deterministic, auditable use in regulated environments.

## Repository packages

- `packages/eslint-config-yarapa` — public ESLint Flat Config package with exactly 16 composable presets.
- `packages/typescript-config-yarapa` — repository TypeScript configuration support.

## Maintainer commands

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm format
pnpm check-types
pnpm test
pnpm verify
pnpm inspect
```

`pnpm format` uses the repository's own ESLint Stylistic policy. Prettier is not part of the canonical formatting path.

`pnpm inspect` builds the local config package and starts the development-only ESLint Config Inspector so maintainers can inspect merged configuration and rule provenance.

## Certification model

The CI workflow runs for pull requests and pushes to `main`. The intended required checks for protected `main` are:

- `lint`
- `test`
- `check-types`
- `build`
- `inventory`
- `consumer`
- `compatibility (node-24.15.0-eslint-10.0.0-typescript-5.0.4)`
- `compatibility (node-24.20.0-eslint-10.9.1-typescript-5.9.3)`
- `compatibility (node-24.20.0-eslint-10.9.1-typescript-6.0.3)`
- `windows-consumer`

The compatibility matrix is boundary-focused rather than a full Cartesian product. It certifies the declared Node.js, ESLint 10, and TypeScript support range with packed-consumer execution.

The packed-consumer path is release-readiness verification only. It runs build, `publint`, `pnpm pack`, Are The Types Wrong using the ESM-only profile, installation into a clean temporary consumer, public-export verification, and ESLint execution. It does not publish a package.

## Required `main` governance

Repository administrators should configure a GitHub ruleset or branch protection for `main` with the following controls:

1. Require changes through pull requests.
2. Require the CI checks listed above before merge.
3. Require review conversations to be resolved.
4. Dismiss stale approvals after new commits where the repository plan supports approval requirements.
5. Block force pushes.
6. Block branch deletion.
7. Apply `CODEOWNERS` review requirements where supported by the repository plan.

These settings are external repository state, not files in this tree. Their presence must be verified through GitHub before claiming that `main` is protected.

## Dependency governance

Dependabot groups updates by ESLint ecosystem, TypeScript ecosystem, test/build tooling, and GitHub Actions. Dependency PRs are reviewable and are not auto-merged. Changes that alter lint behavior must expose their Rule Inventory diff.

GitHub Actions used by CI are expected to follow one auditable pinning strategy across the workflow and remain reviewable through Dependabot.

## Behavioral versioning

For this repository, diagnostic behavior is part of compatibility. A JavaScript API that remains source-compatible can still introduce a breaking change when an existing consumer receives new errors, tighter rule options, broader file applicability, or materially different automatic fixes. Such changes require explicit behavioral SemVer review.

## Change control

- Do not weaken CI, security controls, or published lint rules simply to obtain a green build.
- Keep package runtime/plugin dependencies deterministic and review Rule Inventory changes.
- Review automatic fixes for safety and idempotence.
- Reply to pull-request review conversations with the disposition and verification evidence before resolving them.
- Do not claim external repository controls are enabled without verifying current GitHub state.

## Publication boundary

Repository verification may build and pack `eslint-config-yarapa`, but package publication is a separate explicitly authorized operation. Normal development and enterprise-hardening workflows must not publish to npm, configure npm publishing credentials/OIDC, create publication tags, or create GitHub Releases for publication.
