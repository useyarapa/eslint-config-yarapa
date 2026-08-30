import type { Linter } from "eslint";

/**
 * Optional repository-boundary ignores. Never included in `recommended` and
 * never required for conformance. Apply this preset first, and only when
 * its documented boundaries are appropriate for the consumer repository.
 * Every ignored path must be an intentional boundary rather than a way to
 * evade the Banking Baseline.
 */
export const ignores: Linter.Config[] = [
  {
    name: "yarapa/ignores/common-build-output",
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/coverage/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/node_modules/**",
    ],
  },
];
