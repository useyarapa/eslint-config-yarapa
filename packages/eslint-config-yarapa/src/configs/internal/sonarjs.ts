import type { Linter } from "eslint";

import sonarjsPlugin from "eslint-plugin-sonarjs";

const PROJECT_SPECIFIC_RULES = new Set(["file-header"]);

/**
 * SonarJS high-assurance coverage. Not independently exported. Every
 * generally applicable rule present in the exact-pinned `sonarjs.rules`
 * export is enabled as an error, including rules omitted from SonarJS
 * recommended, type-aware rules, overlapping rules, rules with known
 * false-positive potential, and deprecated rules that remain in the pinned
 * release.
 *
 * Rules whose correctness depends on consumer-owned project metadata are not
 * universal controls. `file-header` requires a repository-specific copyright
 * or license header value, which a public shared config cannot infer safely,
 * so it is the single package-level exception and must be configured by the
 * consuming repository when such a header policy exists.
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
      Object.keys(sonarjsPlugin.rules)
        .filter(ruleName => !PROJECT_SPECIFIC_RULES.has(ruleName))
        .map(ruleName => [`sonarjs/${ruleName}`, "error"]),
    ),
  },
];
