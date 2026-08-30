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

import type { Linter } from "eslint";

/**
 * The aggregate Banking Baseline. Applies every universally relevant
 * control described in the "Banking Baseline" section of `docs/POLICY.md`:
 * ESLint core recommended, TypeScript recommended and type-aware
 * recommended coverage with Project Service, import resolution and
 * dependency-boundary checks, Promise and asynchronous control-flow
 * checks, regular-expression checks, SonarJS all-rules coverage, security
 * recommended coverage, unused-import controls, auditable ESLint
 * suppression comments, JSDoc recommended-error coverage, JSON/JSONC/JSON5
 * recommended coverage, package manifest validity and consistency checks,
 * the mandatory stylistic standard, and Perfectionist recommended natural
 * ordering.
 *
 * Runtime (`node`, `browser`) and test-runner (`vitest`, `ava`) presets are
 * deliberately excluded because they must be scoped to a consumer
 * repository's real file boundaries; add them in later `defineConfig`
 * entries constrained to the files that actually use those stacks. `ignores`
 * is also excluded because ignoring source is a repository boundary
 * decision, never required for conformance.
 */
export const recommended: Linter.Config[] = [
  ...base,
  ...typescript,
  ...typeChecked,
  ...importResolution,
  ...sonarjsAllRules,
  ...security,
  ...jsdoc,
  ...json,
  ...packageJson,
  ...stylistic,
  ...perfectionistNatural,
];
