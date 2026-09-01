export function required<T>(
  value: T | null | undefined,
  label: string,
): T {
  if (value == null) {
    throw new Error(`Missing required upstream config: ${label}`);
  }

  return value;
}
