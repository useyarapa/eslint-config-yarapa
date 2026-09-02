import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const pnpm
  = process.platform === "win32"
    ? resolve(process.env.PNPM_HOME ?? "", "pnpm.exe")
    : "pnpm";
const node = process.execPath;
const eslintVersion = process.env.ESLINT_VERSION ?? "10.9.1";
const typescriptVersion = process.env.TYPESCRIPT_VERSION ?? "6.0.3";
const frameworkProfile = process.env.FRAMEWORK_PROFILE;
const frameworkVersion = process.env.FRAMEWORK_VERSION;
const nestSampleFile = "sample-nest.ts";
const nestServiceFile = "sample-nest-service.ts";

if ((frameworkProfile === undefined) !== (frameworkVersion === undefined)) {
  throw new Error(
    "FRAMEWORK_PROFILE and FRAMEWORK_VERSION must be provided together",
  );
}

/**
 * Resolve the framework packages expected by one explicit compatibility case.
 * @param profile Selected semantic framework profile.
 * @returns Package names that must resolve in the packed consumer.
 */
function frameworkPackageNames(profile: string | undefined): string[] {
  switch (profile) {
    case undefined:
      return [];
    case "nest":
      return ["@nestjs/core"];
    case "next":
      return ["next"];
    case "react":
      return ["react"];
    default:
      throw new Error(`Unsupported FRAMEWORK_PROFILE: ${profile}`);
  }
}

/**
 * Run a consumer-verification command and fail on any non-zero result.
 * @param command Executable to run.
 * @param args Command arguments.
 * @param cwd Working directory for the command.
 */
function run(command: string, args: string[], cwd: string): void {
  const result = spawnSync(command, args, {
    cwd,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed with ${result.status}`,
    );
  }
}

if (process.platform === "win32" && !process.env.PNPM_HOME) {
  throw new Error("PNPM_HOME is required for the Windows consumer smoke test");
}

const tempRoot = mkdtempSync(join(tmpdir(), "yarapa-consumer-"));
const packDir = resolve(tempRoot, "pack");
const consumerDir = resolve(tempRoot, "consumer");
mkdirSync(packDir, { recursive: true });
mkdirSync(consumerDir, { recursive: true });

try {
  run(pnpm, ["exec", "publint"], packageRoot);
  run(pnpm, ["pack", "--pack-destination", packDir], packageRoot);

  const tarballName = readdirSync(packDir).find(name => name.endsWith(".tgz"));
  if (!tarballName) {
    throw new Error("pnpm pack did not produce a tarball");
  }
  const tarball = resolve(packDir, tarballName);

  run(pnpm, ["exec", "attw", tarball, "--profile", "esm-only"], packageRoot);

  writeFileSync(
    resolve(consumerDir, "package.json"),
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
      "--allow-build=unrs-resolver",
      "add",
      "--save-exact",
      `eslint@${eslintVersion}`,
      `typescript@${typescriptVersion}`,
      tarball,
    ],
    consumerDir,
  );

  const selectedFrameworkPackages = frameworkPackageNames(frameworkProfile);

  writeFileSync(
    resolve(consumerDir, "verify.mjs"),
    [
      "import yarapa from \"eslint-config-yarapa\";",
      "import next from \"eslint-config-yarapa/next\";",
      "import nest from \"eslint-config-yarapa/nest\";",
      "import react from \"eslint-config-yarapa/react\";",
      "",
      "for (const profile of [yarapa, next, nest, react]) {",
      "  if (!Array.isArray(profile) || profile.length === 0) {",
      "    throw new Error(\"Expected non-empty Flat Config array\");",
      "  }",
      "}",
      "",
      ...selectedFrameworkPackages.map(
        packageName => `await import(${JSON.stringify(packageName)});`,
      ),
      "",
    ].join("\n"),
  );

  const profileConfigs = {
    nest: "eslint-config-yarapa/nest",
    next: "eslint-config-yarapa/next",
    react: "eslint-config-yarapa/react",
    root: "eslint-config-yarapa",
  } as const;

  for (const [name, specifier] of Object.entries(profileConfigs)) {
    writeFileSync(
      resolve(consumerDir, `eslint.${name}.config.mjs`),
      [
        `import config from "${specifier}";`,
        "",
        "export default config;",
        "",
      ].join("\n"),
    );
  }

  writeFileSync(
    resolve(consumerDir, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          module: "NodeNext",
          moduleResolution: "NodeNext",
          strict: true,
          target: "ES2022",
        },
        include: [nestSampleFile, nestServiceFile],
      },
      null,
      2,
    )}\n`,
  );

  writeFileSync(resolve(consumerDir, "sample.js"), "export const answer = 42;\n");
  writeFileSync(
    resolve(consumerDir, "sample-next.jsx"),
    [
      "/**",
      " * Render the Next.js smoke-test page.",
      " * @returns {object} Rendered page.",
      " */",
      "export function Page() {",
      "  return <main>YARAPA</main>;",
      "}",
      "",
    ].join("\n"),
  );
  writeFileSync(
    resolve(consumerDir, "sample-react.jsx"),
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
  writeFileSync(
    resolve(consumerDir, nestServiceFile),
    "export const port = 3000;\n",
  );
  writeFileSync(
    resolve(consumerDir, nestSampleFile),
    [
      "import \"./sample-nest-service\";",
      "",
      "export const configuredPort = 3000;",
      "",
    ].join("\n"),
  );

  run(node, ["verify.mjs"], consumerDir);
  run(
    pnpm,
    ["exec", "eslint", "-c", "eslint.root.config.mjs", "sample.js"],
    consumerDir,
  );
  run(
    pnpm,
    ["exec", "eslint", "-c", "eslint.next.config.mjs", "sample-next.jsx"],
    consumerDir,
  );
  run(
    pnpm,
    ["exec", "eslint", "-c", "eslint.nest.config.mjs", nestSampleFile, nestServiceFile],
    consumerDir,
  );
  run(
    pnpm,
    ["exec", "eslint", "-c", "eslint.react.config.mjs", "sample-react.jsx"],
    consumerDir,
  );
} finally {
  rmSync(tempRoot, { force: true, recursive: true });
}
