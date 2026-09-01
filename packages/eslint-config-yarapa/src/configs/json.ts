import type { Linter } from "eslint";

import { configs as jsoncConfigs } from "eslint-plugin-jsonc";

import { required } from "./internal/required.js";

const jsoncRecommendedConfigs = required(
  jsoncConfigs["flat/recommended-with-jsonc"],
  "eslint-plugin-jsonc.configs.flat/recommended-with-jsonc",
);
const jsoncBase = required(
  jsoncRecommendedConfigs[0],
  "eslint-plugin-jsonc.configs.flat/recommended-with-jsonc[0]",
);
const jsoncStrict = required(
  jsoncRecommendedConfigs[1],
  "eslint-plugin-jsonc.configs.flat/recommended-with-jsonc[1]",
);
const jsoncRecommended = required(
  jsoncRecommendedConfigs[2],
  "eslint-plugin-jsonc.configs.flat/recommended-with-jsonc[2]",
);

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
