import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));

type PresetName = keyof typeof configs;
type FixtureCase = {
  preset: PresetName;
  compose?: PresetName[];
  special?: string;
  valid?: { code: string; filename: string };
  invalid?: {
    code: string;
    fatal?: boolean;
    filename: string;
    rule?: string;
  };
};

const fixtureCases = JSON.parse(
  readFileSync(resolve(packageRoot, "fixtures/cases.json"), "utf8"),
) as FixtureCase[];

function eslintFor(presets: PresetName[]): ESLint {
  return new ESLint({
    cwd: packageRoot,
    overrideConfig: presets.flatMap(preset => configs[preset]),
    overrideConfigFile: true,
  });
}

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
      const [result] = await eslint.lintText(fixture.valid!.code, {
        filePath: resolve(packageRoot, fixture.valid!.filename),
      });

      expect(result).toBeDefined();
      expect(
        messageSummary(result!),
        `Unexpected diagnostics for ${fixture.preset} valid fixture`,
      ).toEqual([]);
    });

    it("rejects the invalid fixture", async () => {
      const eslint = eslintFor(fixture.compose ?? [fixture.preset]);
      const [result] = await eslint.lintText(fixture.invalid!.code, {
        filePath: resolve(packageRoot, fixture.invalid!.filename),
      });

      expect(result).toBeDefined();
      expect(result!.errorCount).toBeGreaterThan(0);

      if (fixture.invalid!.fatal) {
        expect(result!.fatalErrorCount).toBeGreaterThan(0);
      }
      if (fixture.invalid!.rule) {
        expect(result!.messages.map(message => message.ruleId)).toContain(
          fixture.invalid!.rule,
        );
      }
    });
  });
}

describe("typeChecked", () => {
  const eslint = eslintFor(["typeChecked"]);
  const projectRoot = resolve(packageRoot, "fixtures/projects/typed");

  it("accepts a typed project source file", async () => {
    const [result] = await eslint.lintFiles(resolve(projectRoot, "src/valid.ts"));
    expect(messageSummary(result!)).toEqual([]);
  });

  it("reports a floating promise with type information", async () => {
    const [result] = await eslint.lintFiles(resolve(projectRoot, "src/invalid.ts"));
    expect(result!.messages.map(message => message.ruleId)).toContain(
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
      messageSummary(result!),
      "Unexpected diagnostics for out-of-project valid tooling file",
    ).toEqual([]);
  });

  it("keeps syntax-only TypeScript controls enabled", async () => {
    const [result] = await eslint.lintText("export const value: any = 1;\n", {
      filePath: resolve(
        packageRoot,
        "fixtures/projects/tooling-out-of-project/invalid.ts",
      ),
    });

    expect(result!.messages.map(message => message.ruleId)).toContain(
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
