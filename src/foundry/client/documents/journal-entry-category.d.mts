import type { InexactPartial, MaybeArray, Merge } from "#utils";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseJournalEntryCategory from "#common/documents/journal-entry-category.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace JournalEntryCategory {
  /**
   * The document's name.
   */
  type Name = "JournalEntryCategory";

  /**
   * The context used to create a `JournalEntryCategory`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `JournalEntryCategory`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `JournalEntryCategory` document instance configured through
   * {@linkcode CONFIG.JournalEntryCategory.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `JournalEntryCategory` document configured through
   * {@linkcode CONFIG.JournalEntryCategory.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "JournalEntryCategory";
      collection: "categories";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      schemaVersion: string;
    }>
  > {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = JournalEntry.Implementation | null;

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
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type CollectionClass = never;

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type Collection = never;

  /**
   * An instance of `JournalEntryCategory` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<JournalEntryCategory.Implementation>;

  /**
   * An instance of `JournalEntryCategory` that comes from the database.
   */
  type Stored = Document.Internal.Stored<JournalEntryCategory.Implementation>;

  /**
   * The data put in {@linkcode JournalEntryCategory._source | JournalEntryCategory#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode JournalEntryCategory.create}
   * and {@linkcode JournalEntryCategory | new JournalEntryCategory(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode JournalEntryCategory.create} and {@linkcode JournalEntryCategory.createDocuments} signatures, and
   * {@linkcode JournalEntryCategory.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode JournalEntryCategory.create}, returning (a single | an array of) (temporary | stored)
   * `JournalEntryCategory`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<JournalEntryCategory.TemporaryIf<Temporary>>
      : JournalEntryCategory.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode JournalEntryCategory.name | JournalEntryCategory#name}.
   *
   * This is data transformed from {@linkcode JournalEntryCategory.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode JournalEntryCategory.update | JournalEntryCategory#update}.
   * It is a distinct type from {@linkcode JournalEntryCategory.CreateData | DeepPartial<JournalEntryCategory.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode JournalEntryCategory.update | JournalEntryCategory#update} and
   * {@linkcode JournalEntryCategory.updateDocuments} signatures, and {@linkcode JournalEntryCategory.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode JournalEntryCategory}. This is the source of truth for how an JournalEntryCategory document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode JournalEntryCategory}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this JournalEntryCategory embedded document.
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this JournalEntryCategory.
     */
    name: fields.StringField<{ required: true; blank: true; textSearch: true }>;

    /**
     * The numeric sort value which orders this category relative to other categories.
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags.
     */
    flags: fields.DocumentFlagsField<Name>;

    /**
     * An object of creation and access information.
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `JournalEntryCategory` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<JournalEntryCategory.Parent> {}

    /**
     * The interface for passing to {@linkcode JournalEntryCategory.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `JournalEntryCategory` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `JournalEntryCategory` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode JournalEntryCategory.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<
      JournalEntryCategory.CreateInput,
      JournalEntryCategory.Parent,
      Temporary
    > {}

    /**
     * The interface for passing to {@linkcode JournalEntryCategory.create} or {@linkcode JournalEntryCategory.createDocuments}.
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
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `JournalEntryCategory` documents. (see {@linkcode JournalEntryCategory.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `JournalEntryCategory` documents.
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
     * The interface passed to {@linkcode JournalEntryCategory._preCreate | JournalEntryCategory#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateJournalEntryCategory` hook}.
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
     * The interface passed to {@linkcode JournalEntryCategory._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode JournalEntryCategory._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode JournalEntryCategory._onCreate | JournalEntryCategory#_onCreate} and
     * {@link Hooks.CreateDocument | the `createJournalEntryCategory` hook}.
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
     * The interface passed to {@linkcode JournalEntryCategory._onCreateOperation} and `JournalEntryCategory`-related collections'
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
     * interface for `JournalEntryCategory` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode JournalEntryCategory.update | JournalEntryCategory#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<
      JournalEntryCategory.UpdateInput,
      JournalEntryCategory.Parent
    > {}

    /**
     * The interface for passing to {@linkcode JournalEntryCategory.update | JournalEntryCategory#update}.
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
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `JournalEntryCategory` documents (see {@linkcode JournalEntryCategory.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode JournalEntryCategory.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `JournalEntryCategory` documents.
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
     * The interface passed to {@linkcode JournalEntryCategory._preUpdate | JournalEntryCategory#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateJournalEntryCategory` hook}.
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
     * The interface passed to {@linkcode JournalEntryCategory._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode JournalEntryCategory._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode JournalEntryCategory._onUpdate | JournalEntryCategory#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateJournalEntryCategory` hook}.
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
     * The interface passed to {@linkcode JournalEntryCategory._onUpdateOperation} and `JournalEntryCategory`-related collections'
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
     * interface for `JournalEntryCategory` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode JournalEntryCategory.delete | JournalEntryCategory#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<JournalEntryCategory.Parent> {}

    /**
     * The interface for passing to {@linkcode JournalEntryCategory.delete | JournalEntryCategory#delete}.
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
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `JournalEntryCategory` documents (see {@linkcode JournalEntryCategory.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode JournalEntryCategory.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `JournalEntryCategory` documents.
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
     * The interface passed to {@linkcode JournalEntryCategory._preDelete | JournalEntryCategory#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteJournalEntryCategory` hook}.
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
     * The interface passed to {@linkcode JournalEntryCategory._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode JournalEntryCategory._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode JournalEntryCategory._onDelete | JournalEntryCategory#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteJournalEntryCategory` hook}.
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
     * The interface passed to {@linkcode JournalEntryCategory._onDeleteOperation} and `JournalEntryCategory`-related collections'
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
        GetDocumentsOperation: JournalEntryCategory.Database2.GetDocumentsOperation;
        BackendGetOperation: JournalEntryCategory.Database2.BackendGetOperation;
        GetOperation: JournalEntryCategory.Database2.GetOperation;

        CreateDocumentsOperation: JournalEntryCategory.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: JournalEntryCategory.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: JournalEntryCategory.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: JournalEntryCategory.Database2.CreateOperation<Temporary>;
        PreCreateOptions: JournalEntryCategory.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: JournalEntryCategory.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: JournalEntryCategory.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: JournalEntryCategory.Database2.OnCreateOptions;
        OnCreateOperation: JournalEntryCategory.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: JournalEntryCategory.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: JournalEntryCategory.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: JournalEntryCategory.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: JournalEntryCategory.Database2.BackendUpdateOperation;
        UpdateOperation: JournalEntryCategory.Database2.UpdateOperation;
        PreUpdateOptions: JournalEntryCategory.Database2.PreUpdateOptions;
        PreUpdateOperation: JournalEntryCategory.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: JournalEntryCategory.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: JournalEntryCategory.Database2.OnUpdateOptions;
        OnUpdateOperation: JournalEntryCategory.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: JournalEntryCategory.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: JournalEntryCategory.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: JournalEntryCategory.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: JournalEntryCategory.Database2.BackendDeleteOperation;
        DeleteOperation: JournalEntryCategory.Database2.DeleteOperation;
        PreDeleteOptions: JournalEntryCategory.Database2.PreDeleteOptions;
        PreDeleteOperation: JournalEntryCategory.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: JournalEntryCategory.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: JournalEntryCategory.Database2.OnDeleteOptions;
        OnDeleteOperation: JournalEntryCategory.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode JournalEntryCategory.Implementation}, otherwise {@linkcode JournalEntryCategory.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? JournalEntryCategory.Implementation : JournalEntryCategory.Stored;

  namespace Database {
    /** Options passed along in Get operations for JournalEntryCategories */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<JournalEntryCategory.Parent> {}

    /** Options passed along in Create operations for JournalEntryCategories */
    interface Create<Temporary extends boolean | undefined = boolean | undefined> extends foundry.abstract.types
      .DatabaseCreateOperation<JournalEntryCategory.CreateData, JournalEntryCategory.Parent, Temporary> {}

    /** Options passed along in Delete operations for JournalEntryCategories */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<JournalEntryCategory.Parent> {}

    /** Options passed along in Update operation for JournalEntryCategories */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<
      JournalEntryCategory.UpdateData,
      JournalEntryCategory.Parent
    > {}

    /** Operation for {@linkcode JournalEntryCategory.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined> extends Document.Database
      .CreateDocumentsOperation<JournalEntryCategory.Database.Create<Temporary>> {}

    /** Operation for {@linkcode JournalEntryCategory.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database
      .UpdateDocumentsOperation<JournalEntryCategory.Database.Update> {}

    /** Operation for {@linkcode JournalEntryCategory.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database
      .DeleteDocumentsOperation<JournalEntryCategory.Database.Delete> {}

    /** Operation for {@linkcode JournalEntryCategory.create} */
    interface CreateOperation<Temporary extends boolean | undefined> extends Document.Database.CreateDocumentsOperation<
      JournalEntryCategory.Database.Create<Temporary>
    > {}

    /** Operation for {@link JournalEntryCategory.update | `JournalEntryCategory#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode JournalEntryCategory.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link JournalEntryCategory._preCreate | `JournalEntryCategory#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link JournalEntryCategory._onCreate | `JournalEntryCategory#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode JournalEntryCategory._preCreateOperation} */
    interface PreCreateOperation extends Document.Database
      .PreCreateOperationStatic<JournalEntryCategory.Database.Create> {}

    /** Operation for {@link JournalEntryCategory._onCreateOperation | `JournalEntryCategory#_onCreateOperation`} */
    interface OnCreateOperation extends JournalEntryCategory.Database.Create {}

    /** Options for {@link JournalEntryCategory._preUpdate | `JournalEntryCategory#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link JournalEntryCategory._onUpdate | `JournalEntryCategory#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode JournalEntryCategory._preUpdateOperation} */
    interface PreUpdateOperation extends JournalEntryCategory.Database.Update {}

    /** Operation for {@link JournalEntryCategory._onUpdateOperation | `JournalEntryCategory._preUpdateOperation`} */
    interface OnUpdateOperation extends JournalEntryCategory.Database.Update {}

    /** Options for {@link JournalEntryCategory._preDelete | `JournalEntryCategory#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link JournalEntryCategory._onDelete | `JournalEntryCategory#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link JournalEntryCategory._preDeleteOperation | `JournalEntryCategory#_preDeleteOperation`} */
    interface PreDeleteOperation extends JournalEntryCategory.Database.Delete {}

    /** Options for {@link JournalEntryCategory._onDeleteOperation | `JournalEntryCategory#_onDeleteOperation`} */
    interface OnDeleteOperation extends JournalEntryCategory.Database.Delete {}

    /** Context for {@linkcode JournalEntryCategory._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<JournalEntryCategory.Parent> {}

    /** Context for {@linkcode JournalEntryCategory._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<JournalEntryCategory.Parent> {}

    /** Context for {@linkcode JournalEntryCategory._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<JournalEntryCategory.Parent> {}

    /**
     * Options for {@link JournalEntryCategory._preCreateDescendantDocuments | `JournalEntryCategory#_preCreateDescendantDocuments`}
     * and {@link JournalEntryCategory._onCreateDescendantDocuments | `JournalEntryCategory#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<JournalEntryCategory.Database.Create> {}

    /**
     * Options for {@link JournalEntryCategory._preUpdateDescendantDocuments | `JournalEntryCategory#_preUpdateDescendantDocuments`}
     * and {@link JournalEntryCategory._onUpdateDescendantDocuments | `JournalEntryCategory#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<JournalEntryCategory.Database.Update> {}

    /**
     * Options for {@link JournalEntryCategory._preDeleteDescendantDocuments | `JournalEntryCategory#_preDeleteDescendantDocuments`}
     * and {@link JournalEntryCategory._onDeleteDescendantDocuments | `JournalEntryCategory#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<JournalEntryCategory.Database.Delete> {}

    /**
     * Create options for {@linkcode JournalEntryCategory.createDialog}.
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

  /** The interface {@linkcode JournalEntryCategory.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode JournalEntryCategory.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode JournalEntryCategory.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode JournalEntryCategory.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode JournalEntryCategory.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode JournalEntryCategory.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode JournalEntryCategory.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends JournalEntryCategory.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<JournalEntryCategory.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode JournalEntryCategory.deleteDialog | JournalEntryCategory#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    JournalEntryCategory.Stored,
    PassedConfig
  >;

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
 * The client-side JournalEntryCategory document which extends the common BaseJournalEntryCategory model.
 */
declare class JournalEntryCategory extends BaseJournalEntryCategory.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `JournalEntryCategory`
   * @param context - Construction context options
   */
  constructor(data: JournalEntryCategory.CreateData, context?: JournalEntryCategory.ConstructionContext);

  override prepareDerivedData(): void;

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

  // Descendant Document operations have been left out because JournalEntryCategory does not have any descendant documents.

  static override defaultName(context?: JournalEntryCategory.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends JournalEntryCategory.CreateDialogOptions | undefined = undefined,
  >(
    data?: JournalEntryCategory.CreateDialogData,
    createOptions?: JournalEntryCategory.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<JournalEntryCategory.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode JournalEntryCategory.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends JournalEntryCategory.CreateDialogOptions | undefined = undefined,
  >(
    data: JournalEntryCategory.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: JournalEntryCategory.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<JournalEntryCategory.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: JournalEntryCategory.Database2.DeleteOneDocumentOperation,
  ): Promise<JournalEntryCategory.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: JournalEntryCategory.Database2.DeleteOneDocumentOperation,
  ): Promise<JournalEntryCategory.DeleteDialogReturn<Options>>;

  static override fromDropData(
    data: JournalEntryCategory.DropData,
  ): Promise<JournalEntryCategory.Implementation | undefined>;

  static override fromImport(
    source: JournalEntryCategory.Source,
    context?: Document.FromImportContext<JournalEntryCategory.Parent> | null,
  ): Promise<JournalEntryCategory.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default JournalEntryCategory;
