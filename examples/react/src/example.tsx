import type { GreetingProps } from "./types.js";

import { formatGreeting } from "./greeting.js";

/**
 * Render a typed React component without framework-specific global state.
 * @param props Greeting properties.
 * @param props.name Name included in the rendered greeting.
 * @returns Rendered greeting text.
 */
export function Greeting({ name }: GreetingProps): string {
  return useGreeting(name);
}

/**
 * Compose greeting behavior behind a React custom-hook boundary.
 * @param name Name included in the greeting.
 * @returns Normalized greeting text.
 */
export function useGreeting(name: string): string {
  return formatGreeting(name);
}
