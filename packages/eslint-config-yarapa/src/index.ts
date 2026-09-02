import type { Linter } from "eslint";

import type { presetNames } from "./configs/presetNames.js";

import { ava } from "./configs/ava.js";
import { base } from "./configs/base.js";
import { browser } from "./configs/browser.js";
import { disableTypeChecked } from "./configs/disableTypeChecked.js";
import { ignores } from "./configs/ignores.js";
import { jsdoc } from "./configs/jsdoc.js";
import { json } from "./configs/json.js";
import { node } from "./configs/node.js";
import { packageJson } from "./configs/packageJson.js";
import { recommended } from "./configs/recommended.js";
import { security } from "./configs/security.js";
import { stylistic } from "./configs/stylistic.js";
import { testingLibrary } from "./configs/testingLibrary.js";
import { typeChecked } from "./configs/typeChecked.js";
import { typescript } from "./configs/typescript.js";
import { vitest } from "./configs/vitest.js";

/**
 * The sixteen named Flat Config array presets exposed by `configs`. Kept
 * un-exported so the generated declaration entrypoint exposes only the single
 * named `configs` export.
 */
type YarapaConfigs = {
  [PresetName in (typeof presetNames)[number]]: Linter.Config[];
};

/**
 * The public surface of `eslint-config-yarapa`: sixteen consistently shaped
 * ESLint Flat Config array presets. There is no default export and no code
 * subpath export; `configs` is the sole JavaScript entrypoint.
 */
export const configs: YarapaConfigs = {
  ava,
  base,
  browser,
  disableTypeChecked,
  ignores,
  jsdoc,
  json,
  node,
  packageJson,
  recommended,
  security,
  stylistic,
  testingLibrary,
  typeChecked,
  typescript,
  vitest,
};
