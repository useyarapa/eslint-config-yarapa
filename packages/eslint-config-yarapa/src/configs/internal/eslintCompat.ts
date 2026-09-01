import type { Linter } from "eslint";

type FlatPlugin = NonNullable<Linter.Config["plugins"]>[string];

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
