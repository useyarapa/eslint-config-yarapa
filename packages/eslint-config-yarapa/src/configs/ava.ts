import type { Linter } from "eslint";

import avaPlugin from "eslint-plugin-ava";

import { vitestFileGlobs } from "./vitest.js";

const [avaRecommended, avaPackageJsonRecommended] =
  avaPlugin.configs.recommended;

/**
 * AVA test-runner capability preset. Select `ava` or `vitest` for a given
 * test-file scope, never both, per the Composition contract. Reuses the
 * same canonical test-file glob list as `vitest` since the convenience
 * scopes are defined by naming convention, not by runner. Also preserves
 * the upstream `**\/package.json`-scoped entry that checks AVA is not
 * placed in production dependencies (`ava/no-ava-in-dependencies`).
 */
export const ava: Linter.Config[] = [
  {
    files: vitestFileGlobs,
    name: "yarapa/ava/recommended",
    plugins: { ava: avaRecommended.plugins.ava },
    rules: { ...avaRecommended.rules },
  },
  {
    files: avaPackageJsonRecommended.files,
    name: "yarapa/ava/no-ava-in-dependencies",
    plugins: { ava: avaPackageJsonRecommended.plugins.ava },
    rules: { ...avaPackageJsonRecommended.rules },
  },
];
