# Contributing to eslint-config-yarapa

Thank you for contributing to `eslint-config-yarapa`.

This repository is a pnpm workspace containing `packages/eslint-config-yarapa`, an opinionated and deterministic ESLint Flat Config package for JavaScript and TypeScript projects.

## Code of Conduct

Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Prerequisites

- Node.js version matching `.nvmrc` (v24.x)
- pnpm (managed via Corepack or package manager: `pnpm@11.23.0`)

Run setup from the repository root:

```sh
pnpm install
```

## Quality Standards & Root Cause Fixes

- **No inline suppressions**: Never introduce or commit comment directives to bypass checks (`// eslint-disable`, `// @ts-ignore`, `// @ts-expect-error`, or `/* prettier-ignore */`).
- **Fix root causes**: When a lint, type, or test check fails, resolve the underlying configuration, types, or code structure instead of disabling the rule.
- **No dead code**: Do not introduce unused exports, unused dependencies, or commented-out code. Run `pnpm knip` to ensure the codebase remains clean.

## Development Workflow

1. **Edit source and tests**:
   - Source code: `packages/eslint-config-yarapa/src/`
   - Tests and fixtures: `packages/eslint-config-yarapa/test/` and `packages/eslint-config-yarapa/fixtures/`
   - Do not edit generated files under `packages/eslint-config-yarapa/dist/`.

2. **Run verification**:
   - **Repository lint**: `pnpm lint` (automatically builds the package first)
   - **Package lint**: `pnpm --filter eslint-config-yarapa lint`
   - **Type check**: `pnpm check-types`
   - **Unit and behavior tests**: `pnpm test`
   - **Dead code & dependency check**: `pnpm knip`
   - **Consumer smoke test**: `pnpm --filter eslint-config-yarapa test:consumer` (packs and verifies tarball with a consumer app)

3. **Verify by change category**:
   - **Preset rules or options**: Add test cases in `packages/eslint-config-yarapa/test/` covering both config profile composition and observable lint diagnostics.
   - **Exports or package metadata**: Run `pnpm --filter eslint-config-yarapa test:consumer` or `pnpm --filter eslint-config-yarapa verify`.
   - **Documentation**: Verify references, links, and markdown formatting.

## Release Intent (Changesets)

If your pull request modifies `packages/eslint-config-yarapa`:

1. Run `pnpm changeset` from repository root.
2. Select the package and appropriate semver bump (`patch`, `minor`, `major`).
3. Provide a clear explanation of what changed and consumer impact.
4. Commit the generated `.changeset/*.md` file with your pull request.

If the change has no package release impact (e.g., repository docs, CI changes), run:

```sh
pnpm changeset --empty
```

Refer to [.changeset/README.md](.changeset/README.md) for details.

## Developer Certificate of Origin (DCO)

To ensure clear intellectual property ownership and open-source integrity, all contributions must include a **Signed-off-by** line matching your Git author identity:

```sh
git commit -s -m "feat(scope): your commit message"
```

If you forgot to sign off a commit, you can sign off an existing commit with:

```sh
git commit --amend --no-edit --signoff
```

## Pull Requests

- Keep pull requests focused on a single change or cohesive feature.
- Ensure all relevant checks pass locally before opening or updating a pull request.
- Describe the changes and list verification checks run in the pull request description.
