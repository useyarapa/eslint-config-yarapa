import type { Linter } from "eslint";

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
