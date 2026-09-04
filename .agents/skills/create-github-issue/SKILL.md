---
name: create-github-issue
description: >
  Create GitHub issues adhering strictly to repository issue templates in
  .github/ISSUE_TEMPLATE/ (bug.yml, feature.yml, config.yml). Use this skill
  whenever the user asks to open an issue, report a bug, request a feature,
  file a defect, or run `gh issue create`. Enforces template field structures,
  safety verification, and zero-emoji compliance.
argument-hint: "[bug|feature]"
license: MIT
---

# Create GitHub Issue

Guide agents and contributors through filing issues that strictly adhere to repository issue templates (`.github/ISSUE_TEMPLATE/`) and project governance rules.

## Core Rules

1. **Strict Template Adherence**:
   - For bug reports: strictly follow `.github/ISSUE_TEMPLATE/bug.yml`.
   - For feature requests: strictly follow `.github/ISSUE_TEMPLATE/feature.yml`.
   - For usage questions or exploratory discussions: route to GitHub Discussions as specified in `config.yml`.
2. **Zero Emojis**: Never use emojis in issue titles or issue descriptions. Use clean ASCII text indicators.
3. **Safety Guarantee**: Never include credentials, API keys, tokens, customer data, or proprietary code in issues.
4. **Conventional Issue Titles**:
   - Bugs: `bug: <concise summary>`
   - Features: `feat: <concise summary>`

---

## Issue Types and Templates

### Type 1: Bug Report (`bug.yml`)

Use this type when reporting incorrect diagnostics, runtime crashes, compatibility failures, or package consumption defects.

**Required Fields**:

- **Version**: `eslint-config-yarapa` version (e.g. `0.3.0`).
- **Environment**: Node.js version, ESLint version, TypeScript version, OS, package manager, and profile used (`next`, `react`, `nest`, or default).
- **Minimal reproduction**: Public reproduction repo or minimal sanitized config snippet.
- **Expected behavior**: What should have happened.
- **Actual behavior**: What actually happened (diagnostic output, error message).
- **Safety**: Confirm removal of credentials, secrets, and proprietary code.

**Invocation via GitHub CLI**:

```sh
gh issue create --title "bug: <concise summary>" --body "$(cat <<'EOF'
### eslint-config-yarapa version

0.3.0

### Environment

- Node.js: 24.20.0
- ESLint: 10.9.1
- TypeScript: 6.0.3
- OS: macOS
- Package Manager: pnpm 11.23.0
- Profile: default

### Minimal reproduction

<Reproduction steps or sanitized config/code>

### Expected behavior

<Description of expected behavior>

### Actual behavior

<Description of actual behavior or error diagnostic>

### Safety

- [x] I removed credentials, secrets, personal/customer data, and proprietary source code from this report.
EOF
)"
```

---

### Type 2: Feature Request (`feature.yml`)

Use this type when proposing a concrete, actionable change or enhancement to `eslint-config-yarapa`.

**Required Fields**:

- **Problem**: Concrete limitation, friction, or use case that needs addressing.
- **Proposed change**: The smallest, most focused change that resolves the problem.
- **Alternatives considered**: Optional workarounds or alternative conventions considered.

**Invocation via GitHub CLI**:

```sh
gh issue create --title "feat: <concise summary>" --body "$(cat <<'EOF'
### Problem

<Describe the concrete limitation or use case>

### Proposed change

<Describe the smallest focused change addressing the problem>

### Alternatives considered

<Optional alternatives, workarounds, or upstream conventions>
EOF
)"
```

---

### Type 3: Questions & Exploratory Ideas (`config.yml`)

If the user ask is an open-ended question, usage inquiry, or unvetted idea, advise routing to GitHub Discussions instead of opening an issue:

- **Questions & Usage Help**: https://github.com/useyarapa/eslint-config-yarapa/discussions/categories/q-a
- **Ideas & Design Discussion**: https://github.com/useyarapa/eslint-config-yarapa/discussions/categories/ideas
