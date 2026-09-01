import type { Linter } from "eslint";

import securityPlugin from "eslint-plugin-security";

import { asFlatPlugin } from "./internal/eslintCompat.js";
import { required } from "./internal/required.js";

const securityRecommended = required(
  securityPlugin.configs.recommended,
  "eslint-plugin-security.configs.recommended",
);
const securityRecommendedPlugin = asFlatPlugin(
  required(
    securityRecommended.plugins?.security,
    "eslint-plugin-security.configs.recommended.plugins.security",
  ),
);
const securityRecommendedRules = required(
  securityRecommended.rules,
  "eslint-plugin-security.configs.recommended.rules",
);

/**
 * `eslint-plugin-security` recommended coverage with every recommended
 * warning promoted to error, per the mandatory plugin policy.
 */
export const security: Linter.Config[] = [
  {
    name: "yarapa/security/recommended",
    plugins: { security: securityRecommendedPlugin },
    rules: Object.fromEntries(
      Object.entries(securityRecommendedRules).map(([rule, severity]) => [
        rule,
        severity === "warn" ? "error" : severity,
      ]),
    ),
  },
];
