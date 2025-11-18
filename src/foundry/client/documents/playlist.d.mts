import type { InexactPartial, MaybeArray, Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { fields } from "#common/data/_module.d.mts";
import type BasePlaylist from "#common/documents/playlist.mjs";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

declare namespace Playlist {
  /**
   * The document's name.
   */
  type Name = "Playlist";

  /**
   * The context used to create a `Playlist`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Playlist`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Playlist` document instance configured through
   * {@linkcode CONFIG.Playlist.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Playlist` document configured through
   * {@linkcode CONFIG.Playlist.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "Playlist";
        collection: "playlists";
        indexed: true;
        compendiumIndexFields: ["_id", "name", "sort", "folder"];
        embedded: Metadata.Embedded;
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
      PlaylistSound: "sounds";
    }

    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create: "PLAYLIST_CREATE";
      delete: "OWNER";
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
  type DirectDescendantName = "PlaylistSound";

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = PlaylistSound.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = PlaylistSound.ImplementationClass;

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
   */
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Playlist">;

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
      Playlist.Implementation,
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
   * The world collection that contains `Playlist`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.Playlists.ImplementationClass;

  /**
   * The world collection that contains `Playlist`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.Playlists.Implementation;

  /**
   * An instance of `Playlist` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Playlist` that comes from the database.
   */
  type Stored = Document.Internal.Stored<Playlist.Implementation>;

  /**
   * The data put in {@linkcode Playlist._source | Playlist#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Playlist.create}
   * and {@linkcode Playlist | new Playlist(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode Playlist.create} and {@linkcode Playlist.createDocuments} signatures, and
   * {@linkcode Playlist.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Playlist.create}, returning (a single | an array of) (temporary | stored)
   * `Playlist`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<Playlist.TemporaryIf<Temporary>>
      : Playlist.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Playlist.name | Playlist#name}.
   *
   * This is data transformed from {@linkcode Playlist.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Playlist.update | Playlist#update}.
   * It is a distinct type from {@linkcode Playlist.CreateData | DeepPartial<Playlist.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Playlist.update | Playlist#update} and
   * {@linkcode Playlist.updateDocuments} signatures, and {@linkcode Playlist.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Playlist}. This is the source of truth for how an Playlist document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Playlist}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Playlist document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this playlist
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The description of this playlist
     * @defaultValue `undefined`
     */
    description: fields.StringField<{ textSearch: true }>;

    /**
     * A Collection of PlaylistSounds embedded documents which belong to this playlist
     * @defaultValue `[]`
     */
    sounds: fields.EmbeddedCollectionField<typeof documents.BasePlaylistSound, Playlist.Implementation>;

    /**
     * A channel in CONST.AUDIO_CHANNELS where all sounds in this playlist are played
     * @defaultValue `"music"`
     */
    channel: fields.StringField<{ choices: typeof CONST.AUDIO_CHANNELS; initial: string; blank: false }>;

    /**
     * The playback mode for sounds in this playlist
     * @defaultValue `CONST.PLAYLIST_MODES.SEQUENTIAL`
     */
    mode: fields.NumberField<
      {
        required: true;
        choices: CONST.PLAYLIST_MODES[];
        initial: typeof CONST.PLAYLIST_MODES.SEQUENTIAL;
        validationError: "must be a value in CONST.PLAYLIST_MODES";
      },
      // FIXME: Overrides required to enforce the branded type
      CONST.PLAYLIST_MODES | null | undefined,
      CONST.PLAYLIST_MODES,
      CONST.PLAYLIST_MODES
    >;

    /**
     * Is this playlist currently playing?
     * @defaultValue `false`
     */
    playing: fields.BooleanField;

    /**
     * A duration in milliseconds to fade volume transition
     * @defaultValue `null`
     */
    fade: fields.NumberField<{ integer: true; positive: true }>;

    /**
     * The _id of a Folder which contains this playlist
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The sorting mode used for this playlist.
     * @defaultValue `CONST.PLAYLIST_SORT_MODES.ALPHABETICAL`
     */
    sorting: fields.StringField<
      {
        required: true;
        choices: CONST.PLAYLIST_SORT_MODES[];
        initial: typeof CONST.PLAYLIST_SORT_MODES.ALPHABETICAL;
        validationError: "must be a value in CONST.PLAYLIST_SORTING_MODES";
      },
      // FIXME: Overrides required to enforce the branded type
      CONST.PLAYLIST_SORT_MODES | null | undefined,
      CONST.PLAYLIST_SORT_MODES,
      CONST.PLAYLIST_SORT_MODES
    >;

    /**
     * A seed used for playlist randomization to guarantee that all clients generate the same random order.
     * @defaultValue `null`
     */
    seed: fields.NumberField<{ integer: true; min: 0 }>;

    /**
     * The numeric sort value which orders this playlist relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Playlist
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
     * `Playlist` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Playlist.Parent> {}

    /**
     * The interface for passing to {@linkcode Playlist.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Playlist` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `Playlist` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Playlist.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<Playlist.CreateInput, Playlist.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode Playlist.create} or {@linkcode Playlist.createDocuments}.
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
     * @deprecated `Playlist` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `Playlist` documents. (see {@linkcode Playlist.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Playlist` documents.
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
     * The interface passed to {@linkcode Playlist._preCreate | Playlist#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreatePlaylist` hook}.
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
     * The interface passed to {@linkcode Playlist._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode Playlist._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Playlist._onCreate | Playlist#_onCreate} and
     * {@link Hooks.CreateDocument | the `createPlaylist` hook}.
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
     * The interface passed to {@linkcode Playlist._onCreateOperation} and `Playlist`-related collections'
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
     * interface for `Playlist` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Playlist.update | Playlist#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Playlist.UpdateInput, Playlist.Parent> {}

    /**
     * The interface for passing to {@linkcode Playlist.update | Playlist#update}.
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
     * @deprecated `Playlist` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `Playlist` documents (see {@linkcode Playlist.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Playlist.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Playlist` documents.
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
     * The interface passed to {@linkcode Playlist._preUpdate | Playlist#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdatePlaylist` hook}.
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
     * The interface passed to {@linkcode Playlist._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode Playlist._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Playlist._onUpdate | Playlist#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updatePlaylist` hook}.
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
     * The interface passed to {@linkcode Playlist._onUpdateOperation} and `Playlist`-related collections'
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
     * interface for `Playlist` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Playlist.delete | Playlist#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Playlist.Parent> {}

    /**
     * The interface for passing to {@linkcode Playlist.delete | Playlist#delete}.
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
     * @deprecated `Playlist` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `Playlist` documents (see {@linkcode Playlist.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Playlist.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Playlist` documents.
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
     * The interface passed to {@linkcode Playlist._preDelete | Playlist#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeletePlaylist` hook}.
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
     * The interface passed to {@linkcode Playlist._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode Playlist._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Playlist._onDelete | Playlist#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deletePlaylist` hook}.
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
     * The interface passed to {@linkcode Playlist._onDeleteOperation} and `Playlist`-related collections'
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
        GetDocumentsOperation: Playlist.Database2.GetDocumentsOperation;
        BackendGetOperation: Playlist.Database2.BackendGetOperation;
        GetOperation: Playlist.Database2.GetOperation;

        CreateDocumentsOperation: Playlist.Database2.CreateDocumentsOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        CreateEmbeddedOperation: Playlist.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: Playlist.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: Playlist.Database2.CreateOperation<Temporary>;
        PreCreateOptions: Playlist.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: Playlist.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Playlist.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Playlist.Database2.OnCreateOptions;
        OnCreateOperation: Playlist.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: Playlist.Database2.UpdateOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        UpdateEmbeddedOperation: Playlist.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Playlist.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Playlist.Database2.BackendUpdateOperation;
        UpdateOperation: Playlist.Database2.UpdateOperation;
        PreUpdateOptions: Playlist.Database2.PreUpdateOptions;
        PreUpdateOperation: Playlist.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Playlist.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: Playlist.Database2.OnUpdateOptions;
        OnUpdateOperation: Playlist.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: Playlist.Database2.DeleteOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        DeleteEmbeddedOperation: Playlist.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Playlist.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Playlist.Database2.BackendDeleteOperation;
        DeleteOperation: Playlist.Database2.DeleteOperation;
        PreDeleteOptions: Playlist.Database2.PreDeleteOptions;
        PreDeleteOperation: Playlist.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Playlist.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: Playlist.Database2.OnDeleteOptions;
        OnDeleteOperation: Playlist.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode Playlist.Implementation}, otherwise {@linkcode Playlist.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? Playlist.Implementation : Playlist.Stored;

  namespace Database {
    /** Options passed along in Get operations for Playlists */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Playlist.Parent> {}

    /** Options passed along in Create operations for Playlists */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Playlist.CreateData, Playlist.Parent, Temporary> {}

    /** Options passed along in Delete operations for Playlists */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Playlist.Parent> {}

    /** Options passed along in Update operations for Playlists */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Playlist.UpdateData, Playlist.Parent> {}

    /** Operation for {@linkcode Playlist.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Playlist.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Playlist.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Playlist.Database.Update> {}

    /** Operation for {@linkcode Playlist.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Playlist.Database.Delete> {}

    /** Operation for {@linkcode Playlist.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Playlist.Database.Create<Temporary>> {}

    /** Operation for {@link Playlist.update | `Playlist#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Playlist.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Playlist._preCreate | `Playlist#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Playlist._onCreate | `Playlist#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Playlist._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Playlist.Database.Create> {}

    /** Operation for {@link Playlist._onCreateOperation | `Playlist#_onCreateOperation`} */
    interface OnCreateOperation extends Playlist.Database.Create {}

    /** Options for {@link Playlist._preUpdate | `Playlist#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Playlist._onUpdate | `Playlist#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Playlist._preUpdateOperation} */
    interface PreUpdateOperation extends Playlist.Database.Update {}

    /** Operation for {@link Playlist._onUpdateOperation | `Playlist._preUpdateOperation`} */
    interface OnUpdateOperation extends Playlist.Database.Update {}

    /** Options for {@link Playlist._preDelete | `Playlist#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Playlist._onDelete | `Playlist#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Playlist._preDeleteOperation | `Playlist#_preDeleteOperation`} */
    interface PreDeleteOperation extends Playlist.Database.Delete {}

    /** Options for {@link Playlist._onDeleteOperation | `Playlist#_onDeleteOperation`} */
    interface OnDeleteOperation extends Playlist.Database.Delete {}

    /** Context for {@linkcode Playlist._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Playlist.Parent> {}

    /** Context for {@linkcode Playlist._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Playlist.Parent> {}

    /** Context for {@linkcode Playlist._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Playlist.Parent> {}

    /**
     * Options for {@link Playlist._preCreateDescendantDocuments | `Playlist#_preCreateDescendantDocuments`}
     * and {@link Playlist._onCreateDescendantDocuments | `Playlist#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Playlist.Database.Create> {}

    /**
     * Options for {@link Playlist._preUpdateDescendantDocuments | `Playlist#_preUpdateDescendantDocuments`}
     * and {@link Playlist._onUpdateDescendantDocuments | `Playlist#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Playlist.Database.Update> {}

    /**
     * Options for {@link Playlist._preDeleteDescendantDocuments | `Playlist#_preDeleteDescendantDocuments`}
     * and {@link Playlist._onDeleteDescendantDocuments | `Playlist#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Playlist.Database.Delete> {}

    /**
     * Create options for {@linkcode Playlist.createDialog}.
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

  /** The interface {@linkcode Playlist.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Playlist.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Playlist.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Playlist.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode Playlist.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Playlist.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode Playlist.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends Playlist.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<Playlist.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode Playlist.deleteDialog | Playlist#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Playlist.Stored,
    PassedConfig
  >;

  type PreCreateDescendantDocumentsArgs = Document.Internal.PreCreateDescendantDocumentsArgs<
    Playlist.Stored,
    Playlist.DirectDescendantName,
    Playlist.Metadata.Embedded
  >;

  type OnCreateDescendantDocumentsArgs = Document.Internal.OnCreateDescendantDocumentsArgs<
    Playlist.Stored,
    Playlist.DirectDescendantName,
    Playlist.Metadata.Embedded
  >;

  type PreUpdateDescendantDocumentsArgs = Document.Internal.PreUpdateDescendantDocumentsArgs<
    Playlist.Stored,
    Playlist.DirectDescendantName,
    Playlist.Metadata.Embedded
  >;

  type OnUpdateDescendantDocumentsArgs = Document.Internal.OnUpdateDescendantDocumentsArgs<
    Playlist.Stored,
    Playlist.DirectDescendantName,
    Playlist.Metadata.Embedded
  >;

  type PreDeleteDescendantDocumentsArgs = Document.Internal.PreDeleteDescendantDocumentsArgs<
    Playlist.Stored,
    Playlist.DirectDescendantName,
    Playlist.Metadata.Embedded
  >;

  type OnDeleteDescendantDocumentsArgs = Document.Internal.OnDeleteDescendantDocumentsArgs<
    Playlist.Stored,
    Playlist.DirectDescendantName,
    Playlist.Metadata.Embedded
  >;

  /* ***********************************************
   *           PLAYLIST-SPECIFIC TYPES             *
   *************************************************/

  /** @internal */
  type _PlayNextOptions = InexactPartial<{
    /**
     * Whether to advance forward (if 1) or backwards (if -1)
     * @defaultValue `1`
     * @remarks Can't be `null` as it only has a parameter default.
     * @privateRemarks This is only checked for `=== 1`, restricting 'backward' values to `-1` based on core's description
     */
    direction: 1 | -1;
  }>;

  interface PlayNextOptions extends _PlayNextOptions {}

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
 * The client-side Playlist document which extends the common BasePlaylist model.
 *
 * @see {@linkcode Playlists}             The world-level collection of Playlist documents
 * @see {@linkcode PlaylistSound}         The PlaylistSound embedded document within a parent Playlist
 * @see {@linkcode PlaylistConfig}        The Playlist configuration application
 *
 */
declare class Playlist extends BasePlaylist.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `Playlist`
   * @param context - Construction context options
   */
  constructor(data: Playlist.CreateData, context?: Playlist.ConstructionContext);

  /** @deprecated Foundry made this property truly private in v13 (this warning will be removed in v14) */
  protected _playbackOrder: never;

  /**
   * The order in which sounds within this playlist will be played (if sequential or shuffled)
   * Uses a stored seed for randomization to guarantee that all clients generate the same random order.
   */
  get playbackOrder(): string[];

  override get visible(): boolean;

  /**
   * Find all content links belonging to a given {@linkcode Playlist} or {@linkcode PlaylistSound}.
   * @param doc - The Playlist or PlaylistSound.
   */
  static _getSoundContentLinks(doc: Playlist.Implementation | PlaylistSound.Implementation): NodeListOf<Element>;

  override prepareDerivedData(): void;

  /**
   * Begin simultaneous playback for all sounds in the Playlist.
   * @returns The updated Playlist document
   */
  playAll(): Promise<this | undefined>;

  /**
   * Play the next Sound within the sequential or shuffled Playlist.
   * @param soundId - The currently playing sound ID, if known
   * @param options - Additional options which configure the next track
   * @returns If successfully updated, this Playlist document
   */
  playNext(soundId?: string | null, options?: Playlist.PlayNextOptions): Promise<this | undefined | null>;

  /**
   * Begin playback of a specific Sound within this Playlist.
   * Determine which other sounds should remain playing, if any.
   * @param sound - The desired sound that should play
   * @returns The updated Playlist
   */
  playSound(sound: PlaylistSound.Implementation): Promise<this | undefined>;

  /**
   * Stop playback of a specific Sound within this Playlist.
   * Determine which other sounds should remain playing, if any.
   * @param sound - The desired sound that should play
   * @returns The updated Playlist
   */
  stopSound(sound: PlaylistSound.Implementation): Promise<this | undefined>;

  /**
   * End playback for any/all currently playing sounds within the Playlist.
   * @returns The updated Playlist document
   */
  stopAll(): Promise<this | undefined>;

  /**
   * Cycle the playlist mode
   * @returns A promise which resolves to the updated Playlist instance
   */
  cycleMode(): Promise<this | undefined>;

  /**
   * Get the next sound in the cached playback order. For internal use.
   * @private
   */
  protected _getNextSound(soundId: string): PlaylistSound.Implementation | undefined;

  /**
   * Get the previous sound in the cached playback order. For internal use.
   * @private
   */
  protected _getPreviousSound(soundId: string): PlaylistSound.Implementation | undefined;

  /**
   * Define the sorting order for the Sounds within this Playlist. For internal use.
   * If sorting alphabetically, the sounds are sorted with a locale-independent comparator
   * to ensure the same order on all clients.
   * @private
   */
  protected _sortSounds(a: PlaylistSound.Implementation, b: PlaylistSound.Implementation): number;

  override toAnchor(options?: foundry.applications.ux.TextEditor.EnrichmentAnchorOptions): HTMLAnchorElement;

  /**
   * @remarks Returns {@link Playlist.playAll | `this.playAll()`} or {@link Playlist.stopAll | `this.stopAll()`}
   */
  override _onClickDocumentLink(event: MouseEvent): Promise<this | undefined>;

  // _preUpdate, _onUpdate, _onDelete are all overridden but with no signature changes from the BasePlaylist class.

  protected override _onCreateDescendantDocuments(...args: Playlist.OnCreateDescendantDocumentsArgs): void;

  protected override _onUpdateDescendantDocuments(...args: Playlist.OnUpdateDescendantDocumentsArgs): void;

  protected override _onDeleteDescendantDocuments(...args: Playlist.OnDeleteDescendantDocumentsArgs): void;

  /**
   * Handle callback logic when an individual sound within the Playlist concludes playback naturally
   * @internal
   * @privateRemarks Possibly returns `this.playNext()` so possibly `null`
   */
  _onSoundEnd(sound: PlaylistSound.Implementation): Promise<this | null | undefined>;

  /**
   * Handle callback logic when playback for an individual sound within the Playlist is started.
   * Schedule auto-preload of next track
   * @internal
   */
  _onSoundStart(sound: PlaylistSound.Implementation): Promise<void>;

  /**
   * Spawn a dialog for bulk importing sound files into a playlist.
   * @returns Returns true if any sound files were successfully imported.
   */
  bulkImportDialog(): Promise<boolean>;

  /**
   * Create PlaylistSounds in this Playlist from the given file paths.
   * @param paths - File paths to import.
   */
  bulkImportSounds(paths: string[]): Promise<PlaylistSound.Implementation[]>;

  override toCompendium<Options extends ClientDocument.ToCompendiumOptions | undefined = undefined>(
    pack?: foundry.documents.collections.CompendiumCollection.Any | null,
    options?: Options,
  ): ClientDocument.ToCompendiumReturnType<"Playlist", Options>;

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

  protected override _preCreateDescendantDocuments(...args: Playlist.PreCreateDescendantDocumentsArgs): void;

  protected override _preUpdateDescendantDocuments(...args: Playlist.PreUpdateDescendantDocumentsArgs): void;

  protected override _preDeleteDescendantDocuments(...args: Playlist.PreDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: Playlist.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Playlist.CreateDialogOptions | undefined = undefined,
  >(
    data?: Playlist.CreateDialogData,
    createOptions?: Playlist.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<Playlist.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Playlist.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Playlist.CreateDialogOptions | undefined = undefined,
  >(
    data: Playlist.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Playlist.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<Playlist.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Playlist.Database2.DeleteOneDocumentOperation,
  ): Promise<Playlist.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Playlist.Database2.DeleteOneDocumentOperation,
  ): Promise<Playlist.DeleteDialogReturn<Options>>;

  static override fromDropData(data: Playlist.DropData): Promise<Playlist.Implementation | undefined>;

  static override fromImport(
    source: Playlist.Source,
    context?: Document.FromImportContext<Playlist.Parent> | null,
  ): Promise<Playlist.Implementation>;

  #Playlist: true;
}

export default Playlist;
