import type { Linter } from "eslint";

import stylisticPlugin from "@stylistic/eslint-plugin";

const MAX_LINE_LENGTH = 80;

const customized = stylisticPlugin.configs.customize({
  arrowParens: false,
  braceStyle: "1tbs",
  commaDangle: "always-multiline",
  indent: 2,
  quoteProps: "as-needed",
  quotes: "double",
  semi: true,
});

export const stylistic: Linter.Config[] = [
  {
    name: "yarapa/stylistic/recommended",
    plugins: { "@stylistic": stylisticPlugin },
    rules: {
      ...customized.rules,
      "@stylistic/arrow-parens": [
        "error",
        "as-needed",
        { requireForBlockBody: false },
      ],
      "@stylistic/max-len": [
        "error",
        {
          code: MAX_LINE_LENGTH,
          ignoreComments: false,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreTrailingComments: false,
          ignoreUrls: true,
        },
      ],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    name: "yarapa/stylistic/typescript-type-definitions",
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
];
