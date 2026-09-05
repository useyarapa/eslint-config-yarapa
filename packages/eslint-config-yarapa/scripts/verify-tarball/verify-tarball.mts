import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.platform === "win32" && !process.env.PNPM_HOME) {
  throw new Error("PNPM_HOME is required for the Windows consumer smoke test");
}

/**
 * Run a command and throw when it exits unsuccessfully.
 * @param command Executable to run.
 * @param arguments_ Arguments passed to the executable.
 * @param cwd Working directory for the command.
 */
function run(command: string, arguments_: string[], cwd: string): void {
  const result = spawnSync(command, arguments_, {
    cwd,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(
      `${command} ${arguments_.join(" ")} failed with ${result.status}`,
    );
  }
}

const packageRoot = fileURLToPath(new URL("../../", import.meta.url));

/**
 * Pack the package and verify it in an isolated consumer project.
 */
export function verifyTarball(): void {
  const temporaryRoot = mkdtempSync(path.join(tmpdir(), "yarapa-consumer-"));
  const packageDirectory = path.resolve(temporaryRoot, "pack");
  const consumerDirectory = path.resolve(temporaryRoot, "consumer");
  mkdirSync(packageDirectory, { recursive: true });
  mkdirSync(consumerDirectory, { recursive: true });
  const pnpm
    = process.platform === "win32"
      ? path.resolve(process.env.PNPM_HOME ?? "", "pnpm.exe")
      : "pnpm";
  const node = process.execPath;
  const eslintVersion = process.env.ESLINT_VERSION ?? "10.9.1";
  const typescriptVersion = process.env.TYPESCRIPT_VERSION ?? "6.0.3";

  try {
    run(pnpm, ["exec", "publint"], packageRoot);
    run(pnpm, ["pack", "--pack-destination", packageDirectory], packageRoot);

    const tarballName = readdirSync(packageDirectory).find(name =>
      name.endsWith(".tgz"),
    );
    if (!tarballName) {
      throw new Error("pnpm pack did not produce a tarball");
    }
    const tarball = path.resolve(packageDirectory, tarballName);

    run(pnpm, ["exec", "attw", tarball, "--profile", "esm-only"], packageRoot);

    writeFileSync(
      path.resolve(consumerDirectory, "package.json"),
      `${JSON.stringify(
        {
          name: "yarapa-consumer-smoke",
          private: true,
          type: "module",
        },
        null,
        2,
      )}\n`,
    );

    run(
      pnpm,
      [
        "--allow-build=sharp",
        "--allow-build=unrs-resolver",
        "add",
        "--save-exact",
        `eslint@${eslintVersion}`,
        `typescript@${typescriptVersion}`,
        tarball,
      ],
      consumerDirectory,
    );

    writeFileSync(
      path.resolve(consumerDirectory, "verify.mjs"),
      [
        "import yarapa from \"eslint-config-yarapa\";",
        "",
        "if (!Array.isArray(yarapa) || yarapa.length === 0) {",
        "  throw new Error(\"Expected non-empty Flat Config array\");",
        "}",
        "",
      ].join("\n"),
    );

    writeFileSync(
      path.resolve(consumerDirectory, "verify-behavior.mjs"),
      [
        "import { ESLint } from \"eslint\";",
        "import yarapa from \"eslint-config-yarapa\";",
        "",
        "async function expectRule(config, filePath, source, expectedRule) {",
        "  const eslint = new ESLint({",
        "    cwd: process.cwd(),",
        "    overrideConfig: config,",
        "    overrideConfigFile: true,",
        "  });",
        "  const [result] = await eslint.lintText(source, { filePath });",
        "  if (!result) throw new Error(`No lint result for ${filePath}`);",
        "  const ruleIds = result.messages.map(message => message.ruleId);",
        "  if (!ruleIds.includes(expectedRule)) {",
        "    throw new Error(",
        "      `Expected ${expectedRule} for ${filePath}; got ${ruleIds.join(\", \")}`",
        "    );",
        "  }",
        "}",
        "",
        "await expectRule(",
        "  yarapa,",
        "  \"sample-invalid.js\",",
        String.raw`  "export function value() { var answer = 42; return answer; }\n",`,
        "  \"no-var\",",
        ");",
        "",
        "await expectRule(",
        "  yarapa,",
        "  \"sample-react-invalid.jsx\",",
        "  [",
        String.raw`    "const useEffect = callback => callback();",`,
        "    \"export function Component({ enabled }) {\",",
        "    \"  if (enabled) useEffect(() => {});\",",
        "    \"  return null;\",",
        "    \"}\",",
        String.raw`  ].join("\n"),`,
        "  \"react-hooks/rules-of-hooks\",",
        ");",
        "",
      ].join("\n"),
    );

    writeFileSync(
      path.resolve(consumerDirectory, "eslint.config.mjs"),
      [
        "import yarapa from \"eslint-config-yarapa\";",
        "",
        "export default yarapa;",
        "",
      ].join("\n"),
    );

    writeFileSync(
      path.resolve(consumerDirectory, "tsconfig.json"),
      `${JSON.stringify(
        {
          compilerOptions: {
            module: "NodeNext",
            moduleResolution: "NodeNext",
            strict: true,
            target: "ES2022",
          },
          include: ["sample.ts"],
        },
        null,
        2,
      )}\n`,
    );

    writeFileSync(
      path.resolve(consumerDirectory, "sample.js"),
      "export const answer = 42;\n",
    );
    writeFileSync(
      path.resolve(consumerDirectory, "sample.ts"),
      "export const answer: number = 42;\n",
    );
    writeFileSync(
      path.resolve(consumerDirectory, "sample-react.jsx"),
      [
        "/**",
        " * Render the React smoke-test component.",
        " * @returns {object} Rendered component.",
        " */",
        "export function Component() {",
        "  return <div>YARAPA</div>;",
        "}",
        "",
      ].join("\n"),
    );

    run(node, ["verify.mjs"], consumerDirectory);
    run(node, ["verify-behavior.mjs"], consumerDirectory);
    run(
      pnpm,
      ["exec", "eslint", "sample.js", "sample.ts", "sample-react.jsx"],
      consumerDirectory,
    );
  } finally {
    rmSync(temporaryRoot, { force: true, recursive: true });
  }
}

const scriptPath = process.argv[1];
const isDirectExecution
  = scriptPath !== undefined
    && path.resolve(scriptPath) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  verifyTarball();
}
