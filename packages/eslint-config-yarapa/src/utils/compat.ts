/**
 * Return a required upstream config value.
 * @param value Upstream config value to validate.
 * @param label Name used in the missing-value error.
 * @returns The non-null upstream config value.
 */
export function required<T>(value: null | T | undefined, label: string): T {
  if (value === null || value === undefined) {
    throw new Error(`Missing required upstream config: ${label}`);
  }

  return value;
}
