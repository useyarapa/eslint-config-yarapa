import type { Linter } from "eslint";

import testingLibraryPlugin from "eslint-plugin-testing-library";

import { canonicalTestFileGlobs } from "./internal/canonicalTestFileGlobs.js";
import { required } from "./internal/required.js";

const domRecommended = required(
  testingLibraryPlugin.configs["flat/dom"],
  "eslint-plugin-testing-library.configs.flat/dom",
);

/**
 * DOM Testing Library capability preset. Add this only to test files that
 * actually use Testing Library's DOM queries; it is additive to the
 * selected test-runner preset (`vitest` or `ava`), never a substitute for
 * it. Scoped to the canonical test-file glob list so its rules never apply
 * to non-test source.
 */
export const testingLibrary: Linter.Config[] = [
  {
    ...domRecommended,
    files: canonicalTestFileGlobs,
    name: "yarapa/testing-library/dom",
  },
];
