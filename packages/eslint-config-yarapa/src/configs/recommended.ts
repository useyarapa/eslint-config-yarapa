import type { Linter } from "eslint";

import { configs as importXConfigs } from "eslint-plugin-import-x";
import perfectionistPlugin, {
  configs as perfectionistConfigs,
} from "eslint-plugin-perfectionist";
import { configs as sonarjsConfigs } from "eslint-plugin-sonarjs";

import { required } from "../utils/compat.js";
import { base } from "./base.js";
import { browser } from "./browser.js";
import { ignores } from "./ignores.js";
import { jsdoc } from "./jsdoc.js";
import { json } from "./json.js";
import { node } from "./node.js";
import { packageJson } from "./package-json.js";
import { stylistic } from "./stylistic.js";
import { typeChecked } from "./type-checked.js";
import { typescript } from "./typescript.js";
import { unicorn } from "./unicorn.js";

const importResolution: Linter.Config[] = [
  importXConfigs["flat/recommended"],
  importXConfigs["flat/typescript"],
];

const sonarjsRecommended: Linter.Config[] = [sonarjsConfigs.recommended];

const recommendedNatural = required(
  perfectionistConfigs["recommended-natural"],
  "eslint-plugin-perfectionist.configs.recommended-natural",
);

const perfectionistNatural: Linter.Config[] = [
  {
    name: "yarapa/internal/perfectionist-recommended-natural",
    plugins: { perfectionist: perfectionistPlugin },
    rules: { ...recommendedNatural.rules },
  },
];

const modernJavaScriptOwnership: Linter.Config = {
  name: "yarapa/canonical-ownership/modern-js",
  rules: {
    "sonarjs/arguments-usage": "off",
    "sonarjs/array-constructor": "off",
    "sonarjs/arrow-function-convention": "off",
    "sonarjs/prefer-default-last": "off",
  },
};

export const recommended: Linter.Config[] = [
  ...ignores,
  ...base,
  ...node,
  ...browser,
  ...typescript,
  ...typeChecked,
  ...importResolution,
  ...sonarjsRecommended,
  modernJavaScriptOwnership,
  ...jsdoc,
  ...json,
  ...packageJson,
  ...stylistic,
  ...unicorn,
  ...perfectionistNatural,
];
