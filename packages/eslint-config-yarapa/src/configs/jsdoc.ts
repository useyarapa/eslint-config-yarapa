import type { Linter } from "eslint";

import jsdocPlugin from "eslint-plugin-jsdoc";

import { required } from "./internal/required.js";

const jsRecommended = required(
  jsdocPlugin.configs["flat/recommended-error"],
  "eslint-plugin-jsdoc.configs.flat/recommended-error",
);
const tsRecommended = required(
  jsdocPlugin.configs["flat/recommended-typescript-error"],
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

/**
 * JSDoc recommended-error coverage for JavaScript and TypeScript files.
 * TypeScript files use the TypeScript-flavored recommended variant so that
 * type-annotation-only JSDoc tags are not required when the type is already
 * expressed in TypeScript syntax.
 */
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
