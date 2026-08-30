import stylisticPlugin from "@stylistic/eslint-plugin";

import type { Linter } from "eslint";

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

/**
 * The mandatory stylistic standard for JavaScript and TypeScript source:
 * two-space indentation, no tabs, semicolons, double quotes, trailing
 * commas wherever the grammar allows them, spaced brackets, `avoid`-style
 * arrow parens, LF line endings (enforced repository-wide through
 * `.gitattributes`, not through this preset), and an 80-character line
 * limit with exemptions for URLs, string literals, template literals, and
 * regular expressions that cannot be split without changing their value.
 */
export const stylistic: Linter.Config[] = [
  {
    name: "yarapa/stylistic/recommended",
    plugins: { "@stylistic": stylisticPlugin },
    rules: {
      ...customized.rules,
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
];
