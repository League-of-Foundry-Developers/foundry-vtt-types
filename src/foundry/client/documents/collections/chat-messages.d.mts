import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The singleton collection of ChatMessage documents which exist within the active World.
 * This Collection is accessible within the Game object as game.messages.
 *
 * @see {@linkcode ChatMessage} The ChatMessage document
 * @see {@linkcode ChatLog} The ChatLog sidebar directory
 */
declare class ChatMessages extends foundry.documents.abstract.WorldCollection<"ChatMessage", "Messages"> {
  static documentName: "ChatMessage";

  override get directory(): typeof ui.chat;

  render(force?: boolean): void;

  /**
   * If requested, dispatch a Chat Bubble UI for the newly created message
   * @param message - The ChatMessage document to say
   */
  sayBubble(message: ChatMessage.Implementation): void;

  /**
   * Handle export of the chat log to a text file
   */
  export(): void;

  /**
   * Allow for bulk deletion of all chat messages, confirm first with a yes/no dialog.
   * @see {@linkcode Dialog.confirm}
   */
  flush(): Promise<Promise<ChatMessage.Stored[]> | false | null>;
}

declare namespace ChatMessages {
  interface Any extends AnyMessages {}
  interface AnyConstructor extends Identity<typeof AnyMessages> {}

  interface ConfiguredClass extends Document.ConfiguredCollectionClass<"ChatMessage"> {}
  interface Configured extends Document.ConfiguredCollection<"ChatMessage"> {}
}

declare abstract class AnyMessages extends ChatMessages {
  constructor(...args: never);
}

export default ChatMessages;
