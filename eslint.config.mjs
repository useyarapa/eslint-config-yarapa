import { defineConfig, globalIgnores } from "eslint/config";

import yarapa from "./packages/eslint-config-yarapa/dist/index.mjs";

export default defineConfig(
  globalIgnores(
    [
      ".turbo/**",
      "packages/eslint-config-yarapa/dist/**",
      "packages/eslint-config-yarapa/fixtures/**",
    ],
    "yarapa/repository/artifacts-and-fixtures",
  ),
  yarapa,
  {
    files: [
      "packages/eslint-config-yarapa/scripts/verify-tarball/**/*.{ts,mts}",
      "packages/eslint-config-yarapa/test/behavior.test.ts",
      "packages/eslint-config-yarapa/test/public-api.test.ts",
    ],
    name: "yarapa/repository/verified-file-io",
    rules: {
      "security/detect-non-literal-fs-filename": "off",
    },
  },
);
