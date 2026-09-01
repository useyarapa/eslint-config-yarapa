import type { Linter } from "eslint";

import nPlugin from "eslint-plugin-n";
import globals from "globals";

import { required } from "./internal/required.js";

const nodeRecommended = required(
  nPlugin.configs["flat/recommended-module"],
  "eslint-plugin-n.configs.flat/recommended-module",
);
const nodeRecommendedPlugin = required(
  nodeRecommended.plugins?.n,
  "eslint-plugin-n.configs.flat/recommended-module.plugins.n",
);

/**
 * Node.js runtime capability preset. Applies Node.js globals and the
 * `eslint-plugin-n` recommended-module Upstream Baseline. Scope this preset
 * to files that actually run on Node.js; do not apply it to browser files.
 */
export const node: Linter.Config[] = [
  {
    languageOptions: {
      ...nodeRecommended.languageOptions,
      globals: {
        ...globals.node,
      },
    },
    name: "yarapa/node/recommended",
    plugins: { n: nodeRecommendedPlugin },
    rules: { ...nodeRecommended.rules },
  },
];
