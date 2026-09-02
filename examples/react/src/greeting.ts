/**
 * Format the greeting text rendered by the component example.
 * @param name Name included in the greeting.
 * @returns Normalized greeting text.
 */
export function formatGreeting(name: string): string {
  const normalizedName = name.trim();

  if (normalizedName.length === 0) {
    return "Hello, guest";
  }

  return `Hello, ${normalizedName}`;
}
