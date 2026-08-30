import importXPlugin from "eslint-plugin-import-x";

import type { Linter } from "eslint";

const jsRecommended = importXPlugin.configs["flat/recommended"];
const tsRecommended = importXPlugin.configs["flat/typescript"];

/**
 * Import resolution and dependency-boundary checks. Not independently
 * exported: `docs/POLICY.md` lists import-x as a `recommended`-only
 * universal control. Applies the TypeScript resolver settings to
 * TypeScript files so import-x can resolve `.ts`/`.tsx`/`.cts`/`.mts`
 * specifiers against the nearest TypeScript project.
 */
export const importResolution: Linter.Config[] = [
  {
    name: "yarapa/internal/import-x-recommended",
    plugins: { "import-x": jsRecommended.plugins["import-x"] },
    rules: { ...jsRecommended.rules },
  },
  {
    name: "yarapa/internal/import-x-typescript",
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    settings: { ...tsRecommended.settings },
    rules: { ...tsRecommended.rules },
  },
];
