import type { Linter } from "eslint";

import globals from "globals";

import { reactComponentNaming } from "./configs/internal/reactComponentNaming.js";
import { reactHooks } from "./configs/internal/reactHooks.js";
import { recommended } from "./configs/recommended.js";

/**
 * React component-library profile: shared YARAPA handwriting plus browser,
 * JSX, and maintained React Hooks correctness semantics.
 */
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
