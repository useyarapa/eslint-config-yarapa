import type { Linter } from "eslint";

import tseslint from "typescript-eslint";

/**
 * Type-aware TypeScript controls. Mandatory for TypeScript source files in
 * `recommended`. Uses TypeScript Project Service so consumers do not need to
 * hand-maintain a `parserOptions.project` glob; a source file missing from
 * its intended `tsconfig.json` is a configuration defect in the consumer
 * repository, not a package limitation.
 */
export const typeChecked = tseslint.config({
  extends: [tseslint.configs.recommendedTypeChecked],
  files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: process.cwd(),
    },
  },
  name: "yarapa/type-checked/recommended",
  rules: {
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/only-throw-error": "error",
    "@typescript-eslint/unbound-method": "error",
  },
}) as unknown as Linter.Config[];
