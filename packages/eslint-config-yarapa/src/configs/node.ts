import nPlugin from "eslint-plugin-n";
import globals from "globals";

import type { Linter } from "eslint";

const nodeRecommended = nPlugin.configs["flat/recommended-module"];

/**
 * Node.js runtime capability preset. Applies Node.js globals and the
 * `eslint-plugin-n` recommended-module Upstream Baseline. Scope this preset
 * to files that actually run on Node.js; do not apply it to browser files.
 */
export const node: Linter.Config[] = [
  {
    name: "yarapa/node/recommended",
    plugins: { n: nodeRecommended.plugins.n },
    languageOptions: {
      ...nodeRecommended.languageOptions,
      globals: {
        ...globals.node,
      },
    },
    rules: { ...nodeRecommended.rules },
  },
];
