import type { Linter } from "eslint";

import perfectionistPlugin, {
  configs as perfectionistConfigs,
} from "eslint-plugin-perfectionist";

import { required } from "./required.js";

const recommendedNatural = required(
  perfectionistConfigs["recommended-natural"],
  "eslint-plugin-perfectionist.configs.recommended-natural",
);

export const perfectionistNatural: Linter.Config[] = [
  {
    name: "yarapa/internal/perfectionist-recommended-natural",
    plugins: { perfectionist: perfectionistPlugin },
    rules: { ...recommendedNatural.rules },
  },
];
