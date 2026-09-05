import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CANONICAL_CONFIG_CONTENT,
  CANONICAL_CONFIG_FILE_NAME,
} from "../src/cli/canonical-config.js";
import { checkCanonicalConfig } from "../src/cli/check-canonical-config.js";

let temporaryDirectory: string;

beforeEach(() => {
  temporaryDirectory = mkdtempSync(path.join(tmpdir(), "yarapa-config-"));
});

afterEach(() => {
  vi.restoreAllMocks();
  rmSync(temporaryDirectory, { force: true, recursive: true });
});

/**
 * Resolve the temporary consumer config path.
 * @returns Consumer config path.
 */
function configPath(): string {
  return path.resolve(temporaryDirectory, CANONICAL_CONFIG_FILE_NAME);
}

/**
 * Write a temporary consumer config.
 * @param content Config content.
 */
function writeConfig(content: string): void {
  writeFileSync(configPath(), content);
}

const modifiedConfigs = [
  [
    "a spread rule override",
    [
      `import yarapa from "eslint-config-yarapa";`,
      "",
      `export default [...yarapa, { rules: { "no-console": "off" } }];`,
      "",
    ].join("\n"),
  ],
  [
    "local ignores",
    [
      `import yarapa from "eslint-config-yarapa";`,
      "",
      `export default [...yarapa, { ignores: ["coverage/**"] }];`,
      "",
    ].join("\n"),
  ],
  [
    "local globals",
    [
      `import yarapa from "eslint-config-yarapa";`,
      "",
      "export default [",
      "  ...yarapa,",
      `  { languageOptions: { globals: { APP_ENV: "readonly" } } },`,
      "];",
      "",
    ].join("\n"),
  ],
  [
    "an extra import",
    [
      `import process from "node:process";`,
      `import yarapa from "eslint-config-yarapa";`,
      "",
      "export default yarapa;",
      "",
    ].join("\n"),
  ],
  [
    "a side effect",
    [
      `import yarapa from "eslint-config-yarapa";`,
      "",
      `process.stdout.write("");`,
      "export default yarapa;",
      "",
    ].join("\n"),
  ],
  ["a comment", `// YARAPA\n${CANONICAL_CONFIG_CONTENT}`],
  ["different formatting", CANONICAL_CONFIG_CONTENT.replace("\n\n", "\n")],
  ["CRLF line endings", CANONICAL_CONFIG_CONTENT.replaceAll("\n", "\r\n")],
  ["a missing final newline", CANONICAL_CONFIG_CONTENT.slice(0, -1)],
] as const;

describe("canonical config check", () => {
  it("accepts the exact canonical file", () => {
    const stderr = vi.spyOn(process.stderr, "write");
    writeConfig(CANONICAL_CONFIG_CONTENT);

    expect(checkCanonicalConfig(temporaryDirectory)).toBe(true);
    expect(stderr).not.toHaveBeenCalled();
  });

  it("rejects a missing config file", () => {
    const stderr = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);

    expect(checkCanonicalConfig(temporaryDirectory)).toBe(false);
    expect(stderr).toHaveBeenCalledWith(
      expect.stringContaining(CANONICAL_CONFIG_CONTENT),
    );
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining(configPath()));
  });

  it("rejects an unreadable config path", () => {
    const stderr = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);
    mkdirSync(configPath());

    expect(checkCanonicalConfig(temporaryDirectory)).toBe(false);
    expect(stderr).toHaveBeenCalledWith(
      expect.stringContaining("Unable to read file"),
    );
  });

  it.each(modifiedConfigs)("rejects %s", (_name, content) => {
    const stderr = vi
      .spyOn(process.stderr, "write")
      .mockImplementation(() => true);
    writeConfig(content);

    expect(checkCanonicalConfig(temporaryDirectory)).toBe(false);
    expect(stderr).toHaveBeenCalledWith(
      expect.stringContaining("File contents do not match"),
    );
    expect(stderr).toHaveBeenCalledWith(
      expect.stringContaining(CANONICAL_CONFIG_CONTENT),
    );
  });
});
