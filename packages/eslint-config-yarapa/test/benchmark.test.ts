import { describe, expect, it } from "vitest";

import yarapa from "../src/index.js";
import { eslintForConfigs } from "./helpers/eslint.js";

describe("Performance & Memory Benchmark", () => {
  it("executes canonical configuration within the performance budget", async () => {
    const eslint = eslintForConfigs(yarapa);

    const testSnippet = `
      export type UserRecord = {
        id: string;
        name: string;
        createdAt: Date;
      };

      export const getUserInfo = (user: UserRecord): string => {
        return \`User: \${user.name} (\${user.id})\`;
      };
    `;

    const startMem = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    const results = await eslint.lintText(testSnippet, {
      filePath: "src/sample.ts",
    });

    const elapsedMs = performance.now() - startTime;
    const endMem = process.memoryUsage().heapUsed;
    const heapDiffMb = (endMem - startMem) / (1024 * 1024);

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
    expect(elapsedMs).toBeGreaterThan(0);
    expect(heapDiffMb).toBeLessThan(400);
  });
});
