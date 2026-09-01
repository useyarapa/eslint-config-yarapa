import type { Linter } from "eslint";

import packageJsonPlugin from "eslint-plugin-package-json";

const recommended = packageJsonPlugin.configs.recommended;
const stylisticPackageJson = packageJsonPlugin.configs.stylistic;

/**
 * Package manifest validity, consistency, and property-ordering checks for
 * every `package.json` in the repository. Composes with `json` (both
 * target `package.json`); apply both when a repository wants full JSON
 * syntax coverage plus manifest semantics.
 */
export const packageJson: Linter.Config[] = [
  { ...recommended, name: "yarapa/package-json/recommended" },
  { ...stylisticPackageJson, name: "yarapa/package-json/stylistic" },
];
