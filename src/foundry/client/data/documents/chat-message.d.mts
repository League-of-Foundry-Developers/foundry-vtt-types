import type { ConfiguredChatMessage } from "../../../../configuration/index.d.mts";
import type { HandleEmptyObject, InexactPartial, InterfaceToObject } from "../../../../utils/index.d.mts";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseChatMessage from "../../../common/documents/chat-message.d.mts";

declare global {
  namespace ChatMessage {
    /**
     * The implementation of the ChatMessage document instance configured through `CONFIG.ChatMessage.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredChatMessage | `configuration/ConfiguredChatMessage`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"ChatMessage">;

    /**
     * The implementation of the ChatMessage document configured through `CONFIG.ChatMessage.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"ChatMessage">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"ChatMessage"> {}

    type SubType = Game.Model.TypeNames<"ChatMessage">;
    type OfType<Type extends SubType> = HandleEmptyObject<ConfiguredChatMessage<Type>, ChatMessage<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `ChatMessage` that comes from the database.
     */
    interface Stored extends Document.Stored<ChatMessage.Implementation> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link ChatMessage._source | `ChatMessage._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link ChatMessage.create | `ChatMessage.create`}
     * and {@link ChatMessage | `new ChatMessage(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link ChatMessage.name | `ChatMessage#name`}.
     *
     * This is data transformed from {@link ChatMessage.Source | `ChatMessage.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link ChatMessage.update | `ChatMessage#update`}.
     * It is a distinct type from {@link ChatMessage.CreateData | `DeepPartial<ChatMessage.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link ChatMessage | `ChatMessage`}. This is the source of truth for how an ChatMessage document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link ChatMessage | `ChatMessage`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this ChatMessage document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      type: fields.DocumentTypeField<typeof BaseChatMessage, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

      system: fields.TypeDataField<typeof BaseChatMessage>;

      /**
       * The message type from CONST.CHAT_MESSAGE_STYLES
       * @defaultValue `CONST.CHAT_MESSAGE_STYLES.OTHER`
       */
      style: fields.NumberField<{
        required: true;
        choices: CONST.CHAT_MESSAGE_STYLES[];
        initial: typeof CONST.CHAT_MESSAGE_STYLES.OTHER;
        validationError: "must be a value in CONST.CHAT_MESSAGE_TYPES";
      }>;

      /**
       * The _id of the User document who generated this message
       * @defaultValue `game?.user?.id`
       */
      author: fields.ForeignDocumentField<typeof documents.BaseUser, { nullable: false; initial: () => string }>;

      /**
       * The timestamp at which point this message was generated
       * @defaultValue `Date.now()`
       */
      timestamp: fields.NumberField<{ required: true; nullable: false; initial: typeof Date.now }>;

      /**
       * An optional flavor text message which summarizes this message
       * @defaultValue `""`
       */
      flavor: fields.HTMLField;

      /**
       * The HTML content of this chat message
       * @defaultValue `""`
       */
      content: fields.HTMLField<{ textSearch: true }>;

      /**
       * A ChatSpeakerData object which describes the origin of the ChatMessage
       * @defaultValue see properties
       */
      speaker: fields.SchemaField<{
        /**
         * The _id of the Scene where this message was created
         * @defaultValue `null`
         */
        scene: fields.ForeignDocumentField<typeof documents.BaseScene, { idOnly: true }>;

        /**
         * The _id of the Actor who generated this message
         * @defaultValue `null`
         */
        actor: fields.ForeignDocumentField<typeof documents.BaseActor, { idOnly: true }>;

        /**
         * The _id of the Token who generated this message
         * @defaultValue `null`
         */
        token: fields.ForeignDocumentField<typeof documents.BaseToken, { idOnly: true }>;

        /**
         * An overridden alias name used instead of the Actor or Token name
         * @defaultValue `""`
         */
        alias: fields.StringField;
      }>;

      /**
       * An array of User _id values to whom this message is privately whispered
       * @defaultValue `[]`
       */
      whisper: fields.ArrayField<fields.ForeignDocumentField<typeof documents.BaseUser, { idOnly: true }>>;

      /**
       * Is this message sent blindly where the creating User cannot see it?
       * @defaultValue `false`
       */
      blind: fields.BooleanField;

      /**
       * Serialized content of any Roll instances attached to the ChatMessage
       * @defaultValue `[]`
       */
      rolls: fields.ArrayField<
        fields.JSONField<
          { validate: (rollJson: string) => void },
          fields.JSONField.AssignmentType<{ validate: (rollJson: string) => void }>,
          Roll // TODO: If initialization fails can this possibly be not-roll?
        >
      >;

      /**
       * The URL of an audio file which plays when this message is received
       * @defaultValue `null`
       */
      sound: fields.FilePathField<{ categories: ["AUDIO"] }>;

      /**
       * Is this message styled as an emote?
       * @defaultValue `false`
       */
      emote: fields.BooleanField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"ChatMessage", InterfaceToObject<CoreFlags>>;

      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for ChatMessages */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<ChatMessage.Parent> {}
      /** Options passed along in Create operations for ChatMessages */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<ChatMessage.CreateData, ChatMessage.Parent, Temporary> {
        rollMode?: foundry.CONST.DICE_ROLL_MODES;
        chatBubble?: boolean;
      }
      /** Options passed along in Delete operations for ChatMessages */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<ChatMessage.Parent> {}
      /** Options passed along in Update operations for ChatMessages */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<ChatMessage.UpdateData, ChatMessage.Parent> {}

      /** Options for {@link ChatMessage.createDocuments} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link ChatMessage._preCreateOperation} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link ChatMessage#_preCreate} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link ChatMessage#_onCreate} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link ChatMessage.updateDocuments} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link ChatMessage._preUpdateOperation} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link ChatMessage#_preUpdate} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link ChatMessage#_onUpdate} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link ChatMessage.deleteDocuments} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link ChatMessage._preDeleteOperation} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link ChatMessage#_preDelete} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link ChatMessage#_onDelete} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    interface CoreFlags {
      core?: {
        initiativeRoll?: boolean;
        RollTable?: string;
      };
    }

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
      message: ChatMessage.PersistedData;
      user: Document.Stored<User.Implementation>;
      author: User.Implementation | undefined;
      alias: string;
      cssClass: string;
      isWhisper: boolean;
      canDelete: boolean;
      whisperTo: string;
    }

    /**
     * @deprecated - {@link ChatMessage.DatabaseOperation}
     */
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface DatabaseOperations
      extends Document.Database.Operations<
        ChatMessage,
        { rollMode: foundry.CONST.DICE_ROLL_MODES; chatBubble: boolean },
        {},
        {}
      > {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */

    /**
     * @deprecated {@link ChatMessage.Types | `ChatMessage.SubType`}
     */
    type TypeNames = ChatMessage.SubType;

    /**
     * @deprecated {@link ChatMessage.CreateData | `ChatMessage.CreateData`}
     */
    interface ConstructorData extends ChatMessage.CreateData {}

    /**
     * @deprecated {@link ChatMessage.implementation | `ChatMessage.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link ChatMessage.Implementation | `ChatMessage.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side ChatMessage document which extends the common BaseChatMessage abstraction.
   * Each ChatMessage document contains ChatMessageData which defines its data schema.
   *
   * @see {@link Messages}                The world-level collection of ChatMessage documents
   *
   */
  class ChatMessage<out SubType extends ChatMessage.SubType = ChatMessage.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseChatMessage,
  )<SubType> {
    static override metadata: ChatMessage.Metadata;

    static get implementation(): ChatMessage.ImplementationClass;

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
      chatData: foundry.documents.BaseChatMessage.CreateData,
      rollMode: keyof typeof CONFIG.Dice.rollModes | "roll",
    ): foundry.documents.BaseChatMessage.CreateData;

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
      user: User.Implementation;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): ChatMessage["_source"]["speaker"];

    /**
     * Obtain an Actor instance which represents the speaker of this message (if any)
     * @param speaker - The speaker data object
     */
    static getSpeakerActor(speaker: ChatMessage["_source"]["speaker"]): Actor.Implementation | null;

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
    static getWhisperRecipients(name: string): Document.Stored<User.Implementation>[];

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
