import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The singleton collection of ChatMessage documents which exist within the active World.
   * This Collection is accessible within the Game object as game.messages.
   *
   * @see {@link ChatMessage} The ChatMessage document
   * @see {@link ChatLog} The ChatLog sidebar directory
   */
  class Messages extends WorldCollection<typeof foundry.documents.BaseChatMessage, "Messages"> {
    static override documentName: "ChatMessage";

    override get directory(): typeof ui.chat;

    override render(force?: boolean): void;

    /**
     * If requested, dispatch a Chat Bubble UI for the newly created message
     * @param message - The ChatMessage document to say
     */
    sayBubble(message: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseChatMessage>>): void;

    /**
     * Handle export of the chat log to a text file
     */
    export(): void;

    /**
     * Allow for bulk deletion of all chat messages, confirm first with a yes/no dialog.
     * @see {@link Dialog.confirm}
     */
    flush(): Promise<
      | Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseChatMessage>>>[]>
      | false
      | null
    >;
  }
}
