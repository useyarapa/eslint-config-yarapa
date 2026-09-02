import type { PageInput } from "../types.js";
import { readSingleQueryValue } from "../lib/query.js";

/**
 * Render an App Router-shaped page without external example dependencies.
 * @param input Page input.
 * @param input.searchParams Asynchronous search parameters from the page boundary.
 * @returns Rendered page text.
 * @throws {Error} When the required name parameter is missing or ambiguous.
 */
export default async function Page(
  { searchParams }: PageInput,
): Promise<string> {
  const query = await searchParams;
  const name = readSingleQueryValue(query.name);

  if (name === undefined || name.trim().length === 0) {
    throw new Error("A single non-empty name query parameter is required");
  }

  return `YARAPA — ${name}`;
}
