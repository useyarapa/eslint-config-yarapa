import globals from "globals";

import type { Linter } from "eslint";

/**
 * Browser runtime capability preset. Supplies browser globals and language
 * semantics only; no rule plugin backs the browser runtime, so this preset
 * has no Upstream Baseline of its own. Scope this preset to files that
 * actually run in a browser; do not apply it to Node.js files.
 */
export const browser: Linter.Config[] = [
  {
    name: "yarapa/browser/globals",
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
