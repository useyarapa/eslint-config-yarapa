---
name: create-github-pr
description: >
  Generate and open pull requests strictly adhering to the repository PR
  template (.github/pull_request_template.md). Use this skill whenever the user
  asks to create a pull request, open a PR, prepare a PR, submit changes, or
  run `gh pr create`. Enforces verification checklist execution, changeset
  requirements, conventional PR naming, and zero-emoji compliance.
argument-hint: "[issue-number|optional-title]"
license: MIT
---

# Create GitHub Pull Request

Guide agents and contributors through creating pull requests that strictly conform to `.github/pull_request_template.md` and repository engineering standards.

## Core Rules

1. **Strict Template Adherence**: The pull request body must strictly contain all sections from `.github/pull_request_template.md` without omission.
2. **Zero Emojis**: Never include emojis in PR title or PR body. Use clean ASCII text indicators (`[x]`, `[ ]`, `PASS`, `FAIL`).
3. **Evidence-Based Verification**: Do not check verification checkboxes blindly. Run each required command, confirm the result, and mark passed items with `[x]`.
4. **Changeset Compliance**: Identify whether changes affect `packages/eslint-config-yarapa`. If yes, require a Changeset; if no package impact, require an empty Changeset (`pnpm changeset --empty`).

---

## Step-by-Step Workflow

### Step 1: Pre-flight Git State Inspection

Inspect branch status and diff:

```sh
git status
git diff main...HEAD
git log main...HEAD --oneline
```

Verify that all commits follow Conventional Commits and satisfy DCO (`Signed-off-by`).

### Step 2: Execute Verification Checklist

Run each verification check specified in the repository PR template:

```sh
# 1. Package lint
pnpm --filter eslint-config-yarapa lint

# 2. Package type check
pnpm --filter eslint-config-yarapa check-types

# 3. Package tests
pnpm --filter eslint-config-yarapa test

# 4. Dead code & dependency audit
pnpm knip

# 5. Full consumer verification pipeline
pnpm --filter eslint-config-yarapa verify
```

If any check fails, resolve the root cause before proceeding. Never open a PR with failing checks.

### Step 3: Check Changeset Status

Verify whether a changeset file exists under `.changeset/*.md`:

```sh
pnpm changeset:status
```

- If changes affect `packages/eslint-config-yarapa/`, ensure a valid changeset is committed.
- If changes have no package release impact (e.g. repo tooling, docs, CI), run:
  ```sh
  pnpm changeset --empty
  ```

### Step 4: Construct PR Body

Format the pull request body using HEREDOC matching `.github/pull_request_template.md` exactly:

```markdown
## Description

<Concise, clear explanation of proposed changes and motivation.>

## Related issue

<!-- Reference related issue (e.g. Fixes #123) or 'None' -->

Fixes #<issue-number>

## Reviewers

@<reviewer-username>

## Verification

- [x] `pnpm --filter eslint-config-yarapa lint`
- [x] `pnpm --filter eslint-config-yarapa check-types`
- [x] `pnpm --filter eslint-config-yarapa test`
- [x] `pnpm knip`
- [x] `pnpm --filter eslint-config-yarapa verify`

## Release

<!-- Mark exactly one of the two options below -->

- [x] This package change includes a Changeset.
- [ ] This change has no package release impact and uses an empty Changeset.
```

### Step 5: Create Pull Request via GitHub CLI

Execute `gh pr create` with properly formatted title and body:

```sh
gh pr create --title "<type>(<scope>): <short description>" --body "$(cat <<'EOF'
## Description

<description text>

## Related issue

Fixes #123

## Reviewers

@maintainer

## Verification

- [x] `pnpm --filter eslint-config-yarapa lint`
- [x] `pnpm --filter eslint-config-yarapa check-types`
- [x] `pnpm --filter eslint-config-yarapa test`
- [x] `pnpm knip`
- [x] `pnpm --filter eslint-config-yarapa verify`

## Release

- [x] This package change includes a Changeset.
- [ ] This change has no package release impact and uses an empty Changeset.
EOF
)"
```
