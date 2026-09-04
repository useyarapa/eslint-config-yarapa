import type { Linter } from "eslint";

import { configs as jsoncConfigs } from "eslint-plugin-jsonc";

import { required } from "../utils/compat.js";

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
    name: "yarapa/json/json5-trailing-comma",
    rules: {
      "jsonc/comma-dangle": ["error", "always-multiline"],
    },
  },
];
