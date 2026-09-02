import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts", "src/next.ts", "src/nest.ts", "src/react.ts"],
  format: ["esm"],
  platform: "node",
  sourcemap: true,
});
