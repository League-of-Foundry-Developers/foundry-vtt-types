import type { ConfiguredChatMessage } from "#configuration";
import type { AnyObject, Identity, InexactPartial, InterfaceToObject, MaybeArray, Merge, NullishProps } from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema, SchemaField } from "#common/data/fields.d.mts";
import type BaseChatMessage from "#common/documents/chat-message.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace ChatMessage {
  /**
   * The document's name.
   */
  type Name = "ChatMessage";

  /**
   * The context used to create a `ChatMessage`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `ChatMessage`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `ChatMessage` document instance configured through
   * {@linkcode CONFIG.ChatMessage.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredChatMessage | fvtt-types/configuration/ConfiguredChatMessage} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `ChatMessage` document configured through
   * {@linkcode CONFIG.ChatMessage.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
      delete: "OWNER";
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
  type SubType = foundry.Game.Model.TypeNames<"ChatMessage">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"ChatMessage">;

  /**
   * `Known` represents the types of `ChatMessage` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = ChatMessage.OfType<ChatMessage.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `ChatMessage` with the corresponding type. This works with both the
   * builtin `ChatMessage` class or a custom subclass if that is set up in
   * {@link ConfiguredChatMessage | `fvtt-types/configuration/ConfiguredChatMessage`}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType
    extends Identity<{
      [Type in SubType]: Type extends unknown
        ? ConfiguredChatMessage<Type> extends { document: infer Document }
          ? Document
          : // eslint-disable-next-line @typescript-eslint/no-restricted-types
            ChatMessage<Type>
        : never;
    }> {}

  /**
   * `SystemOfType` returns the system property for a specific `ChatMessage` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<Name, _SystemMap, Type, ConfiguredSubType>;

  /**
   * @internal
   */
  interface _ModelMap extends Document.Internal.ModelMap<Name> {}

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<Name> {}

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
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
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
   * This is a fixed string per document type and is primarily useful for the descendant Document operation methods, e.g
   * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains `ChatMessage`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.ChatMessages.ImplementationClass;

  /**
   * The world collection that contains `ChatMessage`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.ChatMessages.Implementation;

  /**
   * An instance of `ChatMessage` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `ChatMessage` that comes from the database.
   */
  type Stored<SubType extends ChatMessage.SubType = ChatMessage.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode ChatMessage._source | ChatMessage#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode ChatMessage.create}
   * and {@linkcode ChatMessage | new ChatMessage(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends ChatMessage.SubType = ChatMessage.SubType>
    extends fields.SchemaField.CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode ChatMessage.create} and {@linkcode ChatMessage.createDocuments} signatures, and
   * {@linkcode ChatMessage.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode ChatMessage.create}, returning (a single | an array of) (temporary | stored)
   * `ChatMessage`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<ChatMessage.TemporaryIf<Temporary>>
      : ChatMessage.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode ChatMessage.name | ChatMessage#name}.
   *
   * This is data transformed from {@linkcode ChatMessage.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode ChatMessage.update | ChatMessage#update}.
   * It is a distinct type from {@linkcode ChatMessage.CreateData | DeepPartial<ChatMessage.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode ChatMessage.update | ChatMessage#update} and
   * {@linkcode ChatMessage.updateDocuments} signatures, and {@linkcode ChatMessage.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode ChatMessage}. This is the source of truth for how an ChatMessage document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode ChatMessage}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this ChatMessage document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** @defaultValue `"base"` */
    type: fields.DocumentTypeField<typeof BaseChatMessage, { initial: typeof CONST.BASE_DOCUMENT_TYPE }>;

    /**
     * Data for a ChatMessage subtype, defined by a System or Module
     */
    system: fields.TypeDataField<typeof BaseChatMessage>;

    /**
     * The message type from CONST.CHAT_MESSAGE_STYLES
     * @defaultValue `CONST.CHAT_MESSAGE_STYLES.OTHER`
     */
    // FIXME: overrides to enforce the branded type
    style: fields.NumberField<
      {
        required: true;
        choices: CONST.CHAT_MESSAGE_STYLES[];
        initial: typeof CONST.CHAT_MESSAGE_STYLES.OTHER;
        validationError: "must be a value in CONST.CHAT_MESSAGE_TYPES";
      },
      CONST.CHAT_MESSAGE_STYLES | null | undefined,
      CONST.CHAT_MESSAGE_STYLES,
      CONST.CHAT_MESSAGE_STYLES
    >;

    /**
     * The _id of the User document who generated this message
     * @defaultValue `game.user?.id`
     */
    author: fields.DocumentAuthorField<typeof documents.BaseUser>;

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
        // TODO: Figure out why passing whole Roll objects doesn't lose `terms` complex objects without calling `.toJSON()`
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        fields.JSONField.AssignmentType<{ validate: (rollJson: string) => void }> | Roll.Any,
        Roll
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
    flags: fields.DocumentFlagsField<Name, InterfaceToObject<CoreFlags>>;

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
     * @defaultValue `undefined`
     */
    alias: fields.StringField;
  }

  interface SpeakerData extends fields.SchemaField.InitializedData<SpeakerSchema> {}

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `ChatMessage` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<ChatMessage.Parent> {}

    /**
     * The interface for passing to {@linkcode ChatMessage.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `ChatMessage` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `ChatMessage` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ChatMessage.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<ChatMessage.CreateInput, ChatMessage.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode ChatMessage.create} or {@linkcode ChatMessage.createDocuments}.
     * @see {@linkcode Document.Database2.CreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.CreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated `ChatMessage` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `ChatMessage` documents. (see {@linkcode ChatMessage.Parent})
     * @see {@linkcode Document.Database2.CreateEmbeddedOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateEmbeddedOperation extends Document.Database2.CreateEmbeddedOperation<CreateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `ChatMessage` documents.
     * @see {@linkcode Document.Database2.BackendCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendCreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.BackendCreateOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode ChatMessage._preCreate | ChatMessage#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateChatMessage` hook}.
     * @see {@linkcode Document.Database2.PreCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOptions<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.PreCreateOptions<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode ChatMessage._preCreateOperation}.
     * @see {@linkcode Document.Database2.PreCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.PreCreateOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated The interface passed to {@linkcode ChatMessage._onCreateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnCreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.OnCreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode ChatMessage._onCreate | ChatMessage#_onCreate} and
     * {@link Hooks.CreateDocument | the `createChatMessage` hook}.
     * @see {@linkcode Document.Database2.OnCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOptions extends Document.Database2.OnCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode ChatMessage._onCreateOperation} and `ChatMessage`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOperation extends Document.Database2.OnCreateOperation<CreateOperation> {}

    /* ***********************************************
     *              UPDATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.UpdateOperation | DatabaseUpdateOperation}
     * interface for `ChatMessage` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ChatMessage.update | ChatMessage#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<ChatMessage.UpdateInput, ChatMessage.Parent> {}

    /**
     * The interface for passing to {@linkcode ChatMessage.update | ChatMessage#update}.
     * @see {@linkcode Document.Database2.UpdateOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateOneDocumentOperation extends Document.Database2.UpdateOneDocumentOperation<UpdateOperation> {}

    /**
     * @deprecated `ChatMessage` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `ChatMessage` documents (see {@linkcode ChatMessage.Parent}). This interface is just an alias
     * for {@linkcode UpdateOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateEmbeddedOperation extends UpdateOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode ChatMessage.updateDocuments}.
     * @see {@linkcode Document.Database2.UpdateManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateManyDocumentsOperation extends Document.Database2.UpdateManyDocumentsOperation<UpdateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `ChatMessage` documents.
     * @see {@linkcode Document.Database2.BackendUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendUpdateOperation extends Document.Database2.BackendUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ChatMessage._preUpdate | ChatMessage#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateChatMessage` hook}.
     * @see {@linkcode Document.Database2.PreUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOptions extends Document.Database2.PreUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ChatMessage._preUpdateOperation}.
     * @see {@linkcode Document.Database2.PreUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOperation extends Document.Database2.PreUpdateOperation<UpdateOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode ChatMessage._onUpdateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnUpdateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateDocumentsOperation extends Document.Database2.OnUpdateDocumentsOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ChatMessage._onUpdate | ChatMessage#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateChatMessage` hook}.
     * @see {@linkcode Document.Database2.OnUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOptions extends Document.Database2.OnUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ChatMessage._onUpdateOperation} and `ChatMessage`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOperation extends Document.Database2.OnUpdateOperation<UpdateOperation> {}

    /* ***********************************************
     *              DELETE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.DeleteOperation | DatabaseDeleteOperation}
     * interface for `ChatMessage` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ChatMessage.delete | ChatMessage#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<ChatMessage.Parent> {}

    /**
     * The interface for passing to {@linkcode ChatMessage.delete | ChatMessage#delete}.
     * @see {@linkcode Document.Database2.DeleteOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteOneDocumentOperation extends Document.Database2.DeleteOneDocumentOperation<DeleteOperation> {}

    /**
     * @deprecated `ChatMessage` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `ChatMessage` documents (see {@linkcode ChatMessage.Parent}). This interface is just an alias
     * for {@linkcode DeleteOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteEmbeddedOperation extends DeleteOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode ChatMessage.deleteDocuments}.
     * @see {@linkcode Document.Database2.DeleteManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteManyDocumentsOperation extends Document.Database2.DeleteManyDocumentsOperation<DeleteOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `ChatMessage` documents.
     * @see {@linkcode Document.Database2.BackendDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendDeleteOperation extends Document.Database2.BackendDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ChatMessage._preDelete | ChatMessage#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteChatMessage` hook}.
     * @see {@linkcode Document.Database2.PreDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOptions extends Document.Database2.PreDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ChatMessage._preDeleteOperation}.
     * @see {@linkcode Document.Database2.PreDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOperation extends Document.Database2.PreDeleteOperation<DeleteOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode ChatMessage._onDeleteDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnDeleteDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteDocumentsOperation extends Document.Database2.OnDeleteDocumentsOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ChatMessage._onDelete | ChatMessage#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteChatMessage` hook}.
     * @see {@linkcode Document.Database2.OnDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOptions extends Document.Database2.OnDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ChatMessage._onDeleteOperation} and `ChatMessage`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOperation extends Document.Database2.OnDeleteOperation<DeleteOperation> {}

    namespace Internal {
      interface OperationNameMap<Temporary extends boolean | undefined = boolean | undefined> {
        GetDocumentsOperation: ChatMessage.Database2.GetDocumentsOperation;
        BackendGetOperation: ChatMessage.Database2.BackendGetOperation;
        GetOperation: ChatMessage.Database2.GetOperation;

        CreateDocumentsOperation: ChatMessage.Database2.CreateDocumentsOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        CreateEmbeddedOperation: ChatMessage.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: ChatMessage.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: ChatMessage.Database2.CreateOperation<Temporary>;
        PreCreateOptions: ChatMessage.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: ChatMessage.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: ChatMessage.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: ChatMessage.Database2.OnCreateOptions;
        OnCreateOperation: ChatMessage.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: ChatMessage.Database2.UpdateOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        UpdateEmbeddedOperation: ChatMessage.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: ChatMessage.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: ChatMessage.Database2.BackendUpdateOperation;
        UpdateOperation: ChatMessage.Database2.UpdateOperation;
        PreUpdateOptions: ChatMessage.Database2.PreUpdateOptions;
        PreUpdateOperation: ChatMessage.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: ChatMessage.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: ChatMessage.Database2.OnUpdateOptions;
        OnUpdateOperation: ChatMessage.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: ChatMessage.Database2.DeleteOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        DeleteEmbeddedOperation: ChatMessage.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: ChatMessage.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: ChatMessage.Database2.BackendDeleteOperation;
        DeleteOperation: ChatMessage.Database2.DeleteOperation;
        PreDeleteOptions: ChatMessage.Database2.PreDeleteOptions;
        PreDeleteOperation: ChatMessage.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: ChatMessage.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: ChatMessage.Database2.OnDeleteOptions;
        OnDeleteOperation: ChatMessage.Database2.OnDeleteOperation;
      }
    }

    /* ***********************************************
     *             DocsV2 DEPRECATIONS               *
     *************************************************/

    /** @deprecated Use {@linkcode GetOperation} instead. This type will be removed in v14.  */
    type Get = GetOperation;

    /** @deprecated Use {@linkcode GetDocumentsOperation} instead. This type will be removed in v14.  */
    type GetOptions = GetDocumentsOperation;

    /** @deprecated Use {@linkcode CreateOperation} instead. This type will be removed in v14.  */
    type Create<Temporary extends boolean | undefined> = CreateOperation<Temporary>;

    /** @deprecated Use {@linkcode UpdateOperation} instead. This type will be removed in v14.  */
    type Update = UpdateOperation;

    /** @deprecated Use {@linkcode DeleteOperation} instead. This type will be removed in v14.  */
    type Delete = DeleteOperation;

    // CreateDocumentsOperation didn't change purpose or name

    /** @deprecated Use {@linkcode UpdateManyDocumentsOperation} instead. This type will be removed in v14 */
    type UpdateDocumentsOperation = UpdateManyDocumentsOperation;

    /** @deprecated Use {@linkcode DeleteManyDocumentsOperation} instead. This type will be removed in v14 */
    type DeleteDocumentsOperation = DeleteManyDocumentsOperation;

    // PreCreateOptions didn't change purpose or name

    // OnCreateOptions didn't change purpose or name

    // PreCreateOperation didn't change purpose or name

    // OnCreateOperation didn't change purpose or name

    // PreUpdateOptions didn't change purpose or name

    // OnUpdateOptions didn't change purpose or name

    // PreUpdateOperation didn't change purpose or name

    // OnUpdateOperation didn't change purpose or name

    // PreDeleteOptions didn't change purpose or name

    // OnDeleteOptions didn't change purpose or name

    // PreDeleteOperation didn't change purpose or name

    // OnDeleteOperation didn't change purpose or name

    /** @deprecated Use {@linkcode OnCreateDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnCreateDocumentsContext = OnCreateDocumentsOperation;

    /** @deprecated Use {@linkcode OnUpdateDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnUpdateDocumentsContext = OnUpdateDocumentsOperation;

    /** @deprecated Use {@linkcode OnDeleteOptions} instead. This type will be removed in v14 */
    type DeleteOptions = OnDeleteOptions;

    /** @deprecated Use {@linkcode OnCreateOptions} instead. This type will be removed in v14 */
    type CreateOptions = OnCreateOptions;

    /** @deprecated Use {@linkcode OnUpdateOptions} instead. This type will be removed in v14 */
    type UpdateOptions = OnUpdateOptions;

    /** @deprecated Use {@linkcode OnDeleteDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type DeleteDocumentsContext = OnDeleteDocumentsOperation;

    /** @deprecated use {@linkcode CreateDocumentsOperation} instead. This type will be removed in v14. */
    type DialogCreateOptions = CreateDocumentsOperation;
  }

  /**
   * If `Temporary` is true then {@linkcode ChatMessage.Implementation}, otherwise {@linkcode ChatMessage.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? ChatMessage.Implementation : ChatMessage.Stored;

  namespace Database {
    /** Options passed along in Get operations for ChatMessages */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<ChatMessage.Parent> {}

    /** Options passed along in Create operations for ChatMessages */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<ChatMessage.CreateData, ChatMessage.Parent, Temporary> {
      rollMode?: foundry.dice.Roll.Mode;
      chatBubble?: boolean;
    }

    /** Options passed along in Delete operations for ChatMessages */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<ChatMessage.Parent> {}

    /** Options passed along in Update operations for ChatMessages */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<ChatMessage.UpdateData, ChatMessage.Parent> {}

    /** Operation for {@linkcode ChatMessage.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<ChatMessage.Database.Create<Temporary>> {}

    /** Operation for {@linkcode ChatMessage.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<ChatMessage.Database.Update> {}

    /** Operation for {@linkcode ChatMessage.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<ChatMessage.Database.Delete> {}

    /** Operation for {@linkcode ChatMessage.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<ChatMessage.Database.Create<Temporary>> {}

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

    /**
     * Create options for {@linkcode ChatMessage.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name>, CoreFlags {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  interface CoreFlags {
    core?: {
      canPopout?: boolean;
      initiativeRoll?: boolean;
      nue?: boolean;
      RollTable?: string;
    };
  }

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  /** The interface {@linkcode ChatMessage.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode ChatMessage.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode ChatMessage.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode ChatMessage.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode ChatMessage.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode ChatMessage.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode ChatMessage.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends ChatMessage.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<ChatMessage.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode ChatMessage.deleteDialog | ChatMessage#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    ChatMessage.Stored,
    PassedConfig
  >;

  /* ***********************************************
   *         CHAT-MESSAGE-SPECIFIC TYPES           *
   *************************************************/

  /** @internal */
  interface _BaseSpeakerOptions {
    /** The Scene in which the speaker resides */
    scene: Scene.Implementation | null;

    /** The Actor whom is speaking */
    actor: Actor.Implementation | null | undefined;

    /** The Token whom is speaking */
    token: TokenDocument.Implementation | Token.Implementation | null | undefined;

    /** The name of the speaker to display */
    alias: string;
  }

  interface GetSpeakerOptions extends NullishProps<_BaseSpeakerOptions> {}

  /**
   * @deprecated The associated function was made private without deprecation or direct replacement.
   */
  interface GetSpeakerFromTokenOptions extends NullishProps<Pick<_BaseSpeakerOptions, "token" | "alias">> {}

  /**
   * @deprecated The associated function was made private without deprecation or direct replacement.
   */
  interface GetSpeakerFromActorOptions extends NullishProps<Pick<_BaseSpeakerOptions, "scene" | "actor" | "alias">> {}

  /**
   *@deprecated The associated function was made private without deprecation or direct replacement.
   */
  interface GetSpeakerFromUserOptions extends NullishProps<Pick<_BaseSpeakerOptions, "scene" | "alias">> {
    /** The User who is speaking */
    user: User.Implementation;
  }

  /** @internal */
  type _SpeakerData = SchemaField.InitializedData<ChatMessage.SpeakerSchema>;

  interface SpeakerData extends _SpeakerData {}

  /**
   * @remarks
   * {@linkcode ChatMessage.getWhisperRecipients} has a couple special-cased values, and a couple fallback behaviors.
   * _ALL_ comparisons are case-**in**sensitive, compared lowercase.
   * - `"GM"` or `"DM"` inputs returns `game.users.filter(u => u.isGM)`
   * - `"players"` returns `game.users.players`
   * - Then if any User names match, returns all that do
   * - Then returns any Users whose assigned `character` matches
   * - Finally returns `[]`
   */
  type WhisperRecipient = "GM" | "DM" | "players" | (string & {});

  /**
   * @remarks Serves two purposes:
   * - Template context for either calling `renderTemplate` on `CONFIG.ChatMessage.template` or passing to {@link ChatMessage._renderRollContent | `ChatMessage#_renderRollContent`}
   * - Context passed to the {@linkcode Hooks.StaticCallbacks.renderChatMessage | `renderChatMessage`} hook.
   */
  interface MessageData {
    /** @remarks This is the return of `ChatMessage#toObject(false)`, but that doesn't seem to make a difference */
    message: ChatMessage.Source;

    /** @remarks Always `game.user` */
    user: User.Stored;

    /** @remarks The message's {@link ChatMessage.author | `author`} */
    author: User.Implementation;

    /** @remarks The message's {@link ChatMessage.alias | `alias`} */
    alias: string;

    /** @remarks Possibly more than one class name, space-separated */
    cssClass: string;

    /**
     * @remarks The `.length` of the message's {@link ChatMessage.whisper | `whisper`} array,
     * despite the name implying a `boolean`
     */
    isWhisper: number;

    /**
     * @remarks Always `game.user.isGM`. Foundry comments: "Only GM users are allowed to have the
     * trash-bin icon in the chat log itself"
     */
    canDelete: boolean;

    /**
     * @remarks A `", "`-separated list of the `name`s of the `User`s whose IDs are in the message's
     * {@link ChatMessage.whisper | `whisper`} array
     */
    whisperTo: string;
  }

  /** @remarks `"roll"` means "use the current rollMode" */
  type PassableRollMode = foundry.dice.Roll.Mode | "roll";

  /**
   * These keys are overridden in `ChatMessage#renderHTML`
   *
   * @internal
   */
  type _SetMessageKey =
    | "canDelete"
    | "message"
    | "user"
    | "author"
    | "speakerActor"
    | "alias"
    | "cssClass"
    | "isWhisper"
    | "whisperTo";

  interface RenderHTMLOptions extends Omit<MessageData, _SetMessageKey> {
    canDelete?: boolean | undefined;
    canClose?: boolean | undefined;
  }

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode ChatMessage.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side ChatMessage document which extends the common BaseChatMessage abstraction.
 * Each ChatMessage document contains ChatMessageData which defines its data schema.
 *
 * @see {@linkcode Messages}                The world-level collection of ChatMessage documents
 *
 */
declare class ChatMessage<out SubType extends ChatMessage.SubType = ChatMessage.SubType> extends BaseChatMessage
  .Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `ChatMessage`
   * @param context - Construction context options
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: ChatMessage.CreateData<SubType>, context?: ChatMessage.ConstructionContext);

  /**
   * Is this ChatMessage currently displayed in the sidebar ChatLog?
   * @defaultValue `false`
   * @remarks Set `true` in {@link ChatLog.postOne | `ChatLog#postOne`} and {@link ChatLog._renderBatch | `ChatLog#_renderBatch`}
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

  /**
   * The Actor which represents the speaker of this message (if any).
   */
  get speakerActor(): Actor.Implementation | null;

  /**
   * @remarks Initializes `this.rolls` from an array of JSON-serializable objects to instances of their listed Roll class,
   * dropping any that throw when passed to {@linkcode Roll.fromData}
   */
  override prepareDerivedData(): void;

  /**
   * Transform a provided object of ChatMessage data by applying a certain roll mode to the data object.
   *  - Public: `whisper` is set to `[]` and `blind` is set to `false`.
   *  - Self: `whisper` is set to `[game.user.id]` and `blind` is set to `false`.
   *  - Private: `whisper` is set to the GM users unless `whisper` is nonempty and `blind` is set to `false`.
   *  - Blind: `whisper` is set to the GM users unless `whisper` is nonempty and `blind` is set to `true`.
   * @param chatData - The object of ChatMessage data
   * @param rollMode - The roll mode to apply to this message data. `"roll"` is the current roll mode.
   * @returns The modified ChatMessage data with the roll mode applied
   */
  static applyRollMode(
    chatData: ChatMessage.CreateData,
    rollMode: ChatMessage.PassableRollMode,
  ): ChatMessage.CreateData;

  /**
   * Update the data of a ChatMessage instance to apply a requested roll mode.
   * This function calls {@link ChatMessage.applyRollMode} and updates the source of the ChatMessage.
   * @param rollMode - The roll mode to apply to this message data. `"roll"` is the current roll mode.
   * @remarks Only calls `this.updateSource`, doesn't db update messages already stored
   */
  applyRollMode(rollMode: ChatMessage.PassableRollMode): void;

  /**
   * Attempt to determine who is the speaking character (and token) for a certain Chat Message
   * First assume that the currently controlled Token is the speaker
   *
   * @param options - Options which affect speaker identification (default: `{}`)
   *
   * @returns The identified speaker data
   */
  static getSpeaker(options?: ChatMessage.GetSpeakerOptions): ChatMessage.SpeakerData;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected static _getSpeakerFromToken(options: never): never;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected static _getSpeakerFromActor(options: never): never;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected static _getSpeakerFromUser(options: never): never;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected _renderRollContent(messageData: never): never;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected _renderRollHTML(isPrivate?: never): never;

  /**
   * Obtain an Actor instance which represents the speaker of this message (if any)
   * @param speaker - The speaker data object
   * @remarks `speaker` has no parameter default, if it's falsey this returns `null`
   */
  static getSpeakerActor(speaker?: ChatMessage.SpeakerData): Actor.Implementation | null;

  /**
   * Obtain a data object used to evaluate any dice rolls associated with this particular chat message
   */
  getRollData(): AnyObject;

  /**
   * Given a string whisper target, return an Array of the user IDs which should be targeted for the whisper
   *
   * @param name - The target name of the whisper target
   * @returns An array of User instances
   * @remarks See {@linkcode ChatMessage.WhisperRecipient}
   */
  static getWhisperRecipients(name: ChatMessage.WhisperRecipient): User.Stored[];

  /**
   * Render the HTML for the ChatMessage which should be added to the log
   * @param options - Additional options passed to the Handlebars Template.
   */
  renderHTML(options?: ChatMessage.RenderHTMLOptions): Promise<HTMLElement>;

  // _preCreate, _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
  // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

  /**
   * Export the content of the chat message into a standardized log format
   */
  export(): string;

  /**
   * @deprecated since v13 until v15
   */
  getHTML(): Promise<JQuery>;

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

  static override defaultName(context?: ChatMessage.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends ChatMessage.CreateDialogOptions | undefined = undefined,
  >(
    data?: ChatMessage.CreateDialogData,
    createOptions?: ChatMessage.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<ChatMessage.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode ChatMessage.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends ChatMessage.CreateDialogOptions | undefined = undefined,
  >(
    data: ChatMessage.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: ChatMessage.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<ChatMessage.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: ChatMessage.Database2.DeleteOneDocumentOperation,
  ): Promise<ChatMessage.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: ChatMessage.Database2.DeleteOneDocumentOperation,
  ): Promise<ChatMessage.DeleteDialogReturn<Options>>;

  static override fromDropData(data: ChatMessage.DropData): Promise<ChatMessage.Implementation | undefined>;

  static override fromImport(
    source: ChatMessage.Source,
    context?: Document.FromImportContext<ChatMessage.Parent> | null,
  ): Promise<ChatMessage.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default ChatMessage;
