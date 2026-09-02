export type MessageRepository = {
  findMessage(id: string): Promise<string | undefined>;
};

/**
 * Small service boundary showing typed async work and explicit error handling.
 */
export class ExampleService {
  /**
   * Create a service backed by a message repository.
   * @param repository Message storage boundary.
   */
  public constructor(private readonly repository: MessageRepository) {}

  /**
   * Load a required message.
   * @param id Message identifier.
   * @returns The stored message.
   * @throws When the requested message does not exist.
   */
  public async requireMessage(id: string): Promise<string> {
    const message = await this.repository.findMessage(id);

    if (message === undefined) {
      throw new Error(`Message ${id} was not found`);
    }

    return message;
  }
}
