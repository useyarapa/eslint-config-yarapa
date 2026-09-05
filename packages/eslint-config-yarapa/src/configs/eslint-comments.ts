import type { Linter } from "eslint";

import { rules as commentsPluginRules } from "@eslint-community/eslint-plugin-eslint-comments";

const commentsRules: Linter.RulesRecord = {
  "@eslint-community/eslint-comments/disable-enable-pair": "error",
  "@eslint-community/eslint-comments/no-aggregating-enable": "error",
  "@eslint-community/eslint-comments/no-duplicate-disable": "error",
  "@eslint-community/eslint-comments/no-unlimited-disable": "error",
  "@eslint-community/eslint-comments/no-unused-enable": "error",
  "@eslint-community/eslint-comments/require-description": "error",
};

export const eslintComments: Linter.Config[] = [
  {
    name: "yarapa/eslint-comments",
    plugins: {
      "@eslint-community/eslint-comments": {
        rules: commentsPluginRules,
      },
    },
    rules: commentsRules,
  },
];
