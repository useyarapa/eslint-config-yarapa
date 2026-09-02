import type { Linter } from "eslint";

import { recommended } from "./configs/recommended.js";

/**
 * Shared YARAPA handwriting for generic JavaScript and TypeScript code.
 * Framework entrypoints layer only their required environment semantics on
 * top of this baseline.
 */
const yarapa: Linter.Config[] = recommended;

export default yarapa;
