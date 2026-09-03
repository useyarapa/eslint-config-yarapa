import type { Linter } from "eslint";

import globals from "globals";

export const browser: Linter.Config[] = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    name: "yarapa/browser/globals",
  },
];
