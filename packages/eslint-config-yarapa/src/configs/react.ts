import type { Linter } from "eslint";

import reactHooksPlugin from "eslint-plugin-react-hooks";

const reactHooksRecommended
  = reactHooksPlugin.configs.flat["recommended-latest"];

export const react: Linter.Config[] = [
  {
    ...reactHooksRecommended,
    files: ["**/*.jsx", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    name: "yarapa/react/runtime",
  },
  {
    files: ["**/*.jsx", "**/*.tsx"],
    name: "yarapa/react/component-naming",
    rules: {
      "sonarjs/function-name": ["error", { format: "^[_a-zA-Z][a-zA-Z0-9]*$" }],
    },
  },
];
