import { defineConfig, globalIgnores } from "eslint/config";

import yarapa from "./packages/eslint-config-yarapa/dist/index.mjs";
import yarapaNest from "./packages/eslint-config-yarapa/dist/nest.mjs";

const nodeToolingFiles = [
  "packages/eslint-config-yarapa/src/**/*.{ts,mts,cts}",
  "packages/eslint-config-yarapa/test/**/*.{js,mjs,cjs,ts,mts,cts}",
  "packages/eslint-config-yarapa/scripts/**/*.{js,mjs,cjs,ts,mts,cts}",
  "packages/eslint-config-yarapa/*.config.{js,mjs,cjs,ts,mts,cts}",
];

export default defineConfig(
  globalIgnores(
    [
      "packages/eslint-config-yarapa/dist/**",
      "packages/eslint-config-yarapa/fixtures/**",
    ],
    "yarapa/repository/artifacts-and-fixtures",
  ),
  yarapa,
  {
    extends: yarapaNest,
    files: nodeToolingFiles,
    name: "yarapa/repository/node-tooling",
  },
  {
    files: [
      "packages/eslint-config-yarapa/scripts/verify-tarball.mts",
      "packages/eslint-config-yarapa/test/behavior.test.ts",
      "packages/eslint-config-yarapa/test/public-api.test.ts",
    ],
    name: "yarapa/repository/verified-file-io",
    rules: {
      "security/detect-non-literal-fs-filename": "off",
    },
  },
);
