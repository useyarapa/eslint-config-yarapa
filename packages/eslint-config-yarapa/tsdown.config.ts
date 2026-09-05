import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    "yarapa-eslint-config": "src/cli/yarapa-eslint-config.ts",
  },
  format: ["esm"],
  platform: "node",
  sourcemap: true,
});
