import type { ConfiguredActorDelta } from "#configuration";
import type { Identity, MaybeArray, Merge, NullishProps } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type DataModel from "#common/abstract/data.d.mts";
import type { Document, DatabaseBackend, EmbeddedCollection } from "#common/abstract/_module.d.mts";
import type { BaseActorDelta } from "#common/documents/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

declare namespace ActorDelta {
  /**
   * The document's name.
   */
  type Name = "ActorDelta";

  /**
   * The context used to create a `ActorDelta`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `ActorDelta`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `ActorDelta` document instance configured through
   * {@linkcode CONFIG.ActorDelta.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredActorDelta | fvtt-types/configuration/ConfiguredActorDelta} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `ActorDelta` document configured through
   * {@linkcode CONFIG.ActorDelta.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "ActorDelta";
      collection: "delta";
      label: "DOCUMENT.ActorDelta";
      labelPlural: "DOCUMENT.ActorDeltas";
      isEmbedded: true;
      embedded: Metadata.Embedded;
      permissions: Metadata.Permissions;
      schemaVersion: "13.341";
    }>
  > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      Item: "items";
      ActiveEffect: "effects";
    }

    interface Permissions {
      create: "OWNER";
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `ActorDelta`. Due to the implementation of the `ActorDelta` document,
   * the SubType is the same as the `Actor`'s SubType.
   *
   * {@linkcode Actor.SubType}
   */
  type SubType = Actor.SubType;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@linkcode ActorDelta.SubType} for more information.
   */
  type ConfiguredSubType = Actor.ConfiguredSubType;

  /**
   * `Known` represents the types of `ActorDelta` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = ActorDelta.OfType<ActorDelta.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `ActorDelta` with the corresponding type. This works with both the
   * builtin `ActorDelta` class or a custom subclass if that is set up in
   * {@link ConfiguredActorDelta | `fvtt-types/configuration/ConfiguredActorDelta`}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType extends Identity<{
    [Type in SubType]: Type extends unknown
      ? ConfiguredActorDelta<Type> extends { document: infer Document }
        ? Document
        : // eslint-disable-next-line @typescript-eslint/no-restricted-types
          ActorDelta<Type>
      : never;
  }> {}

  /**
   * `SystemOfType` returns the system property for a specific `ActorDelta` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<Name, _SystemMap, Type, ConfiguredSubType>;

  /**
   * @internal
   */
  // Actor and ActorDelta have the same subtype setup.
  interface _ModelMap extends Actor._ModelMap {}

  /**
   * @internal
   */
  // Actor and ActorDelta have the same subtype setup.
  interface _SystemMap extends Actor._SystemMap {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   *
   * `ActorDelta` requires a parent, even for `new ActorDelta`, so `null` is not an option here.
   */
  type Parent = TokenDocument.Implementation;

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
  type Descendant = DirectDescendant | Item.Descendant;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = DirectDescendantClass | Item.DescendantClass;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Scene">;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   *
   * @privateRemarks This is always the same as `DirectDescendant` and is provided as a convenient alias for users. It is not deprecated.
   */
  type Embedded = DirectDescendant;

  namespace Embedded {
    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Name = keyof Metadata.Embedded;

    /**
     * A valid name to refer to a collection embedded in this document.
     * @remarks Functionally identical to `keyof `{@linkcode Metadata.Embedded}` | ValueOf<Metadata.Embedded>`
     */
    type CollectionName = Document.Embedded.CollectionName<Metadata.Embedded>;

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
      ActorDelta.Implementation,
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * The return type for {@linkcode ActorDelta.getCollectionName | ActorDelta#getCollectionName}. If the
     * passed name is not a known valid embedded document type/collection name for `ActorDelta`, returns `null`.
     */
    type GetCollectionNameReturn<Name extends string> = Name extends CollectionName
      ? Document.Embedded._CollectionNameForName<Metadata.Embedded, Name>
      : null;

    /**
     * The return type for {@linkcode ActorDelta.getEmbeddedDocument | ActorDelta#getEmbeddedDocument}.
     * See {@linkcode EmbeddedCollection.GetReturn}.
     */
    type GetReturn<
      EmbeddedName extends CollectionName,
      Options extends EmbeddedCollection.GetOptions | undefined,
    > = EmbeddedCollection.GetReturn<DocumentFor<EmbeddedName>, Options>;

    /**
     * @deprecated This type has been made internal. If you are actively using it for some reason, please let us know.
     * This type will be removed
     */
    type CollectionNameOf<Name extends Embedded.CollectionName> = Document.Embedded._CollectionNameForName<
      Metadata.Embedded,
      Name
    >;
  }

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for the descendant Document operation methods, e.g
   * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type CollectionClass = never;

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type Collection = never;

  /**
   * An instance of `ActorDelta` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `ActorDelta` that comes from the database.
   */
  type Stored = Document.Internal.Stored<ActorDelta.Implementation>;

  /**
   * The data put in {@linkcode ActorDelta._source | ActorDelta#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source<SubType extends ActorDelta.SubType = ActorDelta.SubType> extends fields.SchemaField
    .SourceData<Schema> {
    type: SubType | null;
  }

  /**
   * The data necessary to create a document. Used in places like {@linkcode ActorDelta.create}
   * and {@linkcode ActorDelta | new ActorDelta(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends ActorDelta.SubType = ActorDelta.SubType> extends fields.SchemaField
    .CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode ActorDelta.create} and {@linkcode ActorDelta.createDocuments} signatures, and
   * {@linkcode ActorDelta.Database.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode ActorDelta.create}, returning (a single | an array of) (temporary | stored)
   * `ActorDelta`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<ActorDelta.TemporaryIf<Temporary>>
      : ActorDelta.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode ActorDelta.name | ActorDelta#name}.
   *
   * This is data transformed from {@linkcode ActorDelta.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode ActorDelta.update | ActorDelta#update}.
   * It is a distinct type from {@linkcode ActorDelta.CreateData | DeepPartial<ActorDelta.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode ActorDelta.update | ActorDelta#update} and
   * {@linkcode ActorDelta.updateDocuments} signatures, and {@linkcode ActorDelta.Database.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode ActorDelta}. This is the source of truth for how an ActorDelta document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode ActorDelta}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends fields.DataSchema {
    /**
     * The _id which uniquely identifies this ActorDelta document.
     */
    _id: fields.DocumentIdField;

    /**
     * The name override, if any.
     * @defaultValue `null`
     */
    name: fields.StringField<{ required: false; nullable: true; initial: null }>;

    /**
     * The type override, if any.
     * @defaultValue `null`
     */
    type: fields.StringField<{ required: false; nullable: true; initial: null }>;

    /**
     * The image override, if any.
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"]; nullable: true; initial: null; required: false }>;

    /**
     * The system data model override.
     */
    system: fields.ObjectField;

    /**
     * An array of embedded item data overrides.
     */
    items: fields.EmbeddedCollectionDeltaField<typeof foundry.documents.BaseItem, ActorDelta.Implementation>;

    /**
     * An array of embedded active effect data overrides.
     */
    effects: fields.EmbeddedCollectionDeltaField<typeof foundry.documents.BaseActiveEffect, ActorDelta.Implementation>;

    /**
     * Ownership overrides.
     * @defaultValue `null`
     */
    ownership: fields.DocumentOwnershipField<{ required: false; nullable: true; initial: null }>;

    /**
     * An object of actor flag overrides.
     */
    flags: fields.DocumentFlagsField<"Actor">;
  }

  namespace Database {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `ActorDelta` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<ActorDelta.Parent> {}

    /**
     * The interface for passing to {@linkcode ActorDelta.get}.
     * @see {@linkcode Document.Database.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `ActorDelta` documents.
     * @see {@linkcode Document.Database.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `ActorDelta` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ActorDelta.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<ActorDelta.CreateInput, ActorDelta.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode ActorDelta.create} or {@linkcode ActorDelta.createDocuments}.
     * @see {@linkcode Document.Database.CreateDocumentsOperation}
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
      .Database.CreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `ActorDelta` documents. (see {@linkcode ActorDelta.Parent})
     * @see {@linkcode Document.Database.CreateEmbeddedOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateEmbeddedOperation extends Document.Database.CreateEmbeddedOperation<CreateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `ActorDelta` documents.
     * @see {@linkcode Document.Database.BackendCreateOperation}
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
      .Database.BackendCreateOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode ActorDelta._preCreate | ActorDelta#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateActorDelta` hook}.
     * @see {@linkcode Document.Database.PreCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOptions<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database
      .PreCreateOptions<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode ActorDelta._preCreateOperation}.
     * @see {@linkcode Document.Database.PreCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database
      .PreCreateOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated The interface passed to {@linkcode ActorDelta._onCreateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database.OnCreateDocumentsOperation}
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
      .Database.OnCreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode ActorDelta._onCreate | ActorDelta#_onCreate} and
     * {@link Hooks.CreateDocument | the `createActorDelta` hook}.
     * @see {@linkcode Document.Database.OnCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOptions extends Document.Database.OnCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode ActorDelta._onCreateOperation} and `ActorDelta`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOperation extends Document.Database.OnCreateOperation<CreateOperation> {}

    /* ***********************************************
     *              UPDATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.UpdateOperation | DatabaseUpdateOperation}
     * interface for `ActorDelta` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ActorDelta.update | ActorDelta#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<ActorDelta.UpdateInput, ActorDelta.Parent> {}

    /**
     * The interface for passing to {@linkcode ActorDelta.update | ActorDelta#update}.
     * @see {@linkcode Document.Database.UpdateOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateOneDocumentOperation extends Document.Database.UpdateOneDocumentOperation<UpdateOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `ActorDelta` documents (see {@linkcode ActorDelta.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode ActorDelta.updateDocuments}.
     * @see {@linkcode Document.Database.UpdateManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateManyDocumentsOperation extends Document.Database.UpdateManyDocumentsOperation<UpdateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `ActorDelta` documents.
     * @see {@linkcode Document.Database.BackendUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendUpdateOperation extends Document.Database.BackendUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActorDelta._preUpdate | ActorDelta#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateActorDelta` hook}.
     * @see {@linkcode Document.Database.PreUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActorDelta._preUpdateOperation}.
     * @see {@linkcode Document.Database.PreUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOperation extends Document.Database.PreUpdateOperation<UpdateOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode ActorDelta._onUpdateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database.OnUpdateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateDocumentsOperation extends Document.Database.OnUpdateDocumentsOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActorDelta._onUpdate | ActorDelta#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateActorDelta` hook}.
     * @see {@linkcode Document.Database.OnUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOptions extends Document.Database.OnUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode ActorDelta._onUpdateOperation} and `ActorDelta`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOperation extends Document.Database.OnUpdateOperation<UpdateOperation> {}

    /* ***********************************************
     *              DELETE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.DeleteOperation | DatabaseDeleteOperation}
     * interface for `ActorDelta` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode ActorDelta.delete | ActorDelta#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<ActorDelta.Parent> {}

    /**
     * The interface for passing to {@linkcode ActorDelta.delete | ActorDelta#delete}.
     * @see {@linkcode Document.Database.DeleteOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteOneDocumentOperation extends Document.Database.DeleteOneDocumentOperation<DeleteOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `ActorDelta` documents (see {@linkcode ActorDelta.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode ActorDelta.deleteDocuments}.
     * @see {@linkcode Document.Database.DeleteManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteManyDocumentsOperation extends Document.Database.DeleteManyDocumentsOperation<DeleteOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `ActorDelta` documents.
     * @see {@linkcode Document.Database.BackendDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendDeleteOperation extends Document.Database.BackendDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActorDelta._preDelete | ActorDelta#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteActorDelta` hook}.
     * @see {@linkcode Document.Database.PreDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOptions extends Document.Database.PreDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActorDelta._preDeleteOperation}.
     * @see {@linkcode Document.Database.PreDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOperation extends Document.Database.PreDeleteOperation<DeleteOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode ActorDelta._onDeleteDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database.OnDeleteDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteDocumentsOperation extends Document.Database.OnDeleteDocumentsOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActorDelta._onDelete | ActorDelta#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteActorDelta` hook}.
     * @see {@linkcode Document.Database.OnDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOptions extends Document.Database.OnDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode ActorDelta._onDeleteOperation} and `ActorDelta`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOperation extends Document.Database.OnDeleteOperation<DeleteOperation> {}

    namespace Internal {
      interface OperationNameMap<Temporary extends boolean | undefined = boolean | undefined> {
        GetDocumentsOperation: ActorDelta.Database.GetDocumentsOperation;
        BackendGetOperation: ActorDelta.Database.BackendGetOperation;
        GetOperation: ActorDelta.Database.GetOperation;

        CreateDocumentsOperation: ActorDelta.Database.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: ActorDelta.Database.CreateEmbeddedOperation;
        BackendCreateOperation: ActorDelta.Database.BackendCreateOperation<Temporary>;
        CreateOperation: ActorDelta.Database.CreateOperation<Temporary>;
        PreCreateOptions: ActorDelta.Database.PreCreateOptions<Temporary>;
        PreCreateOperation: ActorDelta.Database.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: ActorDelta.Database.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: ActorDelta.Database.OnCreateOptions;
        OnCreateOperation: ActorDelta.Database.OnCreateOperation;

        UpdateOneDocumentOperation: ActorDelta.Database.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: ActorDelta.Database.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: ActorDelta.Database.UpdateManyDocumentsOperation;
        BackendUpdateOperation: ActorDelta.Database.BackendUpdateOperation;
        UpdateOperation: ActorDelta.Database.UpdateOperation;
        PreUpdateOptions: ActorDelta.Database.PreUpdateOptions;
        PreUpdateOperation: ActorDelta.Database.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: ActorDelta.Database.OnUpdateDocumentsOperation;
        OnUpdateOptions: ActorDelta.Database.OnUpdateOptions;
        OnUpdateOperation: ActorDelta.Database.OnUpdateOperation;

        DeleteOneDocumentOperation: ActorDelta.Database.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: ActorDelta.Database.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: ActorDelta.Database.DeleteManyDocumentsOperation;
        BackendDeleteOperation: ActorDelta.Database.BackendDeleteOperation;
        DeleteOperation: ActorDelta.Database.DeleteOperation;
        PreDeleteOptions: ActorDelta.Database.PreDeleteOptions;
        PreDeleteOperation: ActorDelta.Database.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: ActorDelta.Database.OnDeleteDocumentsOperation;
        OnDeleteOptions: ActorDelta.Database.OnDeleteOptions;
        OnDeleteOperation: ActorDelta.Database.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode ActorDelta.Implementation}, otherwise {@linkcode ActorDelta.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? ActorDelta.Implementation : ActorDelta.Stored;

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

  /** The interface {@linkcode ActorDelta.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode ActorDelta.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode ActorDelta.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode ActorDelta.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode ActorDelta.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode ActorDelta.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode ActorDelta.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends ActorDelta.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<ActorDelta.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode ActorDelta.deleteDialog | ActorDelta#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    ActorDelta.Stored,
    PassedConfig
  >;

  type PreCreateDescendantDocumentsArgs =
    | Document.Internal.PreCreateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.PreCreateDescendantDocumentsArgs;

  type OnCreateDescendantDocumentsArgs =
    | Document.Internal.OnCreateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.OnCreateDescendantDocumentsArgs;

  type PreUpdateDescendantDocumentsArgs =
    | Document.Internal.PreUpdateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.PreUpdateDescendantDocumentsArgs;

  type OnUpdateDescendantDocumentsArgs =
    | Document.Internal.OnUpdateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.OnUpdateDescendantDocumentsArgs;

  type PreDeleteDescendantDocumentsArgs =
    | Document.Internal.PreDeleteDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.PreDeleteDescendantDocumentsArgs;

  type OnDeleteDescendantDocumentsArgs =
    | Document.Internal.OnDeleteDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendantName,
        ActorDelta.Metadata.Embedded
      >
    | Item.OnDeleteDescendantDocumentsArgs;

  /* ***********************************************
   *           ACTOR-DELTA-SPECIFIC TYPES          *
   *************************************************/

  /** @internal */
  type _InitializeOptions = NullishProps<{
    /**
     * @remarks Is this initialization part of a {@linkcode Scene.reset | Scene#reset} call? (skips further initialization if truthy)
     * @defaultValue `false`
     */
    sceneReset: boolean;
  }>;

  interface InitializeOptions extends Document.InitializeOptions, _InitializeOptions {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   * @privateRemarks This is off-template, as ActorDelta throws if not provided a valid TokenDocument
   * parent in the construction context for any construction, not just `.create`ion
   */
  interface ConstructorArgs extends Identity<[data: CreateData | undefined, context: ConstructionContext]> {}

  /**
   * @deprecated Replaced with {@linkcode ActorDelta.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side ActorDelta embedded document which extends the common BaseActorDelta document model.
 * @see {@linkcode TokenDocument}  The TokenDocument document type which contains ActorDelta embedded documents.
 */
declare class ActorDelta<out SubType extends ActorDelta.SubType = ActorDelta.SubType> extends BaseActorDelta.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `ActorDelta`
   * @param context - Construction context options
   */
  // Note(LukeAbby): `data` is not actually required but `context.parent` is.
  constructor(data: ActorDelta.CreateData<SubType> | undefined, context: ActorDelta.ConstructionContext);

  protected override _configure(options?: Document.ConfigureOptions): void;

  protected override _initialize(options?: ActorDelta.InitializeOptions): void;

  /** Pass-through the type from the synthetic Actor, if it exists. */
  get type(): SubType;

  set type(type);

  protected _type: string;

  /**
   * Apply this ActorDelta to the base Actor and return a synthetic Actor.
   * @param context - Context to supply to synthetic Actor instantiation.
   * @remarks Forwards `context` to {@link BaseActorDelta.applyDelta | `this.constructor.applyDelta(this, this.parent.baseActor, context)`}
   */
  apply(context?: BaseActorDelta.ApplyDeltaContext): Actor.Implementation | null;

  /** @remarks `"The synthetic actor prepares its items in the appropriate context of an actor. The actor delta does not need to prepare its items, and would do so in the incorrect context."` */
  override prepareEmbeddedDocuments(): void;

  // TODO: accurately type changes and return type
  override updateSource(
    // Note(LukeAbby): This must be valid for both `new ActorDelta.implementation(actorChanges, { parent: this.parent });` and `super.updateSource`.
    // However it's likely the overlap between these two types is pretty high.
    changes?: ActorDelta.Source,
    options?: DataModel.UpdateOptions,
  ): object;

  override reset(): void;

  /**
   * Generate a synthetic Actor instance when constructed, or when the represented Actor, or actorLink status changes.
   */
  protected _createSyntheticActor(options?: {
    /**
     * Whether to fully re-initialize this ActorDelta's collections in
     * order to re-retrieve embedded Documents from the synthetic
     * Actor.
     */
    reinitializeCollections: boolean;
  }): void;

  /**
   * Update the synthetic Actor instance with changes from the delta or the base Actor.
   */
  updateSyntheticActor(): void;

  /**
   * Restore this delta to empty, inheriting all its properties from the base actor.
   * @returns The restored synthetic Actor.
   */
  restore(): Promise<Actor.Implementation>;

  /**
   * Ensure that the embedded collection delta is managing any entries that have had their descendants updated.
   * @param doc - The parent whose immediate children have been modified.
   */
  _handleDeltaCollectionUpdates(doc: Document.Any): void;

  /** @remarks `"No-op as ActorDeltas do not have sheets."` */
  protected override _onSheetChange(): Promise<void>;

  override _prepareDeltaUpdate(changes?: ActorDelta.UpdateData, options?: DataModel.UpdateOptions): void;

  // _onUpdate and _onDelete are all overridden but with no signature changes from BaseActorDelta.

  protected override _dispatchDescendantDocumentEvents(
    event: ClientDocument.LifeCycleEventName,
    collection: string,
    args: unknown[],
    _parent: ClientDocument,
  ): void;

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

  protected override _preCreateDescendantDocuments(...args: ActorDelta.PreCreateDescendantDocumentsArgs): void;

  protected override _onCreateDescendantDocuments(...args: ActorDelta.OnCreateDescendantDocumentsArgs): void;

  protected override _preUpdateDescendantDocuments(...args: ActorDelta.PreUpdateDescendantDocumentsArgs): void;

  protected override _onUpdateDescendantDocuments(...args: ActorDelta.OnUpdateDescendantDocumentsArgs): void;

  protected override _preDeleteDescendantDocuments(...args: ActorDelta.PreDeleteDescendantDocumentsArgs): void;

  protected override _onDeleteDescendantDocuments(...args: ActorDelta.OnDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: ActorDelta.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends ActorDelta.CreateDialogOptions | undefined = undefined,
  >(
    data?: ActorDelta.CreateDialogData,
    createOptions?: ActorDelta.Database.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<ActorDelta.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode ActorDelta.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends ActorDelta.CreateDialogOptions | undefined = undefined,
  >(
    data: ActorDelta.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: ActorDelta.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<ActorDelta.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: ActorDelta.Database.DeleteOneDocumentOperation,
  ): Promise<ActorDelta.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: ActorDelta.Database.DeleteOneDocumentOperation,
  ): Promise<ActorDelta.DeleteDialogReturn<Options>>;

  static override fromDropData(data: ActorDelta.DropData): Promise<ActorDelta.Implementation | undefined>;

  static override fromImport(
    source: ActorDelta.Source,
    context?: Document.FromImportContext<ActorDelta.Parent> | null,
  ): Promise<ActorDelta.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default ActorDelta;
