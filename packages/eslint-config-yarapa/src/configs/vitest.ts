import vitestPlugin from "@vitest/eslint-plugin";

import type { Linter } from "eslint";

/**
 * Canonical Vitest test-file glob, covering `*.test.*`/`*.spec.*` naming and
 * `test`/`tests`/`__tests__` directories for the supported JavaScript and
 * TypeScript extensions, plus runner-specific `test.js`/`test-*.js` names.
 */
export const vitestFileGlobs: string[] = [
  "**/*.test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/*.spec.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/test-*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/test/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/tests/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
  "**/__tests__/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}",
];

/**
 * Vitest test-runner capability preset. Select `vitest` or `ava` for a
 * given test-file scope, never both, per the Composition contract.
 */
export const vitest: Linter.Config[] = [
  {
    name: "yarapa/vitest/recommended",
    files: vitestFileGlobs,
    plugins: { vitest: vitestPlugin },
    rules: { ...vitestPlugin.configs.recommended.rules },
  },
];
