import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/**
 * The singleton collection of ChatMessage documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.messages | game.messages}.
 *
 * @see {@linkcode foundry.documents.ChatMessage}: The ChatMessage document
 * @see {@linkcode foundry.applications.sidebar.tabs.ChatLog}: The ChatLog sidebar directory
 */
declare class ChatMessages extends WorldCollection<"ChatMessage", "Messages"> {
  static override documentName: "ChatMessage";

  override get directory(): typeof ui.chat;

  /** @remarks This is a no-op in {@linkcode ChatMessages} */
  override render(force?: boolean): void;

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
  flush(): Promise<ChatMessages.FlushDialogReturn>;
}

declare namespace ChatMessages {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode ChatMessages.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode ChatMessages.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyChatMessages {}
    interface AnyConstructor extends Identity<typeof AnyChatMessages> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"ChatMessage"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"ChatMessage"> {}

  type FlushDialogReturn = DialogV2.ConfirmReturn<{ yes: { callback: () => Promise<void> } }>;

  /** @deprecated Replaced by {@linkcode ChatMessages.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode ChatMessages.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

export default ChatMessages;

declare abstract class AnyChatMessages extends ChatMessages {
  constructor(...args: never);
}
