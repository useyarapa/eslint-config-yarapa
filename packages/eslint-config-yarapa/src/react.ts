import type { Linter } from "eslint";

import reactHooksPlugin from "eslint-plugin-react-hooks";

import { browser } from "./configs/browser.js";
import { recommended } from "./configs/recommended.js";

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

const react: Linter.Config[] = [
  ...recommended,
  ...reactHooksRecommended,
  ...reactComponentNaming,
  ...browser,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    name: "yarapa/react/runtime",
  },
];

export default react;
