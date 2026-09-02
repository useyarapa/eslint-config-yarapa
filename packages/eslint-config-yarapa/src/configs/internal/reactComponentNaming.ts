import type { Linter } from "eslint";

/**
 * React component naming shared by React and Next.js semantic profiles.
 * SonarJS keeps validating function names while allowing PascalCase components.
 */
export const reactComponentNaming: Linter.Config[] = [
  {
    files: [
      "**/*.js",
      "**/*.mjs",
      "**/*.cjs",
      "**/*.jsx",
      "**/*.ts",
      "**/*.mts",
      "**/*.cts",
      "**/*.tsx",
    ],
    name: "yarapa/internal/react-component-naming",
    rules: {
      "sonarjs/function-name": [
        "error",
        { format: "^[_a-zA-Z][a-zA-Z0-9]*$" },
      ],
    },
  },
];
