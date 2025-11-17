import type { ConfiguredCards } from "#configuration";
import type { Identity, InexactPartial, MaybeArray, Merge, NullishProps } from "#utils";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseCards from "#common/documents/cards.d.mts";
import type { documents } from "#client/client.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace Cards {
  /**
   * The document's name.
   */
  type Name = "Cards";

  /**
   * The context used to create a `Cards`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Cards`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Cards` document instance configured through
   * {@linkcode CONFIG.Cards.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredCards | fvtt-types/configuration/ConfiguredCards} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Cards` document configured through
   * {@linkcode CONFIG.Cards.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "Cards";
        collection: "cards";
        indexed: true;
        compendiumIndexFields: ["_id", "name", "description", "img", "type", "sort", "folder"];
        embedded: Metadata.Embedded;
        hasTypeData: true;
        label: string;
        labelPlural: string;
        permissions: Metadata.Permissions;
        coreTypes: ["deck", "hand", "pile"];
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      Card: "cards";
    }

    interface Permissions {
      create: "OWNER";
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `Cards`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.Cards.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"Cards">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"Cards">;

  /**
   * `Known` represents the types of `Cards` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = Cards.OfType<Cards.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `Cards` with the corresponding type. This works with both the
   * builtin `Cards` class or a custom subclass if that is set up in
   * {@link ConfiguredCards | `fvtt-types/configuration/ConfiguredCards`}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType
    extends Identity<{
      [Type in SubType]: Type extends unknown
        ? ConfiguredCards<Type> extends { document: infer Document }
          ? Document
          : // eslint-disable-next-line @typescript-eslint/no-restricted-types
            Cards<Type>
        : never;
    }> {}

  /**
   * `SystemOfType` returns the system property for a specific `Cards` subtype.
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
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendantName = "Card";

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = Card.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = Card.ImplementationClass;

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Cards">;

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
      Cards.Implementation,
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
   * The world collection that contains `Cards`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.CardStacks.ImplementationClass;

  /**
   * The world collection that contains `Cards`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.CardStacks.Implementation;

  /**
   * An instance of `Cards` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Cards` that comes from the database.
   */
  type Stored<SubType extends Cards.SubType = Cards.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode Cards._source | Cards#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Cards.create}
   * and {@linkcode Cards | new Cards(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends Cards.SubType = Cards.SubType> extends fields.SchemaField.CreateData<Schema> {
    type: SubType;
  }

  /**
   * Used in the {@linkcode Cards.create} and {@linkcode Cards.createDocuments} signatures, and
   * {@linkcode Cards.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Cards.create}, returning (a single | an array of) (temporary | stored)
   * `Cards`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput> ? Array<Cards.TemporaryIf<Temporary>> : Cards.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Cards.name | Cards#name}.
   *
   * This is data transformed from {@linkcode Cards.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Cards.update | Cards#update}.
   * It is a distinct type from {@linkcode Cards.CreateData | DeepPartial<Cards.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Cards.update | Cards#update} and
   * {@linkcode Cards.updateDocuments} signatures, and {@linkcode Cards.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Cards}. This is the source of truth for how an Cards document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Cards}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this stack of Cards document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The text name of this stack */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The type of this stack, in BaseCards.metadata.types
     * @defaultValue `BaseCards.TYPES[0]`
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    type: fields.DocumentTypeField<typeof BaseCards, {}>;

    /**
     * A text description of this stack
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ textSearch: true }>;

    /**
     * An image or video which is used to represent the stack of cards
     * @defaultValue `BaseCards.DEFAULT_ICON`
     */
    img: fields.FilePathField<{
      categories: ["IMAGE", "VIDEO"];
      initial: () => typeof BaseCards.DEFAULT_ICON;
    }>;

    /**
     * Data for a Cards subtype, defined by a System or Module
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseCards>;

    /**
     * A collection of Card documents which currently belong to this stack
     * @defaultValue `[]`
     */
    cards: fields.EmbeddedCollectionField<typeof documents.BaseCard, Cards.Implementation>;

    /**
     * The visible width of this stack
     * @defaultValue `null`
     */
    width: fields.NumberField<{ integer: true; positive: true }>;

    /**
     * The visible height of this stack
     * @defaultValue `null`
     */
    height: fields.NumberField<{ integer: true; positive: true }>;

    /**
     * The angle of rotation of this stack
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * Whether or not to publicly display the number of cards in this stack
     * @defaultValue `false`
     */
    displayCount: fields.BooleanField;

    /**
     * The _id of a Folder which contains this document
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The sort order of this stack relative to others in its parent collection
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Cards
     * @defaultValue see {@linkcode fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;

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
     * `Cards` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Cards.Parent> {}

    /**
     * The interface for passing to {@linkcode Cards.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Cards` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `Cards` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Cards.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<Cards.CreateInput, Cards.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode Cards.create} or {@linkcode Cards.createDocuments}.
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
     * @deprecated `Cards` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `Cards` documents. (see {@linkcode Cards.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Cards` documents.
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
     * The interface passed to {@linkcode Cards._preCreate | Cards#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateCards` hook}.
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
     * The interface passed to {@linkcode Cards._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode Cards._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Cards._onCreate | Cards#_onCreate} and
     * {@link Hooks.CreateDocument | the `createCards` hook}.
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
     * The interface passed to {@linkcode Cards._onCreateOperation} and `Cards`-related collections'
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
     * interface for `Cards` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Cards.update | Cards#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Cards.UpdateInput, Cards.Parent> {}

    /**
     * The interface for passing to {@linkcode Cards.update | Cards#update}.
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
     * @deprecated `Cards` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `Cards` documents (see {@linkcode Cards.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Cards.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Cards` documents.
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
     * The interface passed to {@linkcode Cards._preUpdate | Cards#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateCards` hook}.
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
     * The interface passed to {@linkcode Cards._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode Cards._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Cards._onUpdate | Cards#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateCards` hook}.
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
     * The interface passed to {@linkcode Cards._onUpdateOperation} and `Cards`-related collections'
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
     * interface for `Cards` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Cards.delete | Cards#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Cards.Parent> {}

    /**
     * The interface for passing to {@linkcode Cards.delete | Cards#delete}.
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
     * @deprecated `Cards` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `Cards` documents (see {@linkcode Cards.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Cards.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Cards` documents.
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
     * The interface passed to {@linkcode Cards._preDelete | Cards#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteCards` hook}.
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
     * The interface passed to {@linkcode Cards._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode Cards._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Cards._onDelete | Cards#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteCards` hook}.
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
     * The interface passed to {@linkcode Cards._onDeleteOperation} and `Cards`-related collections'
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
        GetDocumentsOperation: Cards.Database2.GetDocumentsOperation;
        BackendGetOperation: Cards.Database2.BackendGetOperation;
        GetOperation: Cards.Database2.GetOperation;

        CreateDocumentsOperation: Cards.Database2.CreateDocumentsOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        CreateEmbeddedOperation: Cards.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: Cards.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: Cards.Database2.CreateOperation<Temporary>;
        PreCreateOptions: Cards.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: Cards.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Cards.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Cards.Database2.OnCreateOptions;
        OnCreateOperation: Cards.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: Cards.Database2.UpdateOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        UpdateEmbeddedOperation: Cards.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Cards.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Cards.Database2.BackendUpdateOperation;
        UpdateOperation: Cards.Database2.UpdateOperation;
        PreUpdateOptions: Cards.Database2.PreUpdateOptions;
        PreUpdateOperation: Cards.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Cards.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: Cards.Database2.OnUpdateOptions;
        OnUpdateOperation: Cards.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: Cards.Database2.DeleteOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        DeleteEmbeddedOperation: Cards.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Cards.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Cards.Database2.BackendDeleteOperation;
        DeleteOperation: Cards.Database2.DeleteOperation;
        PreDeleteOptions: Cards.Database2.PreDeleteOptions;
        PreDeleteOperation: Cards.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Cards.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: Cards.Database2.OnDeleteOptions;
        OnDeleteOperation: Cards.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode Cards.Implementation}, otherwise {@linkcode Cards.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? Cards.Implementation : Cards.Stored;

  namespace Database {
    /** Options passed along in Get operations for Cards Documents */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Cards.Parent> {}

    /** Options passed along in Create operations for Cards Documents */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Cards.CreateData, Cards.Parent, Temporary> {
      animate?: boolean;
    }

    /** Options passed along in Delete operations for Cards Documents */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Cards.Parent> {
      animate?: boolean;
    }

    /** Options passed along in Update operations for Cards Documents */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Cards.UpdateData, Cards.Parent> {
      animate?: boolean;
    }

    /** Operation for {@linkcode Cards.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Cards.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Cards.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Cards.Database.Update> {}

    /** Operation for {@linkcode Cards.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Cards.Database.Delete> {}

    /** Operation for {@linkcode Cards.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Cards.Database.Create<Temporary>> {}

    /** Operation for {@link Cards.update | `Cards#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Cards.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Cards._preCreate | `Cards#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Cards._onCreate | `Cards#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Cards._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Cards.Database.Create> {}

    /** Operation for {@link Cards._onCreateOperation | `Cards#_onCreateOperation`} */
    interface OnCreateOperation extends Cards.Database.Create {}

    /** Options for {@link Cards._preUpdate | `Cards#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Cards._onUpdate | `Cards#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Cards._preUpdateOperation} */
    interface PreUpdateOperation extends Cards.Database.Update {}

    /** Operation for {@link Cards._onUpdateOperation | `Cards._preUpdateOperation`} */
    interface OnUpdateOperation extends Cards.Database.Update {}

    /** Options for {@link Cards._preDelete | `Cards#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Cards._onDelete | `Cards#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Cards._preDeleteOperation | `Cards#_preDeleteOperation`} */
    interface PreDeleteOperation extends Cards.Database.Delete {}

    /** Options for {@link Cards._onDeleteOperation | `Cards#_onDeleteOperation`} */
    interface OnDeleteOperation extends Cards.Database.Delete {}

    /** Context for {@linkcode Cards._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Cards.Parent> {}

    /** Context for {@linkcode Cards._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Cards.Parent> {}

    /** Context for {@linkcode Cards._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Cards.Parent> {}

    /**
     * Options for {@link Cards._preCreateDescendantDocuments | `Cards#_preCreateDescendantDocuments`}
     * and {@link Cards._onCreateDescendantDocuments | `Cards#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Cards.Database.Create> {}

    /**
     * Options for {@link Cards._preUpdateDescendantDocuments | `Cards#_preUpdateDescendantDocuments`}
     * and {@link Cards._onUpdateDescendantDocuments | `Cards#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Cards.Database.Update> {}

    /**
     * Options for {@link Cards._preDeleteDescendantDocuments | `Cards#_preDeleteDescendantDocuments`}
     * and {@link Cards._onDeleteDescendantDocuments | `Cards#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Cards.Database.Delete> {}

    /**
     * Create options for {@linkcode Cards.createDialog}.
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

  /** The interface {@linkcode Cards.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Cards.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Cards.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Cards.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode Cards.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Cards.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode Cards.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends Cards.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<Cards.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode Cards.deleteDialog | Cards#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Cards.Stored,
    PassedConfig
  >;

  type PreCreateDescendantDocumentsArgs = Document.Internal.PreCreateDescendantDocumentsArgs<
    Cards.Stored,
    Cards.DirectDescendantName,
    Cards.Metadata.Embedded
  >;

  type OnCreateDescendantDocumentsArgs = Document.Internal.OnCreateDescendantDocumentsArgs<
    Cards.Stored,
    Cards.DirectDescendantName,
    Cards.Metadata.Embedded
  >;

  type PreUpdateDescendantDocumentsArgs = Document.Internal.PreUpdateDescendantDocumentsArgs<
    Cards.Stored,
    Cards.DirectDescendantName,
    Cards.Metadata.Embedded
  >;

  type OnUpdateDescendantDocumentsArgs = Document.Internal.OnUpdateDescendantDocumentsArgs<
    Cards.Stored,
    Cards.DirectDescendantName,
    Cards.Metadata.Embedded
  >;

  type PreDeleteDescendantDocumentsArgs = Document.Internal.PreDeleteDescendantDocumentsArgs<
    Cards.Stored,
    Cards.DirectDescendantName,
    Cards.Metadata.Embedded
  >;

  type OnDeleteDescendantDocumentsArgs = Document.Internal.OnDeleteDescendantDocumentsArgs<
    Cards.Stored,
    Cards.DirectDescendantName,
    Cards.Metadata.Embedded
  >;

  /* ***********************************************
   *             CARDS-SPECIFIC TYPES              *
   *************************************************/

  /**
   * @remarks Passing anything else errors downstream when a lookup table lacking the provided key causes
   * {@link Cards._postChatNotification | `Cards#_postChatNotification`} to call {@link Localization.format | `game.i18n.format`}
   * with an `undefined` first argument
   */
  type DealAction = "deal" | "pass";

  /**
   * @remarks Passing anything else errors downstream when a lookup table lacking the provided key causes
   * {@link Cards._postChatNotification | `Cards#_postChatNotification`} to call {@link Localization.format | `game.i18n.format`}
   * with an `undefined` first argument
   */
  type PassAction = "pass" | "play" | "draw" | "discard";

  /** @internal */
  type _ChatNotificationOption = NullishProps<{
    /**
     * Create a ChatMessage which notifies that this action has occurred
     * @defaultValue `true`
     */
    chatNotification: boolean;
  }>;

  /**
   * Omitting one word from the different descriptions in various methods' JSDocs lets
   * this be a reusable property
   *
   * @internal
   */
  type _UpdateDataOption = InexactPartial<{
    /**
     * Modifications to make to each Card as part of the [...] operation, for example the displayed face
     * @defaultValue `{}`
     * @remarks Can't be `null` as it only has a parameter default
     */
    updateData: Card.UpdateData;
  }>;

  type _HowOption = InexactPartial<{
    /**
     * How to draw, a value from CONST.CARD_DRAW_MODES
     * @defaultValue `CONST.CARD_DRAW_MODES.FIRST`
     * @remarks Can't be `null` as it only has a parameter default
     */
    how: CONST.CARD_DRAW_MODES;
  }>;

  /** @internal */
  type _DealOptions = InexactPartial<{
    /**
     * The name of the action being performed, used as part of the dispatched Hook event
     * @defaultValue `"deal"`
     * @remarks Can't be `null` as it only has a parameter default. See {@linkcode Cards.DealAction}
     */
    action: DealAction;
  }>;

  interface DealOptions extends _DealOptions, _HowOption, _UpdateDataOption, _ChatNotificationOption {}

  /**
   * Additional context which describes the operation
   * @remarks This is the context provided to the {@link Hooks.StaticCallbacks.dealCards | `dealCards`} hook
   */
  interface DealContext {
    /**
     * The action name being performed, i.e. "deal", "pass"
     * @remarks See {@linkcode Cards.DealAction}
     */
    action: DealAction;

    /**
     * An array of Card creation operations to be performed in each destination Cards document
     * @remarks Outer array: one element per `to` provided to this {@link Cards.deal | `Cards#deal`} call
     */
    toCreate: Card.CreateData[][];

    /**
     * Card update operations to be performed in the origin Cards document
     * @remarks Core will only ever provide elements of `{ _id: string; drawn: true}`
     */
    fromUpdate: Card.UpdateData[];

    /**
     * Card deletion operations to be performed in the origin Cards document
     * @remarks An array of `_id`s
     */
    fromDelete: string[];
  }

  /** @internal */
  type _PassOptions = InexactPartial<{
    /**
     * The name of the action being performed, used as part of the dispatched Hook event
     * @defaultValue `"pass"`
     * @remarks Can't be `null` as it only has a parameter default. See {@linkcode PassAction}
     */
    action: PassAction;
  }>;

  interface PassOptions extends _PassOptions, _UpdateDataOption, _ChatNotificationOption {}

  /**
   * Additional context which describes the operation
   * @remarks This is the context provided to the {@link Hooks.StaticCallbacks.passCards | `passCards`} hook
   */
  interface PassContext extends Pick<DealContext, "fromUpdate" | "fromDelete"> {
    /**
     * The action name being performed, i.e. "pass", "play", "discard", "draw"
     * @remarks See {@linkcode Cards.PassAction}
     */
    action: PassAction;

    /**
     * Card creation operations to be performed in the destination Cards document
     */
    toCreate: Card.CreateData[];

    /**
     * Card update operations to be performed in the destination Cards document
     * @remarks Core will only ever provide elements of `{ _id: string; drawn: false }`
     */
    toUpdate: Card.UpdateData[];
  }

  /**
   * @remarks {@link Cards.draw | `Cards#draw`} spreads this into an object, minus `how`, with the `action` preset to `"draw"`,
   * which wouldn't make sense to change, then passes that to {@link Cards.pass | `Cards#pass`}
   * @privateRemarks `action` omitted as it's already provided.
   */
  interface DrawOptions extends _HowOption, Omit<PassOptions, "action"> {
    /**
     * @deprecated While passing `action` is technically valid, it's unclear why this would ever be done.
     * If you need to do this call `this.parent.pass` directly.
     */
    action?: never;
  }

  interface ShuffleOptions extends _UpdateDataOption, _ChatNotificationOption {}

  interface RecallOptions extends _UpdateDataOption, _ChatNotificationOption {}

  /**
   * Additional context which describes the operation.
   * @remarks This is the context provided to the {@link Hooks.StaticCallbacks.returnCards | `returnCards`} hook
   */
  interface ReturnContext extends Pick<DealContext, "fromDelete"> {
    /**
     * A mapping of Card deck IDs to the update operations that will be performed on them.
     */
    toUpdate: Record<string, Card.UpdateData[]>;
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
   * @deprecated Replaced with {@linkcode Cards.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side Cards document which extends the common BaseCards model.
 * Each Cards document contains CardsData which defines its data schema.
 *
 * @see {@linkcode CardStacks}                        The world-level collection of Cards documents
 * @see {@linkcode CardsConfig}                       The Cards configuration application
 */
declare class Cards<out SubType extends Cards.SubType = Cards.SubType> extends BaseCards.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Cards`
   * @param context - Construction context options
   */
  constructor(data: Cards.CreateData<SubType>, context?: Cards.ConstructionContext);

  /**
   * Provide a thumbnail image path used to represent this document.
   */
  get thumbnail(): string | null;

  /**
   * The Card documents within this stack which are able to be drawn.
   */
  get availableCards(): Card.Implementation[];

  /**
   * The Card documents which belong to this stack but have already been drawn.
   */
  get drawnCards(): Card.Implementation[];

  /**
   * Returns the localized Label for the type of Card Stack this is
   */
  get typeLabel(): string;

  /**
   * Can this Cards document be cloned in a duplicate workflow?
   */
  get canClone(): boolean;

  /**
   * @remarks Sets `context.keepEmbeddedIds` to `false` if it's `=== undefined`
   */
  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<Cards.Implementation | Cards.CreateData> | undefined,
    operation?: Document.Database.CreateDocumentsOperation<Cards.Database.Create<Temporary>>,
  ): Promise<Array<Cards.TemporaryIf<Temporary>>>;

  /**
   * Deal one or more cards from this Cards document to each of a provided array of Cards destinations.
   * Cards are allocated from the top of the deck in cyclical order until the required number of Cards have been dealt.
   * @param to      - An array of other Cards documents to which cards are dealt
   * @param number  - The number of cards to deal to each other document (default: `1`)
   * @param options - Options which modify how the deal operation is performed (default: `{}`)
   * @returns This Cards document after the deal operation has completed
   */
  deal(to: Cards.Implementation[], number?: number, options?: Cards.DealOptions): Promise<Cards.Implementation>;

  /**
   * Pass an array of specific Card documents from this document to some other Cards stack.
   * @param to      - Some other Cards document that is the destination for the pass operation
   * @param ids     - The embedded Card ids which should be passed
   * @param options - Additional options which modify the pass operation (default: `{}`)
   * @returns An array of the Card embedded documents created within the destination stack
   */
  pass(to: Cards.Implementation, ids: string[], options?: Cards.PassOptions): Promise<Card.Implementation[]>;

  /**
   * Draw one or more cards from some other Cards document.
   * @param from    - Some other Cards document from which to draw
   * @param number  - The number of cards to draw (default: `1`)
   * @param options - Options which modify how the draw operation is performed (default: `{}`)
   * @returns An array of the Card documents which were drawn
   */
  draw(from: Cards.Implementation, number?: number, options?: Cards.DrawOptions): Promise<Card.Implementation[]>;

  /**
   * Shuffle this Cards stack, randomizing the sort order of all the cards it contains.
   * @param options - Options which modify how the shuffle operation is performed. (default: `{}`)
   * @returns The Cards document after the shuffle operation has completed
   */
  shuffle(options?: Cards.ShuffleOptions): Promise<this>;

  /**
   * Recall the Cards stack, retrieving all original cards from other stacks where they may have been drawn if this is a
   * deck, otherwise returning all the cards in this stack to the decks where they originated.
   * @param options - Options which modify the recall operation
   * @returns The Cards document after the recall operation has completed.
   */
  recall(options?: Cards.RecallOptions): Promise<this>;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected _resetDeck(options?: never): never;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected _resetStack(options?: never): never;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected _postChatNotification(source: never, action: never, context: never): never;

  /**
   * A sorting function that is used to determine the standard order of Card documents within an un-shuffled stack.
   * @param a - The card being sorted
   * @param b - Another card being sorted against
   */
  protected sortStandard(a: Card.Implementation, b: Card.Implementation): number;

  /**
   * A sorting function that is used to determine the order of Card documents within a shuffled stack.
   * @param a - The card being sorted
   * @param b - Another card being sorted against
   */
  protected sortShuffled(a: Card.Implementation, b: Card.Implementation): number;

  /**
   * An internal helper method for drawing a certain number of Card documents from this Cards stack.
   * @param number - The number of cards to draw
   * @param how    - A draw mode from CONST.CARD_DRAW_MODES
   * @returns An array of drawn Card documents
   */
  protected _drawCards(number: number, how: CONST.CARD_DRAW_MODES): Card.Implementation[];

  // _preCreate and _preDelete are overridden but with no signature changes from BaseCards.

  /**
   * Display a dialog which prompts the user to deal cards to some number of hand-type Cards documents.
   * @see {@link Cards.deal | `Cards#deal`}
   */
  dealDialog(): Promise<this | null>;

  /**
   * Display a dialog which prompts the user to draw cards from some other deck-type Cards documents.
   * @see {@link Cards.draw | `Cards#draw`}
   */
  drawDialog(): Promise<Card.Implementation[] | null>;

  /**
   * Display a dialog which prompts the user to pass cards from this document to some other other Cards document.
   * @see {@link Cards.deal | `Cards#deal`}
   */
  passDialog(): Promise<this | null>;

  /**
   * Display a dialog which prompts the user to play a specific Card to some other Cards document
   * @see {@link Cards.pass | `Cards#pass`}
   * @param card - The specific card being played as part of this dialog
   */
  playDialog(card: Card.Implementation): Promise<Card.Implementation[] | null>;

  /**
   * Display a confirmation dialog for whether or not the user wishes to reset a Cards stack
   * @see {@link Cards.reset | `Cards#reset`}
   */
  resetDialog(): Promise<this | false | null>;

  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends Cards.CreateDialogOptions | undefined = undefined,
  >(
    data?: Cards.CreateDialogData,
    createOptions?: Cards.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<Cards.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Cards.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends Cards.CreateDialogOptions | undefined = undefined,
  >(
    data: Cards.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Cards.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<Cards.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Cards.Database2.DeleteOneDocumentOperation,
  ): Promise<Cards.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Cards.Database2.DeleteOneDocumentOperation,
  ): Promise<Cards.DeleteDialogReturn<Options>>;

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

  protected override _preCreateDescendantDocuments(...args: Cards.PreCreateDescendantDocumentsArgs): void;

  protected override _onCreateDescendantDocuments(...args: Cards.OnCreateDescendantDocumentsArgs): void;

  protected override _preUpdateDescendantDocuments(...args: Cards.PreUpdateDescendantDocumentsArgs): void;

  protected override _onUpdateDescendantDocuments(...args: Cards.OnUpdateDescendantDocumentsArgs): void;

  protected override _preDeleteDescendantDocuments(...args: Cards.PreDeleteDescendantDocumentsArgs): void;

  protected override _onDeleteDescendantDocuments(...args: Cards.OnDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: Cards.DefaultNameContext): string;

  static override fromDropData(data: Cards.DropData): Promise<Cards.Implementation | undefined>;

  static override fromImport(
    source: Cards.Source,
    context?: Document.FromImportContext<Cards.Parent> | null,
  ): Promise<Cards.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default Cards;
