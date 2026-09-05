import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const configsDir = path.resolve(currentDir, "../src/configs");

describe("static rule policy guard", () => {
  it("forbids upstream preset access and extends in production configs", () => {
    const configFiles = fs
      .readdirSync(configsDir)
      .filter(file => file.endsWith(".ts"))
      .map(file => path.join(configsDir, file));

    const forbiddenPatterns = [
      /\.configs[.[\]]/u,
      /\bextends\s*:/u,
      /import\s*\{[^}]*\bconfigs\b[^}]*\}\s*from\s+["'][^./]/u,
    ];

    const violations: string[] = [];

    for (const filePath of configFiles) {
      const content = fs.readFileSync(filePath, "utf8");
      const relativePath = path.relative(configsDir, filePath);

      for (const pattern of forbiddenPatterns) {
        if (pattern.test(content)) {
          violations.push(`${relativePath} matched ${pattern.toString()}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("keeps recommended.ts orchestration-only", () => {
    const recommendedPath = path.join(configsDir, "recommended.ts");
    const content = fs.readFileSync(recommendedPath, "utf8");

    expect(content).not.toMatch(/\brules\s*:/u);
    expect(content).not.toMatch(/\bplugins\s*:/u);
    expect(content).not.toMatch(/\blanguageOptions\s*:/u);
    expect(content).not.toMatch(/\bsettings\s*:/u);
    expect(content).not.toMatch(/from\s+["']eslint-plugin-[^./]+/u);
  });
});
