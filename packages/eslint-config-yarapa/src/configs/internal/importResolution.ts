import type { Linter } from "eslint";

import { configs as importXConfigs } from "eslint-plugin-import-x";

import { required } from "./required.js";

const jsRecommended = required(
  importXConfigs["flat/recommended"],
  "eslint-plugin-import-x.configs.flat/recommended",
);
const tsRecommended = required(
  importXConfigs["flat/typescript"],
  "eslint-plugin-import-x.configs.flat/typescript",
);
const importXRecommendedPlugin = required(
  jsRecommended.plugins?.["import-x"],
  "eslint-plugin-import-x.configs.flat/recommended.plugins.import-x",
);
const jsRecommendedRules = required(
  jsRecommended.rules,
  "eslint-plugin-import-x.configs.flat/recommended.rules",
);

export const importResolution: Linter.Config[] = [
  {
    name: "yarapa/internal/import-x-recommended",
    plugins: { "import-x": importXRecommendedPlugin },
    rules: Object.fromEntries(
      Object.entries(jsRecommendedRules).map(([rule, severity]) => [
        rule,
        severity === "warn" ? "error" : severity,
      ]),
    ),
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    name: "yarapa/internal/import-x-typescript",
    rules: { ...tsRecommended.rules },
    settings: { ...tsRecommended.settings },
  },
];
