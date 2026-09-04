import type { ESLint } from "eslint";

import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { required } from "../src/configs/internal/required.js";
import yarapa from "../src/index.js";
import react from "../src/react.js";
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
  const javascriptFixture = resolve(
    packageRoot,
    "fixtures/valid/base/case.js",
  );
  const projectRoot = resolve(packageRoot, "fixtures/projects/typed");

  it("accepts a typed project source file", async () => {
    const [result] = await eslint.lintFiles(
      resolve(projectRoot, "src/valid.ts"),
    );
    const summary = messageSummary(required(result, "typed valid lint result"));

    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
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
      filePath: javascriptFixture,
    });
    const lintResult = required(result, "unused variable lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "unused-imports/no-unused-vars",
    );
  });

  it("rejects var in shared JavaScript handwriting", async () => {
    const [result] = await eslint.lintText(
      "export function increment(value) { var next = value + 1; return next; }\n",
      { filePath: javascriptFixture },
    );
    const lintResult = required(result, "var lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "no-var",
    );
  });

  it("requires strict equality in shared JavaScript handwriting", async () => {
    const [result] = await eslint.lintText(
      "export const equivalent = (left, right) => left == right;\n",
      { filePath: javascriptFixture },
    );
    const lintResult = required(result, "equality lint result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "eqeqeq",
    );
  });

  it("prefers literal constructors and dot property access", async () => {
    const source = [
      "export const build = value => {",
      "  const object = new Object();",
      "  const items = new Array(value, value);",
      "  object[\"value\"] = items[0];",
      "  return object;",
      "};",
      "",
    ].join("\n");
    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });
    const lintResult = required(result, "literal syntax lint result");
    const ruleIds = lintResult.messages.map(message => message.ruleId);

    expect(ruleIds).toContain("no-object-constructor");
    expect(ruleIds).toContain("no-array-constructor");
    expect(ruleIds).toContain("dot-notation");
  });

  it("prefers rest/spread and default parameters last", async () => {
    const source = [
      "export const call = (fallback = 0, action, args) =>",
      "  action.apply(undefined, args) ?? fallback;",
      "export function collect() { return Array.from(arguments); }",
      "",
    ].join("\n");
    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });
    const lintResult = required(result, "modern function lint result");
    const ruleIds = lintResult.messages.map(message => message.ruleId);

    expect(ruleIds).toContain("default-param-last");
    expect(ruleIds).toContain("prefer-spread");
    expect(ruleIds).toContain("prefer-rest-params");
  });

  it("requires braces, Object.hasOwn, and explicit parseInt radix", async () => {
    const source = [
      "export const parse = (object, key, value) => {",
      "  if (object) return Object.prototype.hasOwnProperty.call(object, key);",
      "  return parseInt(value);",
      "};",
      "",
    ].join("\n");
    const [result] = await eslint.lintText(source, {
      filePath: javascriptFixture,
    });
    const lintResult = required(result, "modern builtins lint result");
    const ruleIds = lintResult.messages.map(message => message.ruleId);

    expect(ruleIds).toContain("curly");
    expect(ruleIds).toContain("prefer-object-has-own");
    expect(ruleIds).toContain("radix");
  });

  it("reports hard-coded passwords through the official SonarJS preset", async () => {
    const [result] = await eslint.lintText(
      "const password = \"secret-value\";\n",
      { filePath: javascriptFixture },
    );
    const lintResult = required(result, "SonarJS behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "sonarjs/no-hardcoded-passwords",
    );
  });

  it("reports conditional hooks through the official React Hooks preset", async () => {
    const reactEslint = eslintForConfigs(react);
    const source = [
      "const useEffect = callback => callback();",
      "export const Component = active => {",
      "  if (active) {",
      "    useEffect(() => {});",
      "  }",
      "  return null;",
      "};",
      "",
    ].join("\n");
    const [result] = await reactEslint.lintText(source, {
      filePath: resolve(packageRoot, "fixtures/react-hooks.jsx"),
    });
    const lintResult = required(result, "React Hooks behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "react-hooks/rules-of-hooks",
    );
  });

  it("reports unresolved imports through the official import-x preset", async () => {
    const [result] = await eslint.lintText(
      "import missing from \"./does-not-exist.js\";\nexport { missing };\n",
      { filePath: resolve(packageRoot, "fixtures/import-resolution.js") },
    );
    const lintResult = required(result, "import-x behavior result");

    expect(lintResult.messages.map(message => message.ruleId)).toContain(
      "import-x/no-unresolved",
    );
  });
});
