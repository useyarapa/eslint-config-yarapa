---
name: create-github-issue
description: >
  Prepare or create a GitHub issue using the current repository's issue
  templates, contribution guidance, security policy, and metadata. Use this
  skill when the user asks to report a bug, request a feature, open an issue,
  or run `gh issue create` in any repository.
argument-hint: "[issue-type|title]"
license: MIT
---

# Create GitHub Issue

Prepare accurate, self-contained GitHub issues without assuming a project name,
package manager, template layout, title convention, label, or discussion URL.
Treat the target repository as the source of truth.

## Repository Discovery

Before drafting an issue:

1. Identify the target repository from the user's request, the current Git
   remote, or an explicit `--repo` value. Do not guess the owner or repository.
2. Read the repository instructions relevant to contributions, issue filing,
   support, and security.
3. Inspect the repository's issue-template configuration and all available
   issue templates. Support both issue forms and Markdown templates.
4. Use `gh repo view` when remote metadata is needed, including whether issues
   or discussions are enabled.
5. Derive title conventions, labels, required fields, and routing rules only
   from the target repository. Do not carry conventions from another project.

If the repository provides no applicable template, write the smallest body that
fully describes the request. Do not invent a project-specific form.

## Issue Classification

Choose a template from the reported behavior and the template descriptions:

- Use a bug template for reproducible incorrect behavior or regressions.
- Use a feature template for a concrete capability or improvement request.
- Follow repository-provided support, question, documentation, or proposal
  templates when they match more closely.
- Follow contact links or security reporting instructions instead of opening a
  public issue when the repository routes that category elsewhere.

If more than one template is equally applicable and the choice affects required
content, ask the user which issue type they intend.

## Evidence and Safety

- State only facts supported by the user's report, command output, repository
  state, or linked evidence.
- Never fabricate versions, environments, reproduction results, expected
  behavior, labels, issue relationships, or acceptance criteria.
- Ask for required information that cannot be discovered. Do not leave fake
  example values in a final issue.
- Minimize reproduction material and remove credentials, tokens, personal or
  customer data, private URLs, and proprietary source code.
- Follow the repository's private vulnerability-reporting process when the
  report may disclose a security vulnerability.
- Keep the issue self-contained. Include the relevant context rather than
  relying on unstated knowledge from the current conversation.

## Drafting Workflow

1. Build the title using the repository's declared convention. Otherwise use a
   concise outcome-oriented title without imposing a prefix.
2. Reproduce every required template heading or issue-form field in the same
   order and with the same meaning.
3. Preserve required checklists and attestations. Mark an item complete only
   when the evidence supports it.
4. Remove template instructions only when the template explicitly says they
   should be removed.
5. Use repository labels, assignees, milestones, and projects only when the
   template, repository policy, or user explicitly requires them.
6. Present the completed title and body for review when the user asked to
   prepare or draft an issue rather than create it.

## GitHub CLI Creation

When the user has asked to create the issue, use the authenticated GitHub CLI
against the verified repository:

```sh
gh issue create --repo "<owner/repository>" --title "<title>" --body "$(cat <<'EOF'
<body matching the selected repository template>
EOF
)"
```

Add `--label`, `--assignee`, `--milestone`, or `--project` only when their exact
values have been verified for the target repository. Do not replace a required
repository template with a hardcoded generic body.

## Verification

Before creation:

- Confirm the target repository and selected template.
- Compare the final title and body with the current template and contribution
  instructions.
- Confirm all required fields contain real information and all checked items
  are true.
- Inspect the final body for secrets and private data.

After creation, return the issue URL from `gh issue create`. If creation fails,
report the command failure and preserve the prepared title and body; do not
claim that an issue exists.
