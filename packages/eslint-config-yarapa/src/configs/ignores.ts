import type { Linter } from "eslint";

export const ignores: Linter.Config[] = [
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/coverage/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/node_modules/**",
    ],
    name: "yarapa/ignores/common-build-output",
  },
];
