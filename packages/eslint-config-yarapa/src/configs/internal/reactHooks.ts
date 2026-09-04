import type { Linter } from "eslint";

import reactHooksPlugin from "eslint-plugin-react-hooks";

export const reactHooksRecommended: Linter.Config[] = [
  reactHooksPlugin.configs.flat["recommended-latest"],
];
