import type { ESLint } from "eslint";

import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { required } from "../src/configs/internal/required.js";
import yarapa from "../src/index.js";
import { eslintForConfigs, packageRoot } from "./helpers/eslint.js";

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

describe("shared YARAPA behavior", () => {
  const eslint = eslintForConfigs(yarapa);
  const projectRoot = resolve(packageRoot, "fixtures/projects/typed");

  it("accepts a typed project source file", async () => {
    const [result] = await eslint.lintFiles(
      resolve(projectRoot, "src/valid.ts"),
    );

    expect(
      messageSummary(required(result, "typed valid lint result")),
    ).toEqual([]);
  });

  it("reports a floating promise with type information", async () => {
    const [result] = await eslint.lintFiles(
      resolve(projectRoot, "src/invalid.ts"),
    );
    const lintResult = required(result, "typed invalid lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "@typescript-eslint/no-floating-promises",
    );
  });

  it("rejects unused JavaScript variables", async () => {
    const [result] = await eslint.lintText("const unused = 1;\n", {
      filePath: resolve(packageRoot, "fixtures/valid/base/case.js"),
    });
    const lintResult = required(result, "unused variable lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "unused-imports/no-unused-vars",
    );
  });
});
