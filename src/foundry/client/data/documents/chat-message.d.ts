import {
  ConfiguredDocumentClass,
  ConfiguredObjectClassForName,
  ToObjectFalseType
} from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type { ChatMessageDataConstructorData } from "../../../common/data/data.mjs/chatMessageData";

declare global {
  /**
   * The client-side ChatMessage document which extends the common BaseChatMessage abstraction.
   * Each ChatMessage document contains ChatMessageData which defines its data schema.
   *
   * @see {@link data.ChatMessageData}              The ChatMessage data schema
   * @see {@link documents.Messages}                The world-level collection of ChatMessage documents
   *
   * @param data - Initial data provided to construct the ChatMessage document
   */
  class ChatMessage extends ClientDocumentMixin(foundry.documents.BaseChatMessage) {
    /**
     * The cached Roll instance that this message contains, if any
     * @defaultValue `null`
     * @internal
     */
    protected _roll: Roll | null;

    /**
     * Is the display of the roll in this message collapsed (false) or expanded (true)
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
     * Return the Roll instance contained in this chat message, if one is present
     */
    get roll(): Roll | null;

    /**
     * Return whether the ChatMessage is visible to the current User.
     * Messages may not be visible if they are private whispers.
     */
    get visible(): boolean;

    /**
     * The User who created the chat message.
     */
    get user(): InstanceType<ConfiguredDocumentClass<typeof User>> | undefined;

    override prepareData(): void;

    /**
     * Transform a provided object of ChatMessage data by applying a certain rollMode to the data object.
     * @param chatData - The object of ChatMessage data prior to applying a rollMode preference
     * @param rollMode - The rollMode preference to apply to this message data
     * @returns The modified ChatMessage data with rollMode preferences applied
     */
    static applyRollMode(
      chatData: ChatMessageDataConstructorData,
      rollMode: keyof typeof CONFIG.Dice.rollModes | "roll"
    ): ChatMessageDataConstructorData;

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
    static getSpeaker(
      options?: ChatMessage.GetSpeakerOptions | undefined
    ): foundry.data.ChatMessageData["speaker"]["_source"];

    /**
     * A helper to prepare the speaker object based on a target TokenDocument
     *
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromToken({
      token,
      alias
    }: {
      /** The TokenDocument of the speaker */
      token: InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): foundry.data.ChatMessageData["speaker"]["_source"];
    /**
     * A helper to prepare the speaker object based on a target TokenDocument
     *
     * @returns The identified speaker data
     * @deprecated Passing a Token is deprecated, a TokenDocument should be passed instead
     */
    protected static _getSpeakerFromToken({
      token,
      alias
    }: {
      /** The TokenDocument of the speaker */
      token: InstanceType<ConfiguredObjectClassForName<"Token">>;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): foundry.data.ChatMessageData["speaker"]["_source"];

    /**
     * A helper to prepare the speaker object based on a target Actor
     *
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromActor({
      scene,
      actor,
      alias
    }: {
      /** The Scene is which the speaker resides */
      scene?: InstanceType<ConfiguredDocumentClass<typeof Scene>> | undefined;

      /** The Actor that is speaking */
      actor: InstanceType<ConfiguredDocumentClass<typeof Actor>>;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): foundry.data.ChatMessageData["speaker"]["_source"];

    /**
     * A helper to prepare the speaker object based on a target User
     *
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromUser({
      scene,
      user,
      alias
    }: {
      /** The Scene in which the speaker resides */
      scene?: InstanceType<ConfiguredDocumentClass<typeof Scene>> | undefined;

      /** The User who is speaking */
      user: InstanceType<ConfiguredDocumentClass<typeof User>>;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): foundry.data.ChatMessageData["speaker"]["_source"];

    /**
     * Obtain an Actor instance which represents the speaker of this message (if any)
     * @param speaker - The speaker data object
     */
    static getSpeakerActor(
      speaker: foundry.data.ChatMessageData["speaker"]["_source"]
    ): InstanceType<ConfiguredDocumentClass<typeof Actor>> | null;

    /**
     * Obtain a data object used to evaluate any dice rolls associated with this particular chat message
     */
    getRollData(): object;

    /**
     * Given a string whisper target, return an Array of the user IDs which should be targeted for the whisper
     *
     * @param name - The target name of the whisper target
     * @returns An array of User instances
     */
    static getWhisperRecipients(name: string): StoredDocument<InstanceType<ConfiguredDocumentClass<typeof User>>>[];

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

    protected override _preCreate(
      data: ChatMessageDataConstructorData,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    protected override _onCreate(
      data: foundry.data.ChatMessageData["_source"],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onUpdate(
      data: DeepPartial<foundry.data.ChatMessageData["_source"]>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Export the content of the chat message into a standardized log format
     */
    export(): string;
  }

  namespace ChatMessage {
    interface GetSpeakerOptions {
      /** The Scene in which the speaker resides */
      scene?: InstanceType<ConfiguredDocumentClass<typeof Scene>> | undefined;

      /** The Actor whom is speaking */
      actor?: InstanceType<ConfiguredDocumentClass<typeof Actor>> | undefined;

      /** The Token whom is speaking */
      token?: InstanceType<ConfiguredDocumentClass<typeof TokenDocument>> | undefined;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }

    interface MessageData {
      message: ToObjectFalseType<ChatMessage>;
      user: StoredDocument<InstanceType<ConfiguredDocumentClass<typeof User>>>;
      author: InstanceType<ConfiguredDocumentClass<typeof User>> | undefined;
      alias: string;
      cssClass: string;
      isWhisper: boolean;
      canDelete: boolean;
      whisperTo: string;
    }
  }
}
