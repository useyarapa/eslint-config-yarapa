import type { Linter } from "eslint";

import globals from "globals";

import { recommended } from "./configs/recommended.js";

/**
 * React component-library profile: shared YARAPA handwriting plus browser and
 * JSX language semantics. React-specific plugin deltas are layered separately
 * once their behavior is covered by framework-focused tests.
 */
const react: Linter.Config[] = [
  ...recommended,
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
