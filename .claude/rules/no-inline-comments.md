---
paths:
  - "packages/eslint-config-yarapa/src/**/*.{ts,mts,cts,js,mjs,cjs}"
  - "packages/eslint-config-yarapa/test/**/*.{ts,mts,cts,js,mjs,cjs}"
  - "packages/eslint-config-yarapa/scripts/**/*.{ts,mts,cts,js,mjs,cjs}"
  - "*.{mjs,cjs,ts,mts,js}"
  - ".husky/*"
---

# No Inline Comments Rules

Prohibit inline, block, and explanatory code comments across the codebase, permitting only formal JSDoc documentation.

## Zero Inline Comments

- Do not write inline comments (`//`) or arbitrary block comments (`/* ... */`) in code or scripts.
- Comments explaining what code does or why it does it are considered noise. Code must be self-explanatory through clear naming, modular structuring, and idiomatic patterns.
- Do not leave commented-out code blocks in any committed file.

## Permitted Documentation: Formal JSDoc Only

- The only permitted comments in source code are formal JSDoc blocks (`/** ... */`) attached to public APIs, exported types, interfaces, or functions.
- JSDoc comments must be concise, accurate, and follow `eslint-plugin-jsdoc` validation rules.
- Do not use JSDoc for internal implementation details or trivial statements.
