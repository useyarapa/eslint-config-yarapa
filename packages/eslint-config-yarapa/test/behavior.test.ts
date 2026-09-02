import type { ESLint } from "eslint";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import type { configs } from "../src/index.js";

import { required } from "../src/configs/internal/required.js";
import { eslintFor, packageRoot } from "./helpers/eslint.js";

type FixtureCase = {
  compose?: PresetName[];
  invalid?: {
    code: string;
    fatal?: boolean;
    filename: string;
    rule?: string;
  };
  preset: PresetName;
  special?: string;
  valid?: { code: string; filename: string };
};
type PresetName = keyof typeof configs;

const fixtureCases = JSON.parse(
  readFileSync(resolve(packageRoot, "fixtures/cases.json"), "utf8"),
) as FixtureCase[];

/**
 * Reduce a lint result to stable diagnostic fields for assertions.
 * @param result ESLint result to summarize.
 * @returns Stable diagnostic summary objects.
 */
function messageSummary(result: ESLint.LintResult): object[] {
  return result.messages.map(message => ({
    message: message.message,
    ruleId: message.ruleId,
    severity: message.severity,
  }));
}

for (const fixture of fixtureCases.filter(item => !item.special)) {
  describe(`behavioral fixture: ${fixture.preset}`, () => {
    it("accepts the valid fixture", async () => {
      const eslint = eslintFor(fixture.compose ?? [fixture.preset]);
      const valid = required(fixture.valid, `${fixture.preset} valid fixture`);
      const [result] = await eslint.lintText(valid.code, {
        filePath: resolve(packageRoot, valid.filename),
      });
      const lintResult = required(result, `${fixture.preset} valid lint result`);

      expect(messageSummary(lintResult)).toEqual([]);
    });

    it("rejects the invalid fixture", async () => {
      const eslint = eslintFor(fixture.compose ?? [fixture.preset]);
      const invalid = required(
        fixture.invalid,
        `${fixture.preset} invalid fixture`,
      );
      const [result] = await eslint.lintText(invalid.code, {
        filePath: resolve(packageRoot, invalid.filename),
      });
      const lintResult = required(result, `${fixture.preset} invalid lint result`);

      expect(lintResult.errorCount).toBeGreaterThan(0);
      expect(!invalid.fatal || lintResult.fatalErrorCount > 0).toBe(true);
      const expectedRule = invalid.rule;
      expect(
        expectedRule === undefined
        || lintResult.messages.some(message => message.ruleId === expectedRule),
      ).toBe(true);
    });
  });
}

describe("typeChecked", () => {
  const eslint = eslintFor(["typeChecked"]);
  const projectRoot = resolve(packageRoot, "fixtures/projects/typed");

  it("accepts a typed project source file", async () => {
    const [result] = await eslint.lintFiles(resolve(projectRoot, "src/valid.ts"));
    expect(messageSummary(required(result, "typed valid lint result"))).toEqual([]);
  });

  it("reports a floating promise with type information", async () => {
    const [result] = await eslint.lintFiles(resolve(projectRoot, "src/invalid.ts"));
    const lintResult = required(result, "typed invalid lint result");
    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "@typescript-eslint/no-floating-promises",
    );
  });
});

describe("disableTypeChecked", () => {
  const eslint = eslintFor(["recommended", "disableTypeChecked"]);

  it("allows an intentional out-of-project tooling file", async () => {
    const [result] = await eslint.lintText(
      "export const value: string = \"ok\";\n",
      {
        filePath: resolve(
          packageRoot,
          "fixtures/projects/tooling-out-of-project/valid.ts",
        ),
      },
    );

    expect(
      messageSummary(required(result, "out-of-project valid lint result")),
    ).toEqual([]);
  });

  it("keeps syntax-only TypeScript controls enabled", async () => {
    const [result] = await eslint.lintText("export const value: any = 1;\n", {
      filePath: resolve(
        packageRoot,
        "fixtures/projects/tooling-out-of-project/invalid.ts",
      ),
    });

    const lintResult = required(result, "out-of-project invalid lint result");
    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "@typescript-eslint/no-explicit-any",
    );
  });
});

describe("ignores", () => {
  const eslint = eslintFor(["ignores", "typescript"]);

  it("ignores documented build output", async () => {
    await expect(
      eslint.isPathIgnored(resolve(packageRoot, "dist/generated.ts")),
    ).resolves.toBe(true);
  });

  it("does not ignore source by default", async () => {
    await expect(
      eslint.isPathIgnored(resolve(packageRoot, "src/index.ts")),
    ).resolves.toBe(false);
  });
});
