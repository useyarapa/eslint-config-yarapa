import type { Linter } from "eslint";

import sonarjsPlugin from "eslint-plugin-sonarjs";

/**
 * SonarJS all-rules coverage. Not independently exported: `docs/POLICY.md`
 * lists SonarJS as a `recommended`-only universal control, deliberately
 * stricter than SonarJS's own upstream recommended preset. Every rule
 * present in the exact-pinned `sonarjs.rules` export is enabled as an
 * error, without deduplication or package-level exceptions - including
 * rules omitted from SonarJS recommended, type-aware rules, rules that
 * overlap other plugins, rules with known false-positive potential, and
 * deprecated rules that remain present in the pinned plugin release.
 */
export const sonarjsAllRules: Linter.Config[] = [
  {
    // SonarJS's rule implementations assume a JS/TS-shaped AST (e.g. they
    // call `getAncestors()`, which the JSONC source code representation
    // does not implement) and crash the linter when applied to JSON,
    // JSONC, or JSON5 files. Scope explicitly to JavaScript/TypeScript so
    // `recommended` can compose this with `json`/`packageJson` safely.
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
    name: "yarapa/internal/sonarjs-all-rules",
    plugins: { sonarjs: sonarjsPlugin },
    rules: Object.fromEntries(
      Object.keys(sonarjsPlugin.rules).map((ruleName) => [
        `sonarjs/${ruleName}`,
        "error",
      ]),
    ),
  },
];
