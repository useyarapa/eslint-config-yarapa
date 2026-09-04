---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs,json,jsonc,md,mdx,yaml,yml}"
---

# No Prettier Ignore Rules

Keep formatting deterministic and solve layout problems through structure or configuration.

## Consistent Formatting

- Format supported files with the repository's configured formatter.
- Refactor long or awkward expressions when formatting exposes a structural problem.
- Use workspace-level ignore configuration only for generated artifacts, caches, or verified external boundaries.

## No Formatter Directives

- Do not add `prettier-ignore`, `prettier-ignore-start`, or `prettier-ignore-end` directives.
- Do not use inline comments, flags, or alternate commands to bypass formatting.
- Do not add file-specific exceptions to preserve an aesthetic preference.

## Verification

- Run the configured formatter in check mode before review.
- Inspect the final diff for formatter directives and untracked formatting exceptions.
