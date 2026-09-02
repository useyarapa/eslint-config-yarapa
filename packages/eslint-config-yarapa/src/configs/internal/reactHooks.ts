import type { Linter } from "eslint";

import reactHooksPlugin from "eslint-plugin-react-hooks";

import { asFlatPlugin } from "./eslintCompat.js";

/**
 * React Hooks correctness shared by React and Next.js profiles. The rule set
 * is an explicit snapshot of the maintained 7.1.1 flat recommended config;
 * YARAPA promotes upstream warnings to errors to preserve zero-warning CI.
 */
export const reactHooks: Linter.Config[] = [
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
    name: "yarapa/internal/react-hooks",
    plugins: {
      "react-hooks": asFlatPlugin(reactHooksPlugin),
    },
    rules: {
      "react-hooks/component-hook-factories": "error",
      "react-hooks/config": "error",
      "react-hooks/error-boundaries": "error",
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/gating": "error",
      "react-hooks/globals": "error",
      "react-hooks/immutability": "error",
      "react-hooks/incompatible-library": "error",
      "react-hooks/preserve-manual-memoization": "error",
      "react-hooks/purity": "error",
      "react-hooks/refs": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/set-state-in-effect": "error",
      "react-hooks/set-state-in-render": "error",
      "react-hooks/static-components": "error",
      "react-hooks/unsupported-syntax": "error",
      "react-hooks/use-memo": "error",
    },
  },
];
