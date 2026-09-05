---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

# No Inline Comments Rules

Keep implementation self-explanatory through names, structure, and tested contracts. Reserve comments for durable API documentation.

## Code Clarity

- Express intent through precise names, focused units, explicit boundaries, and idiomatic control flow.
- Remove comments that merely restate what the code already says.

## Permitted Documentation

- Use concise JSDoc only for public APIs, exported types, interfaces, or non-obvious contractual behavior.
- Keep JSDoc accurate, maintained with the API, and valid under the configured documentation rules.
- Do not use JSDoc as a substitute for clear naming or to document trivial implementation details.

## Verification

- Inspect changed source for explanatory, stale, or commented-out code.
- Keep tool directives and suppression policy in configuration or repository guidance, not scattered through implementation files.
