# Claude Rules Symmetry Rules

Maintain strict naming consistency, structural symmetry, and clear loading boundaries across all rule files in `.claude/rules/`.

## Naming Conventions

- Use kebab-case exclusively for all filenames in `.claude/rules/`.
- Use parallel grammatical forms based on rule category:
  - **Negative Constraint Rules**: Prefix with `no-*` for strict prohibitions and anti-patterns (e.g. `no-dead-code.md`, `no-eslint-disable.md`, `no-js-files.md`).
  - **Positive Architectural Policies**: Use imperative or descriptive verb/noun phrases for foundational principles (e.g. `prefer-existing-capabilities.md`, `single-author-style.md`).
- Match the filename directly to the domain concept. Do not use ambiguous abbreviations or generic names.

## File Skeleton & Symmetry

Every rule file must follow the exact same Markdown skeleton in this order:

1. **Frontmatter** (Conditional rules only):
   - Include `paths:` glob pattern only when the rule applies to specific filetypes.
   - Omit frontmatter entirely for unconditional, always-on architectural rules.
2. **Top-Level Heading (`#`)**:
   - Follow the naming pattern: `# <Rule Name> Rules`.
3. **Summary Paragraph**:
   - A concise 1-2 sentence statement of the rule's purpose and scope.
4. **Core Sections (`##`)**:
   - Focused, declarative bullet points specifying requirements, boundaries, and prohibitions.
5. **Verification Section (`## Verification`)**:
   - Concrete inspection and command steps to verify compliance before concluding tasks.

## Loading Boundaries

- **Always-on Rules (No Frontmatter)**: Reserved for foundational architectural principles, code philosophy, text conventions, and global guardrails that must govern every conversation turn.
- **File-Scoped Rules (`paths:` Frontmatter)**: Used for syntax-level constraints and implementation-specific checks that load only when relevant files are inspected.

## Verification

- Confirm new rule filenames follow kebab-case and the established naming prefix.
- Verify the file contains all required skeleton sections including `## Verification`.
- Confirm Markdown formatting adheres to repository linting standards via `pnpm lint:check`.
