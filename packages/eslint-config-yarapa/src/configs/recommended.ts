import type { Linter } from "eslint";

import { base } from "./base.js";
import { importResolution } from "./internal/importResolution.js";
import { perfectionistNatural } from "./internal/perfectionist.js";
import { sonarjsAllRules } from "./internal/sonarjs.js";
import { jsdoc } from "./jsdoc.js";
import { json } from "./json.js";
import { packageJson } from "./packageJson.js";
import { security } from "./security.js";
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

/**
 * Shared YARAPA recommended rule set. Applies the generic JavaScript and
 * TypeScript handwriting used by every semantic profile: core correctness,
 * type-aware TypeScript with Project Service, import resolution and dependency
 * checks, Promise and asynchronous control-flow checks, regexp and SonarJS
 * coverage, security rules, unused-code handling, ESLint suppression
 * discipline, JSDoc, JSON/package metadata validation, `@stylistic` formatting,
 * and natural ordering.
 *
 * Runtime, framework, and test-library semantics remain explicit file/profile
 * composition concerns rather than plugin-shaped public presets. Repository
 * ignore boundaries likewise remain a consumer/repository decision.
 */
export const recommended: Linter.Config[] = [
  ...base,
  ...typescript,
  ...typeChecked,
  ...importResolution,
  ...sonarjsAllRules,
  modernJavaScriptOwnership,
  ...security,
  ...jsdoc,
  ...json,
  ...packageJson,
  ...stylistic,
  ...perfectionistNatural,
];
