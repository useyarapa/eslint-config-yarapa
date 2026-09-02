/**
 * Canonical test-file glob list, covering `*.test.*`/`*.spec.*` naming and
 * `test`/`tests`/`__tests__` directories for the supported JavaScript and
 * TypeScript extensions, plus runner-specific `test.js`/`test-*.js` names.
 * Shared by the `vitest`, `ava`, and `testingLibrary` presets so the
 * convenience scopes stay defined by naming convention, not by runner.
 */
export const canonicalTestFileGlobs: string[] = [
  "**/*.test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/*.spec.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/test-*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/test/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/tests/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/__tests__/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
];
