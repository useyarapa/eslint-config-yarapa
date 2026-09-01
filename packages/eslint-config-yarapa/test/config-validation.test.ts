import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));

type PresetName = keyof typeof configs;

const representativeFiles: Record<Exclude<PresetName, "ignores">, string> = {
  ava: "fixtures/valid/ava/case.test.js",
  base: "fixtures/valid/base/case.js",
  browser: "fixtures/valid/browser/case.js",
  disableTypeChecked: "fixtures/projects/tooling-out-of-project/valid.ts",
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

function eslintFor(preset: PresetName): ESLint {
  return new ESLint({
    cwd: packageRoot,
    overrideConfig: configs[preset],
    overrideConfigFile: true,
  });
}

describe("Flat Config validation", () => {
  it.each(Object.entries(representativeFiles) as [PresetName, string][])(
    "resolves configs.%s with ESLint itself",
    async (preset, relativePath) => {
      const config = await eslintFor(preset).calculateConfigForFile(
        resolve(packageRoot, relativePath),
      );

      expect(config).toBeDefined();
    },
  );

  it("validates the ignores preset through ESLint path matching", async () => {
    await expect(
      eslintFor("ignores").isPathIgnored(resolve(packageRoot, "dist/generated.js")),
    ).resolves.toBe(true);
  });
});
