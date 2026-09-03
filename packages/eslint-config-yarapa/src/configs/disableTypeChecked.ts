import type { Linter } from "eslint";

import { configs as tseslintConfigs } from "typescript-eslint";

export const disableTypeChecked: Linter.Config[] = [
  {
    ...tseslintConfigs.disableTypeChecked,
    name: "yarapa/disable-type-checked/off",
  },
];
