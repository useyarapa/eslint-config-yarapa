/**
 * The sixteen public preset names, alphabetically ordered. This module is the
 * single source of truth: `index.ts` derives its `configs` type from it and
 * the repository verification suites and scripts reuse it instead of keeping
 * hand-copied lists.
 */
export const presetNames = [
  "ava",
  "base",
  "browser",
  "disableTypeChecked",
  "ignores",
  "jsdoc",
  "json",
  "node",
  "packageJson",
  "recommended",
  "security",
  "stylistic",
  "testingLibrary",
  "typeChecked",
  "typescript",
  "vitest",
] as const;
