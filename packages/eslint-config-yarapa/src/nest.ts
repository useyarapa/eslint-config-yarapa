import type { Linter } from "eslint";

import { node } from "./configs/node.js";
import { recommended } from "./configs/recommended.js";

const nest: Linter.Config[] = [...recommended, ...node];

export default nest;
