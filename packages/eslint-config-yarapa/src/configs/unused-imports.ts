import type { Linter } from "eslint";

import unusedImportsPlugin from "eslint-plugin-unused-imports";

const unusedImportsRules: Linter.RulesRecord = {
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
};

export const unusedImports: Linter.Config[] = [
  {
    name: "yarapa/unused-imports",
    plugins: {
      "unused-imports": unusedImportsPlugin,
    },
    rules: unusedImportsRules,
  },
];
