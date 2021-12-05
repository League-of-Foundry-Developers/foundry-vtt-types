import { ConfiguredDocumentClass, ConstructorDataType } from '../../../types/helperTypes';
import { DocumentModificationOptions } from '../../common/abstract/document.mjs';

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
    constructor(
      data?: ConstructorParameters<ConstructorOf<foundry.documents.BaseChatMessage>>[0],
      context?: ConstructorParameters<ConstructorOf<foundry.documents.BaseChatMessage>>[1]
    );

    /**
     * If the chat message contains a Roll instance, cache it here
     * @defaultValue `null`
     */
    protected _roll: Roll | null;

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
    get user(): User | undefined;

    /** @override */
    prepareData(): void;

    /**
     * Transform a provided object of ChatMessage data by applying a certain rollMode to the data object.
     * @param chatData - The object of ChatMessage data prior to applying a rollMode preference
     * @param rollMode - The rollMode preference to apply to this message data
     * @returns The modified ChatMessage data with rollMode preferences applied
     */
    static applyRollMode(
      chatData: ConstructorDataType<foundry.data.ChatMessageData>,
      rollMode: foundry.CONST.DICE_ROLL_MODES
    ): ConstructorDataType<foundry.data.ChatMessageData>;

    /**
     * Update the data of a ChatMessage instance to apply a requested rollMode
     * @param rollMode - The rollMode preference to apply to this message data
     */
    applyRollMode(rollMode: foundry.CONST.DICE_ROLL_MODES): void;

    /**
     * Attempt to determine who is the speaking character (and token) for a certain Chat Message
     * First assume that the currently controlled Token is the speaker
     *
     * @param scene - The Scene in which the speaker resides
     * @param actor - The Actor whom is speaking
     * @param token - The Token whom is speaking
     * @param alias - The name of the speaker to display
     *
     * @returns The identified speaker data
     */
    static getSpeaker({
      scene,
      actor,
      token,
      alias
    }?: {
      scene?: InstanceType<ConfiguredDocumentClass<typeof Scene>> | undefined;
      actor?: InstanceType<ConfiguredDocumentClass<typeof Actor>> | undefined;
      token?: InstanceType<ConfiguredDocumentClass<typeof TokenDocument>> | undefined;
      alias?: string | undefined;
    }): foundry.data.ChatMessageData['speaker']['_source'];

    /**
     * A helper to prepare the speaker object based on a target TokenDocument
     *
     * @param token - The TokenDocument of the speaker
     * @param alias - The name of the speaker to display
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromToken({
      token,
      alias
    }: {
      token: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseToken>>;
      alias: string;
    }): foundry.data.ChatMessageData['speaker']['_source'];
    /**
     * A helper to prepare the speaker object based on a target TokenDocument
     *
     * @param token - The TokenDocument of the speaker
     * @param alias - The name of the speaker to display
     * @returns The identified speaker data
     * @deprecated Passing a Token is deprecated, a TokenDocument should be passed instead
     */
    protected static _getSpeakerFromToken({
      token,
      alias
    }: {
      token: InstanceType<CONFIG['Token']['objectClass']>;
      alias: string;
    }): foundry.data.ChatMessageData['speaker']['_source'];

    /**
     * A helper to prepare the speaker object based on a target Actor
     *
     * @param scene - The Scene is which the speaker resides
     * @param actor - The Actor that is speaking
     * @param alias - The name of the speaker to display
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromActor({
      scene,
      actor,
      alias
    }: {
      scene?: InstanceType<ConfiguredDocumentClass<typeof Scene>>;
      actor: InstanceType<ConfiguredDocumentClass<typeof Actor>>;
      alias?: string;
    }): foundry.data.ChatMessageData['speaker']['_source'];

    /**
     * A helper to prepare the speaker object based on a target User
     *
     * @param scene - The Scene in which the speaker resides
     * @param user  - The User who is speaking
     * @param alias - The name of the speaker to display
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromUser({
      scene,
      user,
      alias
    }: {
      scene?: InstanceType<ConfiguredDocumentClass<typeof Scene>>;
      user: InstanceType<ConfiguredDocumentClass<typeof User>>;
      alias?: string;
    }): foundry.data.ChatMessageData['speaker']['_source'];

    /**
     * Obtain an Actor instance which represents the speaker of this message (if any)
     * @param speaker - The speaker data object
     */
    static getSpeakerActor(speaker: foundry.data.ChatMessageData['speaker']['_source']): Actor | null;

    /**
     * Obtain a data object used to evaluate any dice rolls associated with this particular chat message
     */
    getRollData(): InstanceType<ConfiguredDocumentClass<typeof Actor>>['getRollData'] | {};

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

    /** @override */
    _preCreate(
      data: ConstructorDataType<foundry.data.ChatMessageData>,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    /** @override */
    _onCreate(
      data: foundry.data.ChatMessageData['_source'],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @override */
    _onUpdate(
      data: DeepPartial<foundry.data.ChatMessageData['_source']>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @override */
    _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Export the content of the chat message into a standardized log format
     */
    export(): string;
  }
}

export {};
