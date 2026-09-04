import type { Linter } from "eslint";

import nPlugin from "eslint-plugin-n";
import globals from "globals";

import { required } from "../utils/compat.js";

const nodeRecommended = required(
  nPlugin.configs["flat/recommended-module"],
  "eslint-plugin-n.configs.flat/recommended-module",
);
const nodeRecommendedPlugin = required(
  nodeRecommended.plugins?.n,
  "eslint-plugin-n.configs.flat/recommended-module.plugins.n",
);

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
    settings: {
      node: {
        tryExtensions: [
          ".js",
          ".jsx",
          ".mjs",
          ".cjs",
          ".json",
          ".node",
          ".ts",
          ".tsx",
          ".mts",
          ".cts",
        ],
      },
    },
  },
];
