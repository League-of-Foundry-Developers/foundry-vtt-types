import type { InexactPartial, MaybeArray, Merge } from "#utils";
import type Sound from "#client/audio/sound.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BasePlaylistSound from "#common/documents/playlist-sound.mjs";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace PlaylistSound {
  /**
   * The document's name.
   */
  type Name = "PlaylistSound";

  /**
   * The context used to create a `PlaylistSound`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `PlaylistSound`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `PlaylistSound` document instance configured through
   * {@linkcode CONFIG.PlaylistSound.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `PlaylistSound` document configured through
   * {@linkcode CONFIG.PlaylistSound.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "PlaylistSound";
        collection: "sounds";
        indexed: true;
        label: string;
        labelPlural: string;
        compendiumIndexFields: ["name", "sort"];
        schemaVersion: string;
        permissions: Metadata.Permissions;
      }>
    > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create: "OWNER";
      update: "OWNER";
      delete: "OWNER";
    }
  }

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Playlist.Implementation | null;

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Playlist">;

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
   * An instance of `PlaylistSound` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `PlaylistSound` that comes from the database.
   */
  type Stored = Document.Internal.Stored<PlaylistSound.Implementation>;

  /**
   * The data put in {@linkcode PlaylistSound._source | PlaylistSound#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode PlaylistSound.create}
   * and {@linkcode PlaylistSound | new PlaylistSound(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode PlaylistSound.create} and {@linkcode PlaylistSound.createDocuments} signatures, and
   * {@linkcode PlaylistSound.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode PlaylistSound.create}, returning (a single | an array of) (temporary | stored)
   * `PlaylistSound`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<PlaylistSound.TemporaryIf<Temporary>>
      : PlaylistSound.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode PlaylistSound.name | PlaylistSound#name}.
   *
   * This is data transformed from {@linkcode PlaylistSound.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode PlaylistSound.update | PlaylistSound#update}.
   * It is a distinct type from {@linkcode PlaylistSound.CreateData | DeepPartial<PlaylistSound.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode PlaylistSound.update | PlaylistSound#update} and
   * {@linkcode PlaylistSound.updateDocuments} signatures, and {@linkcode PlaylistSound.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode PlaylistSound}. This is the source of truth for how an PlaylistSound document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode PlaylistSound}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this PlaylistSound document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this sound
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The description of this sound
     * @defaultValue `undefined`
     */
    description: fields.StringField;

    /**
     * The audio file path that is played by this sound
     * @defaultValue `null`
     */
    path: fields.FilePathField<{ categories: ["AUDIO"] }>;

    /**
     * A channel in CONST.AUDIO_CHANNELS where this sound is are played
     * @defaultValue `""`
     */
    channel: fields.StringField<{ required: true; choices: typeof CONST.AUDIO_CHANNELS; initial: string; blank: true }>;

    /**
     * Is this sound currently playing?
     * @defaultValue `false`
     */
    playing: fields.BooleanField;

    /**
     * The time in seconds at which playback was paused
     * @defaultValue `null`
     */
    pausedTime: fields.NumberField<{ min: 0 }>;

    /**
     * Does this sound loop?
     * @defaultValue `false`
     */
    repeat: fields.BooleanField;

    /**
     * The audio volume of the sound, from 0 to 1
     * @defaultValue `1`
     */
    volume: fields.AlphaField<{ initial: 0.5; step: 0.01 }>;

    /**
     * A duration in milliseconds to fade volume transition
     * @defaultValue `null`
     */
    fade: fields.NumberField<{ integer: true; min: 0 }>;

    /**
     * The sort order of the PlaylistSound relative to others in the same collection
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `PlaylistSound` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<PlaylistSound.Parent> {}

    /**
     * The interface for passing to {@linkcode PlaylistSound.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `PlaylistSound` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `PlaylistSound` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode PlaylistSound.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<PlaylistSound.CreateInput, PlaylistSound.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode PlaylistSound.create} or {@linkcode PlaylistSound.createDocuments}.
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
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `PlaylistSound` documents. (see {@linkcode PlaylistSound.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `PlaylistSound` documents.
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
     * The interface passed to {@linkcode PlaylistSound._preCreate | PlaylistSound#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreatePlaylistSound` hook}.
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
     * The interface passed to {@linkcode PlaylistSound._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode PlaylistSound._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode PlaylistSound._onCreate | PlaylistSound#_onCreate} and
     * {@link Hooks.CreateDocument | the `createPlaylistSound` hook}.
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
     * The interface passed to {@linkcode PlaylistSound._onCreateOperation} and `PlaylistSound`-related collections'
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
     * interface for `PlaylistSound` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode PlaylistSound.update | PlaylistSound#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation
      extends DatabaseBackend.UpdateOperation<PlaylistSound.UpdateInput, PlaylistSound.Parent> {}

    /**
     * The interface for passing to {@linkcode PlaylistSound.update | PlaylistSound#update}.
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
     * can contain `PlaylistSound` documents (see {@linkcode PlaylistSound.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode PlaylistSound.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `PlaylistSound` documents.
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
     * The interface passed to {@linkcode PlaylistSound._preUpdate | PlaylistSound#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdatePlaylistSound` hook}.
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
     * The interface passed to {@linkcode PlaylistSound._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode PlaylistSound._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode PlaylistSound._onUpdate | PlaylistSound#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updatePlaylistSound` hook}.
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
     * The interface passed to {@linkcode PlaylistSound._onUpdateOperation} and `PlaylistSound`-related collections'
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
     * interface for `PlaylistSound` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode PlaylistSound.delete | PlaylistSound#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<PlaylistSound.Parent> {}

    /**
     * The interface for passing to {@linkcode PlaylistSound.delete | PlaylistSound#delete}.
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
     * can contain `PlaylistSound` documents (see {@linkcode PlaylistSound.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode PlaylistSound.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `PlaylistSound` documents.
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
     * The interface passed to {@linkcode PlaylistSound._preDelete | PlaylistSound#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeletePlaylistSound` hook}.
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
     * The interface passed to {@linkcode PlaylistSound._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode PlaylistSound._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode PlaylistSound._onDelete | PlaylistSound#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deletePlaylistSound` hook}.
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
     * The interface passed to {@linkcode PlaylistSound._onDeleteOperation} and `PlaylistSound`-related collections'
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
        GetDocumentsOperation: PlaylistSound.Database2.GetDocumentsOperation;
        BackendGetOperation: PlaylistSound.Database2.BackendGetOperation;
        GetOperation: PlaylistSound.Database2.GetOperation;

        CreateDocumentsOperation: PlaylistSound.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: PlaylistSound.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: PlaylistSound.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: PlaylistSound.Database2.CreateOperation<Temporary>;
        PreCreateOptions: PlaylistSound.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: PlaylistSound.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: PlaylistSound.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: PlaylistSound.Database2.OnCreateOptions;
        OnCreateOperation: PlaylistSound.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: PlaylistSound.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: PlaylistSound.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: PlaylistSound.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: PlaylistSound.Database2.BackendUpdateOperation;
        UpdateOperation: PlaylistSound.Database2.UpdateOperation;
        PreUpdateOptions: PlaylistSound.Database2.PreUpdateOptions;
        PreUpdateOperation: PlaylistSound.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: PlaylistSound.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: PlaylistSound.Database2.OnUpdateOptions;
        OnUpdateOperation: PlaylistSound.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: PlaylistSound.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: PlaylistSound.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: PlaylistSound.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: PlaylistSound.Database2.BackendDeleteOperation;
        DeleteOperation: PlaylistSound.Database2.DeleteOperation;
        PreDeleteOptions: PlaylistSound.Database2.PreDeleteOptions;
        PreDeleteOperation: PlaylistSound.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: PlaylistSound.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: PlaylistSound.Database2.OnDeleteOptions;
        OnDeleteOperation: PlaylistSound.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode PlaylistSound.Implementation}, otherwise {@linkcode PlaylistSound.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? PlaylistSound.Implementation : PlaylistSound.Stored;

  namespace Database {
    /** Options passed along in Get operations for PlaylistSounds */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<PlaylistSound.Parent> {}

    /** Options passed along in Create operations for PlaylistSounds */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<
        PlaylistSound.CreateData,
        PlaylistSound.Parent,
        Temporary
      > {}

    /** Options passed along in Delete operations for PlaylistSounds */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<PlaylistSound.Parent> {}

    /** Options passed along in Update operations for PlaylistSounds */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<PlaylistSound.UpdateData, PlaylistSound.Parent> {}

    /** Operation for {@linkcode PlaylistSound.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<PlaylistSound.Database.Create<Temporary>> {}

    /** Operation for {@linkcode PlaylistSound.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<PlaylistSound.Database.Update> {}

    /** Operation for {@linkcode PlaylistSound.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<PlaylistSound.Database.Delete> {}

    /** Operation for {@linkcode PlaylistSound.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<PlaylistSound.Database.Create<Temporary>> {}

    /** Operation for {@link PlaylistSound.update | `PlaylistSound#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode PlaylistSound.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link PlaylistSound._preCreate | `PlaylistSound#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link PlaylistSound._onCreate | `PlaylistSound#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode PlaylistSound._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<PlaylistSound.Database.Create> {}

    /** Operation for {@link PlaylistSound._onCreateOperation | `PlaylistSound#_onCreateOperation`} */
    interface OnCreateOperation extends PlaylistSound.Database.Create {}

    /** Options for {@link PlaylistSound._preUpdate | `PlaylistSound#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link PlaylistSound._onUpdate | `PlaylistSound#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode PlaylistSound._preUpdateOperation} */
    interface PreUpdateOperation extends PlaylistSound.Database.Update {}

    /** Operation for {@link PlaylistSound._onUpdateOperation | `PlaylistSound._preUpdateOperation`} */
    interface OnUpdateOperation extends PlaylistSound.Database.Update {}

    /** Options for {@link PlaylistSound._preDelete | `PlaylistSound#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link PlaylistSound._onDelete | `PlaylistSound#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link PlaylistSound._preDeleteOperation | `PlaylistSound#_preDeleteOperation`} */
    interface PreDeleteOperation extends PlaylistSound.Database.Delete {}

    /** Options for {@link PlaylistSound._onDeleteOperation | `PlaylistSound#_onDeleteOperation`} */
    interface OnDeleteOperation extends PlaylistSound.Database.Delete {}

    /** Context for {@linkcode PlaylistSound._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<PlaylistSound.Parent> {}

    /** Context for {@linkcode PlaylistSound._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<PlaylistSound.Parent> {}

    /** Context for {@linkcode PlaylistSound._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<PlaylistSound.Parent> {}

    /**
     * Options for {@link PlaylistSound._preCreateDescendantDocuments | `PlaylistSound#_preCreateDescendantDocuments`}
     * and {@link PlaylistSound._onCreateDescendantDocuments | `PlaylistSound#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<PlaylistSound.Database.Create> {}

    /**
     * Options for {@link PlaylistSound._preUpdateDescendantDocuments | `PlaylistSound#_preUpdateDescendantDocuments`}
     * and {@link PlaylistSound._onUpdateDescendantDocuments | `PlaylistSound#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<PlaylistSound.Database.Update> {}

    /**
     * Options for {@link PlaylistSound._preDeleteDescendantDocuments | `PlaylistSound#_preDeleteDescendantDocuments`}
     * and {@link PlaylistSound._onDeleteDescendantDocuments | `PlaylistSound#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<PlaylistSound.Database.Delete> {}

    /**
     * Create options for {@linkcode PlaylistSound.createDialog}.
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

  /** The interface {@linkcode PlaylistSound.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode PlaylistSound.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode PlaylistSound.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode PlaylistSound.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode PlaylistSound.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode PlaylistSound.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode PlaylistSound.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends PlaylistSound.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<PlaylistSound.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode PlaylistSound.deleteDialog | PlaylistSound#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    PlaylistSound.Stored,
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
 * The client-side PlaylistSound document which extends the common BasePlaylistSound model.
 * Each PlaylistSound belongs to the sounds collection of a Playlist document.
 *
 * @see {@linkcode Playlist}                       The Playlist document which contains PlaylistSound embedded documents
 * @see {@linkcode PlaylistSoundConfig}   The PlaylistSound configuration application
 * @see {@linkcode Sound}                          The Sound API which manages web audio playback
 *
 */
declare class PlaylistSound extends BasePlaylistSound.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `PlaylistSound`
   * @param context - Construction context options
   */
  constructor(data: PlaylistSound.CreateData, context?: PlaylistSound.ConstructionContext);

  /**
   * The debounce tolerance for processing rapid volume changes into database updates in milliseconds
   * @defaultValue `100`
   */
  static VOLUME_DEBOUNCE_MS: number;

  /**
   * The Sound which manages playback for this playlist sound
   * @remarks Only `undefined` prior to first {@link PlaylistSound._createSound | `PlaylistSound#_createSound`} call
   */
  sound: Sound | null | undefined;

  /**
   * A debounced function, accepting a single volume parameter to adjust the volume of this sound
   * @param volume - The desired volume level
   */
  debounceVolume: (volume: number) => void;

  /**
   * Create a Sound used to play this PlaylistSound document
   */
  protected _createSound(): Sound | null;

  /**
   * Determine the fade-in length:
   * - If the track is not decoded yet, just honor the configured value.
   * - Once we know the real duration, cap the fade to half duration of the track.
   */
  get fadeDuration(): number;

  /**
   * The audio context within which this sound is played.
   * This will be undefined if the audio context is not yet active.
   */
  get context(): AudioContext | undefined;

  /**
   * schedule the fade-out that should occur when repeat is off.
   * Does nothing if the sound is set to repeat or has no finite duration
   */
  protected _scheduleFadeOut(): void;

  /**
   * Cancel any pending fade-out on the current sound.
   */
  protected _cancelFadeOut(): void;

  /**
   * Synchronize playback for this particular PlaylistSound instance
   */
  sync(): void;

  /**
   * Load the audio for this sound for the current client.
   */
  load(): Promise<void>;

  toAnchor(options?: foundry.applications.ux.TextEditor.EnrichmentAnchorOptions): HTMLAnchorElement;

  /**
   * @remarks Returns {@link Playlist.stopSound | `this.parent.stopSound()`} or {@link Playlist.playSound | `this.parent.playSound()`}
   */
  override _onClickDocumentLink(event: MouseEvent): Promise<Playlist.Implementation | undefined>;

  // _preUpdate, _onUpdate, and _onDelete are all overridden but with no signature changes.
  // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

  /**
   * Special handling that occurs when playback of a PlaylistSound is started.
   */
  protected _onStart(): Promise<Sound | void>;

  /**
   * Special handling that occurs when a PlaylistSound reaches the natural conclusion of its playback.
   */
  protected _onEnd(): Promise<void | Playlist.Implementation | null | undefined>;

  /**
   * Special handling that occurs when a PlaylistSound is manually stopped before its natural conclusion.
   * @remarks Core's implementation is a no-op, this is soft abstract
   */
  protected _onStop(): Promise<void>;

  /**
   * The effective volume at which this playlist sound is played, incorporating the global playlist volume setting.
   * @deprecated since v12 until v14
   * @remarks "`PlaylistSound#effectiveVolume` is deprecated in favor of using {@link PlaylistSound.volume | `PlaylistSound#volume`} directly"
   */
  get effectiveVolume(): number;

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

  // Descendant Document operations have been left out because PlaylistSound does not have any descendant documents.

  // Note: `context` is required because otherwise a `collection` cannot be found.
  static override defaultName(context?: PlaylistSound.DefaultNameContext): string;

  // Note: `context` is required because otherwise a `collection` cannot be found.
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends PlaylistSound.CreateDialogOptions | undefined = undefined,
  >(
    data?: PlaylistSound.CreateDialogData,
    createOptions?: PlaylistSound.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<PlaylistSound.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode PlaylistSound.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends PlaylistSound.CreateDialogOptions | undefined = undefined,
  >(
    data: PlaylistSound.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: PlaylistSound.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<PlaylistSound.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: PlaylistSound.Database2.DeleteOneDocumentOperation,
  ): Promise<PlaylistSound.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: PlaylistSound.Database2.DeleteOneDocumentOperation,
  ): Promise<PlaylistSound.DeleteDialogReturn<Options>>;

  static override fromDropData(data: PlaylistSound.DropData): Promise<PlaylistSound.Implementation | undefined>;

  static override fromImport(
    source: PlaylistSound.Source,
    context?: Document.FromImportContext<PlaylistSound.Parent> | null,
  ): Promise<PlaylistSound.Implementation>;

  // Embedded document operations have been left out because PlaylistSound does not have any embedded documents.

  #PlaylistSound: true;
}

export default PlaylistSound;
