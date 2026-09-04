# Add No-Redundancy Rule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `.claude/rules/no-redundancy.md` following Claude Code official rule formatting to strictly enforce DRY and eliminate redundant code in this repository.

**Architecture:** Create `.claude/rules/no-redundancy.md` using YAML frontmatter with `paths:` scoping for on-demand loading across package code, scripts, and root configs.

**Tech Stack:** Markdown, YAML frontmatter, Claude Code rules system.

## Global Constraints
- Must follow official Claude Code specification for `.claude/rules/` (`https://code.claude.com/docs/en/memory#organize-rules-with-claude/rules/`).
- Must use YAML frontmatter with `paths` list.
- Keep concise (under 200 lines).
- Must adhere to conventional commit format (e.g. `feat(rules): ...`).

---

### Task 1: Create `.claude/rules/no-redundancy.md`

**Files:**
- Create: `.claude/rules/no-redundancy.md`

**Interfaces:**
- Consumes: Spec requirements in `docs/superpowers/specs/2026-09-04-no-redundancy-rule-design.md`
- Produces: Persistent path-scoped instruction file for Claude Code

- [ ] **Step 1: Create `.claude/rules` directory and write `no-redundancy.md`**

Write the following content to `.claude/rules/no-redundancy.md`:

```markdown
---
paths:
  - "packages/eslint-config-yarapa/**/*.{ts,mts,cts,js,mjs,cjs,json}"
  - "scripts/**/*.{ts,mts,js,mjs}"
  - "*.{js,mjs,ts,mts,json}"
---

# No Redundancy & Strict DRY Rules

Apply zero-tolerance for code duplication and redundant logic in this repository.

## 1. Zero Duplicated Logic (Strict DRY)
- Never duplicate logic, calculations, conditional branches, or transformations.
- If identical or near-identical logic appears in two or more places, extract it immediately into a shared helper function, utility module, or constant.

## 2. Single Source of Truth
- Do not hardcode recurring values, rule names, preset names, test file globs, or config options across files.
- Reuse existing central definitions (such as `presetNames.ts`, `canonicalTestFileGlobs.ts`).

## 3. Reuse Existing Utilities First
- Before creating any new helper or adapter, inspect existing codebase utilities:
  - Flat Config compatibility helpers in `packages/eslint-config-yarapa/src/configs/internal/`
  - Test harness helpers in `test/helpers/eslint.ts`
- Extend or reuse existing utilities instead of introducing redundant parallel implementations.

## 4. No Redundant Abstractions or Dead Code
- Avoid passthrough functions or unnecessary wrappers that add no behavior.
- Immediately remove dead code, unused imports, unused type declarations, and unreachable logic.

## 5. No Redundant Test Logic
- All test ESLint instances must use `test/helpers/eslint.ts` rather than building custom ESLint test configs from scratch.
- Replace duplicate assertion chains with parameterized (table-driven) tests or shared assertion helpers.
```

- [ ] **Step 2: Validate YAML frontmatter and formatting**

Verify that YAML frontmatter parses properly without syntax errors and that markdown structure is clean.

- [ ] **Step 3: Commit the new rule**

```bash
git add .claude/rules/no-redundancy.md
git commit -m "feat(rules): add no-redundancy rule for strict DRY enforcement"
```
