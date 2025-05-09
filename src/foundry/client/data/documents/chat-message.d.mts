import type { ConfiguredChatMessage } from "fvtt-types/configuration";
import type { AnyObject, InexactPartial, InterfaceToObject, Merge } from "fvtt-types/utils";
import type { documents } from "#client-esm/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseChatMessage from "#common/documents/chat-message.d.mts";

import fields = foundry.data.fields;

declare global {
  namespace ChatMessage {
    /**
     * The document's name.
     */
    type Name = "ChatMessage";

    /**
     * The arguments to construct the document.
     */
    type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

    /**
     * The documents embedded within `ChatMessage`.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the `ChatMessage` document instance configured through `CONFIG.ChatMessage.documentClass` in Foundry and
     * {@linkcode DocumentClassConfig} or {@link ConfiguredChatMessage | `fvtt-types/configuration/ConfiguredChatMessage`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the `ChatMessage` document configured through `CONFIG.ChatMessage.documentClass` in Foundry and
     * {@linkcode DocumentClassConfig} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<Name>;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata
      extends Merge<
        Document.Metadata.Default,
        Readonly<{
          name: "ChatMessage";
          collection: "messages";
          label: string;
          labelPlural: string;
          hasTypeData: true;
          isPrimary: true;
          permissions: Metadata.Permissions;
          schemaVersion: string;
        }>
      > {}

    namespace Metadata {
      /**
       * The permissions for whether a certain user can create, update, or delete this document.
       */
      interface Permissions {
        create(user: User.Internal.Implementation, doc: Implementation): boolean;
        update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      }
    }

    /**
     * Allowed subtypes of `ChatMessage`. This is configured through various methods. Modern Foundry
     * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
     * under {@linkcode CONFIG.ChatMessage.dataModels}. This corresponds to
     * fvtt-type's {@linkcode DataModelConfig}.
     *
     * Subtypes can also be registered through a `template.json` though this is discouraged.
     * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
     * {@linkcode DataConfig}.
     */
    type SubType = Game.Model.TypeNames<"ChatMessage">;

    /**
     * `ConfiguredSubTypes` represents the subtypes a user explicitly registered. This excludes
     * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
     * module subtypes `${string}.${string}`.
     *
     * @see {@link SubType} for more information.
     */
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"ChatMessage">;

    /**
     * `Known` represents the types of `ChatMessage` that a user explicitly registered.
     *
     * @see {@link ConfiguredSubTypes} for more information.
     */
    type Known = ChatMessage.OfType<ChatMessage.ConfiguredSubTypes>;

    /**
     * `OfType` returns an instance of `ChatMessage` with the corresponding type. This works with both the
     * builtin `ChatMessage` class or a custom subclass if that is set up in
     * {@link ConfiguredChatMessage | `fvtt-types/configuration/ConfiguredChatMessage`}.
     */
    // eslint-disable-next-line @typescript-eslint/no-restricted-types
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredChatMessage<Type>, ChatMessage<Type>>;

    /**
     * `SystemOfType` returns the system property for a specific `ChatMessage` subtype.
     */
    type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<_SystemMap, Type>;

    /**
     * @internal
     */
    interface _SystemMap extends Document.Internal.SystemMap<"ChatMessage"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all instances, or never if the document doesn't have any descendants.
     */
    type Descendant = never;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all classes, or never if the document doesn't have any descendants.
     */
    type DescendantClass = never;

    /**
     * Types of `CompendiumCollection` this document might be contained in.
     * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
     */
    // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
    type Pack = never;

    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Embedded = never;

    /**
     * The name of the world or embedded collection this document can find itself in.
     * For example an `Item` is always going to be inside a collection with a key of `items`.
     * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
     */
    type ParentCollectionName = Metadata["collection"];

    /**
     * The world collection that contains `ChatMessage`s. Will be `never` if none exists.
     */
    type CollectionClass = Messages.ConfiguredClass;

    /**
     * The world collection that contains `ChatMessage`s. Will be `never` if none exists.
     */
    type Collection = Messages.Configured;

    /**
     * An instance of `ChatMessage` that comes from the database but failed validation meaning that
     * its `system` and `_source` could theoretically be anything.
     */
    interface Invalid<out SubType extends ChatMessage.SubType = ChatMessage.SubType>
      extends Document.Invalid<OfType<SubType>> {}

    /**
     * An instance of `ChatMessage` that comes from the database.
     */
    interface Stored<out SubType extends ChatMessage.SubType = ChatMessage.SubType>
      extends Document.Stored<OfType<SubType>> {}

    /**
     * The data put in {@link ChatMessage._source | `ChatMessage#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@linkcode Set}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated Replaced with {@linkcode ChatMessage.Source}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a document. Used in places like {@linkcode ChatMessage.create}
     * and {@link ChatMessage | `new ChatMessage(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link ChatMessage.name | `ChatMessage#name`}.
     *
     * This is data transformed from {@linkcode ChatMessage.Source} and turned into more
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
     * The schema for {@linkcode ChatMessage}. This is the source of truth for how an ChatMessage document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@linkcode ChatMessage}. For example
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
      speaker: fields.SchemaField<SpeakerSchema>;

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
          // eslint-disable-next-line @typescript-eslint/no-deprecated
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
      flags: fields.ObjectField.FlagsField<Name, InterfaceToObject<CoreFlags>>;

      _stats: fields.DocumentStatsField;
    }

    interface SpeakerSchema extends DataSchema {
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
    }

    interface SpeakerData extends fields.SchemaField.InitializedData<SpeakerSchema> {}

    namespace Database {
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

      /** Operation for {@linkcode ChatMessage.createDocuments} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<ChatMessage.Database.Create<Temporary>> {}

      /** Operation for {@linkcode ChatMessage.updateDocuments} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<ChatMessage.Database.Update> {}

      /** Operation for {@linkcode ChatMessage.deleteDocuments} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<ChatMessage.Database.Delete> {}

      /** Operation for {@linkcode ChatMessage.create} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<ChatMessage.Database.Create<Temporary>> {}

      /** Operation for {@link ChatMessage.update | `ChatMessage#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@linkcode ChatMessage.get} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link ChatMessage._preCreate | `ChatMessage#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link ChatMessage._onCreate | `ChatMessage#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@linkcode ChatMessage._preCreateOperation} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<ChatMessage.Database.Create> {}

      /** Operation for {@link ChatMessage._onCreateOperation | `ChatMessage#_onCreateOperation`} */
      interface OnCreateOperation extends ChatMessage.Database.Create {}

      /** Options for {@link ChatMessage._preUpdate | `ChatMessage#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link ChatMessage._onUpdate | `ChatMessage#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@linkcode ChatMessage._preUpdateOperation} */
      interface PreUpdateOperation extends ChatMessage.Database.Update {}

      /** Operation for {@link ChatMessage._onUpdateOperation | `ChatMessage._preUpdateOperation`} */
      interface OnUpdateOperation extends ChatMessage.Database.Update {}

      /** Options for {@link ChatMessage._preDelete | `ChatMessage#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link ChatMessage._onDelete | `ChatMessage#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link ChatMessage._preDeleteOperation | `ChatMessage#_preDeleteOperation`} */
      interface PreDeleteOperation extends ChatMessage.Database.Delete {}

      /** Options for {@link ChatMessage._onDeleteOperation | `ChatMessage#_onDeleteOperation`} */
      interface OnDeleteOperation extends ChatMessage.Database.Delete {}

      /** Context for {@linkcode ChatMessage._onDeleteOperation} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<ChatMessage.Parent> {}

      /** Context for {@linkcode ChatMessage._onCreateDocuments} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<ChatMessage.Parent> {}

      /** Context for {@linkcode ChatMessage._onUpdateDocuments} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<ChatMessage.Parent> {}

      /**
       * Options for {@link ChatMessage._preCreateDescendantDocuments | `ChatMessage#_preCreateDescendantDocuments`}
       * and {@link ChatMessage._onCreateDescendantDocuments | `ChatMessage#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<ChatMessage.Database.Create> {}

      /**
       * Options for {@link ChatMessage._preUpdateDescendantDocuments | `ChatMessage#_preUpdateDescendantDocuments`}
       * and {@link ChatMessage._onUpdateDescendantDocuments | `ChatMessage#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<ChatMessage.Database.Update> {}

      /**
       * Options for {@link ChatMessage._preDeleteDescendantDocuments | `ChatMessage#_preDeleteDescendantDocuments`}
       * and {@link ChatMessage._onDeleteDescendantDocuments | `ChatMessage#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<ChatMessage.Database.Delete> {}
    }

    /**
     * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
     */
    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      /**
       * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
       */
      type Scope = Document.FlagKeyOf<Flags>;

      /**
       * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
       */
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;

      /**
       * Gets the type of a particular flag given a `Scope` and a `Key`.
       */
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    interface CoreFlags {
      core?: {
        canPopout?: boolean;
        initiativeRoll?: boolean;
        nue?: boolean;
        RollTable?: string;
      };
    }

    interface GetSpeakerOptions {
      /** The Scene in which the speaker resides */
      scene: Scene.Implementation | null;

      /** The Actor whom is speaking */
      actor: Actor.Implementation | null | undefined;

      /** The Token whom is speaking */
      token: TokenDocument.Implementation | Token.Implementation | null | undefined;

      /** The name of the speaker to display */
      alias: string | undefined;
    }

    interface MessageData {
      message: ChatMessage.Source;
      user: User.Stored;
      author: User.Implementation | undefined;
      alias: string;
      cssClass: string;
      isWhisper: boolean;
      canDelete: boolean;
      whisperTo: string;
    }

    /**
     * @deprecated Replaced with {@linkcode ChatMessage.DatabaseOperation}
     */
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface DatabaseOperations
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      extends Document.Database.Operations<
        ChatMessage.Implementation,
        { rollMode: foundry.CONST.DICE_ROLL_MODES; chatBubble: boolean },
        {},
        {}
      > {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */

    /**
     * @deprecated Replaced with {@linkcode ChatMessage.SubType}
     */
    type TypeNames = ChatMessage.SubType;

    /**
     * @deprecated Replaced with {@linkcode ChatMessage.CreateData}
     */
    interface ConstructorData extends ChatMessage.CreateData {}

    /**
     * @deprecated Replaced with {@link ChatMessage.implementation | `ChatMessage.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated Replaced with {@linkcode ChatMessage.Implementation}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side ChatMessage document which extends the common BaseChatMessage abstraction.
   * Each ChatMessage document contains ChatMessageData which defines its data schema.
   *
   * @see {@linkcode Messages}                The world-level collection of ChatMessage documents
   *
   */
  class ChatMessage<out SubType extends ChatMessage.SubType = ChatMessage.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseChatMessage,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `ChatMessage`
     * @param context - Construction context options
     */
    constructor(...args: ChatMessage.ConstructorArgs);

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
    static getSpeaker(
      options?: InexactPartial<ChatMessage.GetSpeakerOptions>,
    ): ChatMessage.Implementation["_source"]["speaker"];

    /**
     * A helper to prepare the speaker object based on a target TokenDocument
     * @param options - Options which affect speaker identification
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromToken(options: {
      /** The TokenDocument of the speaker */
      token: TokenDocument.Implementation;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): ChatMessage.Implementation["_source"]["speaker"];

    /**
     * A helper to prepare the speaker object based on a target Actor
     * @param options - Options which affect speaker identification
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromActor(options: {
      /** The Scene is which the speaker resides */
      scene?: Scene.Implementation | undefined;

      /** The Actor that is speaking */
      actor: Actor.Implementation;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): ChatMessage.Implementation["_source"]["speaker"];

    /**
     * A helper to prepare the speaker object based on a target User
     * @param options - Options which affect speaker identification
     * @returns The identified speaker data
     */
    protected static _getSpeakerFromUser(options: {
      /** The Scene in which the speaker resides */
      scene?: Scene.Implementation | undefined;

      /** The User who is speaking */
      user: User.Implementation;

      /** The name of the speaker to display */
      alias?: string | undefined;
    }): ChatMessage.Implementation["_source"]["speaker"];

    /**
     * Obtain an Actor instance which represents the speaker of this message (if any)
     * @param speaker - The speaker data object
     */
    static getSpeakerActor(speaker: ChatMessage.Implementation["_source"]["speaker"]): Actor.Implementation | null;

    /**
     * Obtain a data object used to evaluate any dice rolls associated with this particular chat message
     */
    getRollData(): AnyObject;

    /**
     * Given a string whisper target, return an Array of the user IDs which should be targeted for the whisper
     *
     * @param name - The target name of the whisper target
     * @returns An array of User instances
     */
    static getWhisperRecipients(name: string): User.Stored[];

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

    // _preCreate, _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
    // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

    /**
     * Export the content of the chat message into a standardized log format
     */
    export(): string;

    /*
     * After this point these are not really overridden methods.
     * They are here because Foundry's documents are complex and have lots of edge cases.
     * There are DRY ways of representing this but this ends up being harder to understand
     * for end users extending these functions, especially for static methods. There are also a
     * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
     * as there is no data that can safely construct every possible document. Finally keeping definitions
     * separate like this helps against circularities.
     */

    // ClientDocument overrides

    // Descendant Document operations have been left out because ChatMessage does not have any descendant documents.

    static override defaultName(context?: Document.DefaultNameContext<ChatMessage.SubType, ChatMessage.Parent>): string;

    static override createDialog(
      data?: Document.CreateDialogData<ChatMessage.CreateData>,
      context?: Document.CreateDialogContext<ChatMessage.SubType, ChatMessage.Parent>,
    ): Promise<ChatMessage.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<ChatMessage.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<ChatMessage.Implementation | undefined>;

    static override fromImport(
      source: ChatMessage.Source,
      context?: Document.FromImportContext<ChatMessage.Parent>,
    ): Promise<ChatMessage.Implementation>;
  }
}
