import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const repoRoot = resolve(packageRoot, "../..");
const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, "package.json"), "utf8"),
) as { scripts?: Record<string, string> };

const REQUIRED_PRESET_NAMES = [
  "recommended",
  "base",
  "typescript",
  "typeChecked",
  "disableTypeChecked",
  "node",
  "browser",
  "stylistic",
  "ignores",
  "security",
  "testingLibrary",
  "vitest",
  "ava",
  "json",
  "packageJson",
  "jsdoc",
] as const;

describe("release gate structure", () => {
  it.each([
    "generated/rule-inventory.json",
    "scripts/generate-rule-inventory.mts",
    "scripts/verify-tarball.mts",
  ])("includes %s", relativePath => {
    expect(existsSync(resolve(packageRoot, relativePath))).toBe(true);
  });

  it.each(["inventory:check", "test:consumer", "verify"])(
    "exposes the %s package script",
    scriptName => {
      expect(packageJson.scripts).toHaveProperty(scriptName);
    },
  );

  it("has a repository Flat Config for self-linting", () => {
    const candidates = [
      "eslint.config.mjs",
      "eslint.config.js",
      "eslint.config.ts",
    ];

    expect(candidates.some(file => existsSync(resolve(repoRoot, file)))).toBe(
      true,
    );
  });

  it.each(REQUIRED_PRESET_NAMES)(
    "has valid and invalid fixture boundaries for %s",
    presetName => {
      expect(existsSync(resolve(packageRoot, "fixtures/valid", presetName))).toBe(
        true,
      );
      expect(
        existsSync(resolve(packageRoot, "fixtures/invalid", presetName)),
      ).toBe(true);
    },
  );
});
