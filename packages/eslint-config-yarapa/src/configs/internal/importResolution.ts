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

/**
 * Import resolution and dependency-boundary checks. Not independently
 * exported: `docs/POLICY.md` lists import-x as a `recommended`-only
 * universal control. Applies the TypeScript resolver settings to
 * TypeScript files so import-x can resolve `.ts`/`.tsx`/`.cts`/`.mts`
 * specifiers against the nearest TypeScript project (backed by the
 * `eslint-import-resolver-typescript` direct dependency, activated via
 * `settings["import-x/resolver"]` below, exactly as the upstream
 * `flat/typescript` preset configures it).
 *
 * Per the mandatory plugin policy, every recommended warning is promoted
 * to error so a repository without `--max-warnings=0` cannot pass CI
 * while violating the Banking Baseline.
 */
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
