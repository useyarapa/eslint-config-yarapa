import type { SearchValue } from "../types.js";

/**
 * Read one query value while rejecting ambiguous repeated values.
 * @param value Search parameter value.
 * @returns A single value when present and unambiguous.
 */
export function readSingleQueryValue(value: SearchValue): string | undefined {
  if (typeof value === "string" || value === undefined) {
    return value;
  }

  return value.length === 1 ? value[0] : undefined;
}
