import { defineConfig } from "eslint/config";

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
    extends: [configs.disableTypeChecked],
    files: toolingTypeScriptFiles,
    name: "yarapa/repository/tooling-without-project",
  },
);
