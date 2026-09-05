import type { Linter } from "eslint";

import {
  configs as commentsConfigs,
  rules as commentsRules,
} from "@eslint-community/eslint-plugin-eslint-comments";
import js from "@eslint/js";
import promisePlugin from "eslint-plugin-promise";
import { configs as regexpConfigs } from "eslint-plugin-regexp";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

import { required } from "../utils/compat.js";

const { configs: promiseConfigs } = promisePlugin;
const { rules: unusedImportsRules } = unusedImportsPlugin;

const modernJavaScriptRules: Linter.RulesRecord = {
  "arrow-body-style": [
    "error",
    "as-needed",
    { requireReturnForObjectLiteral: false },
  ],
  curly: ["error", "all"],
  "default-param-last": "error",
  "dot-notation": "error",
  eqeqeq: ["error", "always"],
  "no-array-constructor": "error",
  "no-object-constructor": "error",
  "no-restricted-imports": [
    "error",
    {
      paths: [
        {
          message: "Use es-toolkit or native methods instead.",
          name: "lodash",
        },
        {
          message: "Use es-toolkit or native methods instead.",
          name: "lodash-es",
        },
        {
          message: "Use es-toolkit or native methods instead.",
          name: "underscore",
        },
        { message: "Use es-toolkit or native methods instead.", name: "ramda" },
      ],
      patterns: [
        {
          group: ["lodash/*", "lodash-es/*"],
          message: "Use es-toolkit or native methods instead.",
        },
        {
          group: ["underscore/*"],
          message: "Use es-toolkit or native methods instead.",
        },
        {
          group: ["ramda/*"],
          message: "Use es-toolkit or native methods instead.",
        },
      ],
    },
  ],
  "no-var": "error",
  "object-shorthand": ["error", "always"],
  "prefer-const": "error",
  "prefer-object-has-own": "error",
  "prefer-object-spread": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",
  "prefer-template": "error",
  radix: "error",
};

const promiseRecommended = required(
  promiseConfigs["flat/recommended"],
  "eslint-plugin-promise.configs.flat/recommended",
);
const regexpRecommended = regexpConfigs["flat/recommended"];

export const base: Linter.Config[] = [
  js.configs.recommended,
  {
    name: "yarapa/base/modern-js-handwriting",
    rules: modernJavaScriptRules,
  },
  {
    name: "yarapa/base/eslint-comments-recommended",
    plugins: {
      "@eslint-community/eslint-comments": {
        rules: commentsRules,
      },
    },
    rules: {
      ...commentsConfigs.recommended.rules,
      "@eslint-community/eslint-comments/require-description": "error",
    },
  },
  promiseRecommended as unknown as Linter.Config,
  {
    name: "yarapa/base/promise-policy",
    rules: {
      "promise/no-callback-in-promise": "error",
      "promise/no-nesting": "error",
      "promise/no-promise-in-callback": "error",
      "promise/no-return-in-finally": "error",
      "promise/valid-params": "error",
    },
  },
  {
    name: "yarapa/base/regexp-recommended",
    plugins: { regexp: regexpRecommended.plugins?.regexp },
    rules: { ...regexpRecommended.rules },
  },
  {
    name: "yarapa/base/unused-imports",
    plugins: { "unused-imports": { rules: unusedImportsRules } },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];
