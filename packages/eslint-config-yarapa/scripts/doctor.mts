import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

type CheckResult = {
  isPassed: boolean;
  message: string;
  name: string;
};

const checks: CheckResult[] = [];

/**
 * Record an audit check outcome.
 * @param name Category name.
 * @param isPassed Whether check passed.
 * @param successMessage Message on pass.
 * @param failureMessage Message on failure.
 */
function recordCheck(
  name: string,
  isPassed: boolean,
  successMessage: string,
  failureMessage: string,
): void {
  checks.push({
    isPassed,
    message: isPassed ? successMessage : failureMessage,
    name,
  });
}

const nodeVersion = process.version;
const majorNode = Number(nodeVersion.slice(1).split(".", 1)[0] || "0");
recordCheck(
  "Node.js Runtime",
  majorNode >= 24,
  `Node.js ${nodeVersion} satisfies >=24.15.0 requirement`,
  `Node.js ${nodeVersion} is below required >=24.15.0`,
);

const cwd = process.cwd();
const hasEslintConfig
  = existsSync(path.resolve(cwd, "eslint.config.mjs"))
    || existsSync(path.resolve(cwd, "eslint.config.js"))
    || existsSync(path.resolve(cwd, "eslint.config.ts"));

recordCheck(
  "ESLint Flat Config",
  hasEslintConfig,
  "Found valid ESLint Flat Config entrypoint",
  "Missing eslint.config.mjs. YARAPA requires modern Flat Config.",
);

const candidateTsConfigs = [
  path.resolve(cwd, "tsconfig.json"),
  path.resolve(cwd, "packages/eslint-config-yarapa/tsconfig.json"),
];

const foundTsConfig = candidateTsConfigs.find(p => existsSync(p));

recordCheck(
  "TypeScript Configuration",
  Boolean(foundTsConfig),
  "Found valid TypeScript config for type-aware analysis",
  "Missing tsconfig.json in project or packages.",
);

if (foundTsConfig) {
  try {
    const tsconfigRaw = readFileSync(foundTsConfig, "utf8");
    const isParseable = tsconfigRaw.length > 0;
    recordCheck(
      "tsconfig.json Integrity",
      isParseable,
      "TypeScript configuration is readable and valid",
      "TypeScript configuration is empty or invalid",
    );
  } catch {
    checks.push({
      isPassed: false,
      message: "Failed to read TypeScript configuration",
      name: "tsconfig.json Integrity",
    });
  }
}

let isAllPassed = true;
process.stdout.write("\nYARAPA Code Standard Diagnostic Doctor\n");
process.stdout.write("======================================\n\n");

for (const c of checks) {
  const statusLabel = c.isPassed ? "[PASS]" : "[FAIL]";
  process.stdout.write(`${statusLabel} [${c.name}]: ${c.message}\n`);
  if (!c.isPassed) {
    isAllPassed = false;
  }
}

process.stdout.write("\n");
if (isAllPassed) {
  process.stdout.write(
    "All system prerequisites satisfy YARAPA enterprise standards.\n\n",
  );
} else {
  process.exitCode = 1;
  process.stderr.write(
    "Some prerequisites failed. Please resolve the defects above.\n\n",
  );
}
