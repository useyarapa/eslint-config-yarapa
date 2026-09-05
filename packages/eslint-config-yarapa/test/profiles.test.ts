import type { Linter } from "eslint";

import js from "@eslint/js";
import { configs as importXConfigs } from "eslint-plugin-import-x";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { configs as sonarjsConfigs } from "eslint-plugin-sonarjs";
import { describe, expect, it } from "vitest";

import yarapa from "../src/index.js";
import nest from "../src/nest.js";
import react from "../src/react.js";

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
  reactHooks: reactHooksPlugin.configs.flat["recommended-latest"],
  sonarjs: sonarjsConfigs.recommended,
} as const;

const profileEntries: ReadonlyArray<{
  expectedConfigs: ReadonlyArray<Linter.Config>;
  name: string;
  profile: Linter.Config[];
}> = [
  {
    expectedConfigs: [
      officialConfigs.eslint,
      officialConfigs.sonarjs,
      officialConfigs.importRecommended,
      officialConfigs.importTypeScript,
    ],
    name: "default",
    profile: yarapa,
  },
  {
    expectedConfigs: [
      officialConfigs.eslint,
      officialConfigs.sonarjs,
      officialConfigs.importRecommended,
      officialConfigs.importTypeScript,
    ],
    name: "nest",
    profile: nest,
  },
  {
    expectedConfigs: [
      officialConfigs.eslint,
      officialConfigs.sonarjs,
      officialConfigs.reactHooks,
      officialConfigs.importRecommended,
      officialConfigs.importTypeScript,
    ],
    name: "react",
    profile: react,
  },
];

const profiles = profileEntries.map(({ profile }) => profile);

describe("semantic profiles", () => {
  it.each(profileEntries)(
    "$name exports a non-empty Flat Config array",
    ({ profile }) => {
      expect(Array.isArray(profile)).toBe(true);
      expect(profile.length).toBeGreaterThan(0);
    },
  );

  it.each(profileEntries)(
    "$name preserves official upstream config ownership",
    ({ expectedConfigs, profile }) => {
      for (const expectedConfig of expectedConfigs) {
        expect(profile).toContain(expectedConfig);
      }
    },
  );

  it("preserves the official import-x warning severity", () => {
    expect(
      officialConfigs.importRecommended.rules?.["import-x/no-duplicates"],
    ).toBe("warn");
  });

  it("shares canonical handwriting across all profiles", () => {
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
      const resolved = profiles.map(profile => findRule(profile, ruleName));
      const [first, ...rest] = resolved;

      expect(first).toBeDefined();
      for (const value of rest) {
        expect(value).toStrictEqual(first);
      }
    }
  });

  it("keeps modern JavaScript concerns on canonical owners", () => {
    for (const profile of profiles) {
      expect(findRule(profile, "sonarjs/arguments-usage")).toBe("off");
      expect(findRule(profile, "sonarjs/array-constructor")).toBe("off");
      expect(findRule(profile, "sonarjs/arrow-function-convention")).toBe(
        "off",
      );
      expect(findRule(profile, "sonarjs/prefer-default-last")).toBe("off");
    }
  });
});
