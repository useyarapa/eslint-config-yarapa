import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { packageRoot } from "./helpers/eslint.js";

const packageJson = JSON.parse(
  readFileSync(path.resolve(packageRoot, "package.json"), "utf8"),
) as { exports: Record<string, unknown> };

describe("public API", () => {
  it("uses a generic default export instead of plugin-shaped configs", async () => {
    const module = await import("../src/index.js");

    expect(Reflect.get(module, "default")).toEqual(expect.any(Array));
    expect(Reflect.has(module, "configs")).toBe(false);
  });

  it("publishes root entry and package.json exports only", () => {
    expect(Reflect.has(packageJson.exports, ".")).toBe(true);
    expect(Reflect.has(packageJson.exports, "./package.json")).toBe(true);
  });

  it.each(["./nest", "./react", "./node"])(
    "does not expose %s as a public subpath",
    subpath => {
      expect(Reflect.has(packageJson.exports, subpath)).toBe(false);
    },
  );
});
