import type { Linter } from "eslint";

import js from "@eslint/js";
import { configs as importXConfigs } from "eslint-plugin-import-x";
import { configs as sonarjsConfigs } from "eslint-plugin-sonarjs";
import { describe, expect, it } from "vitest";

import yarapa from "../src/index.js";

/**
 * Resolve the final configured value for one rule in a profile.
 * @param profile Flat Config array.
 * @param ruleName Fully qualified rule name.
 * @returns The final rule entry when configured.
 */
function findRule(
  profile: Linter.Config[],
  ruleName: string,
): Linter.RuleEntry | undefined {
  let resolved: Linter.RuleEntry | undefined;

  for (const config of profile) {
    const rule = Reflect.get(config.rules ?? {}, ruleName) as
      Linter.RuleEntry | undefined;

    if (rule !== undefined) {
      resolved = rule;
    }
  }

  return resolved;
}

const officialConfigs = {
  eslint: js.configs.recommended,
  importRecommended: importXConfigs["flat/recommended"],
  importTypeScript: importXConfigs["flat/typescript"],
  sonarjs: sonarjsConfigs.recommended,
} as const;

describe("unified public configuration", () => {
  it("exports a non-empty Flat Config array", () => {
    expect(Array.isArray(yarapa)).toBe(true);
    expect(yarapa.length).toBeGreaterThan(0);
  });

  it("preserves official upstream config ownership", () => {
    for (const expectedConfig of Object.values(officialConfigs)) {
      expect(yarapa).toContain(expectedConfig);
    }
  });

  it("includes Node runtime and browser globals in unified config", () => {
    const hasNodePlugin = yarapa.some(config =>
      Boolean(config.plugins && Reflect.has(config.plugins, "n")),
    );
    expect(hasNodePlugin).toBe(true);

    const hasBrowserGlobals = yarapa.some(config =>
      Boolean(
        config.languageOptions?.globals
        && Reflect.has(config.languageOptions.globals, "window"),
      ),
    );
    expect(hasBrowserGlobals).toBe(true);
  });

  it("includes scoped React capabilities in unified config", () => {
    const reactRuntimeConfig = yarapa.find(
      config => config.name === "yarapa/react/runtime",
    );
    expect(reactRuntimeConfig).toBeDefined();
    expect(reactRuntimeConfig?.files).toEqual(["**/*.jsx", "**/*.tsx"]);
    expect(
      Reflect.get(
        reactRuntimeConfig?.rules ?? {},
        "react-hooks/rules-of-hooks",
      ),
    ).toBe("error");

    const reactNamingConfig = yarapa.find(
      config => config.name === "yarapa/react/component-naming",
    );
    expect(reactNamingConfig).toBeDefined();
    expect(reactNamingConfig?.files).toEqual(["**/*.jsx", "**/*.tsx"]);
  });

  it("preserves the official import-x warning severity", () => {
    expect(
      officialConfigs.importRecommended.rules?.["import-x/no-duplicates"],
    ).toBe("warn");
  });

  it("shares canonical handwriting across configuration", () => {
    for (const ruleName of [
      "@stylistic/semi",
      "@typescript-eslint/consistent-type-imports",
      "@typescript-eslint/default-param-last",
      "@typescript-eslint/dot-notation",
      "@typescript-eslint/no-array-constructor",
      "@typescript-eslint/no-floating-promises",
      "arrow-body-style",
      "curly",
      "eqeqeq",
      "import-x/no-duplicates",
      "no-object-constructor",
      "no-restricted-imports",
      "no-var",
      "object-shorthand",
      "prefer-const",
      "prefer-object-has-own",
      "prefer-object-spread",
      "prefer-rest-params",
      "prefer-spread",
      "prefer-template",
      "radix",
    ]) {
      const resolved = findRule(yarapa, ruleName);
      expect(resolved).toBeDefined();
    }
  });

  it("keeps modern JavaScript concerns on canonical owners", () => {
    expect(findRule(yarapa, "sonarjs/arguments-usage")).toBe("off");
    expect(findRule(yarapa, "sonarjs/array-constructor")).toBe("off");
    expect(findRule(yarapa, "sonarjs/arrow-function-convention")).toBe("off");
    expect(findRule(yarapa, "sonarjs/prefer-default-last")).toBe("off");
  });
});
