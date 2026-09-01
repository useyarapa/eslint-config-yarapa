import type { Linter } from "eslint";

import perfectionistPlugin, {
  configs as perfectionistConfigs,
} from "eslint-plugin-perfectionist";

import { required } from "./required.js";

const recommendedNatural = required(
  perfectionistConfigs["recommended-natural"],
  "eslint-plugin-perfectionist.configs.recommended-natural",
);

/**
 * Perfectionist recommended natural ordering. Not independently exported:
 * Perfectionist is a `recommended`-only universal control providing semantic
 * import grouping and natural ascending order, so it is folded into
 * `recommended` rather than exposed as its own preset.
 */
export const perfectionistNatural: Linter.Config[] = [
  {
    name: "yarapa/internal/perfectionist-recommended-natural",
    plugins: { perfectionist: perfectionistPlugin },
    rules: { ...recommendedNatural.rules },
  },
];
