import type { InexactPartial, MaybeArray, Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseRollTable from "#common/documents/roll-table.mjs";
import type TextEditor from "#client/applications/ux/text-editor.mjs";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace RollTable {
  /**
   * The document's name.
   */
  type Name = "RollTable";

  /**
   * The context used to create a `RollTable`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `RollTable`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `RollTable` document instance configured through
   * {@linkcode CONFIG.RollTable.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `RollTable` document configured through
   * {@linkcode CONFIG.RollTable.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "RollTable";
        collection: "tables";
        indexed: true;
        compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
        embedded: Metadata.Embedded;
        label: string;
        labelPlural: string;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      TableResult: "results";
    }
  }

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = null;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendantName = "TableResult";

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = TableResult.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = TableResult.ImplementationClass;

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<Name>;

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
      RollTable.Implementation,
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
   * The world collection that contains `RollTable`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.RollTables.ImplementationClass;

  /**
   * The world collection that contains `RollTable`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.RollTables.Implementation;

  /**
   * An instance of `RollTable` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `RollTable` that comes from the database.
   */
  type Stored = Document.Internal.Stored<RollTable.Implementation>;

  /**
   * The data put in {@linkcode RollTable._source | RollTable#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode RollTable.create}
   * and {@linkcode RollTable | new RollTable(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode RollTable.create} and {@linkcode RollTable.createDocuments} signatures, and
   * {@linkcode RollTable.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode RollTable.create}, returning (a single | an array of) (temporary | stored)
   * `RollTable`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<RollTable.TemporaryIf<Temporary>>
      : RollTable.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode RollTable.name | RollTable#name}.
   *
   * This is data transformed from {@linkcode RollTable.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode RollTable.update | RollTable#update}.
   * It is a distinct type from {@linkcode RollTable.CreateData | DeepPartial<RollTable.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode RollTable.update | RollTable#update} and
   * {@linkcode RollTable.updateDocuments} signatures, and {@linkcode RollTable.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode RollTable}. This is the source of truth for how an RollTable document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode RollTable}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this RollTable document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this RollTable
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * An image file path which provides the thumbnail artwork for this RollTable
     * @defaultValue `BaseRollTable.DEFAULT_ICON`
     */
    img: fields.FilePathField<{
      categories: ["IMAGE"];
      initial: () => typeof documents.BaseRollTable.DEFAULT_ICON;
    }>;

    /**
     * The HTML text description for this RollTable document
     * @defaultValue `""`
     */
    description: fields.StringField<{ textSearch: true }>;

    /**
     * A Collection of TableResult embedded documents which belong to this RollTable
     * @defaultValue `[]`
     */
    results: fields.EmbeddedCollectionField<typeof documents.BaseTableResult, RollTable.Implementation>;

    /**
     * The Roll formula which determines the results chosen from the table
     * @defaultValue `""`
     */
    formula: fields.StringField;

    /**
     * Are results from this table drawn with replacement?
     * @defaultValue `true`
     */
    replacement: fields.BooleanField<{ initial: true }>;

    /**
     * Is the Roll result used to draw from this RollTable displayed in chat?
     * @defaultValue `true`
     */
    displayRoll: fields.BooleanField<{ initial: true }>;

    /**
     * The _id of a Folder which contains this RollTable
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The numeric sort value which orders this RollTable relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this RollTable
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
     * `RollTable` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<RollTable.Parent> {}

    /**
     * The interface for passing to {@linkcode RollTable.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `RollTable` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `RollTable` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode RollTable.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<RollTable.CreateInput, RollTable.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode RollTable.create} or {@linkcode RollTable.createDocuments}.
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
     * @deprecated `RollTable` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `RollTable` documents. (see {@linkcode RollTable.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `RollTable` documents.
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
     * The interface passed to {@linkcode RollTable._preCreate | RollTable#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateRollTable` hook}.
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
     * The interface passed to {@linkcode RollTable._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode RollTable._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode RollTable._onCreate | RollTable#_onCreate} and
     * {@link Hooks.CreateDocument | the `createRollTable` hook}.
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
     * The interface passed to {@linkcode RollTable._onCreateOperation} and `RollTable`-related collections'
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
     * interface for `RollTable` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode RollTable.update | RollTable#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<RollTable.UpdateInput, RollTable.Parent> {}

    /**
     * The interface for passing to {@linkcode RollTable.update | RollTable#update}.
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
     * @deprecated `RollTable` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `RollTable` documents (see {@linkcode RollTable.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode RollTable.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `RollTable` documents.
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
     * The interface passed to {@linkcode RollTable._preUpdate | RollTable#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateRollTable` hook}.
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
     * The interface passed to {@linkcode RollTable._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode RollTable._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode RollTable._onUpdate | RollTable#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateRollTable` hook}.
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
     * The interface passed to {@linkcode RollTable._onUpdateOperation} and `RollTable`-related collections'
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
     * interface for `RollTable` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode RollTable.delete | RollTable#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<RollTable.Parent> {}

    /**
     * The interface for passing to {@linkcode RollTable.delete | RollTable#delete}.
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
     * @deprecated `RollTable` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `RollTable` documents (see {@linkcode RollTable.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode RollTable.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `RollTable` documents.
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
     * The interface passed to {@linkcode RollTable._preDelete | RollTable#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteRollTable` hook}.
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
     * The interface passed to {@linkcode RollTable._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode RollTable._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode RollTable._onDelete | RollTable#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteRollTable` hook}.
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
     * The interface passed to {@linkcode RollTable._onDeleteOperation} and `RollTable`-related collections'
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
        GetDocumentsOperation: RollTable.Database2.GetDocumentsOperation;
        BackendGetOperation: RollTable.Database2.BackendGetOperation;
        GetOperation: RollTable.Database2.GetOperation;

        CreateDocumentsOperation: RollTable.Database2.CreateDocumentsOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        CreateEmbeddedOperation: RollTable.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: RollTable.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: RollTable.Database2.CreateOperation<Temporary>;
        PreCreateOptions: RollTable.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: RollTable.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: RollTable.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: RollTable.Database2.OnCreateOptions;
        OnCreateOperation: RollTable.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: RollTable.Database2.UpdateOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        UpdateEmbeddedOperation: RollTable.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: RollTable.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: RollTable.Database2.BackendUpdateOperation;
        UpdateOperation: RollTable.Database2.UpdateOperation;
        PreUpdateOptions: RollTable.Database2.PreUpdateOptions;
        PreUpdateOperation: RollTable.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: RollTable.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: RollTable.Database2.OnUpdateOptions;
        OnUpdateOperation: RollTable.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: RollTable.Database2.DeleteOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        DeleteEmbeddedOperation: RollTable.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: RollTable.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: RollTable.Database2.BackendDeleteOperation;
        DeleteOperation: RollTable.Database2.DeleteOperation;
        PreDeleteOptions: RollTable.Database2.PreDeleteOptions;
        PreDeleteOperation: RollTable.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: RollTable.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: RollTable.Database2.OnDeleteOptions;
        OnDeleteOperation: RollTable.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode RollTable.Implementation}, otherwise {@linkcode RollTable.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? RollTable.Implementation : RollTable.Stored;

  namespace Database {
    /** Options passed along in Get operations for RollTables */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<RollTable.Parent> {}

    /** Options passed along in Create operations for RollTables */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<RollTable.CreateData, RollTable.Parent, Temporary> {}

    /** Options passed along in Delete operations for RollTables */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<RollTable.Parent> {}

    /** Options passed along in Update operations for RollTables */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<RollTable.UpdateData, RollTable.Parent> {}

    /** Operation for {@linkcode RollTable.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<RollTable.Database.Create<Temporary>> {}

    /** Operation for {@linkcode RollTable.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<RollTable.Database.Update> {}

    /** Operation for {@linkcode RollTable.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<RollTable.Database.Delete> {}

    /** Operation for {@linkcode RollTable.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<RollTable.Database.Create<Temporary>> {}

    /** Operation for {@link RollTable.update | `RollTable#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode RollTable.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link RollTable._preCreate | `RollTable#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link RollTable._onCreate | `RollTable#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode RollTable._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<RollTable.Database.Create> {}

    /** Operation for {@link RollTable._onCreateOperation | `RollTable#_onCreateOperation`} */
    interface OnCreateOperation extends RollTable.Database.Create {}

    /** Options for {@link RollTable._preUpdate | `RollTable#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link RollTable._onUpdate | `RollTable#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode RollTable._preUpdateOperation} */
    interface PreUpdateOperation extends RollTable.Database.Update {}

    /** Operation for {@link RollTable._onUpdateOperation | `RollTable._preUpdateOperation`} */
    interface OnUpdateOperation extends RollTable.Database.Update {}

    /** Options for {@link RollTable._preDelete | `RollTable#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link RollTable._onDelete | `RollTable#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link RollTable._preDeleteOperation | `RollTable#_preDeleteOperation`} */
    interface PreDeleteOperation extends RollTable.Database.Delete {}

    /** Options for {@link RollTable._onDeleteOperation | `RollTable#_onDeleteOperation`} */
    interface OnDeleteOperation extends RollTable.Database.Delete {}

    /** Context for {@linkcode RollTable._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<RollTable.Parent> {}

    /** Context for {@linkcode RollTable._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<RollTable.Parent> {}

    /** Context for {@linkcode RollTable._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<RollTable.Parent> {}

    /**
     * Options for {@link RollTable._preCreateDescendantDocuments | `RollTable#_preCreateDescendantDocuments`}
     * and {@link RollTable._onCreateDescendantDocuments | `RollTable#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<RollTable.Database.Create> {}

    /**
     * Options for {@link RollTable._preUpdateDescendantDocuments | `RollTable#_preUpdateDescendantDocuments`}
     * and {@link RollTable._onUpdateDescendantDocuments | `RollTable#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<RollTable.Database.Update> {}

    /**
     * Options for {@link RollTable._preDeleteDescendantDocuments | `RollTable#_preDeleteDescendantDocuments`}
     * and {@link RollTable._onDeleteDescendantDocuments | `RollTable#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<RollTable.Database.Delete> {}

    /**
     * Create options for {@linkcode RollTable.createDialog}.
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

  /** The interface {@linkcode RollTable.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode RollTable.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode RollTable.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode RollTable.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode RollTable.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode RollTable.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode RollTable.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends RollTable.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<RollTable.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode RollTable.deleteDialog | RollTable#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    RollTable.Stored,
    PassedConfig
  >;

  type PreCreateDescendantDocumentsArgs = Document.Internal.PreCreateDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendantName,
    RollTable.Metadata.Embedded
  >;

  type OnCreateDescendantDocumentsArgs = Document.Internal.OnCreateDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendantName,
    RollTable.Metadata.Embedded
  >;

  type PreUpdateDescendantDocumentsArgs = Document.Internal.PreUpdateDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendantName,
    RollTable.Metadata.Embedded
  >;

  type OnUpdateDescendantDocumentsArgs = Document.Internal.OnUpdateDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendantName,
    RollTable.Metadata.Embedded
  >;

  type PreDeleteDescendantDocumentsArgs = Document.Internal.PreDeleteDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendantName,
    RollTable.Metadata.Embedded
  >;

  type OnDeleteDescendantDocumentsArgs = Document.Internal.OnDeleteDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendantName,
    RollTable.Metadata.Embedded
  >;

  /* ***********************************************
   *          ROLL-TABLE-SPECIFIC TYPES            *
   *************************************************/

  /**
   * An object containing the executed Roll and the produced results
   */
  interface Draw {
    /**
     * The Dice roll which generated the draw
     */
    roll: Roll;

    /**
     * An array of drawn TableResult documents
     */
    results: Document.ToConfiguredInstance<typeof foundry.documents.BaseTableResult>[];
  }

  /**
   * Optional arguments which customize the draw
   */
  interface DrawOptions {
    /**
     * An existing Roll instance to use for drawing from the table
     */
    roll: Roll;

    /**
     * Allow drawing recursively from inner RollTable results
     * @defaultValue `true`
     */
    recursive: boolean;

    /**
     * One or more table results which have been drawn
     * @defaultValue `[]`
     */
    results: TableResult.Implementation[];

    /**
     * Whether to automatically display the results in chat
     * @defaultValue `true`
     */
    displayChat: boolean;

    /**
     * The chat roll mode to use when displaying the result
     */
    rollMode: ChatMessage.PassableRollMode;
  }

  /**
   * Additional options which modify message creation
   */
  interface ToMessageOptions<Temporary extends boolean | undefined = undefined> {
    /**
     * An optional Roll instance which produced the drawn results
     */
    roll: Roll | null;

    /**
     * Additional data which customizes the created messages
     * @defaultValue `{}`
     */
    messageData: ConstructorParameters<typeof foundry.documents.BaseChatMessage>[0];

    /**
     * Additional options which customize the created messages
     * @defaultValue `{}`
     */
    messageOptions: ChatMessage.Database.CreateOperation<Temporary>;
  }

  interface RollOptions {
    /**
     * An alternative dice Roll to use instead of the default table formula
     */
    roll?: Roll;

    /**
     * If a RollTable document is drawn as a result, recursively roll it
     * @defaultValue `true`
     */
    recursive?: boolean;

    /**
     * An internal flag used to track recursion depth
     * @defaultValue `0`
     */
    _depth?: number;
  }

  interface RollTableHTMLEmbedConfig extends TextEditor.DocumentHTMLEmbedConfig {
    /**
     * Adds a button allowing the table to be rolled directly from its embedded context.
     * Default: `false`
     */
    rollable?: boolean | undefined;
  }

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side RollTable document which extends the common BaseRollTable model.
 *
 * @see {@linkcode RollTables}         The world-level collection of RollTable documents
 * @see {@linkcode TableResult}        The embedded TableResult document
 * @see {@linkcode RollTableConfig}    The RollTable configuration application
 */
declare class RollTable extends BaseRollTable.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `RollTable`
   * @param context - Construction context options
   */
  constructor(data: RollTable.CreateData, context?: RollTable.ConstructionContext);

  /**
   * Provide a thumbnail image path used to represent this document.
   */
  get thumbnail(): this["img"];

  /**
   * Display a result drawn from a RollTable in the Chat Log along.
   * Optionally also display the Roll which produced the result and configure aspects of the displayed messages.
   *
   * @param results - An Array of one or more TableResult Documents which were drawn and should be displayed
   * @param options - Additional options which modify message creation
   */
  toMessage(
    results: TableResult.Implementation[],
    options?: InexactPartial<RollTable.ToMessageOptions>,
  ): Promise<ChatMessage.Implementation | undefined>;

  /**
   * Draw a result from the RollTable based on the table formula or a provided Roll instance
   * @param options - Optional arguments which customize the draw behavior
   * @returns A Promise which resolves to an object containing the executed roll and the produced results
   */
  draw(options?: RollTable.DrawOptions): Promise<RollTable.Draw>;

  /**
   * Draw multiple results from a RollTable, constructing a final synthetic Roll as a dice pool of inner rolls.
   * @param number  - The number of results to draw
   * @param options - Optional arguments which customize the draw
   * @returns The drawn results
   */
  drawMany(number: number, options?: InexactPartial<RollTable.DrawOptions>): Promise<RollTable.Draw>;

  /**
   * Normalize the probabilities of rolling each item in the RollTable based on their assigned weights
   */
  normalize(): Promise<this | undefined>;

  /**
   * Reset the state of the RollTable to return any drawn items to the table
   * @remarks Actually, returns list of TableEntries updated, not the RollTable.
   * As written, it force updates all records, not just the ones already drawn.
   */
  resetResults(): Promise<TableResult.Stored[]>;

  /**
   * Evaluate a RollTable by rolling its formula and retrieving a drawn result.
   *
   * Note that this function only performs the roll and identifies the result, the RollTable#draw function should be
   * called to formalize the draw from the table.
   *
   * @param options - Options which modify rolling behavior
   *                  (default: `{}`)
   * @returns The Roll and results drawn by that Roll
   *
   * @example
   * ```typescript
   * // Draw results using the default table formula
   * const defaultResults = await table.roll();
   *
   * // Draw results using a custom roll formula
   * const roll = new Roll("1d20 + @abilities.wis.mod", actor.getRollData());
   * const customResults = await table.roll({roll});
   * ```
   */
  roll(options?: RollTable.RollOptions): Promise<RollTable.Draw>;

  /**
   * Get an Array of valid results for a given rolled total
   * @param value - The rolled value
   * @returns An Array of results
   */
  getResultsForRoll(value: number): TableResult.Stored[];

  /**
   * Create embedded roll table markup.
   * @param config  - Configuration for embedding behavior.
   * @param options - The original enrichment options for cases where the Document embed content
   *                  also contains text that must be enriched.
   *
   * @example Embed the content of a Roll Table as a figure.
   * ```
   * @Embed[RollTable.kRfycm1iY3XCvP8c]
   * ```
   * becomes
   * ```html
   * <figure class="content-embed" data-content-embed data-uuid="RollTable.kRfycm1iY3XCvP8c" data-id="kRfycm1iY3XCvP8c">
   *   <table class="roll-table-embed">
   *     <thead>
   *       <tr>
   *         <th>Roll</th>
   *         <th>Result</th>
   *       </tr>
   *     </thead>
   *     <tbody>
   *       <tr>
   *         <td>1&mdash;10</td>
   *         <td>
   *           <a class="inline-roll roll" data-mode="roll" data-formula="1d6">
   *             <i class="fas fa-dice-d20"></i>
   *             1d6
   *           </a>
   *           Orcs attack!
   *         </td>
   *       </tr>
   *       <tr>
   *         <td>11&mdash;20</td>
   *         <td>No encounter</td>
   *       </tr>
   *     </tbody>
   *   </table>
   *   <figcaption>
   *     <div class="embed-caption">
   *       <p>This is the Roll Table description.</p>
   *     </div>
   *     <cite>
   *       <a class="content-link" data-link data-uuid="RollTable.kRfycm1iY3XCvP8c" data-id="kRfycm1iY3XCvP8c"
   *          data-type="RollTable" data-tooltip="Rollable Table">
   *         <i class="fas fa-th-list"></i>
   *         Rollable Table
   *     </cite>
   *   </figcaption>
   * </figure>
   * ```
   */
  protected _buildEmbedHTML(
    config: TextEditor.DocumentHTMLEmbedConfig & { rollable: boolean },
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | null>;

  protected override _createFigureEmbed(
    content: HTMLElement | HTMLCollection,
    config: TextEditor.DocumentHTMLEmbedConfig,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | null>;

  /**
   * Handle a roll from within embedded content.
   * @param event  - The originating event
   * @param action - The named action that was clicked
   */
  protected _onClickEmbedAction(event: PointerEvent, action: string): Promise<void>;

  override onEmbed(element: foundry.applications.elements.HTMLDocumentEmbedElement): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class GurpsRollTable extends RollTable {
   *   protected override _onCreateDescendantDocuments(...args: RollTable.OnCreateDescendantDocumentsArgs) {
   *     super._onCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, data, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onCreateDescendantDocuments(...args: RollTable.OnCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class BladesRollTable extends RollTable {
   *   protected override _onDeleteDescendantDocuments(...args: RollTable.OnUpdateDescendantDocuments) {
   *     super._onDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, ids, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onDeleteDescendantDocuments(...args: RollTable.OnDeleteDescendantDocumentsArgs): void;

  override toCompendium<Options extends ClientDocument.ToCompendiumOptions | undefined = undefined>(
    pack?: foundry.documents.collections.CompendiumCollection.Any | null,
    options?: Options,
  ): ClientDocument.ToCompendiumReturnType<"RollTable", Options>;

  /**
   * Create a new RollTable document using all of the Documents from a specific Folder as new results.
   * @param folder  - The Folder document from which to create a roll table
   * @param options - Additional options passed to the RollTable.create method
   */
  static fromFolder<Temporary extends boolean | undefined = undefined>(
    folder: Folder.Implementation,
    options?: RollTable.Database.CreateOperation<Temporary>,
  ): Promise<RollTable.TemporaryIf<Temporary> | undefined>;

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

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class SwadeRollTable extends RollTable {
   *   protected override _preCreateDescendantDocuments(...args: RollTable.PreCreateDescendantDocumentsArgs) {
   *     super._preCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, data, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preCreateDescendantDocuments(...args: RollTable.PreCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class LancerRollTable extends RollTable {
   *   protected override _preUpdateDescendantDocuments(...args: RollTable.OnUpdateDescendantDocuments) {
   *     super._preUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, changes, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preUpdateDescendantDocuments(...args: RollTable.PreUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class Ptr2eRollTable extends RollTable {
   *   protected override _onUpdateDescendantDocuments(...args: RollTable.OnUpdateDescendantDocumentsArgs) {
   *     super._onUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, changes, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onUpdateDescendantDocuments(...args: RollTable.OnUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class KultRollTable extends RollTable {
   *   protected override _preDeleteDescendantDocuments(...args: RollTable.PreDeleteDescendantDocumentsArgs) {
   *     super._preDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, ids, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preDeleteDescendantDocuments(...args: RollTable.PreDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: RollTable.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends RollTable.CreateDialogOptions | undefined = undefined,
  >(
    data?: RollTable.CreateDialogData,
    createOptions?: RollTable.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<RollTable.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode RollTable.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends RollTable.CreateDialogOptions | undefined = undefined,
  >(
    data: RollTable.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: RollTable.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<RollTable.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: RollTable.Database2.DeleteOneDocumentOperation,
  ): Promise<RollTable.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: RollTable.Database2.DeleteOneDocumentOperation,
  ): Promise<RollTable.DeleteDialogReturn<Options>>;

  static override fromDropData(data: RollTable.DropData): Promise<RollTable.Implementation | undefined>;

  static override fromImport(
    source: RollTable.Source,
    context?: Document.FromImportContext<RollTable.Parent> | null,
  ): Promise<RollTable.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default RollTable;
