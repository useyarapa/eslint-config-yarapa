import type { Linter } from "eslint";

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
