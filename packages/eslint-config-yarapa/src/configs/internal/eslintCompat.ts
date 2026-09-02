import type { Linter } from "eslint";

type FlatPlugin = NonNullable<Linter.Config["plugins"]>[string];

/**
 * Bridges `defineConfig()` results to the plain `Linter.Config[]` shape the
 * public presets promise. `defineConfig` carries internal plugin/extends
 * typing that does not flow through the public `configs` surface; the runtime
 * array is passed through unchanged.
 * @param config Config array produced by `defineConfig()`.
 * @returns The unchanged config array with the public preset typing.
 */
export function asFlatConfigArray(config: unknown): Linter.Config[] {
  return config as Linter.Config[];
}

/**
 * Bridges plugin packages that still publish their Flat Config plugin type
 * through `@types/eslint` to ESLint 10's `@eslint/core` plugin type. The
 * runtime object is passed through unchanged; this exists only at the
 * dependency type boundary.
 * @param plugin Plugin runtime object to bridge.
 * @returns The unchanged plugin object with ESLint 10-compatible typing.
 */
export function asFlatPlugin(plugin: unknown): FlatPlugin {
  return plugin as FlatPlugin;
}
