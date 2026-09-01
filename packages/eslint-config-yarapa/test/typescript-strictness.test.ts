import tseslint from "typescript-eslint";
import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";

type Decision =
  | "adopt"
  | "duplicate-overlap"
  | "false-positive-risk"
  | "not-applicable"
  | "reject"
  | "unstable";

type Classification = {
  decision: Decision;
  rationale: string;
};

const classifications: Record<string, Classification> = {};

function isEnabled(value: unknown): boolean {
  const severity = Array.isArray(value) ? value[0] : value;
  return severity !== undefined && severity !== 0 && severity !== "off";
}

function collectEnabledRules(value: unknown, rules = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) collectEnabledRules(item, rules);
    return rules;
  }

  if (typeof value !== "object" || value === null) return rules;

  const candidate = value as { rules?: Record<string, unknown> };
  for (const [ruleName, ruleValue] of Object.entries(candidate.rules ?? {})) {
    if (isEnabled(ruleValue)) rules.add(ruleName);
  }

  return rules;
}

const upstreamStrictRules = collectEnabledRules([
  tseslint.configs.strict,
  tseslint.configs.strictTypeChecked,
]);
const yarapaRules = collectEnabledRules([
  configs.typescript,
  configs.typeChecked,
]);
const missingStrictRules = [...upstreamStrictRules]
  .filter(ruleName => ruleName.startsWith("@typescript-eslint/"))
  .filter(ruleName => !yarapaRules.has(ruleName))
  .sort();

describe("typescript-eslint strictness audit", () => {
  it("classifies every strict control not currently adopted by YARAPA", () => {
    expect(
      Object.keys(classifications).sort(),
      `Unclassified strict controls:\n${missingStrictRules.join("\n")}`,
    ).toStrictEqual(missingStrictRules);
  });

  it("keeps every classification explicit and reviewable", () => {
    for (const [ruleName, classification] of Object.entries(classifications)) {
      expect(ruleName.startsWith("@typescript-eslint/")).toBe(true);
      expect(classification.rationale.length).toBeGreaterThanOrEqual(20);
    }
  });

  it("does not silently adopt a strict control without dedicated evidence", () => {
    const adopted = Object.entries(classifications)
      .filter(([, classification]) => classification.decision === "adopt")
      .map(([ruleName]) => ruleName);

    expect(adopted).toStrictEqual([]);
  });
});
