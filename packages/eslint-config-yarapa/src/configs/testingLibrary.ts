import type { Linter } from "eslint";

import testingLibraryPlugin from "eslint-plugin-testing-library";

import { vitestFileGlobs } from "./vitest.js";

/**
 * DOM Testing Library capability preset. Add this only to test files that
 * actually use Testing Library's DOM queries; it is additive to the
 * selected test-runner preset (`vitest` or `ava`), never a substitute for
 * it. Scoped to the canonical test-file glob list so its rules never apply
 * to non-test source.
 */
export const testingLibrary: Linter.Config[] = [
  {
    ...testingLibraryPlugin.configs["flat/dom"],
    files: vitestFileGlobs,
    name: "yarapa/testing-library/dom",
  },
];
