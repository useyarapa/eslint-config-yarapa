/**
 * Canonical internal test-file glob list, covering `*.test.*`/`*.spec.*`
 * naming and `test`/`tests`/`__tests__` directories for supported JavaScript
 * and TypeScript extensions, plus runner-style `test.js`/`test-*.js` names.
 * Test-library semantics may use this scope when explicitly composed; the file
 * naming convention does not imply a public runner-specific preset.
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
