import { describe, expect, it } from "vitest";

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
    expect(Object.keys(configs).sort()).toStrictEqual(
      [...REQUIRED_PRESET_NAMES].sort(),
    );
  });

  it.each(REQUIRED_PRESET_NAMES)(
    "configs.%s is a non-empty Flat Config array",
    (presetName) => {
      const preset = configs[presetName];

      expect(Array.isArray(preset)).toBe(true);
      expect(preset.length).toBeGreaterThan(0);
    },
  );

  it("every config entry in every preset is a plain object", () => {
    for (const presetName of REQUIRED_PRESET_NAMES) {
      for (const entry of configs[presetName]) {
        expect(typeof entry).toBe("object");
        expect(entry).not.toBeNull();
      }
    }
  });

  it("recommended does not compose the repo-scoped stack presets", () => {
    const recommendedConfigNames = configs.recommended
      .map((entry) => entry.name)
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
