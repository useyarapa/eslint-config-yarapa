# Add No-Speculative-Config Rule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `.claude/rules/no-speculative-config.md` following Claude Code official rule formatting to strictly prohibit speculative configurations and phantom patterns in this repository.

**Architecture:** Create `.claude/rules/no-speculative-config.md` using YAML frontmatter with `paths:` scoping for on-demand loading across the workspace.

**Tech Stack:** Markdown, YAML frontmatter, Claude Code rules system.

## Global Constraints
- Must follow official Claude Code specification for `.claude/rules/` (`https://code.claude.com/docs/en/memory#organize-rules-with-claude/rules/`).
- Must use YAML frontmatter with `paths` list.
- Keep concise (under 200 lines).
- Must adhere to conventional commit format (`feat(rules): ...`).

---

### Task 1: Create `.claude/rules/no-speculative-config.md`

**Files:**
- Create: `.claude/rules/no-speculative-config.md`

**Interfaces:**
- Consumes: Spec requirements in `docs/superpowers/specs/2026-09-04-no-speculative-config-rule-design.md`
- Produces: Persistent path-scoped instruction file for Claude Code

- [ ] **Step 1: Write `.claude/rules/no-speculative-config.md`**

Write the following content to `.claude/rules/no-speculative-config.md`:

```markdown
---
paths:
  - "packages/eslint-config-yarapa/**/*.{ts,mts,cts,js,mjs,cjs,json}"
  - "scripts/**/*.{ts,mts,js,mjs}"
  - "*.{js,mjs,ts,mts,json}"
---

# No Speculative Configuration Rules

Apply zero-tolerance for speculative configuration, phantom patterns, and unverified flags in this repository.

## 1. Demand-Driven Configuration (No "Just in Case" Config)
- Never add ESLint rules, plugins, parser options, or environment flags speculatively or for hypothetical future needs.
- Every rule or configuration modification must satisfy an active, verified requirement.

## 2. No Phantom File Globs or Patterns
- Do not define file match patterns, extensions, or ignore globs for file types or directory structures that do not exist within the intended operational scope of the preset or repository.

## 3. No Speculative Options or Fallback Branches
- Do not build custom configuration options, fallback toggles, or abstraction layers for consumers that do not exist yet.
- Maintain minimum viable, strictly typed, and observable Flat Configs.

## 4. Required Observable Verification
- Any configuration rule or override introduced must be backed by a test case or demonstrable lint behavior to prove necessity and correctness.
```

- [ ] **Step 2: Validate YAML frontmatter and markdown syntax**

Verify that YAML frontmatter parses correctly with the `paths` array.

- [ ] **Step 3: Commit the new rule**

```bash
git add .claude/rules/no-speculative-config.md
git commit -m "feat(rules): add no-speculative-config rule"
```
