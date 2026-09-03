import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";
import { configs as tseslintConfigs } from "typescript-eslint";

import { asFlatConfigArray } from "./internal/eslintCompat.js";

export const typeChecked: Linter.Config[] = asFlatConfigArray(
  defineConfig({
    extends: [tseslintConfigs.recommendedTypeChecked],
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
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: false },
      ],
      "@typescript-eslint/dot-notation": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/only-throw-error": "error",
      "@typescript-eslint/unbound-method": "error",
      "dot-notation": "off",
    },
  }),
);
