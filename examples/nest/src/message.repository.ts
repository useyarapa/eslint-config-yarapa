/**
 * Storage boundary used by the Nest service example.
 */
export type MessageRepository = {
  findMessage(id: string): Promise<string | undefined>;
};
