import type { Linter } from "eslint";

import { isNil } from "es-toolkit";

type FlatPlugin = NonNullable<Linter.Config["plugins"]>[string];

/**
 * @param config - unknown plugin config to cast
 * @returns flat config array
 */
export function asFlatConfigArray(config: unknown): Linter.Config[] {
  return config as Linter.Config[];
}

/**
 * @param plugin - unknown plugin to cast
 * @returns flat plugin
 */
export function asFlatPlugin(plugin: unknown): FlatPlugin {
  return plugin as FlatPlugin;
}

/**
 * @param value - value to assert is non-null
 * @param label - name of the required config for error messages
 * @returns the value, guaranteed non-null
 */
export function required<T>(value: null | T | undefined, label: string): T {
  if (isNil(value)) {
    throw new Error(`Missing required upstream config: ${label}`);
  }

  return value;
}
