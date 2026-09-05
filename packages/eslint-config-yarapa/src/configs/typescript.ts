import type { Linter } from "eslint";

import { defineConfig } from "eslint/config";
import { configs as tseslintConfigs } from "typescript-eslint";

export const typescript: Linter.Config[] = defineConfig(
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
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/no-array-constructor": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "default-param-last": "off",
      "no-array-constructor": "off",
    },
  },
  {
    files: ["**/*.d.ts", "**/*.d.mts", "**/*.d.cts"],
    name: "yarapa/typescript/declaration-files",
    rules: {
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "always" },
      ],
    },
  },
);
