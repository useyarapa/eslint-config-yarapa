import type { Linter } from "eslint";

import jsoncPlugin from "eslint-plugin-jsonc";

const jsoncCompatibilityRules: Linter.RulesRecord = {
  "no-unused-expressions": "off",
  "no-unused-vars": "off",
  strict: "off",
};

const jsoncRules: Linter.RulesRecord = {
  "jsonc/array-bracket-spacing": ["error", "never"],
  "jsonc/comma-dangle": ["error", "never"],
  "jsonc/indent": ["error", 2],
  "jsonc/key-spacing": ["error", { afterColon: true, beforeColon: false }],
  "jsonc/no-bigint-literals": "error",
  "jsonc/no-binary-expression": "error",
  "jsonc/no-binary-numeric-literals": "error",
  "jsonc/no-dupe-keys": "error",
  "jsonc/no-escape-sequence-in-identifier": "error",
  "jsonc/no-floating-decimal": "error",
  "jsonc/no-hexadecimal-numeric-literals": "error",
  "jsonc/no-infinity": "error",
  "jsonc/no-irregular-whitespace": "error",
  "jsonc/no-multi-str": "error",
  "jsonc/no-nan": "error",
  "jsonc/no-number-props": "error",
  "jsonc/no-numeric-separators": "error",
  "jsonc/no-octal": "error",
  "jsonc/no-octal-numeric-literals": "error",
  "jsonc/no-parenthesized": "error",
  "jsonc/no-plus-sign": "error",
  "jsonc/no-regexp-literals": "error",
  "jsonc/no-sparse-arrays": "error",
  "jsonc/no-template-literals": "error",
  "jsonc/no-undefined-value": "error",
  "jsonc/no-unicode-codepoint-escapes": "error",
  "jsonc/no-useless-escape": "error",
  "jsonc/object-curly-spacing": ["error", "always"],
  "jsonc/quote-props": "error",
  "jsonc/quotes": "error",
  "jsonc/space-unary-ops": "error",
  "jsonc/valid-json-number": "error",
  "jsonc/vue-custom-block/no-parsing-error": "error",
};

const json5TrailingCommaRules: Linter.RulesRecord = {
  "jsonc/comma-dangle": ["error", "always-multiline"],
};

export const json: Linter.Config[] = [
  {
    name: "yarapa/json/base",
    plugins: { jsonc: jsoncPlugin },
  },
  {
    files: [
      "*.json",
      "**/*.json",
      "*.json5",
      "**/*.json5",
      "*.jsonc",
      "**/*.jsonc",
    ],
    language: "jsonc/x",
    name: "yarapa/json/strict-off",
    rules: jsoncCompatibilityRules,
  },
  {
    name: "yarapa/json/rules",
    rules: jsoncRules,
  },
  {
    files: ["*.json5", "**/*.json5"],
    name: "yarapa/json/json5-trailing-comma",
    rules: json5TrailingCommaRules,
  },
];
