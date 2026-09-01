import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));

type Inventory = {
  package: string;
  packageVersion: string;
  presets: Record<string, Record<string, Record<string, InventoryValue>>>;
  schemaVersion: number;
  severityCodes: Record<SeverityCode, string>;
  sourcePrefixes: Record<string, string>;
};
type InventoryValue = [SeverityCode, unknown[]] | SeverityCode;
type SeverityCode = "e" | "w";

const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, "package.json"), "utf8"),
) as { name: string; version: string };
const inventory = JSON.parse(
  readFileSync(resolve(packageRoot, "generated/rule-inventory.json"), "utf8"),
) as Inventory;

/**
 * Read the compact severity from an inventory value.
 * @param value Inventory rule value.
 * @returns Compact severity code.
 */
function severity(value: InventoryValue): SeverityCode {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Return a deterministically sorted copy of string values.
 * @param values Values to sort.
 * @returns Sorted copy.
 */
function sorted(values: string[]): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

describe("Rule Inventory", () => {
  it("matches the package identity and schema contract", () => {
    expect(inventory.package).toBe(packageJson.name);
    expect(inventory.packageVersion).toBe(packageJson.version);
    expect(inventory.schemaVersion).toBe(3);
    expect(inventory.severityCodes).toStrictEqual({ e: "error", w: "warn" });
  });

  it("covers exactly the public preset names", () => {
    expect(sorted(Object.keys(inventory.presets))).toStrictEqual(
      sorted(Object.keys(configs)),
    );
  });

  it("stores deterministic enabled controls only", () => {
    const presetEntries = Object.entries(inventory.presets);
    const configEntries = presetEntries.flatMap(([presetName, preset]) =>
      Object.entries(preset).map(([configName, rules]) => ({
        configName,
        presetName,
        rules,
      })),
    );
    const ruleEntries = configEntries.flatMap(
      ({ configName, presetName, rules }) =>
        Object.entries(rules).map(([ruleName, value]) => ({
          configName,
          presetName,
          ruleName,
          value,
        })),
    );

    const unsortedPresets = presetEntries
      .filter(([, preset]) =>
        Object.keys(preset).join("\0") !== sorted(Object.keys(preset)).join("\0"),
      )
      .map(([presetName]) => presetName);
    const unsortedConfigs = configEntries
      .filter(({ rules }) =>
        Object.keys(rules).join("\0") !== sorted(Object.keys(rules)).join("\0"),
      )
      .map(({ configName, presetName }) => `${presetName}/${configName}`);
    const invalidSeverities = ruleEntries
      .filter(({ value }) => !["e", "w"].includes(severity(value)))
      .map(({ configName, presetName, ruleName }) =>
        `${presetName}/${configName}/${ruleName}`,
      );
    const invalidOptionShapes = ruleEntries
      .filter(({ value }) =>
        Array.isArray(value)
        && (value.length !== 2 || !Array.isArray(value[1])),
      )
      .map(({ configName, presetName, ruleName }) =>
        `${presetName}/${configName}/${ruleName}`,
      );

    expect(unsortedPresets).toStrictEqual([]);
    expect(unsortedConfigs).toStrictEqual([]);
    expect(invalidSeverities).toStrictEqual([]);
    expect(invalidOptionShapes).toStrictEqual([]);
  });

  it("maps every plugin rule to a declared inventory source prefix", () => {
    const prefixes = Object.keys(inventory.sourcePrefixes).filter(
      prefix => prefix !== "*",
    );
    const ruleNames = Object.values(inventory.presets)
      .flatMap(preset => Object.values(preset))
      .flatMap(rules => Object.keys(rules));
    const missingPrefixes = ruleNames.filter(
      ruleName =>
        ruleName.includes("/")
        && !prefixes.some(prefix => ruleName.startsWith(prefix)),
    );

    expect(missingPrefixes).toStrictEqual([]);
  });
});
