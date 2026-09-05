import type { Linter } from "eslint";

import { configs as nextConfigs } from "@next/eslint-plugin-next";
import globals from "globals";

import react from "./react.js";

const next: Linter.Config[] = [
  ...react,
  nextConfigs.recommended as Linter.Config,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    name: "yarapa/next/runtime",
  },
];

export default next;
