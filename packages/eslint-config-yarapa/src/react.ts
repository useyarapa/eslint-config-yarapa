import type { Linter } from "eslint";

import { browser } from "./configs/browser.js";
import { reactComponentNaming } from "./configs/internal/reactComponentNaming.js";
import { reactHooksRecommended } from "./configs/internal/reactHooks.js";
import { recommended } from "./configs/recommended.js";

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
