import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));

type SeverityCode = "e" | "w";
type InventoryValue = SeverityCode | [SeverityCode, unknown[]];
type Inventory = {
  package: string;
  packageVersion: string;
  presets: Record<string, Record<string, Record<string, InventoryValue>>>;
  schemaVersion: number;
  severityCodes: Record<SeverityCode, string>;
  sourcePrefixes: Record<string, string>;
};

const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, "package.json"), "utf8"),
) as { name: string; version: string };
const inventory = JSON.parse(
  readFileSync(resolve(packageRoot, "generated/rule-inventory.json"), "utf8"),
) as Inventory;

function sorted(values: string[]): string[] {
  return [...values].sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
}

function severity(value: InventoryValue): SeverityCode {
  return Array.isArray(value) ? value[0] : value;
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
    for (const [presetName, preset] of Object.entries(inventory.presets)) {
      expect(Object.keys(preset)).toStrictEqual(sorted(Object.keys(preset)));

      for (const [configName, rules] of Object.entries(preset)) {
        expect(Object.keys(rules)).toStrictEqual(sorted(Object.keys(rules)));

        for (const [ruleName, value] of Object.entries(rules)) {
          expect(["e", "w"], `${presetName}/${configName}/${ruleName}`).toContain(
            severity(value),
          );

          if (Array.isArray(value)) {
            expect(value).toHaveLength(2);
            expect(Array.isArray(value[1])).toBe(true);
          }
        }
      }
    }
  });

  it("maps every plugin rule to a declared inventory source prefix", () => {
    const prefixes = Object.keys(inventory.sourcePrefixes).filter(
      prefix => prefix !== "*",
    );

    for (const preset of Object.values(inventory.presets)) {
      for (const rules of Object.values(preset)) {
        for (const ruleName of Object.keys(rules)) {
          if (!ruleName.includes("/")) continue;
          expect(
            prefixes.some(prefix => ruleName.startsWith(prefix)),
            `Missing source prefix for ${ruleName}`,
          ).toBe(true);
        }
      }
    }
  });
});
