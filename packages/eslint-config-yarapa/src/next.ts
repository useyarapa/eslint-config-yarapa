import type { Linter } from "eslint";

import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

import { browser } from "./configs/browser.js";
import { recommended } from "./configs/recommended.js";
import { asFlatPlugin } from "./utils/compat.js";

const reactHooksRecommended: Linter.Config[] = [
  reactHooksPlugin.configs.flat["recommended-latest"],
];

const reactComponentNaming: Linter.Config[] = [
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
    name: "yarapa/internal/react-component-naming",
    rules: {
      "sonarjs/function-name": ["error", { format: "^[_a-zA-Z][a-zA-Z0-9]*$" }],
    },
  },
];

const next: Linter.Config[] = [
  ...recommended,
  ...reactHooksRecommended,
  ...reactComponentNaming,
  ...browser,
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
