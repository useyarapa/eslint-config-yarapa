import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { packageRoot } from "./helpers/eslint.js";

const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, "package.json"), "utf8"),
) as { exports: Record<string, unknown> };

describe("public API", () => {
  it("uses a generic default export instead of plugin-shaped configs", async () => {
    const module = await import("../src/index.js");

    expect(Reflect.get(module, "default")).toEqual(expect.any(Array));
    expect(Reflect.has(module, "configs")).toBe(false);
  });

  it.each(["./next", "./nest", "./react"])(
    "publishes %s as a semantic subpath",
    subpath => {
      expect(Reflect.has(packageJson.exports, subpath)).toBe(true);
    },
  );
});
