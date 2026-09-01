import type { Linter } from "eslint";

import avaPlugin from "eslint-plugin-ava";

import { canonicalTestFileGlobs } from "./internal/canonicalTestFileGlobs.js";
import { required } from "./internal/required.js";

const avaRecommendedConfigs = required(
  avaPlugin.configs.recommended,
  "eslint-plugin-ava.configs.recommended",
);
const avaRecommended = required(
  avaRecommendedConfigs[0],
  "eslint-plugin-ava.configs.recommended[0]",
);
const avaPackageJsonRecommended = required(
  avaRecommendedConfigs[1],
  "eslint-plugin-ava.configs.recommended[1]",
);
const avaRecommendedPlugin = required(
  avaRecommended.plugins?.ava,
  "eslint-plugin-ava.configs.recommended[0].plugins.ava",
);
const avaPackageJsonPlugin = required(
  avaPackageJsonRecommended.plugins?.ava,
  "eslint-plugin-ava.configs.recommended[1].plugins.ava",
);

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
    files: canonicalTestFileGlobs,
    name: "yarapa/ava/recommended",
    plugins: { ava: avaRecommendedPlugin },
    rules: { ...avaRecommended.rules },
  },
  {
    files: avaPackageJsonRecommended.files,
    name: "yarapa/ava/no-ava-in-dependencies",
    plugins: { ava: avaPackageJsonPlugin },
    rules: { ...avaPackageJsonRecommended.rules },
  },
];
