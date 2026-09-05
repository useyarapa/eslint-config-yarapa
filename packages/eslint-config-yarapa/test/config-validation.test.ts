import path from "node:path";
import { describe, expect, it } from "vitest";

import yarapa from "../src/index.js";
import { eslintForConfigs, packageRoot } from "./helpers/eslint.js";

const sampleFiles = [
  "fixtures/projects/typed/src/valid.ts",
  "fixtures/projects/untyped/index.js",
] as const;

describe("Flat Config validation", () => {
  it.each(sampleFiles)("resolves configuration for %s", async sampleFile => {
    await expect(
      eslintForConfigs(yarapa).calculateConfigForFile(
        path.resolve(packageRoot, sampleFile),
      ),
    ).resolves.toBeDefined();
  });
});
