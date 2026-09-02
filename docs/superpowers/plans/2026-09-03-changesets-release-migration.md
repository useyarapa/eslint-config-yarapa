# Changesets Release Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Release Please with Changesets v3 + changesets/action v2 as the single release/versioning system while preserving npm Trusted Publishing/OIDC, provenance, package verification, and GitHub Releases.

**Architecture:** Changeset files in feature PRs become the release source of truth. A push to `main` runs the official Changesets v2 split sub-actions: `select-mode` decides whether to create/update a Version Packages PR or publish; `version` gets only GitHub write permissions; `pack` verifies and packages with read-only repository access; `publish` alone receives `id-token: write` and creates npm releases/tags/GitHub Releases. Release Please is removed completely, and the migration carries one bootstrap minor changeset so the already-unreleased work since `eslint-config-yarapa@0.2.0` becomes the replacement `0.3.0` Version Packages PR after migration.

**Tech Stack:** pnpm 11, Node.js 24.20.0 in release automation, `@changesets/cli@3.0.1`, `changesets/action@v2.1.1` pinned to commit `8488615a623b1b9c987934bb89eae8af6a946ac1`, GitHub Actions, npm Trusted Publishing/OIDC.

**Spec:** `docs/superpowers/specs/2026-09-03-changesets-release-architecture-design.md`

## Global Constraints

- Changesets is the only release/versioning source of truth after migration; no Release Please fallback remains.
- Use `@changesets/cli` v3 and `changesets/action` v2 official actions; do not write a custom release state machine or release helper script.
- Pin `changesets/action` to immutable commit `8488615a623b1b9c987934bb89eae8af6a946ac1` (v2.1.1).
- Keep npm Trusted Publishing/OIDC; do not add `NPM_TOKEN`, PATs, GitHub App secrets, or other release credentials.
- Grant `id-token: write` only to the publish job.
- Keep `@repo/typescript-config-yarapa` private and non-publishable.
- Preserve existing `lint`, typecheck, build, tests, `publint`, `attw`, and packed-consumer verification before publish.
- Do not publish, tag, or merge an automatically generated Version Packages PR during migration.
- Close Release Please PR #46 without merging before the migration PR is merged.
- Do not weaken existing CI, rulesets, or security checks.

---

### Task 1: Bootstrap Changesets as the workspace release source of truth

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `.changeset/config.json`
- Create: `.changeset/README.md`
- Create: `.changeset/bootstrap-v0-3-0.md`

**Interfaces:**
- Consumes: existing pnpm workspace rooted at `package.json` and `pnpm-workspace.yaml`.
- Produces: root `pnpm changeset`, `pnpm changeset:status`, and `pnpm version-packages` commands; standard Changesets config; one bootstrap minor release intent for `eslint-config-yarapa`.

- [ ] **Step 1: Prove Changesets is not yet installed**

Run:

```bash
pnpm exec changeset --version
```

Expected before implementation: command resolution fails because `@changesets/cli` is not a workspace dependency.

- [ ] **Step 2: Add the maintained CLI with pnpm so the lockfile is generated, not hand-edited**

Run:

```bash
pnpm add -Dw @changesets/cli@3.0.1
```

Expected: root `package.json` gains `@changesets/cli: 3.0.1` in `devDependencies` and `pnpm-lock.yaml` is updated by pnpm.

- [ ] **Step 3: Add standard root scripts**

Set these entries in root `package.json`:

```json
{
  "scripts": {
    "changeset": "changeset",
    "changeset:status": "changeset status --since main",
    "version-packages": "changeset version"
  }
}
```

Keep every existing script unchanged.

- [ ] **Step 4: Create standard Changesets configuration with private-package publishing disabled**

Create `.changeset/config.json`:

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [],
  "privatePackages": {
    "version": false,
    "tag": false
  }
}
```

Do not add a custom changelog module or release plugin.

- [ ] **Step 5: Add contributor guidance in the Changesets-standard location**

Create `.changeset/README.md` with this content:

```md
# Changesets

Release-impacting pull requests should include a Changeset.

Run:

```sh
pnpm changeset
```

Select the affected publishable package, choose `patch`, `minor`, or `major`, and write a concise user-facing release note.

For changes with intentionally no package release impact, use the standard empty Changeset flow:

```sh
pnpm changeset --empty
```

`eslint-config-yarapa` is publishable. `@repo/typescript-config-yarapa` is private and must not be published.
```

- [ ] **Step 6: Add one bootstrap Changeset for the already-unreleased work since 0.2.0**

Create `.changeset/bootstrap-v0-3-0.md`:

```md
---
"eslint-config-yarapa": minor
---

Complete the v1 ESLint configuration surface and repository-readiness work, including canonical framework presets and packed-consumer verification.
```

This deliberately replaces the release intent represented by Release Please PR #46 so the first Changesets Version Packages PR targets `0.3.0`, not `0.2.1`.

- [ ] **Step 7: Verify CLI/config/package selection locally**

Run:

```bash
pnpm exec changeset --version
pnpm exec changeset status --since main
node -e 'const p=require("./packages/typescript-config-yarapa/package.json"); if (p.private !== true) process.exit(1)'
```

Expected:
- Changesets prints `3.0.1`.
- status reports `eslint-config-yarapa` with a minor release and does not propose publishing `@repo/typescript-config-yarapa`.
- private-package assertion exits 0.

- [ ] **Step 8: Run repository verification**

Run:

```bash
pnpm verify
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add package.json pnpm-lock.yaml .changeset

git commit -m "build: adopt Changesets release metadata"
```

---

### Task 2: Replace Release Please with the official split Changesets workflow

**Files:**
- Create: `.github/workflows/release.yml`
- Delete: `.github/workflows/release-please.yml`

**Interfaces:**
- Consumes: `@changesets/cli@3.0.1`, `.changeset/config.json`, existing `pnpm --filter eslint-config-yarapa verify` command.
- Produces: mode selection, Version Packages PR creation/update, verified packed publish artifact, Trusted Publishing/OIDC npm publish, git tags, and GitHub Releases.

- [ ] **Step 1: Record the old workflow dependency before replacement**

Run:

```bash
grep -n "release-please-action" .github/workflows/release-please.yml
```

Expected before implementation: at least one match.

- [ ] **Step 2: Create `.github/workflows/release.yml` using only maintained actions**

Create the workflow exactly around this job/permission structure:

```yaml
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: read

concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"

jobs:
  select-mode:
    name: select-mode
    runs-on: ubuntu-latest
    permissions:
      contents: read
    outputs:
      mode: ${{ steps.select.outputs.mode }}
      publish-plan-artifact-id: ${{ steps.select.outputs.publish-plan-artifact-id }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
        with:
          fetch-depth: 0
          persist-credentials: false
      - uses: pnpm/setup@703c52620218391530e48b9e8870d5c0082e1b9b # v2.1.0
        with:
          runtime: node@24.20.0
          cache: true
          require-lockfile: true
      - name: Select Changesets mode
        id: select
        uses: changesets/action/select-mode@8488615a623b1b9c987934bb89eae8af6a946ac1 # v2.1.1

  version:
    name: version
    needs: select-mode
    if: ${{ needs.select-mode.outputs.mode == 'version' }}
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
        with:
          fetch-depth: 0
          persist-credentials: false
      - uses: pnpm/setup@703c52620218391530e48b9e8870d5c0082e1b9b # v2.1.0
        with:
          runtime: node@24.20.0
          cache: true
          require-lockfile: true
      - name: Create or update Version Packages PR
        uses: changesets/action/version@8488615a623b1b9c987934bb89eae8af6a946ac1 # v2.1.1
        with:
          commit-message: "chore: version packages"
          pr-title: "chore: version packages"

  pack:
    name: pack
    needs: select-mode
    if: ${{ needs.select-mode.outputs.mode == 'publish' }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
    outputs:
      pack-dir-artifact-id: ${{ steps.pack.outputs.pack-dir-artifact-id }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
        with:
          fetch-depth: 0
          persist-credentials: false
      - uses: pnpm/setup@703c52620218391530e48b9e8870d5c0082e1b9b # v2.1.0
        with:
          runtime: node@24.20.0
          cache: true
          require-lockfile: true
      - name: Rebuild and verify release candidate
        run: pnpm --filter eslint-config-yarapa verify
      - name: Pack publishable packages
        id: pack
        uses: changesets/action/pack@8488615a623b1b9c987934bb89eae8af6a946ac1 # v2.1.1
        with:
          publish-plan-artifact-id: ${{ needs.select-mode.outputs.publish-plan-artifact-id }}

  publish:
    name: publish
    needs:
      - select-mode
      - pack
    if: ${{ needs.select-mode.outputs.mode == 'publish' && needs.pack.result == 'success' }}
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
        with:
          fetch-depth: 0
          persist-credentials: false
      - uses: pnpm/setup@703c52620218391530e48b9e8870d5c0082e1b9b # v2.1.0
        with:
          runtime: node@24.20.0
          cache: true
          require-lockfile: true
      - name: Publish with npm Trusted Publishing
        uses: changesets/action/publish@8488615a623b1b9c987934bb89eae8af6a946ac1 # v2.1.1
        with:
          pack-dir-artifact-id: ${{ needs.pack.outputs.pack-dir-artifact-id }}
          create-github-releases: true
```

Do not add `registry-url`, `_authToken`, `NODE_AUTH_TOKEN`, `NPM_TOKEN`, or a second `npm publish` command.

- [ ] **Step 3: Delete the Release Please workflow**

Run:

```bash
git rm .github/workflows/release-please.yml
```

- [ ] **Step 4: Verify immutable action pinning and permission isolation**

Run:

```bash
grep -n "changesets/action/" .github/workflows/release.yml
grep -n "id-token: write" .github/workflows/release.yml
! grep -R "release-please-action" .github/workflows
! grep -R -E "NPM_TOKEN|NODE_AUTH_TOKEN|_authToken" .github/workflows/release.yml
```

Expected:
- every Changesets sub-action is pinned to `8488615a623b1b9c987934bb89eae8af6a946ac1`;
- exactly one `id-token: write` exists and it is in `publish`;
- no Release Please action remains;
- no token-based npm auth remains.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/release.yml .github/workflows/release-please.yml

git commit -m "ci: replace Release Please with Changesets"
```

---

### Task 3: Make missing Changesets a normal CI failure, not a custom policy system

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: official `changeset status --since <ref>` behavior from `@changesets/cli`.
- Produces: PR-only `changesets` CI job and inclusion in aggregate `ci`; contributor instructions in the main README.

- [ ] **Step 1: Add a PR-only Changesets status job to `ci.yml`**

Add this job before `diagnostic-snapshot`:

```yaml
  changesets:
    name: changesets
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7
        with:
          fetch-depth: 0
          persist-credentials: false
      - uses: pnpm/setup@703c52620218391530e48b9e8870d5c0082e1b9b # v2.1.0
        with:
          runtime: node@24.20.0
          cache: true
          require-lockfile: true
      - name: Require release intent for changed packages
        env:
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
        run: pnpm exec changeset status --since "$BASE_SHA"
```

This intentionally uses Changesets' own package-diff logic. Do not add path allowlists, labels, a custom bot, or a custom exemption script.

- [ ] **Step 2: Add `changesets` to aggregate `ci` without breaking push builds**

Add `changesets` under `ci.needs`, add:

```yaml
          CHANGESETS_RESULT: ${{ needs.changesets.result }}
```

and extend the existing event-specific block to require:

```sh
if [ "$EVENT_NAME" = "pull_request" ]; then
  test "$DEPENDENCY_REVIEW_RESULT" = success
  test "$CHANGESETS_RESULT" = success
else
  test "$DEPENDENCY_REVIEW_RESULT" = skipped
  test "$CHANGESETS_RESULT" = skipped
fi
```

Keep all existing required job assertions unchanged.

- [ ] **Step 3: Document the developer flow in `README.md`**

Add a concise `## Contributing releases` section near existing development/contribution guidance:

```md
## Contributing releases

This workspace uses [Changesets](https://github.com/changesets/changesets) for package versioning and release notes.

For a release-impacting change:

```sh
pnpm changeset
```

Choose `eslint-config-yarapa`, select the semver impact, and write a user-facing summary. For changes with intentionally no package release impact, use `pnpm changeset --empty`.

Merging normal PRs does not publish directly. Changesets creates or updates a `chore: version packages` PR on `main`; publishing occurs only after that version PR is merged and the npm Trusted Publisher path succeeds.
```

Do not document Conventional Commits as the source of semver intent.

- [ ] **Step 4: Verify status and aggregate CI configuration**

Run:

```bash
pnpm exec changeset status --since main
grep -n "name: changesets" .github/workflows/ci.yml
grep -n "CHANGESETS_RESULT" .github/workflows/ci.yml
```

Expected: status succeeds because the migration contains the bootstrap Changeset; CI contains the PR-only changesets job and aggregate result handling.

- [ ] **Step 5: Run full verification**

Run:

```bash
pnpm verify
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/ci.yml README.md

git commit -m "ci: require Changesets release intent"
```

---

### Task 4: Remove Release Please state completely and prove there is no hybrid release path

**Files:**
- Delete: `release-please-config.json`
- Delete: `.release-please-manifest.json`

**Interfaces:**
- Consumes: Changesets workflow/config from Tasks 1-3.
- Produces: repository tree with no Release Please source of truth.

- [ ] **Step 1: Delete Release Please state files**

Run:

```bash
git rm release-please-config.json .release-please-manifest.json
```

- [ ] **Step 2: Prove no Release Please configuration/action reference remains**

Run:

```bash
! git grep -n -i "release-please" -- ':!docs/superpowers/**'
```

Expected: exit 0; historical design/plan docs may mention the migration but executable repository configuration does not.

- [ ] **Step 3: Prove only one publish architecture exists**

Run:

```bash
find .github/workflows -maxdepth 1 -type f -print | sort
grep -R -n "changesets/action/publish" .github/workflows
! grep -R -n "npm publish" .github/workflows
```

Expected:
- exactly one release workflow owns publication: `.github/workflows/release.yml`;
- publication is delegated to `changesets/action/publish`;
- no independent raw `npm publish` path remains.

- [ ] **Step 4: Run lockfile/config checks and repository verification**

Run:

```bash
pnpm install --frozen-lockfile
pnpm exec changeset status --since main
pnpm verify
```

Expected: all commands PASS.

- [ ] **Step 5: Commit**

```bash
git add release-please-config.json .release-please-manifest.json

git commit -m "chore: remove Release Please state"
```

---

### Task 5: Close the obsolete Release Please PR and ship only the migration PR

**Files:**
- No repository file changes expected unless review requires corrections.

**Interfaces:**
- Consumes: completed migration branch with Tasks 1-4 committed.
- Produces: PR #46 closed without merge; one migration PR linked to #47; green CI/review gates; no release/publish side effect.

- [ ] **Step 1: Re-read PR #46 immediately before mutation**

Run:

```bash
gh pr view 46 -R useyarapa/eslint-config-yarapa --json state,mergedAt,headRefName,title,url
```

Expected: `state` is `OPEN`, `mergedAt` is `null`, and it is still the Release Please `0.3.0` PR.

- [ ] **Step 2: Close PR #46 without merging**

Run:

```bash
gh pr close 46 -R useyarapa/eslint-config-yarapa --comment "Superseded by #47. Release automation is migrating to Changesets v3; this Release Please PR must not be merged."
```

Then verify:

```bash
gh pr view 46 -R useyarapa/eslint-config-yarapa --json state,mergedAt
```

Expected: `state` is `CLOSED`, `mergedAt` is `null`.

- [ ] **Step 3: Self-review the migration diff before opening a PR**

Run:

```bash
git diff --check main...HEAD
git diff --stat main...HEAD
git diff main...HEAD -- package.json .changeset .github/workflows README.md release-please-config.json .release-please-manifest.json
```

Reject the branch if any of these are present:

```text
NPM_TOKEN
NODE_AUTH_TOKEN
_authToken
release-please-action
custom release helper script
second publish workflow
id-token: write outside the publish job
```

- [ ] **Step 4: Open the migration PR linked to #47**

Run:

```bash
gh pr create \
  -R useyarapa/eslint-config-yarapa \
  --base main \
  --head refactor/changesets-release \
  --title "refactor(release): migrate to Changesets v3" \
  --body $'Closes #47\n\nReplaces Release Please with Changesets v3 + changesets/action v2 split sub-actions. Keeps npm Trusted Publishing/OIDC, isolates id-token permission to publish, preserves package verification, and removes the hybrid release path.\n\nMigration safety: this PR does not publish, create tags, or merge an automated version PR.'
```

If execution uses a different implementation branch name, substitute only the actual branch name; do not retarget the spec-only branch.

- [ ] **Step 5: Wait for and inspect all required checks**

Run:

```bash
gh pr checks <MIGRATION_PR_NUMBER> -R useyarapa/eslint-config-yarapa --watch
```

Expected required gates include the existing CI topology plus the new `changesets` job and aggregate `ci`. Resolve every actionable review conversation before merge; do not bypass rulesets.

- [ ] **Step 6: Verify no publish/tag/release was triggered by the migration PR itself**

Run:

```bash
gh release list -R useyarapa/eslint-config-yarapa --limit 10
gh api repos/useyarapa/eslint-config-yarapa/tags --jq '.[0:10] | map(.name)'
```

Expected: no new release/tag attributable to the migration branch or PR.

- [ ] **Step 7: Merge only the migration PR after all gates pass**

Use the repository-supported squash merge and expected head SHA:

```bash
gh pr merge <MIGRATION_PR_NUMBER> \
  -R useyarapa/eslint-config-yarapa \
  --squash \
  --delete-branch
```

Do not merge any generated `chore: version packages` PR in this task.

- [ ] **Step 8: Verify the first post-migration `main` run enters Changesets version mode**

After the migration PR lands, inspect the `Release` workflow run and verify:

```text
select-mode = success
mode = version
version = success
pack = skipped
publish = skipped
```

Then verify GitHub contains an open Changesets-generated PR titled:

```text
chore: version packages
```

and that its version change for `eslint-config-yarapa` is `0.2.0 -> 0.3.0` because of `.changeset/bootstrap-v0-3-0.md`.

- [ ] **Step 9: Stop before publishing and record the registry-side prerequisite**

Before any Version Packages PR is merged, verify npm Trusted Publisher configuration points to:

```text
GitHub organization/user: useyarapa
Repository: eslint-config-yarapa
Workflow filename: release.yml
```

If registry-side Trusted Publisher configuration is not proven, leave the Version Packages PR open and report that exact blocker. Do not add `NPM_TOKEN` as a fallback.

- [ ] **Step 10: Update #47 with evidence**

Post the migration PR URL, merged SHA, successful post-merge Release workflow run, generated Version Packages PR URL, and the explicit statement that publish/tag/release was intentionally not executed during migration verification.
