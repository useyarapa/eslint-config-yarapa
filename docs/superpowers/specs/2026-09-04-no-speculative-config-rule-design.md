# Spec: Add No-Speculative-Config Rule for Claude Code

## Overview
Add `.claude/rules/no-speculative-config.md` to strictly prohibit speculative configuration, phantom file globs, unverified rule declarations, and "just in case" config flags across the repository.

## Rule File Specification

- **File Path**: `.claude/rules/no-speculative-config.md`
- **Scope**: Applied to all package source files, tests, scripts, and root configs via frontmatter paths:
  ```markdown
  ---
  paths:
    - "packages/eslint-config-yarapa/**/*.{ts,mts,cts,js,mjs,cjs,json}"
    - "scripts/**/*.{ts,mts,js,mjs}"
    - "*.{js,mjs,ts,mts,json}"
  ---
  ```

## Rule Content & Guidelines

1. **Demand-Driven Configuration (No "Just in Case" Config)**
   - Never add ESLint rules, plugins, parser options, or environment settings speculatively or for hypothetical future needs.
   - Every rule or config modification must satisfy a verified current requirement.

2. **No Phantom File Globs or Patterns**
   - Do not define file match patterns, extensions, or ignore globs for file types that do not exist within the intended operational scope of the preset or repository.

3. **No Speculative Options or Fallback Branches**
   - Do not build custom configuration options, fallback toggles, or abstraction layers for consumers that do not exist yet.
   - Maintain minimum viable, strictly typed, and observable Flat Configs.

4. **Required Observable Verification**
   - Any configuration rule or override introduced must be backed by a test case or demonstrable lint behavior to prove necessity and correctness.

## Verification
- Verify that `.claude/rules/no-speculative-config.md` matches official Claude Code documentation standards.
- Verify YAML frontmatter syntax.
