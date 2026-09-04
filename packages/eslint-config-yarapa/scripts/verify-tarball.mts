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

if (
  (process.env.FRAMEWORK_PROFILE === undefined)
  !== (process.env.FRAMEWORK_VERSION === undefined)
) {
  throw new Error(
    "FRAMEWORK_PROFILE and FRAMEWORK_VERSION must be provided together",
  );
}

/**
 * @param profile - framework profile name
 * @param version - framework version string
 * @returns package install specs
 */
function frameworkInstallPackages(
  profile: string | undefined,
  version: string | undefined,
): string[] {
  if (profile === undefined) {
    return [];
  }
  if (version === undefined) {
    throw new Error("FRAMEWORK_VERSION is required for framework verification");
  }

  switch (profile) {
    case "nest": {
      return [
        `@nestjs/common@${version}`,
        `@nestjs/core@${version}`,
        "reflect-metadata@0.2.2",
        "rxjs@7.8.2",
      ];
    }
    case "next": {
      if (!frameworkReactVersion) {
        throw new Error(
          "FRAMEWORK_REACT_VERSION is required for Next.js verification",
        );
      }
      return [
        `next@${version}`,
        `react@${frameworkReactVersion}`,
        `react-dom@${frameworkReactVersion}`,
      ];
    }
    case "react": {
      return [`react@${version}`, `react-dom@${version}`];
    }
    default: {
      throw new Error(`Unsupported FRAMEWORK_PROFILE: ${profile}`);
    }
  }
}

/**
 * @param profile - framework profile name
 * @returns package names
 */
function frameworkPackageNames(profile: string | undefined): string[] {
  if (profile === undefined) {
    return [];
  }

  switch (profile) {
    case "nest": {
      return ["@nestjs/common", "@nestjs/core", "reflect-metadata", "rxjs"];
    }
    case "next": {
      return ["next", "react", "react-dom"];
    }
    case "react": {
      return ["react", "react-dom"];
    }
    default: {
      throw new Error(`Unsupported FRAMEWORK_PROFILE: ${profile}`);
    }
  }
}

/**
 * @param command - command binary to execute
 * @param arguments_ - arguments array
 * @param cwd - working directory
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

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
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
const frameworkProfile = process.env.FRAMEWORK_PROFILE;
const frameworkVersion = process.env.FRAMEWORK_VERSION;
const frameworkReactVersion = process.env.FRAMEWORK_REACT_VERSION;
const expectRuleCall = "await expectRule(";
const nestSampleFile = "sample-nest.ts";
const nestServiceFile = "sample-nest-service.ts";

try {
  run(pnpm, ["exec", "publint"], packageRoot);
  run(pnpm, ["pack", "--pack-destination", packageDirectory], packageRoot);

  const tarballName = readdirSync(packageDirectory).find(name => name.endsWith(".tgz"));
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

  const frameworkPackages = frameworkInstallPackages(
    frameworkProfile,
    frameworkVersion,
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
      ...frameworkPackages,
      tarball,
    ],
    consumerDirectory,
  );

  const selectedFrameworkPackages = frameworkPackageNames(frameworkProfile);

  writeFileSync(
    path.resolve(consumerDirectory, "verify.mjs"),
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

  writeFileSync(
    path.resolve(consumerDirectory, "verify-behavior.mjs"),
    [
      "import { ESLint } from \"eslint\";",
      "import yarapa from \"eslint-config-yarapa\";",
      "import next from \"eslint-config-yarapa/next\";",
      "import react from \"eslint-config-yarapa/react\";",
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
      expectRuleCall,
      "  yarapa,",
      "  \"sample-invalid.js\",",
      String.raw`  "export function value() { var answer = 42; return answer; }\n",`,
      "  \"no-var\",",
      ");",
      "",
      frameworkProfile === "next"
        ? [
            expectRuleCall,
            "  next,",
            "  \"sample-next-invalid.jsx\",",
            "  [",
            "    \"/** @returns {object} Rendered page. */\",",
            "    \"export function Page() {\",",
            String.raw`    "  return <img alt=\"YARAPA\" src=\"/logo.png\" />;",`,
            "    \"}\",",
            String.raw`  ].join("\n"),`,
            "  \"@next/next/no-img-element\",",
            ");",
          ].join("\n")
        : "",
      "",
      frameworkProfile === "react"
        ? [
            expectRuleCall,
            "  react,",
            "  \"sample-react-invalid.jsx\",",
            "  [",
            String.raw`    "import { useState } from \"react\";",`,
            "    \"/** @returns {object | null} Rendered component. */\",",
            "    \"export function Component({ enabled }) {\",",
            "    \"  if (enabled) useState(0);\",",
            "    \"  return null;\",",
            "    \"}\",",
            String.raw`  ].join("\n"),`,
            "  \"react-hooks/rules-of-hooks\",",
            ");",
          ].join("\n")
        : "",
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
      path.resolve(consumerDirectory, `eslint.${name}.config.mjs`),
      [
        `import config from "${specifier}";`,
        "",
        "export default config;",
        "",
      ].join("\n"),
    );
  }

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
        include: [nestSampleFile, nestServiceFile],
      },
      null,
      2,
    )}\n`,
  );

  writeFileSync(path.resolve(consumerDirectory, "sample.js"), "export const answer = 42;\n");
  writeFileSync(
    path.resolve(consumerDirectory, "sample-next.jsx"),
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
  writeFileSync(
    path.resolve(consumerDirectory, nestServiceFile),
    "export const port = 3000;\n",
  );
  writeFileSync(
    path.resolve(consumerDirectory, nestSampleFile),
    [
      "import \"./sample-nest-service\";",
      "",
      "export const configuredPort = 3000;",
      "",
    ].join("\n"),
  );

  run(node, ["verify.mjs"], consumerDirectory);
  run(node, ["verify-behavior.mjs"], consumerDirectory);
  run(
    pnpm,
    ["exec", "eslint", "-c", "eslint.root.config.mjs", "sample.js"],
    consumerDirectory,
  );
  run(
    pnpm,
    ["exec", "eslint", "-c", "eslint.next.config.mjs", "sample-next.jsx"],
    consumerDirectory,
  );
  run(
    pnpm,
    ["exec", "eslint", "-c", "eslint.nest.config.mjs", nestSampleFile, nestServiceFile],
    consumerDirectory,
  );
  run(
    pnpm,
    ["exec", "eslint", "-c", "eslint.react.config.mjs", "sample-react.jsx"],
    consumerDirectory,
  );
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
