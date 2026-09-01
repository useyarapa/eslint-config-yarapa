import { defineConfig, globalIgnores } from "eslint/config";

import { configs } from "./packages/eslint-config-yarapa/dist/index.mjs";

const nodeFiles = [
  "eslint.config.mjs",
  "packages/eslint-config-yarapa/src/**/*.{ts,mts,cts}",
  "packages/eslint-config-yarapa/test/**/*.{js,mjs,cjs,ts,mts,cts}",
  "packages/eslint-config-yarapa/scripts/**/*.{js,mjs,cjs,ts,mts,cts}",
  "packages/eslint-config-yarapa/*.config.{js,mjs,cjs,ts,mts,cts}",
];

const toolingTypeScriptFiles = [
  "packages/eslint-config-yarapa/scripts/**/*.{ts,mts,cts}",
  "packages/eslint-config-yarapa/*.config.{ts,mts,cts}",
];

export default defineConfig(
  configs.ignores,
  globalIgnores(
    [
      "packages/eslint-config-yarapa/fixtures/**",
      "packages/eslint-config-yarapa/generated/**",
    ],
    "yarapa/repository/verification-artifacts",
  ),
  configs.recommended,
  {
    extends: [configs.node],
    files: nodeFiles,
    name: "yarapa/repository/node",
  },
  {
    extends: [configs.vitest],
    files: ["packages/eslint-config-yarapa/test/**/*.{js,mjs,cjs,ts,mts,cts}"],
    name: "yarapa/repository/vitest",
  },
  {
    files: [
      "packages/eslint-config-yarapa/scripts/generate-rule-inventory.mts",
      "packages/eslint-config-yarapa/scripts/verify-tarball.mts",
      "packages/eslint-config-yarapa/test/behavior.test.ts",
      "packages/eslint-config-yarapa/test/enterprise-gates.test.ts",
      "packages/eslint-config-yarapa/test/inventory.test.ts",
      "packages/eslint-config-yarapa/test/release-gate.test.ts",
    ],
    name: "yarapa/repository/trusted-verification-paths",
    rules: {
      "security/detect-non-literal-fs-filename": "off",
    },
  },
  {
    extends: [configs.disableTypeChecked],
    files: toolingTypeScriptFiles,
    name: "yarapa/repository/tooling-without-project",
  },
);
