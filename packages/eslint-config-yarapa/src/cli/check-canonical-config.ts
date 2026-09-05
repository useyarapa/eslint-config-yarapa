import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  CANONICAL_CONFIG_CONTENT,
  CANONICAL_CONFIG_FILE_NAME,
} from "./canonical-config.js";

/**
 * Check the consumer ESLint config against the canonical template.
 * @param cwd Consumer repository directory.
 * @returns Whether the config matches exactly.
 */
export function checkCanonicalConfig(cwd: string): boolean {
  const configPath = path.resolve(cwd, CANONICAL_CONFIG_FILE_NAME);
  let content: string;

  try {
    content = readFileSync(configPath, "utf8");
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    reportFailure(configPath, `Unable to read file: ${reason}`);
    return false;
  }

  if (content === CANONICAL_CONFIG_CONTENT) {
    return true;
  }

  reportFailure(
    configPath,
    "File contents do not match the canonical template.",
  );
  return false;
}

/**
 * Write a canonical config validation failure.
 * @param configPath Consumer config path.
 * @param reason Validation failure reason.
 */
function reportFailure(configPath: string, reason: string): void {
  process.stderr.write(
    [
      "[FAIL] Invalid YARAPA ESLint configuration.",
      `File: ${configPath}`,
      `Reason: ${reason}`,
      "",
      "Expected file contents:",
      CANONICAL_CONFIG_CONTENT,
    ].join("\n"),
  );
}
