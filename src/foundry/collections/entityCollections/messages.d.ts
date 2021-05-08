/**
 * A :class:`EntityCollection` of class:`ChatMessage` entities
 * The Messages collection is accessible within the game as `game.messages`.
 *
 */
declare class Messages extends WorldCollection<ChatMessage> {
  /** @override */
  get entity(): string;

  /** @override */
  render(force?: boolean, options?: any): any; // Mismatched types

  /**
   * If requested, dispatch a Chat Bubble UI for the newly created message
   * @param message - The ChatMessage entity to say
   */
  protected sayBubble(message: ChatMessage): void;

  /**
   * Handle export of the chat log to a text file
   */
  protected export(): void;

  /**
   * Allow for bulk deletion of all chat messages, confirm first with a yes/no dialog.
   * @see {@link Dialog.confirm}
   */
  flush(): Promise<void>;
}
