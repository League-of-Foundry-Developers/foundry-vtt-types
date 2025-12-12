import type { InexactPartial, InterfaceToObject, MaybeArray, Merge } from "#utils";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { TextureData } from "#common/data/data.mjs";
import type BaseTile from "#common/documents/tile.mjs";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace TileDocument {
  /**
   * The document's name.
   */
  type Name = "Tile";

  /**
   * The context used to create a `TileDocument`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `TileDocument`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `TileDocument` document instance configured through
   * {@linkcode CONFIG.Tile.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `TileDocument` document configured through
   * {@linkcode CONFIG.Tile.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Tile";
      collection: "tiles";
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }>
  > {}

  // No need for Metadata namespace

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Scene.Implementation | null;

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
   * An instance of `TileDocument` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `TileDocument` that comes from the database.
   */
  type Stored = Document.Internal.Stored<TileDocument.Implementation>;

  /**
   * The data put in {@linkcode TileDocument._source | TileDocument#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode TileDocument.create}
   * and {@linkcode TileDocument | new TileDocument(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  // TODO: ensure `width` and `height` are required for creation
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode TileDocument.create} and {@linkcode TileDocument.createDocuments} signatures, and
   * {@linkcode TileDocument.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode TileDocument.create}, returning (a single | an array of) (temporary | stored)
   * `TileDocument`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<TileDocument.TemporaryIf<Temporary>>
      : TileDocument.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode TileDocument.name | TileDocument#name}.
   *
   * This is data transformed from {@linkcode TileDocument.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode TileDocument.update | TileDocument#update}.
   * It is a distinct type from {@linkcode TileDocument.CreateData | DeepPartial<TileDocument.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode TileDocument.update | TileDocument#update} and
   * {@linkcode TileDocument.updateDocuments} signatures, and {@linkcode TileDocument.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode TileDocument}. This is the source of truth for how an TileDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode TileDocument}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Tile embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * An image or video texture which this tile displays.
     */
    texture: TextureData<{ initial: { anchorX: 0.5; anchorY: 0.5; alphaThreshold: 0.75 } }>;

    /**
     * The pixel width of the tile
     */
    // FIXME: This field is `required` with no `initial`, so actually required for construction; Currently an AssignmentType override is required to enforce this
    width: fields.NumberField<{ required: true; min: 0; nullable: false; step: 0.1 }, number>;

    /**
     * The pixel height of the tile
     */
    // FIXME: This field is `required` with no `initial`, so actually required for construction; Currently an AssignmentType override is required to enforce this
    height: fields.NumberField<{ required: true; min: 0; nullable: false; step: 0.1 }, number>;

    /**
     * The x-coordinate position of the top-left corner of the tile
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The y-coordinate position of the top-left corner of the tile
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The elevation of the tile
     * @defaultValue `0`
     */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The z-index of this tile relative to other siblings
     * @defaultValue `0`
     */
    sort: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The angle of rotation for the tile between 0 and 360
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * The tile opacity
     * @defaultValue `1`
     */
    alpha: fields.AlphaField;

    /**
     * Is the tile currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * Is the tile currently locked?
     * @defaultValue `false`
     */
    locked: fields.BooleanField;

    /** @defaultValue see properties */
    restrictions: fields.SchemaField<{
      /** @defaultValue `false` */
      light: fields.BooleanField;

      /** @defaultValue `false` */
      weather: fields.BooleanField;
    }>;

    /**
     * The tile's occlusion settings
     * @defaultValue see properties
     */
    occlusion: fields.SchemaField<{
      /**
       * The occlusion mode from CONST.TILE_OCCLUSION_MODES
       * @defaultValue `1`
       */
      mode: fields.NumberField<
        {
          choices: Record<CONST.OCCLUSION_MODES, string>;
          initial: typeof CONST.OCCLUSION_MODES.NONE;
          validationError: "must be a value in CONST.TILE_OCCLUSION_MODES";
        },
        // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
        CONST.OCCLUSION_MODES | null | undefined,
        CONST.OCCLUSION_MODES | null,
        CONST.OCCLUSION_MODES | null
      >;

      /**
       * The occlusion alpha between 0 and 1
       * @defaultValue `0`
       */
      alpha: fields.AlphaField<{ initial: 0 }>;
    }>;

    /**
     * The tile's video settings
     * @defaultValue see properties
     */
    video: fields.SchemaField<{
      /**
       * Automatically loop the video?
       * @defaultValue `true`
       */
      loop: fields.BooleanField<{ initial: true }>;

      /**
       * Should the video play automatically?
       * @defaultValue `true`
       */
      autoplay: fields.BooleanField<{ initial: true }>;

      /**
       * The volume level of any audio that the video file contains
       * @defaultValue `0`
       */
      volume: fields.AlphaField<{ initial: 0; step: 0.01 }>;
    }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name, InterfaceToObject<CoreFlags>>;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `TileDocument` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<TileDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode TileDocument.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `TileDocument` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `TileDocument` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode TileDocument.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<TileDocument.CreateInput, TileDocument.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode TileDocument.create} or {@linkcode TileDocument.createDocuments}.
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
     * can contain `TileDocument` documents. (see {@linkcode TileDocument.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `TileDocument` documents.
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
     * The interface passed to {@linkcode TileDocument._preCreate | TileDocument#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateTileDocument` hook}.
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
     * The interface passed to {@linkcode TileDocument._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode TileDocument._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode TileDocument._onCreate | TileDocument#_onCreate} and
     * {@link Hooks.CreateDocument | the `createTileDocument` hook}.
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
     * The interface passed to {@linkcode TileDocument._onCreateOperation} and `TileDocument`-related collections'
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
     * interface for `TileDocument` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode TileDocument.update | TileDocument#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<TileDocument.UpdateInput, TileDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode TileDocument.update | TileDocument#update}.
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
     * can contain `TileDocument` documents (see {@linkcode TileDocument.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode TileDocument.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `TileDocument` documents.
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
     * The interface passed to {@linkcode TileDocument._preUpdate | TileDocument#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateTileDocument` hook}.
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
     * The interface passed to {@linkcode TileDocument._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode TileDocument._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode TileDocument._onUpdate | TileDocument#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateTileDocument` hook}.
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
     * The interface passed to {@linkcode TileDocument._onUpdateOperation} and `TileDocument`-related collections'
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
     * interface for `TileDocument` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode TileDocument.delete | TileDocument#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<TileDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode TileDocument.delete | TileDocument#delete}.
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
     * can contain `TileDocument` documents (see {@linkcode TileDocument.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode TileDocument.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `TileDocument` documents.
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
     * The interface passed to {@linkcode TileDocument._preDelete | TileDocument#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteTileDocument` hook}.
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
     * The interface passed to {@linkcode TileDocument._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode TileDocument._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode TileDocument._onDelete | TileDocument#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteTileDocument` hook}.
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
     * The interface passed to {@linkcode TileDocument._onDeleteOperation} and `TileDocument`-related collections'
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
        GetDocumentsOperation: TileDocument.Database2.GetDocumentsOperation;
        BackendGetOperation: TileDocument.Database2.BackendGetOperation;
        GetOperation: TileDocument.Database2.GetOperation;

        CreateDocumentsOperation: TileDocument.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: TileDocument.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: TileDocument.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: TileDocument.Database2.CreateOperation<Temporary>;
        PreCreateOptions: TileDocument.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: TileDocument.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: TileDocument.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: TileDocument.Database2.OnCreateOptions;
        OnCreateOperation: TileDocument.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: TileDocument.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: TileDocument.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: TileDocument.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: TileDocument.Database2.BackendUpdateOperation;
        UpdateOperation: TileDocument.Database2.UpdateOperation;
        PreUpdateOptions: TileDocument.Database2.PreUpdateOptions;
        PreUpdateOperation: TileDocument.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: TileDocument.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: TileDocument.Database2.OnUpdateOptions;
        OnUpdateOperation: TileDocument.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: TileDocument.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: TileDocument.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: TileDocument.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: TileDocument.Database2.BackendDeleteOperation;
        DeleteOperation: TileDocument.Database2.DeleteOperation;
        PreDeleteOptions: TileDocument.Database2.PreDeleteOptions;
        PreDeleteOperation: TileDocument.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: TileDocument.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: TileDocument.Database2.OnDeleteOptions;
        OnDeleteOperation: TileDocument.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode TileDocument.Implementation}, otherwise {@linkcode TileDocument.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? TileDocument.Implementation : TileDocument.Stored;

  namespace Database {
    /** Options passed along in Get operations for TileDocuments */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<TileDocument.Parent> {}

    /** Options passed along in Create operations for TileDocuments */
    interface Create<Temporary extends boolean | undefined = boolean | undefined> extends foundry.abstract.types
      .DatabaseCreateOperation<TileDocument.CreateData, TileDocument.Parent, Temporary> {}

    /** Options passed along in Delete operations for TileDocuments */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<TileDocument.Parent> {}

    /** Options passed along in Update operations for TileDocuments */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<
      TileDocument.UpdateData,
      TileDocument.Parent
    > {}

    /** Operation for {@linkcode TileDocument.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined> extends Document.Database
      .CreateDocumentsOperation<TileDocument.Database.Create<Temporary>> {}

    /** Operation for {@linkcode TileDocument.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database
      .UpdateDocumentsOperation<TileDocument.Database.Update> {}

    /** Operation for {@linkcode TileDocument.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database
      .DeleteDocumentsOperation<TileDocument.Database.Delete> {}

    /** Operation for {@linkcode TileDocument.create} */
    interface CreateOperation<Temporary extends boolean | undefined> extends Document.Database.CreateDocumentsOperation<
      TileDocument.Database.Create<Temporary>
    > {}

    /** Operation for {@link TileDocument.update | `TileDocument#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode TileDocument.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link TileDocument._preCreate | `TileDocument#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link TileDocument._onCreate | `TileDocument#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode TileDocument._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<TileDocument.Database.Create> {}

    /** Operation for {@link TileDocument._onCreateOperation | `TileDocument#_onCreateOperation`} */
    interface OnCreateOperation extends TileDocument.Database.Create {}

    /** Options for {@link TileDocument._preUpdate | `TileDocument#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link TileDocument._onUpdate | `TileDocument#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode TileDocument._preUpdateOperation} */
    interface PreUpdateOperation extends TileDocument.Database.Update {}

    /** Operation for {@link TileDocument._onUpdateOperation | `TileDocument._preUpdateOperation`} */
    interface OnUpdateOperation extends TileDocument.Database.Update {}

    /** Options for {@link TileDocument._preDelete | `TileDocument#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link TileDocument._onDelete | `TileDocument#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link TileDocument._preDeleteOperation | `TileDocument#_preDeleteOperation`} */
    interface PreDeleteOperation extends TileDocument.Database.Delete {}

    /** Options for {@link TileDocument._onDeleteOperation | `TileDocument#_onDeleteOperation`} */
    interface OnDeleteOperation extends TileDocument.Database.Delete {}

    /** Context for {@linkcode TileDocument._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<TileDocument.Parent> {}

    /** Context for {@linkcode TileDocument._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<TileDocument.Parent> {}

    /** Context for {@linkcode TileDocument._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<TileDocument.Parent> {}

    /**
     * Options for {@link TileDocument._preCreateDescendantDocuments | `TileDocument#_preCreateDescendantDocuments`}
     * and {@link TileDocument._onCreateDescendantDocuments | `TileDocument#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<TileDocument.Database.Create> {}

    /**
     * Options for {@link TileDocument._preUpdateDescendantDocuments | `TileDocument#_preUpdateDescendantDocuments`}
     * and {@link TileDocument._onUpdateDescendantDocuments | `TileDocument#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<TileDocument.Database.Update> {}

    /**
     * Options for {@link TileDocument._preDeleteDescendantDocuments | `TileDocument#_preDeleteDescendantDocuments`}
     * and {@link TileDocument._onDeleteDescendantDocuments | `TileDocument#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<TileDocument.Database.Delete> {}

    /**
     * Create options for {@linkcode TileDocument.createDialog}.
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
      /**
       * @deprecated since v12, until 14
       * @remarks "Tiling Sprites are deprecated without replacement."
       */
      isTilingSprite?: boolean;

      /** @remarks If true, and texture.src is a video, it will jump to a random timestamp every time the tile is drawn */
      randomizeVideo?: boolean;
    };
  }

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  /** The interface {@linkcode TileDocument.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode TileDocument.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode TileDocument.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode TileDocument.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode TileDocument.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode TileDocument.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode TileDocument.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends TileDocument.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<TileDocument.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode TileDocument.deleteDialog | TileDocument#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    TileDocument.Stored,
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
 * The client-side Tile document which extends the common BaseTile model.
 *
 * @see {@linkcode Scene}            The Scene document type which contains Tile embedded documents
 * @see {@linkcode TileConfig}       The Tile configuration application
 */
declare class TileDocument extends BaseTile.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `TileDocument`
   * @param context - Construction context options
   */
  constructor(data: TileDocument.CreateData, context?: TileDocument.ConstructionContext);

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

  // Descendant Document operations have been left out because Tile does not have any descendant documents.

  static override defaultName(context: TileDocument.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends TileDocument.CreateDialogOptions | undefined = undefined,
  >(
    data?: TileDocument.CreateDialogData,
    createOptions?: TileDocument.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<TileDocument.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode TileDocument.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends TileDocument.CreateDialogOptions | undefined = undefined,
  >(
    data: TileDocument.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: TileDocument.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<TileDocument.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: TileDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<TileDocument.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: TileDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<TileDocument.DeleteDialogReturn<Options>>;

  static override fromDropData(data: TileDocument.DropData): Promise<TileDocument.Implementation | undefined>;

  static override fromImport(
    source: TileDocument.Source,
    context?: Document.FromImportContext<TileDocument.Parent> | null,
  ): Promise<TileDocument.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // Embedded document operations have been left out because Tile does not have any embedded documents.
}

export default TileDocument;
