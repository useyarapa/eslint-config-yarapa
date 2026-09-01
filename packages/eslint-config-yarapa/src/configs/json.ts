import type { Linter } from "eslint";

import jsoncPlugin from "eslint-plugin-jsonc";

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
      "jsonc/array-bracket-spacing": ["error", "never"],
      "jsonc/comma-dangle": ["error", "never"],
      "jsonc/indent": ["error", 2],
      "jsonc/key-spacing": ["error", { afterColon: true, beforeColon: false }],
      "jsonc/object-curly-spacing": ["error", "always"],
    },
  },
  {
    files: ["*.json5", "**/*.json5"],
    // JSON5 permits trailing commas per its grammar, so the mandatory
    // stylistic standard ("trailing commas wherever the format grammar
    // permits them") requires them here, overriding the strict-JSON
    // "never" default set above. Strict JSON and JSONC's comment-only
    // grammar do not permit trailing commas, so they keep "never".
    name: "yarapa/json/json5-trailing-comma",
    rules: {
      "jsonc/comma-dangle": ["error", "always-multiline"],
    },
  },
];
