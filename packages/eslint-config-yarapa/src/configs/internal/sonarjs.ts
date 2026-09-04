import type { Linter } from "eslint";

import { configs as sonarjsConfigs } from "eslint-plugin-sonarjs";

export const sonarjsRecommended: Linter.Config[] = [
  sonarjsConfigs.recommended,
];
