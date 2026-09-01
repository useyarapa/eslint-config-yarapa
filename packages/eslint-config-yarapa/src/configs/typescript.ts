import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";
import { configs as tseslintConfigs } from "typescript-eslint";

import { asFlatConfigArray } from "./internal/eslintCompat.js";

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

export const typescript: Linter.Config[] = asFlatConfigArray(
  defineConfig(
    {
      extends: [tseslintConfigs.recommended],
      files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
      name: "yarapa/typescript/recommended",
      rules: {
        "@typescript-eslint/ban-ts-comment": [
          "error",
          {
            minimumDescriptionLength: 10,
            "ts-check": false,
            "ts-expect-error": "allow-with-description",
            "ts-ignore": true,
            "ts-nocheck": true,
          },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { fixStyle: "separate-type-imports", prefer: "type-imports" },
        ],
        "@typescript-eslint/no-import-type-side-effects": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        // `unused-imports/no-unused-vars` (from `base`) is the active
        // unused-variable rule for the Banking Baseline; it splits and
        // composes the standard no-unused-vars logic, so the
        // typescript-eslint rule must stay off to avoid duplicate/
        // conflicting reports on the same bindings.
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
    {
      files: ["**/*.d.ts", "**/*.d.mts", "**/*.d.cts"],
      name: "yarapa/typescript/declaration-files",
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
  ),
);
