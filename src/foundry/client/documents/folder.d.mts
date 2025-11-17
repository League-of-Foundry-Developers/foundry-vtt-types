import type { ConfiguredFolder } from "#configuration";
import type { Identity, InexactPartial, IntentionalPartial, MaybeArray, Merge, NullishProps } from "#utils";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { FolderConfig } from "#client/applications/sheets/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseFolder from "#common/documents/folder.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace Folder {
  /**
   * The document's name.
   */
  type Name = "Folder";

  /**
   * The context used to create a `Folder`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Folder`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Folder` document instance configured through
   * {@linkcode CONFIG.Folder.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredFolder | fvtt-types/configuration/ConfiguredFolder} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Folder` document configured through
   * {@linkcode CONFIG.Folder.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "Folder";
        collection: "folders";
        label: string;
        labelPlural: string;
        coreTypes: typeof CONST.FOLDER_DOCUMENT_TYPES;
        schemaVersion: string;
      }>
    > {}

  // No need for Metadata namespace

  /**
   * The subtypes of `Folder` that Foundry provides. `Folder` does not have `system` and therefore
   * there is no way for a user to configure custom subtypes. Nevertheless Foundry has a number of
   * built in subtypes usable for `Folder`.
   *
   * Each of `Folder`'s subtypes correspond to something that it is intended to contain. This
   * includes various documents as well as a {@linkcode Compendium}. The documents a
   * `Folder` can contain specifically are an {@linkcode Actor}, {@linkcode Adventure},
   * {@linkcode Item}, {@linkcode Scene}, {@linkcode JournalEntry},
   * {@linkcode Playlist}, {@linkcode RollTable}, {@linkcode Cards}, or a
   * {@linkcode Macro}
   */
  type SubType = foundry.Game.Model.TypeNames<Name>;

  /**
   * @deprecated `Folder` does not have `system` and therefore there is no way for a user to
   * configure custom subtypes.
   *
   * This type exists only to be informative.
   */
  type ConfiguredSubType = never;

  /**
   * @deprecated `Folder` does not have `system` and therefore there is no way for a user to
   * configure custom subtypes. This means `Known` as a concept does not apply to it.
   *
   * This type exists only to be informative.
   */
  type Known = never;

  /**
   * `OfType` returns an instance of `Folder` with the corresponding type. This works with both the
   * builtin `Folder` class or a custom subclass if that is set up in
   * {@link ConfiguredFolder | `fvtt-types/configuration/ConfiguredFolder`}.
   *
   * Note that `Folder` does not have a `system` property and therefore there is no way for a user
   * to configure custom subtypes. See {@linkcode Folder.SubType} for more information.
   */
  // Note(LukeAbby): The lack of a `system` is why `Document.Internal.DiscriminateSystem` isn't applied.
  type OfType<Type extends SubType> = _OfType[Type];

  /** @internal */
  interface _OfType
    extends Identity<{
      [Type in SubType]: Type extends unknown
        ? ConfiguredFolder<Type> extends { document: infer Document }
          ? Document
          : // eslint-disable-next-line @typescript-eslint/no-restricted-types
            Folder<Type>
        : never;
    }> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Actor.Implementation | Item.Implementation | null;

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<CONST.COMPENDIUM_DOCUMENT_TYPES>;

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
   * The world collection that contains `Folder`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.Folders.ImplementationClass;

  /**
   * The world collection that contains `Folder`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.Folders.Implementation;

  /**
   * An instance of `Folder` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Folder` that comes from the database.
   */
  type Stored<SubType extends Folder.SubType = Folder.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode Folder._source | Folder#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Folder.create}
   * and {@linkcode Folder | new Folder(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends Folder.SubType = Folder.SubType> extends fields.SchemaField.CreateData<Schema> {
    type: SubType;
  }

  /**
   * Used in the {@linkcode Folder.create} and {@linkcode Folder.createDocuments} signatures, and
   * {@linkcode Folder.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Folder.create}, returning (a single | an array of) (temporary | stored)
   * `Folder`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput> ? Array<Folder.TemporaryIf<Temporary>> : Folder.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Folder.name | Folder#name}.
   *
   * This is data transformed from {@linkcode Folder.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Folder.update | Folder#update}.
   * It is a distinct type from {@linkcode Folder.CreateData | DeepPartial<Folder.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Folder.update | Folder#update} and
   * {@linkcode Folder.updateDocuments} signatures, and {@linkcode Folder.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Folder}. This is the source of truth for how an Folder document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Folder}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Folder document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The name of this Folder */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /** The document type which this Folder contains, from {@linkcode CONST.FOLDER_DOCUMENT_TYPES} */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    type: fields.DocumentTypeField<typeof BaseFolder, {}>;

    /**
     * An HTML description of the contents of this folder
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ textSearch: true }>;

    /**
     * The _id of a parent Folder which contains this Folder
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof BaseFolder>;

    /**
     * The sorting mode used to organize documents within this Folder, in ["a", "m"]
     * @defaultValue `"a"`
     */
    sorting: fields.StringField<{ required: true; initial: "a"; choices: typeof BaseFolder.SORTING_MODES }>;

    /**
     * The numeric sort value which orders this Folder relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * A color string used for the background color of this Folder
     * @defaultValue `null`
     */
    color: fields.ColorField;

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
     * `Folder` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Folder.Parent> {}

    /**
     * The interface for passing to {@linkcode Folder.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Folder` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `Folder` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Folder.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<Folder.CreateInput, Folder.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode Folder.create} or {@linkcode Folder.createDocuments}.
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
     * @deprecated `Folder` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `Folder` documents. (see {@linkcode Folder.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Folder` documents.
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
     * The interface passed to {@linkcode Folder._preCreate | Folder#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateFolder` hook}.
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
     * The interface passed to {@linkcode Folder._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode Folder._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Folder._onCreate | Folder#_onCreate} and
     * {@link Hooks.CreateDocument | the `createFolder` hook}.
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
     * The interface passed to {@linkcode Folder._onCreateOperation} and `Folder`-related collections'
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
     * interface for `Folder` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Folder.update | Folder#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Folder.UpdateInput, Folder.Parent> {}

    /**
     * The interface for passing to {@linkcode Folder.update | Folder#update}.
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
     * @deprecated `Folder` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `Folder` documents (see {@linkcode Folder.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Folder.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Folder` documents.
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
     * The interface passed to {@linkcode Folder._preUpdate | Folder#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateFolder` hook}.
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
     * The interface passed to {@linkcode Folder._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode Folder._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Folder._onUpdate | Folder#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateFolder` hook}.
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
     * The interface passed to {@linkcode Folder._onUpdateOperation} and `Folder`-related collections'
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
     * interface for `Folder` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Folder.delete | Folder#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Folder.Parent> {}

    /**
     * The interface for passing to {@linkcode Folder.delete | Folder#delete}.
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
     * @deprecated `Folder` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `Folder` documents (see {@linkcode Folder.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Folder.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Folder` documents.
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
     * The interface passed to {@linkcode Folder._preDelete | Folder#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteFolder` hook}.
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
     * The interface passed to {@linkcode Folder._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode Folder._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Folder._onDelete | Folder#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteFolder` hook}.
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
     * The interface passed to {@linkcode Folder._onDeleteOperation} and `Folder`-related collections'
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
        GetDocumentsOperation: Folder.Database2.GetDocumentsOperation;
        BackendGetOperation: Folder.Database2.BackendGetOperation;
        GetOperation: Folder.Database2.GetOperation;

        CreateDocumentsOperation: Folder.Database2.CreateDocumentsOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        CreateEmbeddedOperation: Folder.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: Folder.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: Folder.Database2.CreateOperation<Temporary>;
        PreCreateOptions: Folder.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: Folder.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Folder.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Folder.Database2.OnCreateOptions;
        OnCreateOperation: Folder.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: Folder.Database2.UpdateOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        UpdateEmbeddedOperation: Folder.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Folder.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Folder.Database2.BackendUpdateOperation;
        UpdateOperation: Folder.Database2.UpdateOperation;
        PreUpdateOptions: Folder.Database2.PreUpdateOptions;
        PreUpdateOperation: Folder.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Folder.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: Folder.Database2.OnUpdateOptions;
        OnUpdateOperation: Folder.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: Folder.Database2.DeleteOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        DeleteEmbeddedOperation: Folder.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Folder.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Folder.Database2.BackendDeleteOperation;
        DeleteOperation: Folder.Database2.DeleteOperation;
        PreDeleteOptions: Folder.Database2.PreDeleteOptions;
        PreDeleteOperation: Folder.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Folder.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: Folder.Database2.OnDeleteOptions;
        OnDeleteOperation: Folder.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode Folder.Implementation}, otherwise {@linkcode Folder.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? Folder.Implementation : Folder.Stored;

  namespace Database {
    /** Options passed along in Get operations for Folders */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Folder.Parent> {}

    /** Options passed along in Create operations for Folders */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Folder.CreateData, Folder.Parent, Temporary> {}

    /** Options passed along in Delete operations for Folders */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Folder.Parent> {}

    /** Options passed along in Update operations for Folders */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Folder.UpdateData, Folder.Parent> {}

    /** Operation for {@linkcode Folder.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Folder.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Folder.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Folder.Database.Update> {}

    /** Operation for {@linkcode Folder.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Folder.Database.Delete> {}

    /** Operation for {@linkcode Folder.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Folder.Database.Create<Temporary>> {}

    /** Operation for {@link Folder.update | `Folder#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Folder.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Folder._preCreate | `Folder#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Folder._onCreate | `Folder#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Folder._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Folder.Database.Create> {}

    /** Operation for {@link Folder._onCreateOperation | `Folder#_onCreateOperation`} */
    interface OnCreateOperation extends Folder.Database.Create {}

    /** Options for {@link Folder._preUpdate | `Folder#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Folder._onUpdate | `Folder#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Folder._preUpdateOperation} */
    interface PreUpdateOperation extends Folder.Database.Update {}

    /** Operation for {@link Folder._onUpdateOperation | `Folder._preUpdateOperation`} */
    interface OnUpdateOperation extends Folder.Database.Update {}

    /** Options for {@link Folder._preDelete | `Folder#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Folder._onDelete | `Folder#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Folder._preDeleteOperation | `Folder#_preDeleteOperation`} */
    interface PreDeleteOperation extends Folder.Database.Delete {}

    /** Options for {@link Folder._onDeleteOperation | `Folder#_onDeleteOperation`} */
    interface OnDeleteOperation extends Folder.Database.Delete {}

    /** Context for {@linkcode Folder._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Folder.Parent> {}

    /** Context for {@linkcode Folder._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Folder.Parent> {}

    /** Context for {@linkcode Folder._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Folder.Parent> {}

    /**
     * Options for {@link Folder._preCreateDescendantDocuments | `Folder#_preCreateDescendantDocuments`}
     * and {@link Folder._onCreateDescendantDocuments | `Folder#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Folder.Database.Create> {}

    /**
     * Options for {@link Folder._preUpdateDescendantDocuments | `Folder#_preUpdateDescendantDocuments`}
     * and {@link Folder._onUpdateDescendantDocuments | `Folder#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Folder.Database.Update> {}

    /**
     * Options for {@link Folder._preDeleteDescendantDocuments | `Folder#_preDeleteDescendantDocuments`}
     * and {@link Folder._onDeleteDescendantDocuments | `Folder#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Folder.Database.Delete> {}

    /**
     * Create options for {@linkcode Folder.createDialog}.
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

  /** The interface {@linkcode Folder.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Folder.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Folder.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Folder.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  // NOTE: Off-template due to real override
  interface CreateDialogData
    extends Omit<Document.CreateDialogData<CreateData>, "name" | "color" | "sorting">,
      InexactPartial<Pick<CreateData, "name" | "color" | "sorting">> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode Folder.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Folder.createDialog}'s third parameter
   *
   * @remarks Rather than a simple `DialogV2`, {@linkcode Folder.createDialog} creates a {@linkcode FolderConfig | FolderConfig}, passing
   * along the returned `Promise`'s `resolve` to the app. As of 13.350, this functionality is bugged and the promise will just never resolve.
   */
  // NOTE: Off-template due to real override
  interface CreateDialogOptions extends InexactPartial<Omit<FolderConfig.Configuration, "resolve" | "document">> {
    /** @deprecated This is force set to the `resolve` of the Promise returned by this `createDialog` call */
    resolve?: never;

    /** @deprecated This is force set to a constructed, temporary `Folder` */
    document?: never;
  }

  /**
   * The return type for {@linkcode Folder.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends Folder.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<Folder.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode Folder.deleteDialog | Folder#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Folder.Stored,
    PassedConfig
  >;

  /* ***********************************************
   *             FOLDER-SPECIFIC TYPES             *
   *************************************************/

  /**
   * Actual document types that go in folders
   */
  type DocumentType = Exclude<CONST.FOLDER_DOCUMENT_TYPES, "Compendium">;

  type DocumentCollection<Type extends SubType> = Type extends "Compendium"
    ? Collection.Any | undefined
    : foundry.documents.abstract.WorldCollection.Any;

  /** @internal */
  type _ExportToCompendiumOptions = NullishProps<{
    /**
     * Update existing entries in the Compendium pack, matching by name
     * @defaultValue `false`
     */
    updateByName: boolean;

    /**
     * Retain the original _id attribute when updating an entity
     * @defaultValue `false`
     * @remarks No default applied despite Foundry's typing, but `undefined` will be treated falsily
     */
    keepId: boolean;

    /**
     * Retain the existing Folder structure
     * @defaultValue `false`
     * @remarks No default applied despite Foundry's typing, but `undefined` will be treated falsily
     */
    keepFolders: boolean;

    /**
     * A target folder id to which the documents will be exported
     * @defaultValue `null`
     */
    folder: string;
  }>;

  /** @privateRemarks `keepId` omitted to override comment */
  interface ExportToCompendiumOptions
    extends _ExportToCompendiumOptions,
      Omit<ClientDocument.ToCompendiumOptions, "keepId"> {}

  /** @internal */
  type _ExportDialogOptions = NullishProps<{
    /**
     * @remarks A compendium to preselect in the dialog
     * @defaultValue `null`
     */
    pack: string;

    /**
     * @remarks Initial state of the `Merge by Name` checkbox in the dialog
     * @defaultValue `true`
     */
    merge: boolean;

    /**
     * @remarks Initial state of the `Keep Document IDs` checkbox in the dialog
     * @defaultValue `true`
     */
    keepId: boolean;

    /**
     * @remarks Initial state of the `Keep Folder Structure` checkbox in the dialog
     * @defaultValue `true`
     */
    keepFolders: boolean;
  }>;

  interface ExportDialogOptions extends _ExportDialogOptions, IntentionalPartial<foundry.appv1.api.Dialog.Options> {}

  // TODO: Handle compendium. This requires the index to be configured.
  type Contents<SubType extends Folder.SubType> = Document.StoredForName<Extract<SubType, Document.Type>>[];

  // TODO: Compendium Pack index
  type DocumentClass<SubType extends Folder.SubType> = Document.ImplementationClassFor<Extract<SubType, Document.Type>>;

  interface ChildNode extends foundry.documents.abstract.DirectoryCollectionMixin.TreeNode<Implementation> {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode Folder.ConfiguredSubType} (will be removed in v14).
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side Folder document which extends the common BaseFolder model.
 *
 * @see {@linkcode Folders}            The world-level collection of Folder documents
 * @see {@linkcode FolderConfig}       The Folder configuration application
 */
declare class Folder<out SubType extends Folder.SubType = Folder.SubType> extends BaseFolder.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Folder`
   * @param context - Construction context options
   */
  constructor(data: Folder.CreateData<SubType>, context?: Folder.ConstructionContext);

  /**
   * The depth of this folder in its sidebar tree
   *
   * @remarks For folders that have been populated by the {@linkcode SidebarDirectory}, this is always be defined
   */
  depth: number | undefined;

  /**
   * An array of nodes representing the children of this one. This differs from the results of
   * {@link Folder.getSubfolders | `Folder#getSubfolders`}, which reports the subset of child Folders
   * displayed to the current User in the UI.
   *
   * Initialized by {@link DirectoryCollection.initializeTree | `DirectoryCollection#initializeTree`}, so always
   * `undefined` in temporary documents, and prior to first UI render in stored documents
   */
  children: Folder.ChildNode | undefined;

  /**
   * Return whether the folder is displayed in the sidebar to the current User.
   * @defaultValue `false`
   */
  displayed: boolean;

  /**
   * The array of the Document instances which are contained within this Folder,
   * unless it's a Folder inside a Compendium pack, in which case it's the array
   * of objects inside the index of the pack that are contained in this Folder.
   */
  get contents(): Folder.Contents<SubType>;

  set contents(value);

  /**
   * The reference to the Document type which is contained within this Folder.
   */
  get documentClass(): Folder.DocumentClass<SubType>;

  /**
   * The reference to the WorldCollection instance which provides Documents to this Folder,
   * unless it's a Folder inside a Compendium pack, in which case it's the index of the pack.
   * A world Folder containing CompendiumCollections will have neither.
   */
  // TODO: Compendium Pack index
  // TODO: Infer specific world collection from SubType
  get documentCollection(): Folder.DocumentCollection<SubType>;

  /**
   * Return whether the folder is currently expanded within the sidebar interface.
   */
  get expanded(): boolean;

  /**
   * Return the list of ancestors of this folder, starting with the parent.
   */
  get ancestors(): Folder.Stored[];

  override get inCompendium(): boolean;

  // _preCreate overridden but with no signature changes.
  // For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.

  /** @remarks Creates and renders a {@link FolderConfig | `FolderConfig`} instead of a simple Dialog */
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends Folder.CreateDialogOptions | undefined = undefined,
  >(
    data?: Folder.CreateDialogData,
    createOptions?: Folder.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<void>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Folder.CreateDialogDeprecatedOptions}
   * @remarks Creates and renders a {@linkcode foundry.applications.sheets.FolderConfig | FolderConfig} instead of a simple `DialogV2`.
   *
   * As of 13.350, that class does nothing with the passed promise resolver, and so this actually returns a promise that never returns.
   */
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends Folder.CreateDialogOptions | undefined = undefined,
  >(
    data: Folder.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Folder.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<void>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Folder.Database2.DeleteOneDocumentOperation,
  ): Promise<Folder.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Folder.Database2.DeleteOneDocumentOperation,
  ): Promise<Folder.DeleteDialogReturn<Options>>;

  /**
   * Export all Documents contained in this Folder to a given Compendium pack.
   * Optionally update existing Documents within the Pack by name, otherwise append all new entries.
   * @param pack    - A Compendium pack to which the documents will be exported
   * @param options - Additional options which customize how content is exported. See {@link ClientDocument.toCompendium | `ClientDocument#toCompendium`} (default: `{}`)
   * @returns The updated Compendium Collection instance
   */
  exportToCompendium<Pack extends foundry.documents.collections.CompendiumCollection.Any>(
    pack: Pack,
    options?: Folder.ExportToCompendiumOptions,
  ): Promise<Pack>;

  /**
   * Provide a dialog form that allows for exporting the contents of a Folder into an eligible Compendium pack.
   * @param pack    - A pack ID to set as the default choice in the select input
   * @param options - Additional options passed to the Dialog.prompt method (default: `{}`)
   * @returns A Promise which resolves or rejects once the dialog has been submitted or closed
   *
   * @remarks - Foundry documents `pack` as just being a `string` but it is unused in favor of `options.pack`, and Foundry itself
   * calls `exportDialog` with `null`.
   */
  exportDialog(pack: string | null, options?: Folder.ExportDialogOptions): Promise<void>;

  /**
   * Get the Folder documents which are sub-folders of the current folder, either direct children or recursively.
   * @param recursive - Identify child folders recursively, if false only direct children are returned (default: `false`)
   * @returns An array of Folder documents which are subfolders of this one
   */
  getSubfolders(recursive?: boolean): Folder.Stored<SubType>[];

  /**
   * Get the Folder documents which are parent folders of the current folder or any if its parents.
   * @returns An array of Folder documents which are parent folders of this one
   */
  getParentFolders(): Folder.Stored<SubType>[];

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

  // Descendant Document operations have been left out because Folder does not have any descendant documents.

  static override defaultName(context?: Folder.DefaultNameContext): string;

  static override fromDropData(data: Folder.DropData): Promise<Folder.Implementation | undefined>;

  static override fromImport(
    source: Folder.Source,
    context?: Document.FromImportContext<Folder.Parent> | null,
  ): Promise<Folder.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  #Folder: true;
}

export default Folder;
