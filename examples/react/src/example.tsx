type GreetingProps = {
  readonly name: string;
};

/**
 * Render a typed React component without framework-specific global state.
 * @param props Greeting properties.
 * @param props.name Name included in the rendered greeting.
 * @returns Rendered greeting text.
 */
export function Greeting({ name }: GreetingProps): string {
  return `Hello, ${name}`;
}
