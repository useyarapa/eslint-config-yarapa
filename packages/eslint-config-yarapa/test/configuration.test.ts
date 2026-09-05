import type { Linter } from "eslint";

import packageJsonPlugin from "eslint-plugin-package-json";
import * as jsoncParser from "jsonc-eslint-parser";
import { describe, expect, it } from "vitest";

import { packageJson } from "../src/configs/package-json.js";
import yarapa from "../src/index.js";
import { required } from "../src/utils/compat.js";

/**
 * Resolve the final configured value for one rule.
 * @param config Flat Config array.
 * @param ruleName Fully qualified rule name.
 * @returns The final rule entry when configured.
 */
function findRule(
  config: Linter.Config[],
  ruleName: string,
): Linter.RuleEntry | undefined {
  let resolved: Linter.RuleEntry | undefined;

  for (const entry of config) {
    const rule = Reflect.get(entry.rules ?? {}, ruleName) as
      Linter.RuleEntry | undefined;

    if (rule !== undefined) {
      resolved = rule;
    }
  }

  return resolved;
}

describe("canonical public configuration", () => {
  it("exports a non-empty Flat Config array", () => {
    expect(Array.isArray(yarapa)).toBe(true);
    expect(yarapa.length).toBeGreaterThan(0);
  });

  it("uses canonical capability names without preset tiers", () => {
    const presetName = ["recom", "mended"].join("");
    const tierNames = yarapa
      .map(config => config.name)
      .filter(name => name?.includes(presetName));

    expect(tierNames).toEqual([]);
  });

  it("owns base, comments, promise, regexp, and unused-imports policies", () => {
    const configNames = yarapa.map(config => config.name).filter(Boolean);

    expect(configNames).toContain("yarapa/base/core");
    expect(configNames).toContain("yarapa/base/modern-js");
    expect(configNames).toContain("yarapa/eslint-comments");
    expect(configNames).toContain("yarapa/promise");
    expect(configNames).toContain("yarapa/regexp");
    expect(configNames).toContain("yarapa/unused-imports");
    expect(configNames).toContain("yarapa/typescript");
    expect(configNames).toContain("yarapa/type-checked");
    expect(configNames).toContain("yarapa/stylistic");
    expect(configNames).toContain("yarapa/unicorn");
    expect(configNames).toContain("yarapa/import-x");
    expect(configNames).toContain("yarapa/sonarjs");
    expect(configNames).toContain("yarapa/perfectionist");
  });

  it("registers @typescript-eslint plugin only in the typescript owner entry", () => {
    const configsWithTsPlugin = yarapa.filter(config =>
      Boolean(
        config.plugins && Reflect.has(config.plugins, "@typescript-eslint"),
      ),
    );

    expect(configsWithTsPlugin).toHaveLength(1);
    expect(configsWithTsPlugin[0]?.name).toBe("yarapa/typescript");
  });

  it("places typescript before type-checked in canonical composition", () => {
    const names = yarapa.map(config => config.name).filter(Boolean);
    const tsIndex = names.indexOf("yarapa/typescript");
    const typeCheckedIndex = names.indexOf("yarapa/type-checked");

    expect(tsIndex).toBeGreaterThanOrEqual(0);
    expect(typeCheckedIndex).toBeGreaterThan(tsIndex);
  });

  it("owns the package manifest rule policy", () => {
    const config = required(packageJson[0], "package manifest config");

    expect(packageJson).toHaveLength(1);
    expect(config.files).toEqual(["**/package.json"]);
    expect(config.languageOptions?.parser).toBe(jsoncParser);
    expect(config.plugins?.["package-json"]).toBe(packageJsonPlugin);
    expect(Object.keys(config.rules ?? {})).toHaveLength(62);
    expect(new Set(Object.values(config.rules ?? {}))).toEqual(
      new Set(["error"]),
    );
  });

  it("owns import-x rule and settings policy", () => {
    const config = yarapa.find(c => c.name === "yarapa/import-x");
    expect(config).toBeDefined();
    expect(config?.rules?.["import-x/no-duplicates"]).toBe("warn");
    expect(config?.settings?.["import-x/resolver"]).toEqual({
      typescript: true,
    });
  });

  it("includes Node runtime and browser globals in unified config", () => {
    const hasNodePlugin = yarapa.some(config =>
      Boolean(config.plugins && Reflect.has(config.plugins, "n")),
    );
    expect(hasNodePlugin).toBe(true);

    const hasBrowserGlobals = yarapa.some(config => {
      const configuredGlobals = config.languageOptions?.globals;

      return configuredGlobals
        ? Reflect.has(configuredGlobals, "window")
        : false;
    });
    expect(hasBrowserGlobals).toBe(true);
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
