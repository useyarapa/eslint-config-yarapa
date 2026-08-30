import testingLibraryPlugin from "eslint-plugin-testing-library";

import type { Linter } from "eslint";

/**
 * DOM Testing Library capability preset. Add this only to test files that
 * actually use Testing Library's DOM queries; it is additive to the
 * selected test-runner preset (`vitest` or `ava`), never a substitute for
 * it.
 */
export const testingLibrary: Linter.Config[] = [
  {
    ...testingLibraryPlugin.configs["flat/dom"],
    name: "yarapa/testing-library/dom",
  },
];
