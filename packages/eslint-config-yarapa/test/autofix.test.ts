import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

import { perfectionistNatural } from "../src/configs/internal/perfectionist.js";
import { configs } from "../src/index.js";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));

async function fixTwice(
  config: ESLint.Options["overrideConfig"],
  code: string,
  filename: string,
): Promise<string> {
  const eslint = new ESLint({
    cwd: packageRoot,
    fix: true,
    overrideConfig: config,
    overrideConfigFile: true,
  });

  const [first] = await eslint.lintText(code, {
    filePath: resolve(packageRoot, filename),
  });
  expect(first).toBeDefined();
  expect(first!.fatalErrorCount).toBe(0);

  const output1 = first!.output ?? code;
  const [second] = await eslint.lintText(output1, {
    filePath: resolve(packageRoot, filename),
  });
  expect(second).toBeDefined();
  expect(second!.fatalErrorCount).toBe(0);

  const output2 = second!.output ?? output1;
  expect(output2).toBe(output1);

  return output1;
}

describe("autofix safety and idempotence", () => {
  it("normalizes representative stylistic source once", async () => {
    const output = await fixTwice(
      configs.stylistic,
      "export const value = 'ok'\n",
      "fixtures/autofix/stylistic.js",
    );

    expect(output).toBe('export const value = "ok";\n');
  });

  it("removes an unused import without changing the used export", async () => {
    const output = await fixTwice(
      configs.base,
      'import { readFileSync } from "node:fs";\n\nexport const value = 1;\n',
      "fixtures/autofix/unused-import.js",
    );

    expect(output).toBe("export const value = 1;\n");
  });

  it("orders imports deterministically", async () => {
    const output = await fixTwice(
      perfectionistNatural,
      'import z from "z";\nimport a from "a";\n\nexport { a, z };\n',
      "fixtures/autofix/import-order.js",
    );

    expect(output.indexOf('from "a"')).toBeLessThan(output.indexOf('from "z"'));
  });
});
