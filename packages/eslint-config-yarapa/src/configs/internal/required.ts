/**
 * Return a required upstream value or fail with context.
 * @param value Candidate upstream value.
 * @param label Human-readable upstream config label.
 * @returns The non-null upstream value.
 */
export function required<T>(
  value: null | T | undefined,
  label: string,
): T {
  if (value === null || value === undefined) {
    throw new Error(`Missing required upstream config: ${label}`);
  }

  return value;
}
