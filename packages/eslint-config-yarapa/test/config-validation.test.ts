import { ESLint } from "eslint";
import { defineConfig } from "eslint/config";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";
import { eslintFor, packageRoot } from "./helpers/eslint.js";

type PresetName = keyof typeof configs;

const representativeFiles: Record<
  Exclude<PresetName, "disableTypeChecked" | "ignores">,
  string
> = {
  ava: "fixtures/valid/ava/case.test.js",
  base: "fixtures/valid/base/case.js",
  browser: "fixtures/valid/browser/case.js",
  jsdoc: "fixtures/valid/jsdoc/case.js",
  json: "fixtures/valid/json/case.json",
  node: "fixtures/valid/node/case.js",
  packageJson: "fixtures/valid/packageJson/package.json",
  recommended: "fixtures/valid/recommended/case.js",
  security: "fixtures/valid/security/case.js",
  stylistic: "fixtures/valid/stylistic/case.js",
  testingLibrary: "fixtures/valid/testingLibrary/case.test.js",
  typeChecked: "fixtures/projects/typed/src/valid.ts",
  typescript: "fixtures/valid/typescript/case.ts",
  vitest: "fixtures/valid/vitest/case.test.js",
};

describe("Flat Config validation", () => {
  for (const [preset, relativePath] of Object.entries(
    representativeFiles,
  ) as [PresetName, string][]) {
    it(`resolves configs.${preset} with ESLint itself`, async () => {
      await expect(
        eslintFor(preset).calculateConfigForFile(
          resolve(packageRoot, relativePath),
        ),
      ).resolves.toBeDefined();
    });
  }

  it("resolves disableTypeChecked as a scoped override", async () => {
    const relativePath = "fixtures/projects/tooling-out-of-project/valid.ts";
    const eslint = new ESLint({
      cwd: packageRoot,
      overrideConfig: defineConfig(
        configs.recommended,
        {
          extends: [configs.disableTypeChecked],
          files: ["fixtures/projects/tooling-out-of-project/**/*.ts"],
        },
      ),
      overrideConfigFile: true,
    });
    await expect(
      eslint.calculateConfigForFile(resolve(packageRoot, relativePath)),
    ).resolves.toBeDefined();
  });

  it("validates the ignores preset through ESLint path matching", async () => {
    await expect(
      eslintFor("ignores").isPathIgnored(resolve(packageRoot, "dist/generated.js")),
    ).resolves.toBe(true);
  });
});
