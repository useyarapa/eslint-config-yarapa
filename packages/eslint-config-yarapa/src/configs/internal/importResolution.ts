import type { Linter } from "eslint";

import importXPlugin from "eslint-plugin-import-x";

const jsRecommended = importXPlugin.configs["flat/recommended"];
const tsRecommended = importXPlugin.configs["flat/typescript"];

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
    plugins: { "import-x": jsRecommended.plugins["import-x"] },
    rules: Object.fromEntries(
      Object.entries(jsRecommended.rules).map(([rule, severity]) => [
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
