import type { Linter } from "eslint";

import { configs as jsdocConfigs } from "eslint-plugin-jsdoc";

import { required } from "../utils/compat.js";

const jsRecommended = required(
  jsdocConfigs["flat/recommended-error"],
  "eslint-plugin-jsdoc.configs.flat/recommended-error",
);
const tsRecommended = required(
  jsdocConfigs["flat/recommended-typescript-error"],
  "eslint-plugin-jsdoc.configs.flat/recommended-typescript-error",
);
const jsRecommendedPlugin = required(
  jsRecommended.plugins?.jsdoc,
  "eslint-plugin-jsdoc.configs.flat/recommended-error.plugins.jsdoc",
);
const tsRecommendedPlugin = required(
  tsRecommended.plugins?.jsdoc,
  "eslint-plugin-jsdoc.configs.flat/recommended-typescript-error.plugins.jsdoc",
);

export const jsdoc: Linter.Config[] = [
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.jsx"],
    name: "yarapa/jsdoc/recommended-javascript",
    plugins: { jsdoc: jsRecommendedPlugin },
    rules: { ...jsRecommended.rules },
  },
  {
    files: ["**/*.ts", "**/*.mts", "**/*.cts", "**/*.tsx"],
    name: "yarapa/jsdoc/recommended-typescript",
    plugins: { jsdoc: tsRecommendedPlugin },
    rules: { ...tsRecommended.rules },
  },
];
