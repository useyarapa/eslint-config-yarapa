import type { Linter } from "eslint";

import globals from "globals";

import { recommended } from "./configs/recommended.js";

/**
 * Next.js application profile: shared YARAPA handwriting plus the browser,
 * Node.js, and JSX language semantics present across a modern Next.js app.
 * Next-specific plugin rules are layered separately once covered by focused
 * framework-delta tests.
 */
const next: Linter.Config[] = [
  ...recommended,
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
