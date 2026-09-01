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

const sourcePrefixes = {
  "@eslint-community/eslint-comments/":
    "@eslint-community/eslint-plugin-eslint-comments",
  "@stylistic/": "@stylistic/eslint-plugin",
  "@typescript-eslint/": "typescript-eslint",
  "ava/": "eslint-plugin-ava",
  "import-x/": "eslint-plugin-import-x",
  "jsdoc/": "eslint-plugin-jsdoc",
  "jsonc/": "eslint-plugin-jsonc",
  "n/": "eslint-plugin-n",
  "package-json/": "eslint-plugin-package-json",
  "perfectionist/": "eslint-plugin-perfectionist",
  "promise/": "eslint-plugin-promise",
  "regexp/": "eslint-plugin-regexp",
  "security/": "eslint-plugin-security",
  "sonarjs/": "eslint-plugin-sonarjs",
  "testing-library/": "eslint-plugin-testing-library",
  "unused-imports/": "eslint-plugin-unused-imports",
  "vitest/": "@vitest/eslint-plugin",
  "*": "@eslint/js",
} as const;

type EnabledSeverity = "error" | "warn";
type SeverityCode = "e" | "w";
type InventoryValue = SeverityCode | readonly [SeverityCode, unknown[]];
type InventoryPresets = Record<
  string,
  Record<string, Record<string, InventoryValue>>
>;

function normalizeSeverity(value: Linter.RuleEntry): "off" | EnabledSeverity {
  const severity = Array.isArray(value) ? value[0] : value;

  if (severity === 0 || severity === "off") return "off";
  if (severity === 1 || severity === "warn") return "warn";
  if (severity === 2 || severity === "error") return "error";

  throw new Error(`Unsupported ESLint severity: ${String(severity)}`);
}

function severityCode(severity: EnabledSeverity): SeverityCode {
  return severity === "error" ? "e" : "w";
}

function ruleSource(rule: string): string {
  for (const [prefix, source] of Object.entries(sourcePrefixes)) {
    if (prefix !== "*" && rule.startsWith(prefix)) return source;
  }

  return sourcePrefixes["*"];
}

function compareCodeUnits(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

const entries: Array<{
  configName: string;
  options: unknown[];
  preset: string;
  rule: string;
  severity: EnabledSeverity;
  source: string;
}> = [];

for (const [preset, configArray] of Object.entries(configs)) {
  for (const config of configArray) {
    for (const [rule, value] of Object.entries(config.rules ?? {})) {
      if (value === undefined) continue;

      const severity = normalizeSeverity(value);
      if (severity === "off") continue;

      entries.push({
        configName: config.name ?? "(anonymous)",
        options: Array.isArray(value) ? value.slice(1) : [],
        preset,
        rule,
        severity,
        source: ruleSource(rule),
      });
    }
  }
}

entries.sort(
  (left, right) =>
    compareCodeUnits(left.preset, right.preset) ||
    compareCodeUnits(left.configName, right.configName) ||
    compareCodeUnits(left.rule, right.rule),
);

const presets: InventoryPresets = {};
for (const entry of entries) {
  const preset = (presets[entry.preset] ??= {});
  const config = (preset[entry.configName] ??= {});

  if (config[entry.rule] !== undefined) {
    throw new Error(
      `Duplicate Rule Inventory entry: ${entry.preset} / ${entry.configName} / ${entry.rule}`,
    );
  }

  const code = severityCode(entry.severity);
  config[entry.rule] =
    entry.options.length === 0 ? code : [code, entry.options];
}

const output = `${JSON.stringify({
  package: packageJson.name,
  packageVersion: packageJson.version,
  presets,
  schemaVersion: 3,
  severityCodes: { e: "error", w: "warn" },
  sourcePrefixes,
})}\n`;

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
