import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const repoRoot = resolve(packageRoot, "../..");
const gitExecutable
  = process.platform === "win32"
    ? "C:\\Program Files\\Git\\cmd\\git.exe"
    : "/usr/bin/git";

/**
 * Read a repository-owned text file for governance assertions.
 * @param relativePath Path relative to the repository root.
 * @returns UTF-8 file contents.
 */
function readRepoFile(relativePath: string): string {
  return readFileSync(resolve(repoRoot, relativePath), "utf8");
}

/**
 * Read the pinned and peer TypeScript versions from a package manifest.
 * @param relativePath Path of the manifest relative to the repository root.
 * @returns The TypeScript dev dependency and peer dependency versions.
 */
function readTypeScriptPins(relativePath: string): {
  typescriptDevDependency: string | undefined;
  typescriptPeerRange: string | undefined;
} {
  const manifest = JSON.parse(readRepoFile(relativePath)) as {
    devDependencies?: { typescript?: string };
    peerDependencies?: { typescript?: string };
  };

  return {
    typescriptDevDependency: manifest.devDependencies?.typescript,
    typescriptPeerRange: manifest.peerDependencies?.typescript,
  };
}

describe("enterprise repository gates", () => {
  it("certifies pull requests and pushes to main", () => {
    const ci = readRepoFile(".github/workflows/ci.yml");

    expect(ci).toContain("pull_request:");
    expect(ci).toMatch(/push:[\t\v\f\r \xa0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*\n\s*branches:[\t\v\f\r \xa0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]*\n\s*- main/);
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

  it("has non-empty non-documentation governance files", () => {
    for (const relativePath of [
      ".github/CODEOWNERS",
      ".github/dependabot.yml",
    ]) {
      const absolutePath = resolve(repoRoot, relativePath);
      expect(existsSync(absolutePath)).toBe(true);
      expect(readFileSync(absolutePath, "utf8").trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps the legacy Markdown reset in effect", () => {
    const trackedMarkdown = execFileSync(gitExecutable, ["ls-files", "*.md"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();

    expect(trackedMarkdown).toBe("");

    for (const relativePath of [
      ".github/pull_request_template.md",
      "AGENTS.md",
      "CLAUDE.md",
      "CONTEXT.md",
      "GEMINI.md",
      "README.md",
      "packages/eslint-config-yarapa/README.md",
    ]) {
      expect(existsSync(resolve(repoRoot, relativePath))).toBe(false);
    }
  });

  it("uses ESLint as the sole repository formatting path", () => {
    const rootPackage = readRepoFile("package.json");
    const lintStaged = readRepoFile(".lintstagedrc.json");
    const { scripts } = JSON.parse(rootPackage) as {
      scripts: Record<string, string>;
    };

    expect(rootPackage).not.toContain("\"prettier\"");
    expect(scripts.format).toBe(
      "pnpm --filter eslint-config-yarapa build && pnpm --filter eslint-config-yarapa exec eslint ../.. --fix",
    );
    expect(lintStaged).not.toContain("prettier");
    expect(lintStaged).toContain("eslint --fix");
  });

  it("pins the package compiler inside the certified peer range", () => {
    const { typescriptDevDependency, typescriptPeerRange } = readTypeScriptPins(
      "packages/eslint-config-yarapa/package.json",
    );

    expect(typescriptPeerRange).toBe(">=5.0.0 <6.1.0");
    expect(typescriptDevDependency).toMatch(/^\d+\.\d+\.\d+$/u);
    const [major = 0, minor = 0] = (typescriptDevDependency ?? "0.0.0")
      .split(".")
      .map(Number);
    expect(major * 1_000 + minor).toBeGreaterThanOrEqual(5 * 1_000);
    expect(major * 1_000 + minor).toBeLessThan(6 * 1_000 + 1);
  });

  it("keeps the root compiler above the certified peer ceiling", () => {
    const { typescriptDevDependency } = readTypeScriptPins("package.json");
    const [major = 0, minor = 0] = (typescriptDevDependency ?? "0.0.0")
      .split(".")
      .map(Number);

    expect(major * 1_000 + minor).toBeGreaterThanOrEqual(6 * 1_000 + 1);
  });

  it("blocks Dependabot from raising any workspace manifest beyond the certified range", () => {
    const dependabot = readRepoFile(".github/dependabot.yml");
    const npmEntries = dependabot
      .split("  - package-ecosystem:")
      .filter(section => section.trimStart().startsWith("npm"));

    expect(npmEntries).toHaveLength(1);
    expect(npmEntries[0]).toContain("directory: /");
    expect(npmEntries[0]).toContain("ignore:");
    expect(npmEntries[0]).toMatch(
      /dependency-name: typescript[\s\S]*?">=6\.1\.0"/u,
    );
  });

  it("runs staged ESLint from the repository root after building", () => {
    const preCommit = readRepoFile(".husky/pre-commit");
    const lintStaged = JSON.parse(readRepoFile(".lintstagedrc.json")) as Record<
      string,
      string[]
    >;
    const stagedCommands = Reflect.get(
      lintStaged,
      "*.{ts,tsx,js,jsx,mjs,cjs}",
    ) as string[] | undefined;

    expect(preCommit).toContain("pnpm --filter eslint-config-yarapa build");
    expect(stagedCommands).toStrictEqual([
      "pnpm exec eslint --fix --max-warnings=0",
    ]);
  });
});
