import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const repoRoot = resolve(packageRoot, "../..");

function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(repoRoot, relativePath), "utf8");
}

describe("enterprise repository gates", () => {
  it("certifies pull requests and pushes to main", () => {
    const ci = readRepoFile(".github/workflows/ci.yml");

    expect(ci).toContain("pull_request:");
    expect(ci).toMatch(/push:\s*\n\s*branches:\s*\n\s*- main/);
  });

  it.each([
    "lint",
    "test",
    "check-types",
    "build",
    "inventory",
    "consumer",
    "compatibility",
    "windows-consumer",
  ])("exposes the %s certification domain in CI", domain => {
    const ci = readRepoFile(".github/workflows/ci.yml");
    expect(ci).toContain(domain);
  });

  it("has non-empty collaboration governance files", () => {
    for (const relativePath of [
      ".github/CODEOWNERS",
      ".github/pull_request_template.md",
      ".github/dependabot.yml",
    ]) {
      const absolutePath = resolve(repoRoot, relativePath);
      expect(existsSync(absolutePath), relativePath).toBe(true);
      expect(readFileSync(absolutePath, "utf8").trim().length, relativePath).toBeGreaterThan(0);
    }
  });

  it("does not expose the Turborepo starter README", () => {
    expect(readRepoFile("README.md")).not.toContain("# Turborepo starter");
  });

  it("uses ESLint as the sole repository formatting path", () => {
    const rootPackage = readRepoFile("package.json");
    const lintStaged = readRepoFile(".lintstagedrc.json");
    const { scripts } = JSON.parse(rootPackage) as {
      scripts: Record<string, string>;
    };

    expect(rootPackage).not.toContain('"prettier"');
    expect(scripts.format).toBe(
      "pnpm --filter eslint-config-yarapa build && pnpm --filter eslint-config-yarapa exec eslint ../.. --fix",
    );
    expect(lintStaged).not.toContain("prettier");
    expect(lintStaged).toContain("eslint --fix");
  });
});
