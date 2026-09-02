import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Resolve the final configured value for one rule across a config array.
 * @param config Flat Config array.
 * @param ruleName Rule name to resolve.
 * @returns The final configured rule entry.
 */
function findRule(
  config: Linter.Config[],
  ruleName: string,
): Linter.RuleEntry | undefined {
  let resolved: Linter.RuleEntry | undefined;

  for (const entry of config) {
    const rule = Reflect.get(entry.rules ?? {}, ruleName) as
      | Linter.RuleEntry
      | undefined;

    if (rule !== undefined) resolved = rule;
  }

  return resolved;
}

afterEach(() => {
  vi.doUnmock("@eslint/js");
  vi.resetModules();
});

describe("static rule policy", () => {
  it("does not inherit newly exported upstream rules implicitly", async () => {
    vi.resetModules();
    vi.doMock("@eslint/js", async importOriginal => {
      const original = await importOriginal<typeof import("@eslint/js")>();
      const recommended = original.default.configs.recommended;

      return {
        default: {
          ...original.default,
          configs: {
            ...original.default.configs,
            recommended: {
              ...recommended,
              rules: {
                ...recommended.rules,
                "no-alert": "error",
              },
            },
          },
        },
      };
    });

    const { base } = await import("../src/configs/base.js");

    expect(findRule(base, "no-alert")).toBeUndefined();
  });
});
