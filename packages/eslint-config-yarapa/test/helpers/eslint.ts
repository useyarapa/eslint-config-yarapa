import type { Linter } from "eslint";

import { ESLint } from "eslint";
import { fileURLToPath } from "node:url";

export const packageRoot = fileURLToPath(new URL("../../", import.meta.url));

/**
 * Create ESLint over an explicit Flat Config array.
 * @param config Flat Config entries to lint with.
 * @param options Extra ESLint options such as autofix.
 * @param options.fix Whether ESLint applies autofixes while linting.
 * @returns ESLint instance configured with the supplied entries.
 */
export function eslintForConfigs(
  config: Linter.Config[],
  options: { fix?: boolean } = {},
): ESLint {
  return new ESLint({
    cwd: packageRoot,
    fix: options.fix,
    overrideConfig: config,
    overrideConfigFile: true,
  });
}
