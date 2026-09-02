interface GreetingProps {
  readonly name: string;
}

/**
 * Render a typed React component without framework-specific global state.
 * @param props Greeting properties.
 * @returns Rendered greeting.
 */
export function Greeting({ name }: GreetingProps) {
  return <strong>Hello, {name}</strong>;
}
