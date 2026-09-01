import { configs as tseslintConfigs } from "typescript-eslint";
import { describe, expect, it } from "vitest";

import { configs } from "../src/index.js";

type Classification = {
  decision: Decision;
  rationale: string;
};

type Decision
  = | "adopt"
    | "duplicate-overlap"
    | "false-positive-risk"
    | "not-applicable"
    | "reject"
    | "unstable";

const unstableRationale
  = "Upstream strict preset membership is not SemVer-stable; adoption requires "
    + "dedicated YARAPA fixtures and behavioral evidence.";

const classifications: Record<string, Classification> = {
  "@typescript-eslint/no-confusing-void-expression": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-deprecated": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-dynamic-delete": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-extraneous-class": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-invalid-void-type": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-meaningless-void-operator": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-misused-spread": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-mixed-enums": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-non-null-asserted-nullish-coalescing": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-unnecessary-boolean-literal-compare": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-unnecessary-condition": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-unnecessary-template-expression": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-unnecessary-type-arguments": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-unnecessary-type-conversion": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-unnecessary-type-parameters": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-useless-constructor": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/no-useless-default-assignment": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/prefer-literal-enum-member": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/prefer-reduce-type-parameter": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/prefer-return-this-type": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/related-getter-setter-pairs": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/return-await": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/unified-signatures": {
    decision: "unstable",
    rationale: unstableRationale,
  },
  "@typescript-eslint/use-unknown-in-catch-callback-variable": {
    decision: "unstable",
    rationale: unstableRationale,
  },
};

/**
 * Collect enabled rules recursively from Flat Config values.
 * @param value Config value to inspect.
 * @param rules Accumulator for enabled rule names.
 * @returns The enabled-rule accumulator.
 */
function collectEnabledRules(
  value: unknown,
  rules = new Set<string>(),
): Set<string> {
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

/**
 * Determine whether an ESLint rule entry is enabled.
 * @param value Rule entry severity or tuple.
 * @returns True when the rule is enabled.
 */
function isEnabled(value: unknown): boolean {
  const severity: unknown = Array.isArray(value)
    ? (value as unknown[])[0]
    : value;
  return severity !== undefined && severity !== 0 && severity !== "off";
}

const upstreamStrictRules = collectEnabledRules([
  tseslintConfigs.strict,
  tseslintConfigs.strictTypeChecked,
]);
const yarapaRules = collectEnabledRules([
  configs.typescript,
  configs.typeChecked,
]);
const missingStrictRules = [...upstreamStrictRules]
  .filter(ruleName => ruleName.startsWith("@typescript-eslint/"))
  .filter(ruleName => !yarapaRules.has(ruleName))
  .sort((left, right) => left.localeCompare(right));

describe("typescript-eslint strictness audit", () => {
  it("classifies every strict control not currently adopted by YARAPA", () => {
    expect(
      Object.keys(classifications).sort((left, right) =>
        left.localeCompare(right),
      ),
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
