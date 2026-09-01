import type { Linter } from "eslint";

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const outputPath = resolve(packageRoot, "generated/rule-inventory.json");
const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, "package.json"), "utf8"),
) as { name: string; version: string };
const builtEntryUrl = new URL("../dist/index.mjs", import.meta.url).href;
const { configs } = (await import(builtEntryUrl)) as {
  configs: Record<string, Linter.Config[]>;
};

const sources: ReadonlyArray<readonly [string, string]> = [
  [
    "@eslint-community/eslint-comments/",
    "@eslint-community/eslint-plugin-eslint-comments",
  ],
  ["@stylistic/", "@stylistic/eslint-plugin"],
  ["@typescript-eslint/", "typescript-eslint"],
  ["ava/", "eslint-plugin-ava"],
  ["import-x/", "eslint-plugin-import-x"],
  ["jsdoc/", "eslint-plugin-jsdoc"],
  ["jsonc/", "eslint-plugin-jsonc"],
  ["n/", "eslint-plugin-n"],
  ["package-json/", "eslint-plugin-package-json"],
  ["perfectionist/", "eslint-plugin-perfectionist"],
  ["promise/", "eslint-plugin-promise"],
  ["regexp/", "eslint-plugin-regexp"],
  ["security/", "eslint-plugin-security"],
  ["sonarjs/", "eslint-plugin-sonarjs"],
  ["testing-library/", "eslint-plugin-testing-library"],
  ["unused-imports/", "eslint-plugin-unused-imports"],
  ["vitest/", "@vitest/eslint-plugin"],
];

type NormalizedSeverity = "error" | "off" | "warn";

type InventoryEntry = {
  configName: string;
  options: unknown[];
  preset: string;
  rule: string;
  severity: NormalizedSeverity;
  source: string;
};

function normalizeSeverity(value: Linter.RuleEntry): NormalizedSeverity {
  const severity = Array.isArray(value) ? value[0] : value;

  if (severity === 0 || severity === "off") return "off";
  if (severity === 1 || severity === "warn") return "warn";
  if (severity === 2 || severity === "error") return "error";

  throw new Error(`Unsupported ESLint severity: ${String(severity)}`);
}

function ruleSource(rule: string): string {
  for (const [prefix, source] of sources) {
    if (rule.startsWith(prefix)) return source;
  }

  return "@eslint/js";
}

const entries: InventoryEntry[] = [];
for (const [preset, configArray] of Object.entries(configs)) {
  for (const config of configArray) {
    for (const [rule, value] of Object.entries(config.rules ?? {})) {
      if (value === undefined) continue;

      entries.push({
        configName: config.name ?? "(anonymous)",
        options: Array.isArray(value) ? value.slice(1) : [],
        preset,
        rule,
        severity: normalizeSeverity(value),
        source: ruleSource(rule),
      });
    }
  }
}

entries.sort(
  (left, right) =>
    left.preset.localeCompare(right.preset) ||
    left.configName.localeCompare(right.configName) ||
    left.rule.localeCompare(right.rule),
);

const output = `${JSON.stringify(
  {
    entries,
    package: packageJson.name,
    packageVersion: packageJson.version,
    schemaVersion: 1,
  },
  null,
  2,
)}\n`;

if (process.argv.includes("--check")) {
  const current = readFileSync(outputPath, "utf8");
  if (current !== output) {
    console.error(
      "Rule Inventory drift detected. Run `pnpm inventory:generate` and review the diff.",
    );
    process.exitCode = 1;
  }
} else {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, output, "utf8");
  console.log(outputPath);
}
