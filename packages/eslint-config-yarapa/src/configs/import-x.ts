import type { Linter } from "eslint";

import importXPlugin from "eslint-plugin-import-x";

const importXRules: Linter.RulesRecord = {
  "import-x/default": "error",
  "import-x/export": "error",
  "import-x/named": "off",
  "import-x/namespace": "error",
  "import-x/no-duplicates": "warn",
  "import-x/no-named-as-default": "warn",
  "import-x/no-named-as-default-member": "warn",
  "import-x/no-unresolved": "error",
};

const importXSettings: Record<string, unknown> = {
  "import-x/extensions": [
    ".ts",
    ".tsx",
    ".cts",
    ".mts",
    ".js",
    ".jsx",
    ".cjs",
    ".mjs",
  ],
  "import-x/external-module-folders": ["node_modules", "node_modules/@types"],
  "import-x/parsers": {
    "@typescript-eslint/parser": [".ts", ".tsx", ".cts", ".mts"],
  },
  "import-x/resolver": {
    typescript: true,
  },
};

export const importX: Linter.Config[] = [
  {
    name: "yarapa/import-x",
    plugins: { "import-x": importXPlugin },
    rules: importXRules,
    settings: importXSettings,
  },
];
