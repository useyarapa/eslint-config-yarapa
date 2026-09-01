import type { Linter } from "eslint";

import jsdocPlugin from "eslint-plugin-jsdoc";

const jsRecommended = jsdocPlugin.configs["flat/recommended-error"];
const tsRecommended = jsdocPlugin.configs["flat/recommended-typescript-error"];

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
    plugins: { jsdoc: jsRecommended.plugins.jsdoc },
    rules: { ...jsRecommended.rules },
  },
  {
    files: ["**/*.ts", "**/*.mts", "**/*.cts", "**/*.tsx"],
    name: "yarapa/jsdoc/recommended-typescript",
    plugins: { jsdoc: tsRecommended.plugins.jsdoc },
    rules: { ...tsRecommended.rules },
  },
];
