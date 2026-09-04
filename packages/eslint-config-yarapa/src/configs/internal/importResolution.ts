import type { Linter } from "eslint";

import { configs as importXConfigs } from "eslint-plugin-import-x";

export const importResolution: Linter.Config[] = [
  importXConfigs["flat/recommended"],
  importXConfigs["flat/typescript"],
];
