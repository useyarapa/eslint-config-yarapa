import type { Linter } from "eslint";

import { base } from "./base.js";
import { browser } from "./browser.js";
import { eslintComments } from "./eslint-comments.js";
import { ignores } from "./ignores.js";
import { importX } from "./import-x.js";
import { jsdoc } from "./jsdoc.js";
import { json } from "./json.js";
import { node } from "./node.js";
import { packageJson } from "./package-json.js";
import { perfectionist } from "./perfectionist.js";
import { promise } from "./promise.js";
import { regexp } from "./regexp.js";
import { sonarjs } from "./sonarjs.js";
import { stylistic } from "./stylistic.js";
import { typeChecked } from "./type-checked.js";
import { typescript } from "./typescript.js";
import { unicorn } from "./unicorn.js";
import { unusedImports } from "./unused-imports.js";

export const yarapa: Linter.Config[] = [
  ...ignores,
  ...base,
  ...eslintComments,
  ...promise,
  ...regexp,
  ...unusedImports,
  ...node,
  ...browser,
  ...typescript,
  ...typeChecked,
  ...importX,
  ...sonarjs,
  ...jsdoc,
  ...json,
  ...packageJson,
  ...stylistic,
  ...unicorn,
  ...perfectionist,
];
