import type { Linter } from "eslint";

import { ESLint } from "eslint";
import { fileURLToPath } from "node:url";

import { configs } from "../../src/index.js";

export const packageRoot = fileURLToPath(new URL("../../", import.meta.url));

type PresetName = keyof typeof configs;

/**
 * Create ESLint for one preset or a composed public-preset list.
 * @param presets Single public preset or composition list.
 * @param options Extra ESLint options such as autofix.
 * @param options.fix Whether ESLint applies autofixes while linting.
 * @returns ESLint instance configured with only those presets.
 */
export function eslintFor(
  presets: PresetName | PresetName[],
  options: { fix?: boolean } = {},
): ESLint {
  const list = Array.isArray(presets) ? presets : [presets];

  return eslintForConfigs(
    list.flatMap(preset => Reflect.get(configs, preset)),
    options,
  );
}

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
