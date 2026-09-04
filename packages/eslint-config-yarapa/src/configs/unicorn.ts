import type { Linter } from "eslint";

import unicornPlugin from "eslint-plugin-unicorn";

const JAVASCRIPT_AND_TYPESCRIPT_FILES = [
  "**/*.js",
  "**/*.mjs",
  "**/*.cjs",
  "**/*.jsx",
  "**/*.ts",
  "**/*.mts",
  "**/*.cts",
  "**/*.tsx",
];

const unicornRecommended = unicornPlugin.configs.recommended;

export const unicorn: Linter.Config[] = [
  {
    ...unicornRecommended,
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
  },
  {
    files: JAVASCRIPT_AND_TYPESCRIPT_FILES,
    name: "yarapa/unicorn/overrides",
    rules: {
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
];
