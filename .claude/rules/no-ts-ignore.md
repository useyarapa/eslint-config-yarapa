---
paths:
  - "**/*.{ts,tsx,mts,cts}"
---

# No TypeScript Ignore Rules

Preserve sound type contracts and resolve type errors without compiler suppression directives.

## Sound Typing

- Resolve type errors in the types, interfaces, control flow, narrowing, generics, or implementation that caused them.
- Prefer explicit types, type guards, discriminated unions, and correct API contracts over type escapes.
- Keep strict compiler settings meaningful by fixing invalid assumptions rather than hiding them.

## No Compiler Suppression

- Do not add `@ts-ignore`, `@ts-nocheck`, or `@ts-expect-error` directives.
- Do not use unjustified `any`, unsafe casts, or equivalent escapes to silence the compiler.
- If an external declaration is incorrect, isolate the issue at the integration boundary and use the narrowest typed solution supported by the toolchain.

## Verification

- Run the repository's configured TypeScript check after changing types or implementation logic.
- Confirm that the final diff contains no new compiler suppression directives.
