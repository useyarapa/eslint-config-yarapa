import type { Linter } from "eslint";

import securityPlugin from "eslint-plugin-security";

const securityRecommended = securityPlugin.configs.recommended;

/**
 * `eslint-plugin-security` recommended coverage with every recommended
 * warning promoted to error, per the mandatory plugin policy.
 */
export const security: Linter.Config[] = [
  {
    name: "yarapa/security/recommended",
    plugins: { security: securityRecommended.plugins.security },
    rules: Object.fromEntries(
      Object.entries(securityRecommended.rules).map(([rule, severity]) => [
        rule,
        severity === "warn" ? "error" : severity,
      ]),
    ),
  },
];
