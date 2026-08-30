import jsoncPlugin from "eslint-plugin-jsonc";

import type { Linter } from "eslint";

const [jsoncBase, jsoncStrict, jsoncRecommended] =
  jsoncPlugin.configs["flat/recommended-with-jsonc"];

/**
 * JSON, JSONC, and JSON5 recommended coverage plus the mandatory stylistic
 * standard's JSON-format equivalents (two-space indentation, double quotes,
 * trailing commas wherever the grammar permits them). Applies to
 * `*.json`, `*.jsonc`, and `*.json5` files, including `package.json`; the
 * `packageJson` preset adds package-manifest-specific validity checks on
 * top of this preset.
 */
export const json: Linter.Config[] = [
  { ...jsoncBase, name: "yarapa/json/base" },
  { ...jsoncStrict, name: "yarapa/json/strict-off" },
  {
    ...jsoncRecommended,
    name: "yarapa/json/recommended",
    rules: {
      ...jsoncRecommended.rules,
      "jsonc/indent": ["error", 2],
      "jsonc/comma-dangle": ["error", "never"],
      "jsonc/key-spacing": ["error", { afterColon: true, beforeColon: false }],
      "jsonc/object-curly-spacing": ["error", "always"],
      "jsonc/array-bracket-spacing": ["error", "never"],
    },
  },
];
