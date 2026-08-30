import jsdocPlugin from "eslint-plugin-jsdoc";

import type { Linter } from "eslint";

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
    name: "yarapa/jsdoc/recommended-javascript",
    files: ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.jsx"],
    plugins: { jsdoc: jsRecommended.plugins.jsdoc },
    rules: { ...jsRecommended.rules },
  },
  {
    name: "yarapa/jsdoc/recommended-typescript",
    files: ["**/*.ts", "**/*.mts", "**/*.cts", "**/*.tsx"],
    plugins: { jsdoc: tsRecommended.plugins.jsdoc },
    rules: { ...tsRecommended.rules },
  },
];
