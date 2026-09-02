import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";

const PROFILE_NAMES = ["next", "nest", "react"] as const;

async function loadProfile(
  profileName: (typeof PROFILE_NAMES)[number],
): Promise<Linter.Config[]> {
  const moduleUrl = new URL(`../src/${profileName}.js`, import.meta.url);
  const profileModule = await import(moduleUrl.href) as {
    default: Linter.Config[];
  };

  return profileModule.default;
}

describe("semantic profiles", () => {
  it.each(PROFILE_NAMES)("/%s exports a non-empty Flat Config array", async profileName => {
    const profile = await loadProfile(profileName);

    expect(Array.isArray(profile)).toBe(true);
    expect(profile.length).toBeGreaterThan(0);
  });

  it("shares canonical handwriting across all profiles", async () => {
    const [next, nest, react] = await Promise.all(
      PROFILE_NAMES.map(profileName => loadProfile(profileName)),
    );

    for (const ruleName of [
      "@stylistic/semi",
      "@typescript-eslint/consistent-type-imports",
      "@typescript-eslint/no-floating-promises",
      "import-x/no-duplicates",
    ]) {
      const resolved = [next, nest, react].map(profile =>
        profile
          .filter(config => config.rules?.[ruleName] !== undefined)
          .at(-1)?.rules?.[ruleName],
      );

      expect(resolved[0]).toBeDefined();
      expect(resolved[1]).toStrictEqual(resolved[0]);
      expect(resolved[2]).toStrictEqual(resolved[0]);
    }
  });
});
