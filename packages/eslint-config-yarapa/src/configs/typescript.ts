import tseslint from "typescript-eslint";

import type { Linter } from "eslint";

/**
 * Syntax-only TypeScript controls: the complete typescript-eslint
 * `recommended` Upstream Baseline plus the Banking Baseline's mandatory
 * TypeScript controls that do not require type information -
 * `@ts-expect-error` with a mandatory description, a ban on `@ts-ignore`,
 * and separate `import type` declarations.
 *
 * This preset applies to every TypeScript file, typed or not. `typeChecked`
 * adds the type-aware layer on top for files that have a TypeScript project.
 */
export const typescript: Linter.Config[] = tseslint.config(
  {
    name: "yarapa/typescript/recommended",
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    extends: [tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
          "ts-check": false,
          minimumDescriptionLength: 10,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: false },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
    },
  },
  {
    name: "yarapa/typescript/declaration-files",
    files: ["**/*.d.ts", "**/*.d.mts", "**/*.d.cts"],
    rules: {
      // Ambient declaration files describe external shapes; these controls
      // stay enabled but the rules below are commonly emitted by declaration
      // generators and remain sanctioned, not exempted, adjustments.
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "always" },
      ],
    },
  },
);
