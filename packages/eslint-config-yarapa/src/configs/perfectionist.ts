import type { Linter } from "eslint";

import perfectionistPlugin from "eslint-plugin-perfectionist";

const perfectionistRules: Linter.RulesRecord = {
  "perfectionist/sort-array-includes": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-classes": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-decorators": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-enums": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-export-attributes": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-exports": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-heritage-clauses": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-import-attributes": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-imports": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-interfaces": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-intersection-types": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-jsx-props": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-maps": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-modules": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-named-exports": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-named-imports": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-object-types": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-objects": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-sets": ["error", { order: "asc", type: "natural" }],
  "perfectionist/sort-switch-case": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-union-types": [
    "error",
    { order: "asc", type: "natural" },
  ],
  "perfectionist/sort-variable-declarations": [
    "error",
    { order: "asc", type: "natural" },
  ],
};

export const perfectionist: Linter.Config[] = [
  {
    name: "yarapa/perfectionist",
    plugins: { perfectionist: perfectionistPlugin },
    rules: perfectionistRules,
  },
];
