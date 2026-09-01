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
  "*": "@eslint/js",
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
} as const;

type EnabledSeverity = "error" | "warn";
type InventoryEntry = {
  configName: string;
  options: unknown[];
  preset: string;
  rule: string;
  severity: EnabledSeverity;
  source: string;
};
type InventoryPresets = Record<
  string,
  Record<string, Record<string, InventoryValue>>
>;
type InventoryValue = readonly [SeverityCode, unknown[]] | SeverityCode;

type SeverityCode = "e" | "w";

/**
 * Append enabled rules from one Flat Config entry to the inventory list.
 * @param target Inventory entries being accumulated.
 * @param preset Public preset name.
 * @param config Flat Config entry to inspect.
 */
function appendEnabledRules(
  target: InventoryEntry[],
  preset: string,
  config: Linter.Config,
): void {
  for (const [rule, value] of Object.entries(config.rules ?? {})) {
    if (value === undefined) continue;

    const severity = normalizeSeverity(value);
    if (severity !== "off") {
      target.push({
        configName: config.name ?? "(anonymous)",
        options: Array.isArray(value) ? value.slice(1) : [],
        preset: preset,
        rule: rule,
        severity: severity,
        source: ruleSource(rule),
      });
    }
  }
}

/**
 * Compare strings by raw code-unit order for deterministic output.
 * @param left Left-hand string.
 * @param right Right-hand string.
 * @returns Negative, positive, or zero ordering result.
 */
function compareCodeUnits(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

/**
 * Normalize an ESLint rule entry to an enabled/off severity.
 * @param value ESLint rule entry to normalize.
 * @returns Normalized severity.
 */
function normalizeSeverity(value: Linter.RuleEntry): "off" | EnabledSeverity {
  const severity = Array.isArray(value) ? value[0] : value;

  if (severity === 0 || severity === "off") return "off";
  if (severity === 1 || severity === "warn") return "warn";
  if (severity === 2 || severity === "error") return "error";

  throw new Error(`Unsupported ESLint severity: ${String(severity)}`);
}

/**
 * Resolve the package source that owns a rule name.
 * @param rule Rule identifier.
 * @returns Package name recorded in the inventory.
 */
function ruleSource(rule: string): string {
  for (const [prefix, source] of Object.entries(sourcePrefixes)) {
    if (prefix !== "*" && rule.startsWith(prefix)) return source;
  }

  return sourcePrefixes["*"];
}

/**
 * Encode an enabled severity for the compact inventory format.
 * @param severity Enabled severity.
 * @returns Compact severity code.
 */
function severityCode(severity: EnabledSeverity): SeverityCode {
  return severity === "error" ? "e" : "w";
}

const entries: InventoryEntry[] = [];
for (const [preset, configArray] of Object.entries(configs)) {
  for (const config of configArray) {
    appendEnabledRules(entries, preset, config);
  }
}

entries.sort(
  (left, right) =>
    compareCodeUnits(left.preset, right.preset)
    || compareCodeUnits(left.configName, right.configName)
    || compareCodeUnits(left.rule, right.rule),
);

const presets = Object.fromEntries(
  Object.keys(configs).map(preset => [preset, {}]),
) as InventoryPresets;
for (const entry of entries) {
  const preset = (presets[entry.preset] ??= {});
  const config = (preset[entry.configName] ??= {});

  if (config[entry.rule] !== undefined) {
    throw new Error(
      `Duplicate Rule Inventory entry: ${entry.preset} / ${entry.configName} / ${entry.rule}`,
    );
  }

  const code = severityCode(entry.severity);
  config[entry.rule]
    = entry.options.length === 0 ? code : [code, entry.options];
}

const output = `${JSON.stringify({
  package: packageJson.name,
  packageVersion: packageJson.version,
  presets: presets,
  schemaVersion: 3,
  severityCodes: { e: "error", w: "warn" },
  sourcePrefixes: sourcePrefixes,
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
