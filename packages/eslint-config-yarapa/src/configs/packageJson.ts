import type { Linter } from "eslint";

import { configs as packageJsonConfigs } from "eslint-plugin-package-json";

import { required } from "./internal/required.js";

const recommended = required(
  packageJsonConfigs.recommended,
  "eslint-plugin-package-json.configs.recommended",
);
const stylisticPackageJson = required(
  packageJsonConfigs.stylistic,
  "eslint-plugin-package-json.configs.stylistic",
);

export const packageJson: Linter.Config[] = [
  { ...recommended, name: "yarapa/package-json/recommended" },
  { ...stylisticPackageJson, name: "yarapa/package-json/stylistic" },
];
