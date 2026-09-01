import type { Linter } from "eslint";

type FlatPlugin = NonNullable<Linter.Config["plugins"]>[string];

/**
 * Bridges plugin packages that still publish their Flat Config plugin type
 * through `@types/eslint` to ESLint 10's `@eslint/core` plugin type. The
 * runtime object is passed through unchanged; this exists only at the
 * dependency type boundary.
 */
export function asFlatPlugin(plugin: unknown): FlatPlugin {
  return plugin as FlatPlugin;
}
