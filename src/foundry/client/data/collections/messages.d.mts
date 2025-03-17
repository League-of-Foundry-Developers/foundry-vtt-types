import type { Identity } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of ChatMessage documents which exist within the active World.
   * This Collection is accessible within the Game object as game.messages.
   *
   * @see {@link ChatMessage} The ChatMessage document
   * @see {@link ChatLog} The ChatLog sidebar directory
   */
  class Messages extends WorldCollection<typeof foundry.documents.BaseChatMessage, "Messages"> {
    static documentName: "ChatMessage";

    override get directory(): typeof ui.chat;

    render(force?: boolean): void;

    /**
     * If requested, dispatch a Chat Bubble UI for the newly created message
     * @param message - The ChatMessage document to say
     */
    sayBubble(message: ChatMessage.ConfiguredInstance): void;

    /**
     * Handle export of the chat log to a text file
     */
    export(): void;

    /**
     * Allow for bulk deletion of all chat messages, confirm first with a yes/no dialog.
     * @see {@link Dialog.confirm}
     */
    flush(): Promise<Promise<Document.Stored<ChatMessage.ConfiguredInstance>[]> | false | null>;
  }

  namespace Messages {
    interface Any extends AnyMessages {}
    interface AnyConstructor extends Identity<typeof AnyMessages> {}
  }
}

declare abstract class AnyMessages extends Messages {
  constructor(arg0: never, ...args: never[]);
}
