import type { Linter } from "eslint";

import { base } from "./base.js";
import { ignores } from "./ignores.js";
import { importResolution } from "./internal/importResolution.js";
import { perfectionistNatural } from "./internal/perfectionist.js";
import { sonarjsAllRules } from "./internal/sonarjs.js";
import { jsdoc } from "./jsdoc.js";
import { json } from "./json.js";
import { packageJson } from "./packageJson.js";
import { stylistic } from "./stylistic.js";
import { typeChecked } from "./typeChecked.js";
import { typescript } from "./typescript.js";

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
  ...typescript,
  ...typeChecked,
  ...importResolution,
  ...sonarjsAllRules,
  modernJavaScriptOwnership,
  ...jsdoc,
  ...json,
  ...packageJson,
  ...stylistic,
  ...perfectionistNatural,
];
