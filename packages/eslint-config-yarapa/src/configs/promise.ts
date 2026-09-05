import type { Linter } from "eslint";

import promisePlugin from "eslint-plugin-promise";

const promiseRules: Linter.RulesRecord = {
  "promise/always-return": "error",
  "promise/avoid-new": "off",
  "promise/catch-or-return": "error",
  "promise/no-callback-in-promise": "error",
  "promise/no-native": "off",
  "promise/no-nesting": "error",
  "promise/no-new-statics": "error",
  "promise/no-promise-in-callback": "error",
  "promise/no-return-in-finally": "error",
  "promise/no-return-wrap": "error",
  "promise/param-names": "error",
  "promise/valid-params": "error",
};

type Plugin = NonNullable<Linter.Config["plugins"]>[string];

export const promise: Linter.Config[] = [
  {
    name: "yarapa/promise",
    plugins: {
      promise: promisePlugin as unknown as Plugin,
    },
    rules: promiseRules,
  },
];
