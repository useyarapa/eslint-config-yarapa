import type { Linter } from "eslint";

import commentsPlugin, {
  configs as commentsConfigs,
} from "@eslint-community/eslint-plugin-eslint-comments";
import js from "@eslint/js";
import promisePlugin from "eslint-plugin-promise";
import { configs as regexpConfigs } from "eslint-plugin-regexp";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

import { asFlatPlugin } from "./internal/eslintCompat.js";
import { required } from "./internal/required.js";

const jsRecommendedRules = required(
  js.configs.recommended.rules,
  "@eslint/js.configs.recommended.rules",
);

const promiseRecommended = required(
  promisePlugin.configs["flat/recommended"],
  "eslint-plugin-promise.configs.flat/recommended",
);
const promiseRecommendedPlugin = asFlatPlugin(
  required(
    promiseRecommended.plugins?.promise,
    "eslint-plugin-promise.configs.flat/recommended.plugins.promise",
  ),
);
const regexpRecommended = regexpConfigs["flat/recommended"];

/**
 * Universally relevant, non-type-aware JavaScript baseline: ESLint core
 * recommended coverage, Promise and asynchronous control-flow checks,
 * regular-expression checks, unused-import controls, and auditable ESLint
 * suppression comments.
 */
export const base: Linter.Config[] = [
  {
    name: "yarapa/base/eslint-recommended",
    rules: { ...jsRecommendedRules },
  },
  {
    name: "yarapa/base/eslint-comments-recommended",
    plugins: {
      "@eslint-community/eslint-comments": commentsPlugin,
    },
    rules: {
      ...commentsConfigs.recommended.rules,
      "@eslint-community/eslint-comments/require-description": "error",
    },
  },
  {
    name: "yarapa/base/promise-recommended",
    plugins: { promise: promiseRecommendedPlugin },
    rules: {
      ...promiseRecommended.rules,
      "promise/no-callback-in-promise": "error",
      "promise/no-nesting": "error",
      "promise/no-promise-in-callback": "error",
      "promise/no-return-in-finally": "error",
      "promise/valid-params": "error",
    },
  },
  {
    name: "yarapa/base/regexp-recommended",
    plugins: { regexp: regexpRecommended.plugins.regexp },
    rules: { ...regexpRecommended.rules },
  },
  {
    name: "yarapa/base/unused-imports",
    plugins: { "unused-imports": unusedImportsPlugin },
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
