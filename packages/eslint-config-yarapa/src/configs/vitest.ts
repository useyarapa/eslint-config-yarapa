import type { Linter } from "eslint";

import vitestPlugin from "@vitest/eslint-plugin";

import { canonicalTestFileGlobs } from "./internal/canonicalTestFileGlobs.js";
import { required } from "./internal/required.js";

const vitestRecommended = required(
  vitestPlugin.configs.recommended,
  "@vitest/eslint-plugin.configs.recommended",
);

/**
 * Vitest test-runner capability preset. Select `vitest` or `ava` for a
 * given test-file scope, never both, per the Composition contract. Scoped
 * to the canonical test-file glob list shared by the test-runner presets.
 */
export const vitest: Linter.Config[] = [
  {
    files: canonicalTestFileGlobs,
    name: "yarapa/vitest/recommended",
    plugins: { vitest: vitestPlugin },
    rules: { ...vitestRecommended.rules },
  },
];
