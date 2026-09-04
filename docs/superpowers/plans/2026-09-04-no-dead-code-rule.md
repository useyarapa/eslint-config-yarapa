# Add No-Dead-Code Rule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `.claude/rules/no-dead-code.md` following Claude Code official rule formatting to strictly prohibit dead code, unused exports, unused dependencies, and commented-out code in this repository.

**Architecture:** Create `.claude/rules/no-dead-code.md` with YAML frontmatter `paths:` scoping for on-demand loading across the workspace.

**Tech Stack:** Markdown, YAML frontmatter, Claude Code rules system.

## Global Constraints
- Must follow official Claude Code specification for `.claude/rules/` (`https://code.claude.com/docs/en/memory#organize-rules-with-claude/rules/`).
- Must use YAML frontmatter with `paths` list.
- Keep concise (under 200 lines).
- Must adhere to conventional commit format (`feat(rules): ...`).

---

### Task 1: Create `.claude/rules/no-dead-code.md`

**Files:**
- Create: `.claude/rules/no-dead-code.md`

**Interfaces:**
- Consumes: Spec requirements in `docs/superpowers/specs/2026-09-04-no-dead-code-rule-design.md`
- Produces: Persistent path-scoped instruction file for Claude Code

- [ ] **Step 1: Write `.claude/rules/no-dead-code.md`**

Write the following content to `.claude/rules/no-dead-code.md`:

```markdown
---
paths:
  - "packages/eslint-config-yarapa/**/*.{ts,mts,cts,js,mjs,cjs,json}"
  - "scripts/**/*.{ts,mts,js,mjs}"
  - "*.{js,mjs,ts,mts,json}"
---

# No Dead Code Rules

Apply zero-tolerance for dead code, unused assets, and speculative implementations in this repository.

## 1. No Unused Files or Exports (Strict YAGNI)
- Never create files, functions, classes, interfaces, types, or constants that are not actively used in the codebase or part of the explicit public API contract.
- Do not design or code for speculative future requirements. If it is not needed now, do not write it.

## 2. No Dead Dependencies
- Never introduce dependencies or devDependencies that are not imported and used in the workspace.
- When removing code that was the sole consumer of a dependency, remove that dependency from `package.json` immediately.

## 3. No Dead Code Artifacts
- Eliminate unused imports, unused local variables, unused parameters, and unreachable execution paths.
- Never leave commented-out code in the repository; rely on git history instead.
- Remove dead wrappers, deprecated shims, and empty stubs.

## 4. Verification via Knip
- When modifying files, exports, or dependencies, run `pnpm knip` to verify zero unused items are introduced.
```

- [ ] **Step 2: Validate YAML frontmatter and markdown syntax**

Verify that the YAML frontmatter parses correctly with `paths` array.

- [ ] **Step 3: Commit the new rule**

```bash
git add .claude/rules/no-dead-code.md
git commit -m "feat(rules): add no-dead-code rule"
```
