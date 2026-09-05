import type { Linter } from "eslint";

import path from "node:path";
import { describe, expect, it } from "vitest";

import yarapa from "../src/index.js";
import { required } from "../src/utils/compat.js";
import { eslintForConfigs, packageRoot } from "./helpers/eslint.js";

/**
 * Apply an ESLint fixer twice and verify idempotence.
 * @param config Flat Config entries under test.
 * @param code Source text to fix.
 * @param filename Virtual fixture path used for config matching.
 * @returns Output from the first fix pass.
 */
async function fixTwice(
  config: Linter.Config[],
  code: string,
  filename: string,
): Promise<string> {
  const eslint = eslintForConfigs(config, { fix: true });

  const [first] = await eslint.lintText(code, {
    filePath: path.resolve(packageRoot, filename),
  });
  expect(first).toBeDefined();
  const firstResult = required(first, "first autofix lint result");
  expect(firstResult.fatalErrorCount).toBe(0);

  const output1 = firstResult.output ?? code;
  const [second] = await eslint.lintText(output1, {
    filePath: path.resolve(packageRoot, filename),
  });
  expect(second).toBeDefined();
  const secondResult = required(second, "second autofix lint result");
  expect(secondResult.fatalErrorCount).toBe(0);

  const output2 = secondResult.output ?? output1;
  expect(output2).toBe(output1);

  return output1;
}

describe("autofix safety and idempotence", () => {
  it("normalizes representative stylistic source once", async () => {
    const output = await fixTwice(
      yarapa,
      "export const value = 'ok'\n",
      "fixtures/autofix/stylistic.js",
    );

    expect(output).toBe("export const value = \"ok\";\n");
  });

  it("removes an unused import without changing the used export", async () => {
    const output = await fixTwice(
      yarapa,
      "import { readFileSync } from \"node:fs\";\n\nexport const value = 1;\n",
      "fixtures/autofix/unused-import.js",
    );

    expect(output).toBe("export const value = 1;\n");
  });

  it("keeps single-parameter block arrows idempotent", async () => {
    const output = await fixTwice(
      yarapa,
      "export const identity = (value) => { return value; };\n",
      "fixtures/autofix/arrow-parens.js",
    );

    expect(output).toContain("identity = value =>");
  });

  it("orders imports deterministically", async () => {
    const output = await fixTwice(
      yarapa,
      "import z from \"z\";\nimport a from \"a\";\n\nexport { a, z };\n",
      "fixtures/autofix/import-order.js",
    );

    expect(output.indexOf("from \"a\"")).toBeLessThan(output.indexOf("from \"z\""));
  });

  it("normalizes template strings and object shorthand once", async () => {
    const output = await fixTwice(
      yarapa,
      "export const greet = name => { const value = \"Hello \" + name; return { value: value }; };\n",
      "fixtures/autofix/modern-js.js",
    );

    expect(output).toBe(
      "export const greet = name => { const value = `Hello ${name}`; return { value }; };\n",
    );
  });

  it("normalizes expression arrows to implicit returns once", async () => {
    const output = await fixTwice(
      yarapa,
      "export const double = value => { return value * 2; };\n",
      "fixtures/autofix/implicit-arrow.js",
    );

    expect(output).toBe("export const double = value => value * 2;\n");
  });

  it("formats structured JSON data idempotently", async () => {
    const source = "{\n\"name\":   \"example\",\n\"version\":\"1.0.0\"\n}\n";
    const output = await fixTwice(yarapa, source, "fixtures/autofix/data.json");

    expect(output).toBe("{\n  \"name\": \"example\",\n  \"version\": \"1.0.0\"\n}\n");
  });

  it("orders package manifest properties idempotently", async () => {
    const source = `${JSON.stringify(
      Object.fromEntries([
        ["version", "1.0.0"],
        ["type", "commonjs"],
        ["name", "example"],
      ]),
      null,
      2,
    )}\n`;
    const output = await fixTwice(
      yarapa,
      source,
      "fixtures/autofix/package.json",
    );

    expect(output).toBe(
      `${JSON.stringify(
        Object.fromEntries([
          ["name", "example"],
          ["version", "1.0.0"],
          ["type", "commonjs"],
        ]),
        null,
        2,
      )}\n`,
    );
  });
});
