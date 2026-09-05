import js from "@eslint/js";
import { describe, expect, it } from "vitest";

import { base } from "../src/configs/base.js";

describe("core ESLint recommended policy", () => {
  it("preserves official core recommended config directly", () => {
    expect(base).toContain(js.configs.recommended);
  });
});
