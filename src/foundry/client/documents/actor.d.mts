import type { AnyObject, InexactPartial, NullishProps, Merge, Identity, MaybeArray } from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type BaseActor from "#common/documents/actor.d.mts";
import type { ConfiguredActor } from "#configuration";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { PrototypeToken } from "#common/data/data.mjs";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace Actor {
  /**
   * The document's name.
   */
  type Name = "Actor";

  /**
   * The context used to create a `Actor`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Actor`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Actor` document instance configured through
   * {@linkcode CONFIG.Actor.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredActor | fvtt-types/configuration/ConfiguredActor} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Actor` document configured through
   * {@linkcode CONFIG.Actor.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Actor";
      collection: "actors";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"];
      embedded: Metadata.Embedded;
      hasTypeData: true;
      label: string;
      labelPlural: string;
      permissions: Metadata.Permissions;
      schemaVersion: string;
    }>
  > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      ActiveEffect: "effects";
      Item: "items";
    }

    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation): boolean;
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
    }
  }

  /**
   * Allowed subtypes of `Actor`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.Actor.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"Actor">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"Actor">;

  /**
   * `Known` represents the types of `Actor` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = Actor.OfType<Actor.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `Actor` with the corresponding type. This works with both the
   * builtin `Actor` class or a custom subclass if that is set up in
   * {@link ConfiguredActor | `fvtt-types/configuration/ConfiguredActor`}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType extends Identity<{
    [Type in SubType]: Type extends unknown
      ? ConfiguredActor<Type> extends { document: infer Document }
        ? Document
        : // eslint-disable-next-line @typescript-eslint/no-restricted-types
          Actor<Type>
      : never;
  }> {}

  /**
   * `SystemOfType` returns the system property for a specific `Actor` subtype.
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
   *
   * @remarks Foundry doesn't store `Actor`s with {@linkcode TokenDocument} parents in the database, it constructs them from the underlying
   * {@linkcode ActorDelta} on the client; they are, however, treated the same as regular embedded documents in most circumstances, and the
   * following is a valid:
   * ```js
   * // works as expected:
   * await tokenDoc.updateEmbeddedDocuments("Actor", [{_id: tokenDoc.actorId, name: "new name" }]);
   * // true:
   * tokenDoc.actor.parent === tokenDoc
   * ```
   * Under the hood, though, this operation is converted to target the `ActorDelta` via `ClientDatabaseBackend##buildRequest` calling
   * `##adjustActorDeltaRequest`.
   */
  type Parent = TokenDocument.Implementation | null;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendantName = "Item" | "ActiveEffect";

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = Item.Stored | ActiveEffect.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = Item.ImplementationClass | ActiveEffect.ImplementationClass;

  /**
   * A document's descendants are any documents that are contained within, either within its schema
   * or its descendant's schemas.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type Descendant = DirectDescendant;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = DirectDescendantClass;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Actor">;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = Document.ImplementationFor<Embedded.Name>;

  namespace Embedded {
    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Name = keyof Metadata.Embedded;

    /**
     * Gets the collection name for an embedded document.
     */
    type CollectionNameOf<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionNameFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection document for an embedded document.
     */
    type DocumentFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.DocumentFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection for an embedded document.
     */
    type CollectionFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionFor<
      Actor.Implementation,
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * A valid name to refer to a collection embedded in this document. For example an `Actor`
     * has the key `"items"` which contains `Item` instance which would make both `"Item" | "Items"`
     * valid keys (amongst others).
     */
    type CollectionName = Document.Embedded.CollectionName<Metadata.Embedded>;
  }

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for the descendant Document operation methods, e.g
   * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains `Actor`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.Actors.ImplementationClass;

  /**
   * The world collection that contains `Actor`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.Actors.Implementation;

  /**
   * An instance of `Actor` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Actor` that comes from the database.
   */
  type Stored<SubType extends Actor.SubType = Actor.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode Actor._source | Actor#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Actor.create}
   * and {@linkcode Actor | new Actor(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends Actor.SubType = Actor.SubType> extends fields.SchemaField.CreateData<Schema> {
    type: SubType;
  }

  /**
   * Used in the {@linkcode Actor.create} and {@linkcode Actor.createDocuments} signatures, and
   * {@linkcode Actor.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Actor.create}, returning (a single | an array of) (temporary | stored)
   * `Actor`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput> ? Array<Actor.TemporaryIf<Temporary>> : Actor.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Actor.name | Actor#name}.
   *
   * This is data transformed from {@linkcode Actor.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Actor.update | Actor#update}.
   * It is a distinct type from {@linkcode Actor.CreateData | DeepPartial<Actor.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Actor.update | Actor#update} and
   * {@linkcode Actor.updateDocuments} signatures, and {@linkcode Actor.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Actor}. This is the source of truth for how an Actor document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Actor}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Actor document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The name of this Actor */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /** An Actor subtype which configures the system data model applied */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    type: fields.DocumentTypeField<typeof BaseActor, {}>;

    /**
     * An image file path which provides the artwork for this Actor
     * @defaultValue `Actor.DEFAULT_ICON`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"]; initial: (data: unknown) => string }>;

    /**
     * Data for an Actor subtype, defined by a System or Module
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseActor>;

    /**
     * Default Token settings which are used for Tokens created from this Actor
     * @defaultValue see {@linkcode PrototypeToken}
     */
    prototypeToken: fields.EmbeddedDataField<typeof PrototypeToken>;

    /**
     * A Collection of Item embedded Documents
     * @defaultValue `[]`
     */
    items: fields.EmbeddedCollectionField<typeof documents.BaseItem, Actor.Implementation>;

    /**
     * A Collection of ActiveEffect embedded Documents
     * @defaultValue `[]`
     */
    effects: fields.EmbeddedCollectionField<typeof documents.BaseActiveEffect, Actor.Implementation>;

    /**
     * The _id of a Folder which contains this Actor
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The numeric sort value which orders this Actor relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Actor
     * @defaultValue `{ default: DOCUMENT_OWNERSHIP_LEVELS.NONE }`
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<"Actor">;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `Actor` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Actor.Parent> {}

    /**
     * The interface for passing to {@linkcode Actor.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Actor` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `Actor` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Actor.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<Actor.CreateInput, Actor.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode Actor.create} or {@linkcode Actor.createDocuments}.
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
    interface CreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database2.CreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated `Actor` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `Actor` documents. (see {@linkcode Actor.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Actor` documents.
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
    interface BackendCreateOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database2.BackendCreateOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode Actor._preCreate | Actor#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateActor` hook}.
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
    interface PreCreateOptions<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database2
      .PreCreateOptions<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode Actor._preCreateOperation}.
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
    interface PreCreateOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database2
      .PreCreateOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated The interface passed to {@linkcode Actor._onCreateDocuments}. It will be removed in v14 along with the
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
    interface OnCreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database2.OnCreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode Actor._onCreate | Actor#_onCreate} and
     * {@link Hooks.CreateDocument | the `createActor` hook}.
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
     * The interface passed to {@linkcode Actor._onCreateOperation} and `Actor`-related collections'
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
     * interface for `Actor` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Actor.update | Actor#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Actor.UpdateInput, Actor.Parent> {}

    /**
     * The interface for passing to {@linkcode Actor.update | Actor#update}.
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
     * @deprecated `Actor` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `Actor` documents (see {@linkcode Actor.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Actor.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Actor` documents.
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
     * The interface passed to {@linkcode Actor._preUpdate | Actor#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateActor` hook}.
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
     * The interface passed to {@linkcode Actor._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode Actor._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Actor._onUpdate | Actor#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateActor` hook}.
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
     * The interface passed to {@linkcode Actor._onUpdateOperation} and `Actor`-related collections'
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
     * interface for `Actor` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Actor.delete | Actor#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Actor.Parent> {}

    /**
     * The interface for passing to {@linkcode Actor.delete | Actor#delete}.
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
     * @deprecated `Actor` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `Actor` documents (see {@linkcode Actor.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Actor.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Actor` documents.
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
     * The interface passed to {@linkcode Actor._preDelete | Actor#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteActor` hook}.
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
     * The interface passed to {@linkcode Actor._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode Actor._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Actor._onDelete | Actor#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteActor` hook}.
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
     * The interface passed to {@linkcode Actor._onDeleteOperation} and `Actor`-related collections'
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
        GetDocumentsOperation: Actor.Database2.GetDocumentsOperation;
        BackendGetOperation: Actor.Database2.BackendGetOperation;
        GetOperation: Actor.Database2.GetOperation;

        CreateDocumentsOperation: Actor.Database2.CreateDocumentsOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        CreateEmbeddedOperation: Actor.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: Actor.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: Actor.Database2.CreateOperation<Temporary>;
        PreCreateOptions: Actor.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: Actor.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Actor.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Actor.Database2.OnCreateOptions;
        OnCreateOperation: Actor.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: Actor.Database2.UpdateOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        UpdateEmbeddedOperation: Actor.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Actor.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Actor.Database2.BackendUpdateOperation;
        UpdateOperation: Actor.Database2.UpdateOperation;
        PreUpdateOptions: Actor.Database2.PreUpdateOptions;
        PreUpdateOperation: Actor.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Actor.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: Actor.Database2.OnUpdateOptions;
        OnUpdateOperation: Actor.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: Actor.Database2.DeleteOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        DeleteEmbeddedOperation: Actor.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Actor.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Actor.Database2.BackendDeleteOperation;
        DeleteOperation: Actor.Database2.DeleteOperation;
        PreDeleteOptions: Actor.Database2.PreDeleteOptions;
        PreDeleteOperation: Actor.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Actor.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: Actor.Database2.OnDeleteOptions;
        OnDeleteOperation: Actor.Database2.OnDeleteOperation;
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
  }

  /**
   * If `Temporary` is true then {@linkcode Actor.Implementation}, otherwise {@linkcode Actor.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? Actor.Implementation : Actor.Stored;

  namespace Database {
    /** Options passed along in Get operations for Actors */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Actor.Parent> {}

    /** Options passed along in Create operations for Actors */
    interface Create<Temporary extends boolean | undefined = boolean | undefined> extends foundry.abstract.types
      .DatabaseCreateOperation<Actor.CreateData, Actor.Parent, Temporary> {}

    /** Options passed along in Delete operations for Actors */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Actor.Parent> {}

    /** Options passed along in Update operations for Actors */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Actor.UpdateData, Actor.Parent> {}

    /** Operation for {@linkcode Actor.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined> extends Document.Database
      .CreateDocumentsOperation<Actor.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Actor.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Actor.Database.Update> {}

    /** Operation for {@linkcode Actor.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Actor.Database.Delete> {}

    /** Operation for {@linkcode Actor.create} */
    interface CreateOperation<Temporary extends boolean | undefined> extends Document.Database.CreateDocumentsOperation<
      Actor.Database.Create<Temporary>
    > {}

    /** Operation for {@link Actor.update | `Actor#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Actor.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Actor._preCreate | `Actor#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Actor._onCreate | `Actor#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Actor._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Actor.Database.Create> {}

    /** Operation for {@link Actor._onCreateOperation | `Actor#_onCreateOperation`} */
    interface OnCreateOperation extends Actor.Database.Create {}

    /** Options for {@link Actor._preUpdate | `Actor#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Actor._onUpdate | `Actor#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Actor._preUpdateOperation} */
    interface PreUpdateOperation extends Actor.Database.Update {}

    /** Operation for {@link Actor._onUpdateOperation | `Actor._preUpdateOperation`} */
    interface OnUpdateOperation extends Actor.Database.Update {}

    /** Options for {@link Actor._preDelete | `Actor#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Actor._onDelete | `Actor#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Actor._preDeleteOperation | `Actor#_preDeleteOperation`} */
    interface PreDeleteOperation extends Actor.Database.Delete {}

    /** Options for {@link Actor._onDeleteOperation | `Actor#_onDeleteOperation`} */
    interface OnDeleteOperation extends Actor.Database.Delete {}

    /** Context for {@linkcode Actor._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Actor.Parent> {}

    /** Context for {@linkcode Actor._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Actor.Parent> {}

    /** Context for {@linkcode Actor._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Actor.Parent> {}

    /**
     * Options for {@link Actor._preCreateDescendantDocuments | `Actor#_preCreateDescendantDocuments`}
     * and {@link Actor._onCreateDescendantDocuments | `Actor#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Actor.Database.Create> {}

    /**
     * Options for {@link Actor._preUpdateDescendantDocuments | `Actor#_preUpdateDescendantDocuments`}
     * and {@link Actor._onUpdateDescendantDocuments | `Actor#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Actor.Database.Update> {}

    /**
     * Options for {@link Actor._preDeleteDescendantDocuments | `Actor#_preDeleteDescendantDocuments`}
     * and {@link Actor._onDeleteDescendantDocuments | `Actor#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Actor.Database.Delete> {}

    /**
     * Create options for {@linkcode Actor.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name> {}

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

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  /** The interface {@linkcode Actor.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Actor.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Actor.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Actor.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode Actor.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Actor.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode Actor.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends Actor.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<Actor.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode Actor.deleteDialog | Actor#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Actor.Stored,
    PassedConfig
  >;

  type PreCreateDescendantDocumentsArgs =
    | Document.Internal.PreCreateDescendantDocumentsArgs<
        Actor.Stored,
        Actor.DirectDescendantName,
        Actor.Metadata.Embedded
      >
    | Item.PreCreateDescendantDocumentsArgs;

  type OnCreateDescendantDocumentsArgs =
    | Document.Internal.OnCreateDescendantDocumentsArgs<
        Actor.Stored,
        Actor.DirectDescendantName,
        Actor.Metadata.Embedded
      >
    | Item.OnCreateDescendantDocumentsArgs;

  type PreUpdateDescendantDocumentsArgs =
    | Document.Internal.PreUpdateDescendantDocumentsArgs<
        Actor.Stored,
        Actor.DirectDescendantName,
        Actor.Metadata.Embedded
      >
    | Item.PreUpdateDescendantDocumentsArgs;

  type OnUpdateDescendantDocumentsArgs =
    | Document.Internal.OnUpdateDescendantDocumentsArgs<
        Actor.Stored,
        Actor.DirectDescendantName,
        Actor.Metadata.Embedded
      >
    | Item.OnUpdateDescendantDocumentsArgs;

  type PreDeleteDescendantDocumentsArgs =
    | Document.Internal.PreDeleteDescendantDocumentsArgs<
        Actor.Stored,
        Actor.DirectDescendantName,
        Actor.Metadata.Embedded
      >
    | Item.PreDeleteDescendantDocumentsArgs;

  type OnDeleteDescendantDocumentsArgs =
    | Document.Internal.OnDeleteDescendantDocumentsArgs<
        Actor.Stored,
        Actor.DirectDescendantName,
        Actor.Metadata.Embedded
      >
    | Item.OnDeleteDescendantDocumentsArgs;

  /* ***********************************************
   *             ACTOR-SPECIFIC TYPES              *
   *************************************************/

  interface GetDefaultArtworkReturn {
    img: string;
    texture: GetDefaultArtworkTextureReturn;
  }

  interface GetDefaultArtworkTextureReturn {
    src: string;
  }

  type ItemTypes = {
    // Note(LukeAbby): `keyof Item._SystemMap` is used to preserve optional modifiers
    [SubType in keyof Item._SystemMap]: Array<Item.OfType<SubType>>;
  };

  type GetActiveTokensReturn<Document extends boolean | undefined> = Document extends true
    ? TokenDocument.Implementation[]
    : Token.Implementation[];

  /** @internal */
  type _RollInitiativeOptions = NullishProps<{
    /**
     * Create new Combatant entries for Tokens associated with this actor.
     * @defaultValue `false`
     */
    createCombatants: boolean;

    /**
     * Re-roll the initiative for this Actor if it has already been rolled.
     * @defaultValue `false`
     */
    rerollInitiative: boolean;
  }> &
    InexactPartial<{
      /**
       * Additional options passed to the Combat#rollInitiative method.
       * @defaultValue `{}`
       * @remarks Can't be `null` as it only has a parameter default
       */
      initiativeOptions: Combat.InitiativeOptions;
    }>;

  interface RollInitiativeOptions extends _RollInitiativeOptions {}

  /** @internal */
  type _ToggleStatusEffectOptions = NullishProps<{
    /**
     * Force a certain active state for the effect
     * @defaultValue `undefined`
     * @remarks `null` is treated as `false`, `undefined` or omitted is treated as `true` *if no status
     * with the given ID already exists*, otherwise also as `false`
     */
    active: boolean;

    /**
     * Whether to set the effect as the overlay effect?
     * @defaultValue `false`
     */
    overlay: boolean;
  }>;

  interface ToggleStatusEffectOptions extends _ToggleStatusEffectOptions {}

  /** @internal */
  type _RequestTokenImagesOptions = NullishProps<{
    /**
     * The name of the compendium the actor is in.
     * @defaultValue `null`
     * @remarks The default comes from the `"requestTokenImages"` socket handler in `dist/database/documents/actor.mjs` where it's the parameter default
     */
    pack: string;
  }>;

  interface RequestTokenImagesOptions extends _RequestTokenImagesOptions {}

  /** @internal */
  type _GetDependentTokensOptions = NullishProps<{
    /**
     * A single Scene, or list of Scenes to filter by.
     * @defaultValue `Array.from(this._dependentTokens.keys())`
     */
    scenes: Scene.Implementation | Scene.Implementation[];

    /**
     * Limit the results to tokens that are linked to the actor.
     * @defaultValue `false`
     */
    linked: boolean;
  }>;

  interface GetDependentTokensOptions extends _GetDependentTokensOptions {}

  interface ModifyTokenAttributeData {
    /** The attribute path */
    attribute: string;

    /** The target attribute value */
    value: number;

    /** Whether the number represents a relative change (true) or an absolute change (false) */
    isDelta: boolean;

    /** Whether the new value is part of an attribute bar, or just a direct value */
    isBar: boolean;
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
   * @deprecated Replaced with {@linkcode Actor.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side Actor document which extends the common BaseActor model.
 *
 *  ### Hook Events
 * {@linkcode hookEvents.applyCompendiumArt}
 *
 * @see {@linkcode Actors}            The world-level collection of Actor documents
 * @see {@linkcode ActorSheet}     The Actor configuration application
 *
 * @example <caption>Create a new Actor</caption>
 * ```typescript
 * let actor = await Actor.create({
 *   name: "New Test Actor",
 *   type: "character",
 *   img: "artwork/character-profile.jpg"
 * });
 * ```
 *
 * @example <caption>Retrieve an existing Actor</caption>
 * ```typescript
 * let actor = game.actors.get(actorId);
 * ```
 */
declare class Actor<out SubType extends Actor.SubType = Actor.SubType> extends foundry.documents.BaseActor.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Actor`
   * @param context - Construction context options
   */
  constructor(data: Actor.CreateData<SubType>, context?: Actor.ConstructionContext);

  protected override _configure(options?: Document.ConfigureOptions): void;

  /**
   * Maintain a list of Token Documents that represent this Actor, stored by Scene. This list may include unpersisted
   * Token Documents (along with possibly unpersisted parent Scenes), including those with a null `_id`.
   * @remarks `defineProperty`'d at construction with no options specified
   */
  protected _dependentTokens?: foundry.utils.IterableWeakMap<
    Scene.Implementation,
    foundry.utils.IterableWeakSet<TokenDocument.Implementation>
  >;

  /** @remarks `||=`s the `prototypeToken`'s `name` and `texture.src` fields with the main actor's values */
  protected override _initializeSource(
    data: this | Actor.CreateData,
    options?: Document.InitializeSourceOptions,
  ): Actor.Source;

  /**
   * An object that tracks which tracks the changes to the data model which were applied by active effects
   * @defaultValue `{}`
   */
  overrides: Record<string, unknown>;

  /**
   * The statuses that are applied to this actor by active effects
   */
  statuses: Set<string>;

  /** @deprecated Foundry made this property truly private in v13 (this warning will be removed in v14) */
  protected _tokenImages: never;

  /** @deprecated Foundry made this property truly private in v13 (this warning will be removed in v14) */
  protected _lastWildcard: never;

  /**
   * Provide a thumbnail image path used to represent this document.
   */
  get thumbnail(): string | null;

  /**
   * A convenience getter to an object that organizes all embedded Item instances by subtype. The object is cached and
   * lazily re-computed as needed.
   */
  get itemTypes(): Actor.ItemTypes;

  /**
   * Test whether an Actor document is a synthetic representation of a Token (if true) or a full Document (if false)
   */
  get isToken(): boolean;

  /**
   * Retrieve the list of ActiveEffects that are currently applied to this Actor.
   */
  get appliedEffects(): ActiveEffect.Implementation[];

  /**
   * An array of ActiveEffect instances which are present on the Actor which have a limited duration.
   */
  get temporaryEffects(): ActiveEffect.Implementation[];

  /**
   * Return a reference to the TokenDocument which owns this Actor as a synthetic override
   */
  get token(): TokenDocument.Implementation | null;

  /**
   * Whether the Actor has at least one Combatant in the active Combat that represents it.
   */
  get inCombat(): boolean;

  override clone<Save extends boolean | undefined = false>(
    data?: Actor.CreateData,
    context?: Document.CloneContext<Save>,
  ): Document.Clone<this, Save>;

  /**
   * Apply any transformations to the Actor data which are caused by ActiveEffects.
   */
  applyActiveEffects(): void;

  /**
   * Retrieve an Array of active tokens which represent this Actor in the current canvas Scene.
   * If the canvas is not currently active, or there are no linked actors, the returned Array will be empty.
   * If the Actor is a synthetic token actor, only the exact Token which it represents will be returned.
   *
   * @param linked   - Limit results to Tokens which are linked to the Actor. Otherwise return all
   *                   Tokens even those which are not linked. (default: `false`)
   * @param document - Return the Document instance rather than the PlaceableObject
   *                   (default: `false`)
   * @returns An array of Token instances in the current Scene which reference this Actor.
   */
  getActiveTokens<ReturnDocument extends boolean | undefined = false>(
    linked?: boolean,
    document?: ReturnDocument,
  ): Actor.GetActiveTokensReturn<ReturnDocument>;

  /**
   * Get all ActiveEffects that may apply to this Actor.
   * If CONFIG.ActiveEffect.legacyTransferral is true, this is equivalent to actor.effects.contents.
   * If CONFIG.ActiveEffect.legacyTransferral is false, this will also return all the transferred ActiveEffects on any
   * of the Actor's owned Items.
   */
  allApplicableEffects(): Generator<ActiveEffect.Implementation, void, undefined>;

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Actor
   * @remarks defaults to this.system, but provided as object for flexible overrides
   */
  getRollData(): AnyObject;

  /**
   * Create a new TokenData object which can be used to create a Token representation of the Actor.
   * @param data - Additional data, such as x, y, rotation, etc. for the created token data (default: `{}`)
   * @returns The created TokenData instance
   */
  getTokenDocument(
    data?: TokenDocument.CreateData,
    options?: TokenDocument.ConstructionContext,
  ): Promise<TokenDocument.Implementation>;

  /**
   * Get an Array of Token images which could represent this Actor
   */
  getTokenImages(): Promise<string[]>;

  /**
   * Handle how changes to a Token attribute bar are applied to the Actor.
   * This allows for game systems to override this behavior and deploy special logic.
   * @param attribute - The attribute path
   * @param value     - The target attribute value
   * @param isDelta   - Whether the number represents a relative change (true) or an absolute change (false) (default: `false`)
   * @param isBar     - Whether the new value is part of an attribute bar, or just a direct value (default: `true`)
   * @returns The updated Actor document
   */
  // Note: Must be kept in sync with `Actor.ModifyTokenAttributeData`
  modifyTokenAttribute(
    attribute: string,
    // TODO: tighten Combatant.Resource with the justification of this being simply `number`
    value: number,
    isDelta?: boolean,
    isBar?: boolean,
  ): Promise<this | undefined>;

  override prepareData(): void;

  override prepareEmbeddedDocuments(): void;

  /**
   * Roll initiative for all Combatants in the currently active Combat encounter which are associated with this Actor.
   * If viewing a full Actor document, all Tokens which map to that actor will be targeted for initiative rolls.
   * If viewing a synthetic Token actor, only that particular Token will be targeted for an initiative roll.
   *
   * @param options - Configuration for how initiative for this Actor is rolled.
   * @returns A promise which resolves to the Combat document once rolls are complete.
   */
  rollInitiative(options?: Actor.RollInitiativeOptions): Promise<Combat.Implementation | null>;

  /**
   * Toggle a configured status effect for the Actor.
   * @param statusId  - A status effect ID defined in CONFIG.statusEffects
   * @param options   - Additional options which modify how the effect is created
   * @returns A promise which resolves to one of the following values:
   *            - ActiveEffect if a new effect need to be created
   *            - true if was already an existing effect
   *            - false if an existing effect needed to be removed
   *            - undefined if no changes need to be made
   */
  toggleStatusEffect(
    statusId: string,
    options?: Actor.ToggleStatusEffectOptions,
  ): Promise<ActiveEffect.Implementation | boolean | undefined>;

  /**
   * Get this actor's dependent tokens.
   * If the actor is a synthetic token actor, only the exact Token which it represents will be returned.
   */
  getDependentTokens(options?: Actor.GetDependentTokensOptions): TokenDocument.Implementation[];

  /**
   * Register a token as a dependent of this actor.
   * @param token - The Token
   * @internal
   */
  protected _registerDependantToken(token: TokenDocument.Implementation): void;

  /**
   * Remove a token from this actor's dependents.
   * @param token - The Token
   * @internal
   */
  protected _unregisterDependentToken(token: TokenDocument.Implementation): void;

  /**
   * Prune a whole scene from this actor's dependent tokens.
   * @param scene - The scene
   * @internal
   */
  protected _unregisterDependentScene(scene: Scene.Implementation): void;

  // _onUpdate is overridden but with no signature changes from BaseActor.

  protected override _onCreateDescendantDocuments(...args: Actor.OnCreateDescendantDocumentsArgs): void;

  protected override _onUpdateDescendantDocuments(...args: Actor.OnUpdateDescendantDocumentsArgs): void;

  protected override _onDeleteDescendantDocuments(...args: Actor.OnDeleteDescendantDocumentsArgs): void;

  /**
   * Additional workflows to perform when any descendant document within this Actor changes.
   */
  protected _onEmbeddedDocumentChange(): void;

  /**
   * Update the active TokenDocument instances which represent this Actor.
   * @param update  - The update delta.
   * @param options - The update context.
   * @remarks Forwards to {@link Token._onUpdateBaseActor | `Token#_onUpdateBaseActor`}
   */
  protected _updateDependentTokens(update: Actor.UpdateData, options: Actor.Database.UpdateOperation): void;

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

  protected override _preCreateDescendantDocuments(...args: Actor.PreCreateDescendantDocumentsArgs): void;

  protected override _preUpdateDescendantDocuments(...args: Actor.PreUpdateDescendantDocumentsArgs): void;

  protected override _preDeleteDescendantDocuments(...args: Actor.PreDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: Actor.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Actor.CreateDialogOptions | undefined = undefined,
  >(
    data?: Actor.CreateDialogData,
    createOptions?: Actor.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<Actor.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Actor.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Actor.CreateDialogOptions | undefined = undefined,
  >(
    data: Actor.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Actor.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<Actor.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Actor.Database2.DeleteOneDocumentOperation,
  ): Promise<Actor.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Actor.Database2.DeleteOneDocumentOperation,
  ): Promise<Actor.DeleteDialogReturn<Options>>;

  static override fromDropData(data: Actor.DropData): Promise<Actor.Implementation | undefined>;

  static override fromImport(
    source: Actor.Source,
    context?: Document.FromImportContext<Actor.Parent> | null,
  ): Promise<Actor.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  #Actor: true;
}

export default Actor;
