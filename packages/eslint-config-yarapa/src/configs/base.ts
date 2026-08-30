import commentsPlugin from "@eslint-community/eslint-plugin-eslint-comments";
import js from "@eslint/js";
import promisePlugin from "eslint-plugin-promise";
import regexpPlugin from "eslint-plugin-regexp";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

import type { Linter } from "eslint";

const promiseRecommended = promisePlugin.configs["flat/recommended"];
const regexpRecommended = regexpPlugin.configs["flat/recommended"];

/**
 * Universally relevant, non-type-aware JavaScript baseline: ESLint core
 * recommended coverage, Promise and asynchronous control-flow checks,
 * regular-expression checks, unused-import controls, and auditable ESLint
 * suppression comments.
 */
export const base: Linter.Config[] = [
  {
    name: "yarapa/base/eslint-recommended",
    rules: { ...js.configs.recommended.rules },
  },
  {
    name: "yarapa/base/eslint-comments-recommended",
    plugins: {
      "@eslint-community/eslint-comments": commentsPlugin,
    },
    rules: { ...commentsPlugin.configs.recommended.rules },
  },
  {
    name: "yarapa/base/promise-recommended",
    plugins: { promise: promiseRecommended.plugins.promise },
    rules: {
      ...promiseRecommended.rules,
      "promise/no-nesting": "error",
      "promise/no-promise-in-callback": "error",
      "promise/no-callback-in-promise": "error",
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
