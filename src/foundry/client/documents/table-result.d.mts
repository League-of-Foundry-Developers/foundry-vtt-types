import type { ConfiguredTableResult } from "#configuration";
import type { Identity, InexactPartial, MaybeArray, Merge } from "#utils";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseTableResult from "#common/documents/table-result.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace TableResult {
  /**
   * The document's name.
   */
  type Name = "TableResult";

  /**
   * The context used to create a `TableResult`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `TableResult`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `TableResult` document instance configured through
   * {@linkcode CONFIG.TableResult.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredTableResult | fvtt-types/configuration/ConfiguredTableResult} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `TableResult` document configured through
   * {@linkcode CONFIG.TableResult.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "TableResult";
      collection: "results";
      label: string;
      labelPlural: string;
      coreTypes: foundry.CONST.TABLE_RESULT_TYPES[];
      permissions: Metadata.Permissions;
      compendiumIndexFields: ["type"];
      schemaVersion: string;
    }>
  > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create: "OWNER";
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      delete: "OWNER";
    }
  }

  /**
   * The subtypes of `TableResult` that Foundry provides. `TableResult` does not have `system` and therefore
   * there is no way for a user to configure custom subtypes. Nevertheless Foundry has a number of
   * built in subtypes usable for `TableResult`.
   */
  type SubType = foundry.Game.Model.TypeNames<Name>;

  /**
   * @deprecated `TableResult` does not have `system` and therefore there is no way for a user to
   * configure custom subtypes.
   *
   * This type exists only to be informative.
   */
  type ConfiguredSubType = never;

  /**
   * @deprecated `TableResult` does not have `system` and therefore there is no way for a user to
   * configure custom subtypes. This means `Known` as a concept does not apply to it.
   *
   * This type exists only to be informative.
   */
  type Known = never;

  /**
   * `OfType` returns an instance of `TableResult` with the corresponding type. This works with both the
   * builtin `TableResult` class or a custom subclass if that is set up in
   * {@link ConfiguredTableResult | `fvtt-types/configuration/ConfiguredTableResult`}.
   *
   * Note that `TableResult` does not have a `system` property and therefore there is no way for a user
   * to configure custom subtypes. See {@linkcode TableResult.SubType} for more information.
   */
  // Note(LukeAbby): The lack of a `system` is why `Document.Internal.DiscriminateSystem` isn't applied.
  type OfType<Type extends SubType> = _OfType[Type];

  /** @internal */
  interface _OfType extends Identity<{
    [Type in SubType]: Type extends unknown
      ? ConfiguredTableResult<Type> extends { document: infer Document }
        ? Document
        : // eslint-disable-next-line @typescript-eslint/no-restricted-types
          TableResult<Type>
      : never;
  }> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = RollTable.Implementation | null;

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"RollTable">;

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
   * An instance of `TableResult` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid<SubType extends TableResult.SubType = TableResult.SubType> = Document.Internal.Invalid<OfType<SubType>>;

  /**
   * An instance of `TableResult` that comes from the database.
   */
  type Stored<SubType extends TableResult.SubType = TableResult.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode TableResult._source | TableResult#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode TableResult.create}
   * and {@linkcode TableResult | new TableResult(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends TableResult.SubType = TableResult.SubType> extends fields.SchemaField
    .CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode TableResult.create} and {@linkcode TableResult.createDocuments} signatures, and
   * {@linkcode TableResult.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode TableResult.create}, returning (a single | an array of) (temporary | stored)
   * `TableResult`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<TableResult.TemporaryIf<Temporary>>
      : TableResult.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode TableResult.name | TableResult#name}.
   *
   * This is data transformed from {@linkcode TableResult.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode TableResult.update | TableResult#update}.
   * It is a distinct type from {@linkcode TableResult.CreateData | DeepPartial<TableResult.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode TableResult.update | TableResult#update} and
   * {@linkcode TableResult.updateDocuments} signatures, and {@linkcode TableResult.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode TableResult}. This is the source of truth for how an TableResult document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode TableResult}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this TableResult embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * A result subtype from CONST.TABLE_RESULT_TYPES
     * @defaultValue `CONST.TABLE_RESULT_TYPES.TEXT`
     */
    type: fields.DocumentTypeField<
      typeof BaseTableResult,
      {
        initial: typeof CONST.TABLE_RESULT_TYPES.TEXT;
      }
    >;

    /**
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; nullable: false; blank: true; initial: ""; textSearch: true }>;

    /**
     * An image file url that represents the table result
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"] }>;

    /**
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ textSearch: true }>;

    /**
     * @defaultValue `undefined`
     */
    documentUuid: fields.DocumentUUIDField<{ required: false; nullable: true; initial: undefined }>;

    /**
     * The probabilistic weight of this result relative to other results
     * @defaultValue `1`
     */
    weight: fields.NumberField<{ required: true; integer: true; positive: true; nullable: false; initial: 1 }>;

    /**
     * A length 2 array of ascending integers which defines the range of dice roll
     * @defaultValue `[]`
     */
    range: fields.ArrayField<
      fields.NumberField<{ integer: true }>,
      {
        min: 2;
        max: 2;
        validate: (r: unknown) => r is [start: number, end: number];
        validationError: "must be a length-2 array of ascending integers";
      },
      number,
      number,
      [start: number, end: number],
      [start: number, end: number],
      number,
      [start: number, end: number]
    >;

    /**
     * Has this result already been drawn (without replacement)
     * @defaultValue `false`
     */
    drawn: fields.BooleanField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;

    _stats: fields.DocumentStatsField;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `TableResult` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<TableResult.Parent> {}

    /**
     * The interface for passing to {@linkcode TableResult.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `TableResult` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `TableResult` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode TableResult.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<TableResult.CreateInput, TableResult.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode TableResult.create} or {@linkcode TableResult.createDocuments}.
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
     * can contain `TableResult` documents. (see {@linkcode TableResult.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `TableResult` documents.
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
     * The interface passed to {@linkcode TableResult._preCreate | TableResult#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateTableResult` hook}.
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
     * The interface passed to {@linkcode TableResult._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode TableResult._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode TableResult._onCreate | TableResult#_onCreate} and
     * {@link Hooks.CreateDocument | the `createTableResult` hook}.
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
     * The interface passed to {@linkcode TableResult._onCreateOperation} and `TableResult`-related collections'
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
     * interface for `TableResult` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode TableResult.update | TableResult#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<TableResult.UpdateInput, TableResult.Parent> {}

    /**
     * The interface for passing to {@linkcode TableResult.update | TableResult#update}.
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
     * can contain `TableResult` documents (see {@linkcode TableResult.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode TableResult.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `TableResult` documents.
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
     * The interface passed to {@linkcode TableResult._preUpdate | TableResult#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateTableResult` hook}.
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
     * The interface passed to {@linkcode TableResult._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode TableResult._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode TableResult._onUpdate | TableResult#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateTableResult` hook}.
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
     * The interface passed to {@linkcode TableResult._onUpdateOperation} and `TableResult`-related collections'
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
     * interface for `TableResult` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode TableResult.delete | TableResult#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<TableResult.Parent> {}

    /**
     * The interface for passing to {@linkcode TableResult.delete | TableResult#delete}.
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
     * can contain `TableResult` documents (see {@linkcode TableResult.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode TableResult.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `TableResult` documents.
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
     * The interface passed to {@linkcode TableResult._preDelete | TableResult#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteTableResult` hook}.
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
     * The interface passed to {@linkcode TableResult._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode TableResult._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode TableResult._onDelete | TableResult#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteTableResult` hook}.
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
     * The interface passed to {@linkcode TableResult._onDeleteOperation} and `TableResult`-related collections'
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
        GetDocumentsOperation: TableResult.Database2.GetDocumentsOperation;
        BackendGetOperation: TableResult.Database2.BackendGetOperation;
        GetOperation: TableResult.Database2.GetOperation;

        CreateDocumentsOperation: TableResult.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: TableResult.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: TableResult.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: TableResult.Database2.CreateOperation<Temporary>;
        PreCreateOptions: TableResult.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: TableResult.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: TableResult.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: TableResult.Database2.OnCreateOptions;
        OnCreateOperation: TableResult.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: TableResult.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: TableResult.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: TableResult.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: TableResult.Database2.BackendUpdateOperation;
        UpdateOperation: TableResult.Database2.UpdateOperation;
        PreUpdateOptions: TableResult.Database2.PreUpdateOptions;
        PreUpdateOperation: TableResult.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: TableResult.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: TableResult.Database2.OnUpdateOptions;
        OnUpdateOperation: TableResult.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: TableResult.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: TableResult.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: TableResult.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: TableResult.Database2.BackendDeleteOperation;
        DeleteOperation: TableResult.Database2.DeleteOperation;
        PreDeleteOptions: TableResult.Database2.PreDeleteOptions;
        PreDeleteOperation: TableResult.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: TableResult.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: TableResult.Database2.OnDeleteOptions;
        OnDeleteOperation: TableResult.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode TableResult.Implementation}, otherwise {@linkcode TableResult.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? TableResult.Implementation : TableResult.Stored;

  namespace Database {
    /** Options passed along in Get operations for TableResults */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<TableResult.Parent> {}

    /** Options passed along in Create operations for TableResults */
    interface Create<Temporary extends boolean | undefined = boolean | undefined> extends foundry.abstract.types
      .DatabaseCreateOperation<TableResult.CreateData, TableResult.Parent, Temporary> {
      animate?: boolean;
    }

    /** Options passed along in Delete operations for TableResults */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<TableResult.Parent> {
      animate?: boolean;
    }

    /** Options passed along in Update operations for TableResults */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<
      TableResult.UpdateData,
      TableResult.Parent
    > {
      animate?: boolean;
    }

    /** Operation for {@linkcode TableResult.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined> extends Document.Database
      .CreateDocumentsOperation<TableResult.Database.Create<Temporary>> {}

    /** Operation for {@linkcode TableResult.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database
      .UpdateDocumentsOperation<TableResult.Database.Update> {}

    /** Operation for {@linkcode TableResult.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database
      .DeleteDocumentsOperation<TableResult.Database.Delete> {}

    /** Operation for {@linkcode TableResult.create} */
    interface CreateOperation<Temporary extends boolean | undefined> extends Document.Database.CreateDocumentsOperation<
      TableResult.Database.Create<Temporary>
    > {}

    /** Operation for {@link TableResult.update | `TableResult#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode TableResult.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link TableResult._preCreate | `TableResult#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link TableResult._onCreate | `TableResult#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode TableResult._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<TableResult.Database.Create> {}

    /** Operation for {@link TableResult._onCreateOperation | `TableResult#_onCreateOperation`} */
    interface OnCreateOperation extends TableResult.Database.Create {}

    /** Options for {@link TableResult._preUpdate | `TableResult#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link TableResult._onUpdate | `TableResult#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode TableResult._preUpdateOperation} */
    interface PreUpdateOperation extends TableResult.Database.Update {}

    /** Operation for {@link TableResult._onUpdateOperation | `TableResult._preUpdateOperation`} */
    interface OnUpdateOperation extends TableResult.Database.Update {}

    /** Options for {@link TableResult._preDelete | `TableResult#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link TableResult._onDelete | `TableResult#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link TableResult._preDeleteOperation | `TableResult#_preDeleteOperation`} */
    interface PreDeleteOperation extends TableResult.Database.Delete {}

    /** Options for {@link TableResult._onDeleteOperation | `TableResult#_onDeleteOperation`} */
    interface OnDeleteOperation extends TableResult.Database.Delete {}

    /** Context for {@linkcode TableResult._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<TableResult.Parent> {}

    /** Context for {@linkcode TableResult._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<TableResult.Parent> {}

    /** Context for {@linkcode TableResult._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<TableResult.Parent> {}

    /**
     * Options for {@link TableResult._preCreateDescendantDocuments | `TableResult#_preCreateDescendantDocuments`}
     * and {@link TableResult._onCreateDescendantDocuments | `TableResult#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<TableResult.Database.Create> {}

    /**
     * Options for {@link TableResult._preUpdateDescendantDocuments | `TableResult#_preUpdateDescendantDocuments`}
     * and {@link TableResult._onUpdateDescendantDocuments | `TableResult#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<TableResult.Database.Update> {}

    /**
     * Options for {@link TableResult._preDeleteDescendantDocuments | `TableResult#_preDeleteDescendantDocuments`}
     * and {@link TableResult._onDeleteDescendantDocuments | `TableResult#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<TableResult.Database.Delete> {}

    /**
     * Create options for {@linkcode TableResult.createDialog}.
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

  /** The interface {@linkcode TableResult.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode TableResult.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode TableResult.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode TableResult.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode TableResult.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode TableResult.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode TableResult.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends TableResult.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<TableResult.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode TableResult.deleteDialog | TableResult#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    TableResult.Stored,
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

  /**
   * @deprecated Replaced with {@linkcode TableResult.ConfiguredSubType} (will be removed in v14).
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side TableResult document which extends the common BaseTableResult model.
 *
 * @see {@linkcode RollTable}         The RollTable document which contains TableResult embedded documents
 */
declare class TableResult<out SubType extends TableResult.SubType = TableResult.SubType> extends foundry.documents
  .BaseTableResult.Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `TableResult`
   * @param context - Construction context options
   */
  constructor(data: TableResult.CreateData<SubType>, context?: TableResult.ConstructionContext);

  /**
   * A path reference to the icon image used to represent this result
   * @remarks Returns {@linkcode CONFIG.RollTable.resultIcon} if `this.img` is falsey
   */
  get icon(): string;

  /** @remarks Overrides `this.img` with the `img` of the associated Document, if this result is a `document` or `compendium` type */
  override prepareBaseData(): void;

  /**
   * Prepare a string representation for this result.
   */
  getHTML(): Promise<string>;

  /**
   * Create a content-link anchor from this Result's referenced Document.
   */
  documentToAnchor(): HTMLAnchorElement | null;

  // _preUpdate is overridden but with no signature changes.

  /**
   * @deprecated since V13 until V15
   */
  getChatText(): string;

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

  // Descendant Document operations have been left out because TableResult does not have any descendant documents.

  static override defaultName(context: TableResult.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends TableResult.CreateDialogOptions | undefined = undefined,
  >(
    data?: TableResult.CreateDialogData,
    createOptions?: TableResult.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<TableResult.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode TableResult.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends TableResult.CreateDialogOptions | undefined = undefined,
  >(
    data: TableResult.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: TableResult.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<TableResult.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: TableResult.Database2.DeleteOneDocumentOperation,
  ): Promise<TableResult.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: TableResult.Database2.DeleteOneDocumentOperation,
  ): Promise<TableResult.DeleteDialogReturn<Options>>;

  static override fromDropData(data: TableResult.DropData): Promise<TableResult.Implementation | undefined>;

  static override fromImport(
    source: TableResult.Source,
    context?: Document.FromImportContext<TableResult.Parent> | null,
  ): Promise<TableResult.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // Embedded document operations have been left out because TableResult does not have any embedded documents.

  static #TableResult: true;
}

export default TableResult;
