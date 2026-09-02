import type { Linter } from "eslint";

import securityPlugin from "eslint-plugin-security";

import { asFlatPlugin } from "./internal/eslintCompat.js";
import { required } from "./internal/required.js";

// eslint-plugin-security is CommonJS and its bundled @types declare named
// exports that Node's CJS interop does not provide at runtime, so the
// namespace must be reached through the default import, so the rule below
// is suppressed for this audited access.
// eslint-disable-next-line import-x/no-named-as-default-member -- CJS interop.
const { configs: securityConfigs } = securityPlugin;

const securityRecommended = required(
  securityConfigs.recommended,
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
 * Security-plugin recommended coverage with every recommended warning
 * promoted to error under YARAPA's zero-warning policy.
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
