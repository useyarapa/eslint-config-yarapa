import type { Linter } from "eslint";

import {
  configs as commentsConfigs,
  rules as commentsRules,
} from "@eslint-community/eslint-plugin-eslint-comments";
import promisePlugin from "eslint-plugin-promise";
import { configs as regexpConfigs } from "eslint-plugin-regexp";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

import { asFlatPlugin } from "./internal/eslintCompat.js";
import { required } from "./internal/required.js";

const { configs: promiseConfigs } = promisePlugin;
const { rules: unusedImportsRules } = unusedImportsPlugin;

const jsRecommendedRules: Linter.RulesRecord = {
  "constructor-super": "error",
  "for-direction": "error",
  "getter-return": "error",
  "no-async-promise-executor": "error",
  "no-case-declarations": "error",
  "no-class-assign": "error",
  "no-compare-neg-zero": "error",
  "no-cond-assign": "error",
  "no-const-assign": "error",
  "no-constant-binary-expression": "error",
  "no-constant-condition": "error",
  "no-control-regex": "error",
  "no-debugger": "error",
  "no-delete-var": "error",
  "no-dupe-args": "error",
  "no-dupe-class-members": "error",
  "no-dupe-else-if": "error",
  "no-dupe-keys": "error",
  "no-duplicate-case": "error",
  "no-empty": "error",
  "no-empty-character-class": "error",
  "no-empty-pattern": "error",
  "no-empty-static-block": "error",
  "no-ex-assign": "error",
  "no-extra-boolean-cast": "error",
  "no-fallthrough": "error",
  "no-func-assign": "error",
  "no-global-assign": "error",
  "no-import-assign": "error",
  "no-invalid-regexp": "error",
  "no-irregular-whitespace": "error",
  "no-loss-of-precision": "error",
  "no-misleading-character-class": "error",
  "no-new-native-nonconstructor": "error",
  "no-nonoctal-decimal-escape": "error",
  "no-obj-calls": "error",
  "no-octal": "error",
  "no-prototype-builtins": "error",
  "no-redeclare": "error",
  "no-regex-spaces": "error",
  "no-self-assign": "error",
  "no-setter-return": "error",
  "no-shadow-restricted-names": "error",
  "no-sparse-arrays": "error",
  "no-this-before-super": "error",
  "no-unassigned-vars": "error",
  "no-undef": "error",
  "no-unexpected-multiline": "error",
  "no-unreachable": "error",
  "no-unsafe-finally": "error",
  "no-unsafe-negation": "error",
  "no-unsafe-optional-chaining": "error",
  "no-unused-labels": "error",
  "no-unused-private-class-members": "error",
  "no-unused-vars": "error",
  "no-useless-assignment": "error",
  "no-useless-backreference": "error",
  "no-useless-catch": "error",
  "no-useless-escape": "error",
  "no-with": "error",
  "preserve-caught-error": "error",
  "require-yield": "error",
  "use-isnan": "error",
  "valid-typeof": "error",
};

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
const promiseRecommendedPlugin = asFlatPlugin(
  required(
    promiseRecommended.plugins?.promise,
    "eslint-plugin-promise.configs.flat/recommended.plugins.promise",
  ),
);
const regexpRecommended = regexpConfigs["flat/recommended"];

export const base: Linter.Config[] = [
  {
    name: "yarapa/base/eslint-recommended",
    rules: jsRecommendedRules,
  },
  {
    name: "yarapa/base/modern-js-handwriting",
    rules: modernJavaScriptRules,
  },
  {
    name: "yarapa/base/eslint-comments-recommended",
    plugins: {
      "@eslint-community/eslint-comments": asFlatPlugin({
        rules: commentsRules,
      }),
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
    plugins: { "unused-imports": asFlatPlugin({ rules: unusedImportsRules }) },
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
