import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import semver from "semver";
import ts from "typescript";

type CheckResult = {
  isPassed: boolean;
  message: string;
  name: string;
};

const checks: CheckResult[] = [];

export function runDoctor(): boolean {
  const nodeVersion = process.version;
  const isNodeSatisfied = semver.satisfies(nodeVersion, ">=24.15.0 <25");
  recordCheck(
    "Node.js Runtime",
    isNodeSatisfied,
    `Node.js ${nodeVersion} satisfies >=24.15.0 <25 requirement`,
    `Node.js ${nodeVersion} does not satisfy >=24.15.0 <25 requirement`,
  );

  const cwd = process.cwd();
  const hasEslintConfig =
    existsSync(path.resolve(cwd, "eslint.config.mjs")) ||
    existsSync(path.resolve(cwd, "eslint.config.js")) ||
    existsSync(path.resolve(cwd, "eslint.config.ts"));

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

  const foundTsConfig = candidateTsConfigs.find(candidatePath =>
    existsSync(candidatePath),
  );

  recordCheck(
    "TypeScript Configuration",
    Boolean(foundTsConfig),
    "Found valid TypeScript config for type-aware analysis",
    "Missing tsconfig.json in project or packages.",
  );

  if (foundTsConfig) {
    const configResult = ts.readConfigFile(foundTsConfig, ts.sys.readFile);
    const hasDiagnosticError = Boolean(
      configResult.error &&
      configResult.error.category === ts.DiagnosticCategory.Error,
    );
    const isConfigFileValid =
      !hasDiagnosticError && configResult.config !== undefined;

    recordCheck(
      "tsconfig.json Integrity",
      isConfigFileValid,
      "TypeScript configuration is syntactically valid and parseable",
      "TypeScript configuration failed syntax parsing",
    );
  }

  let isAllPassed = true;
  process.stdout.write("\nYARAPA Code Standard Diagnostic Doctor\n");
  process.stdout.write("======================================\n\n");

  for (const check of checks) {
    const statusLabel = check.isPassed ? "[PASS]" : "[FAIL]";
    process.stdout.write(`${statusLabel} [${check.name}]: ${check.message}\n`);
    if (!check.isPassed) {
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

  return isAllPassed;
}

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
