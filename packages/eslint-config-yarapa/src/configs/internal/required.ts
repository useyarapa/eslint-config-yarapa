/**
 * @param value - value to assert is non-null
 * @param label - name of the required config for error messages
 * @returns the value, guaranteed non-null
 */
export function required<T>(value: null | T | undefined, label: string): T {
  if (value === null || value === undefined) {
    throw new Error(`Missing required upstream config: ${label}`);
  }

  return value;
}
