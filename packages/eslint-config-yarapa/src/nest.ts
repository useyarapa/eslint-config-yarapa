import type { Linter } from "eslint";

import { node } from "./configs/node.js";
import { recommended } from "./configs/recommended.js";

/**
 * NestJS service profile: shared YARAPA handwriting plus the Node.js runtime
 * semantics required by backend services.
 */
const nest: Linter.Config[] = [
  ...recommended,
  ...node,
];

export default nest;
