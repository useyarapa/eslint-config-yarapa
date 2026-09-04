---
paths:
  - "packages/eslint-config-yarapa/**/*.{ts,mts,cts}"
  - "scripts/**/*.{ts,mts}"
  - "*.{ts,mts}"
---

# No TypeScript Ignore Rules

Enforce sound type safety and prohibit compiler directive suppressions.

## Zero Type Suppression

- Never introduce `@ts-ignore`, `@ts-nocheck`, or `@ts-expect-error` comments.
- Do not bypass the TypeScript compiler or suppress type errors with comment directives.

## Sound Typing over Circumvention

- When a type error occurs, resolve the root cause in the type definitions, interfaces, type narrowing, or implementation logic.
- Use explicit type annotations, type guards, generics, or Discriminated Unions to satisfy type constraints cleanly.

## Strict Type Contracts

- Do not resort to loose type escapes (such as unjustified `any` casts) to work around type checker requirements.
- Verify type soundness by running `pnpm check-types` across the workspace.
