import type { Linter } from "eslint";

import globals from "globals";

import { reactComponentNaming } from "./configs/internal/reactComponentNaming.js";
import { reactHooks } from "./configs/internal/reactHooks.js";
import { recommended } from "./configs/recommended.js";

const react: Linter.Config[] = [
  ...recommended,
  ...reactHooks,
  ...reactComponentNaming,
  {
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    name: "yarapa/react/runtime",
  },
];

export default react;
