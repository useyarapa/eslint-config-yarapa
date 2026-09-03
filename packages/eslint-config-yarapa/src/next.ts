import type { Linter } from "eslint";

import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

import { asFlatPlugin } from "./configs/internal/eslintCompat.js";
import { reactComponentNaming } from "./configs/internal/reactComponentNaming.js";
import { reactHooks } from "./configs/internal/reactHooks.js";
import { recommended } from "./configs/recommended.js";

const next: Linter.Config[] = [
  ...recommended,
  ...reactHooks,
  ...reactComponentNaming,
  {
    files: [
      "**/*.js",
      "**/*.mjs",
      "**/*.cjs",
      "**/*.jsx",
      "**/*.ts",
      "**/*.mts",
      "**/*.cts",
      "**/*.tsx",
    ],
    name: "yarapa/next/framework",
    plugins: {
      "@next/next": asFlatPlugin(nextPlugin),
    },
    rules: {
      "@next/next/google-font-display": "error",
      "@next/next/google-font-preconnect": "error",
      "@next/next/inline-script-id": "error",
      "@next/next/next-script-for-ga": "error",
      "@next/next/no-assign-module-variable": "error",
      "@next/next/no-async-client-component": "error",
      "@next/next/no-before-interactive-script-outside-document": "error",
      "@next/next/no-css-tags": "error",
      "@next/next/no-document-import-in-page": "error",
      "@next/next/no-duplicate-head": "error",
      "@next/next/no-head-element": "error",
      "@next/next/no-head-import-in-document": "error",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
      "@next/next/no-location-assign-relative-destination": "error",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-script-component-in-head": "error",
      "@next/next/no-styled-jsx-in-document": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-title-in-document-head": "error",
      "@next/next/no-typos": "error",
      "@next/next/no-unwanted-polyfillio": "error",
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    name: "yarapa/next/runtime",
  },
];

export default next;
