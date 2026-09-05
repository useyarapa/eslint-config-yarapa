---
name: create-github-pr
description: >
  Prepare or create a GitHub pull request using the current repository's pull
  request template, contribution guidance, branch metadata, and verification
  commands. Use this skill when the user asks to prepare, open, or create a pull
  request in any repository.
argument-hint: "[issue-number|optional-title]"
license: MIT
---

# Create GitHub Pull Request

Prepare accurate, reviewable pull requests without assuming a repository name,
default branch, package manager, release tool, title convention, or verification
command. Treat the target repository as the source of truth.

## Repository Discovery

Before preparing the pull request:

1. Identify the repository from the current Git remote or the user's explicit
   target. Do not guess the owner or repository.
2. Determine the default branch with repository metadata rather than assuming
   `main` or `master`.
3. Read the repository instructions relevant to contributions, testing,
   commits, releases, and pull requests.
4. Locate the applicable pull-request template in the repository's supported
   template locations. If multiple templates exist, select the one matching the
   change or ask the user when the choice is ambiguous.
5. Derive title format, required checks, release-note requirements, issue
   linking syntax, and reviewer policy only from the target repository.

Do not impose Changesets, Conventional Commits, DCO, package-specific scripts,
or any other convention unless the repository requires them.

## Pre-flight Inspection

Inspect all work that the pull request would contain:

```sh
git status --short
git branch --show-current
git status --branch --short
git log "<base>"...HEAD --oneline
git diff "<base>"...HEAD
git diff
git diff --cached
```

Use the verified default or user-selected branch for `<base>`. Review every
commit and the complete branch diff, not only the latest commit. Distinguish
committed changes that will enter the pull request from uncommitted changes
that will not.

Do not discard, stage, commit, rewrite, or include unrelated work without the
user's authorization. Never force-push as part of this workflow.

## Verification

1. Discover required commands from the pull-request template, contribution
   guide, package scripts, task runner, and CI configuration.
2. Select checks applicable to the changed files and public behavior.
3. Run each required check using the repository's own command and package
   manager.
4. Fix the root cause of failures. Never suppress a check, weaken a gate, or
   report an unexecuted command as passing.
5. Record each command and result for the pull-request body when the template
   requests verification evidence.

Do not invent a fixed universal command list. If a required remote-only check
cannot be run locally, leave it unchecked and state that limitation accurately.

## Release and Repository Policy

- Add a changeset, release note, changelog entry, version update, or migration
  note only when repository policy and the actual change require it.
- Follow repository rules for issue linkage, generated files, signed commits,
  reviewers, labels, and branch naming.
- Treat repository templates and contribution instructions as authoritative;
  do not copy requirements from another repository.

## Pull Request Body

1. Start from the selected repository template rather than recreating it.
2. Preserve its section order, headings, comments, and checklists unless the
   template explicitly directs authors to remove them.
3. Summarize the complete branch diff and explain why the change is needed.
4. Link issues only when the relationship and issue number are verified. Do not
   fabricate `Fixes` references.
5. Mark a checklist item complete only when it is true and supported by the
   inspected state or executed command.
6. If no template exists, use a concise body containing a summary and test
   results, adding other sections only when the change needs them.

Derive the title from declared repository conventions. If none exist, use a
concise imperative description of the complete change without imposing a
prefix or scope.

## Push and Creation

If the user asked only to prepare a pull request, return the proposed title,
body, verification results, and any blockers without pushing or creating
anything.

When the user has asked to create the pull request:

1. Confirm the current branch is suitable and contains the intended commits.
2. Push it with upstream tracking only when necessary. Never force-push.
3. Create the pull request with the verified base branch and repository:

```sh
gh pr create \
  --repo "<owner/repository>" \
  --base "<base>" \
  --title "<title>" \
  --body "$(cat <<'EOF'
<body matching the selected repository template>
EOF
)"
```

Add draft state, reviewers, labels, milestone, or project only when requested or
required and after verifying the exact target values.

## Verification

Before creation:

- Confirm the repository, head branch, base branch, and complete commit range.
- Confirm the title and body match current repository instructions and the
  selected template.
- Confirm every checked verification item is supported by an actual result.
- Confirm required release metadata is present and unrelated working-tree
  changes are excluded.

After creation, return the pull-request URL from `gh pr create`. If pushing or
creation fails, report the failure and do not claim that the pull request
exists.
