import type { Linter } from "eslint";

import sonarjsPlugin from "eslint-plugin-sonarjs";
import { describe, expect, it } from "vitest";

import { vitestFileGlobs } from "../src/configs/vitest.js";
import { configs } from "../src/index.js";

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

describe("configs", () => {
  it("exposes exactly the sixteen required preset names", () => {
    expect(
      Object.keys(configs).sort((left, right) => left.localeCompare(right)),
    ).toStrictEqual(
      [...REQUIRED_PRESET_NAMES].sort((left, right) =>
        left.localeCompare(right),
      ),
    );
  });

  it.each(REQUIRED_PRESET_NAMES)(
    "configs.%s is a non-empty Flat Config array",
    presetName => {
      const preset = Reflect.get(configs, presetName);

      expect(Array.isArray(preset)).toBe(true);
      expect(preset.length).toBeGreaterThan(0);
    },
  );

  it("every config entry in every preset is a plain object", () => {
    for (const presetName of REQUIRED_PRESET_NAMES) {
      const preset = Reflect.get(configs, presetName);
      for (const entry of preset) {
        expect(typeof entry).toBe("object");
        expect(entry).not.toBeNull();
      }
    }
  });

  it("testingLibrary scopes its DOM rules to the canonical test-file globs", () => {
    const domEntry = configs.testingLibrary.find(
      entry => entry.name === "yarapa/testing-library/dom",
    );

    expect(domEntry).toBeDefined();
    expect(domEntry?.files).toStrictEqual(vitestFileGlobs);
  });

  it("ava preserves the upstream package.json no-ava-in-dependencies entry", () => {
    const packageJsonEntry = configs.ava.find(
      entry => entry.name === "yarapa/ava/no-ava-in-dependencies",
    );

    expect(packageJsonEntry).toBeDefined();
    expect(packageJsonEntry?.rules).toHaveProperty(
      "ava/no-ava-in-dependencies",
    );
  });

  it("enables every generally applicable SonarJS rule as an error", () => {
    const sonarEntry = configs.recommended.find(
      entry => entry.name === "yarapa/internal/sonarjs-all-rules",
    );

    expect(sonarEntry).toBeDefined();
    expect(sonarEntry?.rules).not.toHaveProperty("sonarjs/file-header");

    for (const ruleName of Object.keys(sonarjsPlugin.rules)) {
      if (ruleName === "file-header") continue;
      const severity = Reflect.get(
        sonarEntry?.rules ?? {},
        `sonarjs/${ruleName}`,
      ) as Linter.RuleEntry | undefined;
      expect(severity).toBe("error");
    }
  });

  it("recommended does not compose the repo-scoped stack presets", () => {
    const recommendedConfigNames = configs.recommended
      .map(entry => entry.name)
      .filter((name): name is string => typeof name === "string");

    const excludedPrefixes = [
      "yarapa/node",
      "yarapa/browser",
      "yarapa/vitest",
      "yarapa/ava",
      "yarapa/ignores",
    ];

    for (const name of recommendedConfigNames) {
      for (const prefix of excludedPrefixes) {
        expect(name.startsWith(prefix)).toBe(false);
      }
    }
  });
});
