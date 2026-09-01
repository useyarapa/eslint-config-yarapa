import type { Linter } from "eslint";

import { configs as tseslintConfigs } from "typescript-eslint";

/**
 * The sole sanctioned file-scoped control that disables type-aware rules.
 * Reserved for explicitly listed tooling files that intentionally have no
 * TypeScript project. Must be applied after `recommended`, in a consumer
 * entry scoped to those tooling files only. Syntax-only TypeScript,
 * security, documentation, and stylistic controls continue to apply because
 * this preset only turns off rules that require type information.
 */
export const disableTypeChecked: Linter.Config[] = [
  {
    ...tseslintConfigs.disableTypeChecked,
    name: "yarapa/disable-type-checked/off",
  },
];
