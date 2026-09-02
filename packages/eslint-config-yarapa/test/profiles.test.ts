import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";

const PROFILE_NAMES = ["next", "nest", "react"] as const;

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
      | Linter.RuleEntry
      | undefined;

    if (rule !== undefined) resolved = rule;
  }

  return resolved;
}

/**
 * Load one semantic profile from its source entrypoint.
 * @param profileName Semantic profile name.
 * @returns The profile's Flat Config array.
 */
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
  it.each(PROFILE_NAMES)(
    "/%s exports a non-empty Flat Config array",
    async profileName => {
      const profile = await loadProfile(profileName);

      expect(Array.isArray(profile)).toBe(true);
      expect(profile.length).toBeGreaterThan(0);
    },
  );

  it("shares canonical handwriting across all profiles", async () => {
    const profiles = await Promise.all(
      PROFILE_NAMES.map(profileName => loadProfile(profileName)),
    );

    for (const ruleName of [
      "@stylistic/semi",
      "@typescript-eslint/consistent-type-imports",
      "@typescript-eslint/no-floating-promises",
      "import-x/no-duplicates",
    ]) {
      const resolved = profiles.map(profile => findRule(profile, ruleName));
      const [first, ...rest] = resolved;

      expect(first).toBeDefined();
      for (const value of rest) expect(value).toStrictEqual(first);
    }
  });
});
