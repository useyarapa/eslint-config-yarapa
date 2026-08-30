import avaPlugin from "eslint-plugin-ava";

import { vitestFileGlobs } from "./vitest.js";

import type { Linter } from "eslint";

const avaRecommended = avaPlugin.configs.recommended[0];

/**
 * AVA test-runner capability preset. Select `ava` or `vitest` for a given
 * test-file scope, never both, per the Composition contract. Reuses the
 * same canonical test-file glob list as `vitest` since the convenience
 * scopes are defined by naming convention, not by runner.
 */
export const ava: Linter.Config[] = [
  {
    name: "yarapa/ava/recommended",
    files: vitestFileGlobs,
    plugins: { ava: avaRecommended.plugins.ava },
    rules: { ...avaRecommended.rules },
  },
];
