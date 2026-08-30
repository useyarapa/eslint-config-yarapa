import perfectionistPlugin from "eslint-plugin-perfectionist";

import type { Linter } from "eslint";

const recommendedNatural = perfectionistPlugin.configs["recommended-natural"];

/**
 * Perfectionist recommended natural ordering. Not independently exported:
 * `docs/POLICY.md` lists Perfectionist as a `recommended`-only universal
 * control providing semantic import grouping and natural ascending order.
 */
export const perfectionistNatural: Linter.Config[] = [
  {
    name: "yarapa/internal/perfectionist-recommended-natural",
    plugins: { perfectionist: perfectionistPlugin },
    rules: { ...recommendedNatural.rules },
  },
];
