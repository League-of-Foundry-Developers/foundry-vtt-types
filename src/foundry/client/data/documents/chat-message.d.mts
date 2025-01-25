import type { InexactPartial } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";
import type BaseChatMessage from "../../../common/documents/chat-message.d.mts";

declare global {
  namespace ChatMessage {
    type Metadata = Document.MetadataFor<ChatMessage>;

    type ConfiguredClass = Document.ConfiguredClassForName<"ChatMessage">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"ChatMessage">;

    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface DatabaseOperations
      extends Document.Database.Operations<
        ChatMessage,
        { rollMode: foundry.CONST.DICE_ROLL_MODES; chatBubble: boolean },
        {},
        {}
      > {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */

    // Helpful aliases
    type TypeNames = BaseChatMessage.TypeNames;
    type ConstructorData = BaseChatMessage.ConstructorData;
    type UpdateData = BaseChatMessage.UpdateData;
    type Schema = BaseChatMessage.Schema;
    type Source = BaseChatMessage.Source;

    interface GetSpeakerOptions {
      /** The Scene in which the speaker resides */
      scene: Scene | null;

      /** The Actor whom is speaking */
      actor: Actor | null | undefined;

      /** The Token whom is speaking */
      token: TokenDocument | Token | null | undefined;

      /** The name of the speaker to display */
      alias: string | undefined;
    }

    interface MessageData {
      message: Document.ToObjectFalseType<ChatMessage>;
      user: Document.Stored<User.ConfiguredInstance>;
      author: User.ConfiguredInstance | undefined;
      alias: string;
      cssClass: string;
      isWhisper: boolean;
      canDelete: boolean;
      whisperTo: string;
    }
  }

  /**
   * The client-side ChatMessage document which extends the common BaseChatMessage abstraction.
   * Each ChatMessage document contains ChatMessageData which defines its data schema.
   *
   * @see {@link Messages}                The world-level collection of ChatMessage documents
   *
   */
  class ChatMessage extends ClientDocumentMixin(foundry.documents.BaseChatMessage) {
    static override metadata: ChatMessage.Metadata;

    static get implementation(): ChatMessage.ConfiguredClass;

    /**
     * Is the display of dice rolls in this message collapsed (false) or expanded (true)
     * @defaultValue `false`
     * @internal
     */
    protected _rollExpanded: boolean;

    /**
     * Is this ChatMessage currently displayed in the sidebar ChatLog?
     * @defaultValue `false`
     */
    logged: boolean;

    /**
     * Return the recommended String alias for this message.
     * The alias could be a Token name in the case of in-character messages or dice rolls.
     * Alternatively it could be a User name in the case of OOC chat or whispers.
     */
    get alias(): string;

    /**
     * Is the current User the author of this message?
     */
    get isAuthor(): boolean;

    /**
     * Return whether the content of the message is visible to the current user.
     * For certain dice rolls, for example, the message itself may be visible while the content of that message is not.
     */
    get isContentVisible(): boolean;

    /**
     * Test whether the chat message contains a dice roll
     */
    get isRoll(): boolean;

    /**
     * Return whether the ChatMessage is visible to the current User.
     * Messages may not be visible if they are private whispers.
     */
    get visible(): boolean;

    override prepareDerivedData(): void;

    /**
     * Transform a provided object of ChatMessage data by applying a certain rollMode to the data object.
     * @param chatData - The object of ChatMessage data prior to applying a rollMode preference
     * @param rollMode - The rollMode preference to apply to this message data
     * @returns The modified ChatMessage data with rollMode preferences applied
     */
    static applyRollMode(
      chatData: foundry.documents.BaseChatMessage.ConstructorData,
      rollMode: keyof typeof CONFIG.Dice.rollModes | "roll",
    ): foundry.documents.BaseChatMessage.ConstructorData;

    /**
     * Update the data of a ChatMessage instance to apply a requested rollMode
     * @param rollMode - The rollMode preference to apply to this message data
     */
    applyRollMode(rollMode: keyof typeof CONFIG.Dice.rollModes | "roll"): void;

    /**
     * Attempt to determine who is the speaking character (and token) for a certain Chat Message
     * First assume that the currently controlled Token is the speaker
     *
     * @param options - (default: `{}`)
     *
     * @returns The identified speaker data
     */
    static getSpeaker(options?: InexactPartial<ChatMessage.GetSpeakerOptions>): ChatMessage["_source"]["speaker"];

    /**
     * A helper to prepare the speaker object based on a target TokenDocument
     * @param options - Options which affect speaker identification
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromToken(options: {
      /** The TokenDocument of the speaker */
      token: TokenDocument;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): ChatMessage["_source"]["speaker"];

    /**
     * A helper to prepare the speaker object based on a target Actor
     * @param options - Options which affect speaker identification
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromActor(options: {
      /** The Scene is which the speaker resides */
      scene?: Scene | undefined;

      /** The Actor that is speaking */
      actor: Actor;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): ChatMessage["_source"]["speaker"];

    /**
     * A helper to prepare the speaker object based on a target User
     * @param options - Options which affect speaker identification
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromUser(options: {
      /** The Scene in which the speaker resides */
      scene?: Scene | undefined;

      /** The User who is speaking */
      user: User;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): ChatMessage["_source"]["speaker"];

    /**
     * Obtain an Actor instance which represents the speaker of this message (if any)
     * @param speaker - The speaker data object
     */
    static getSpeakerActor(speaker: ChatMessage["_source"]["speaker"]): Actor.ConfiguredInstance | null;

    /**
     * Obtain a data object used to evaluate any dice rolls associated with this particular chat message
     */
    getRollData(): Record<string, unknown>;

    /**
     * Given a string whisper target, return an Array of the user IDs which should be targeted for the whisper
     *
     * @param name - The target name of the whisper target
     * @returns An array of User instances
     */
    static getWhisperRecipients(name: string): Document.Stored<User.ConfiguredInstance>[];

    /**
     * Render the HTML for the ChatMessage which should be added to the log
     */
    getHTML(): Promise<JQuery>;

    /**
     * Render the inner HTML content for ROLL type messages.
     * @param messageData - The chat message data used to render the message HTML
     * @internal
     */
    protected _renderRollContent(messageData: ChatMessage.MessageData): Promise<void>;

    /**
     * Render HTML for the array of Roll objects included in this message.
     * @param isPrivate - Is the chat message private?
     * @returns The rendered HTML string
     */
    protected _renderRollHTML(isPrivate: boolean): Promise<string>;

    /**
     * @privateRemarks _preCreate, _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Export the content of the chat message into a standardized log format
     */
    export(): string;
  }
}
