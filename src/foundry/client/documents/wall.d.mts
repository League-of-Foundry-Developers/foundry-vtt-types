import type { InterfaceToObject, MaybeArray, Merge } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type BaseWall from "#common/documents/wall.mjs";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

declare namespace WallDocument {
  /**
   * The document's name.
   */
  type Name = "Wall";

  /**
   * The context used to create a `WallDocument`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `WallDocument`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `WallDocument` document instance configured through
   * {@linkcode CONFIG.Wall.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `WallDocument` document configured through
   * {@linkcode CONFIG.Wall.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Wall";
      collection: "walls";
      label: "DOCUMENT.Wall";
      labelPlural: "DOCUMENT.Walls";
      permissions: Metadata.Permissions;
      schemaVersion: "13.341";
    }>
  > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
    }
  }

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
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Scene">;

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
   * An instance of `WallDocument` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `WallDocument` that comes from the database.
   */
  type Stored = Document.Internal.Stored<WallDocument.Implementation>;

  /**
   * The data put in {@linkcode WallDocument._source | WallDocument#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode WallDocument.create}
   * and {@linkcode WallDocument | new WallDocument(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  // TODO: ensure `c` is required for construction/creation
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode WallDocument.create} and {@linkcode WallDocument.createDocuments} signatures, and
   * {@linkcode WallDocument.Database.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode WallDocument.create}, returning (a single | an array of) (temporary | stored)
   * `WallDocument`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<WallDocument.TemporaryIf<Temporary>>
      : WallDocument.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode WallDocument.name | WallDocument#name}.
   *
   * This is data transformed from {@linkcode WallDocument.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode WallDocument.update | WallDocument#update}.
   * It is a distinct type from {@linkcode WallDocument.CreateData | DeepPartial<WallDocument.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode WallDocument.update | WallDocument#update} and
   * {@linkcode WallDocument.updateDocuments} signatures, and {@linkcode WallDocument.Database.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode WallDocument}. This is the source of truth for how an WallDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode WallDocument}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */

  interface ThresholdSchema extends fields.DataSchema {
    /**
     * Minimum distance from a light source for which this wall blocks light
     */
    light: fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>;

    /**
     * Minimum distance from a vision source for which this wall blocks vision
     */
    sight: fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>;

    /**
     * Minimum distance from a sound source for which this wall blocks sound
     */
    sound: fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>;

    /**
     * Whether to attenuate the source radius when passing through the wall
     */
    attenuation: fields.BooleanField;
  }

  interface ThresholdData extends fields.SchemaField.InitializedData<ThresholdSchema> {}

  interface AnimationSchema extends fields.DataSchema {
    /** @defaultValue `1` */
    direction: fields.NumberField<{ choices: [-1, 1]; initial: 1 }>;

    /** @defaultValue `false` */
    double: fields.BooleanField<{ initial: false }>;

    /** @defaultValue `750` */
    duration: fields.NumberField<{ positive: true; integer: true; initial: 750 }>;

    /** @defaultValue `false` */
    flip: fields.BooleanField<{ initial: false }>;

    /** @defaultValue `1.0` */
    strength: fields.NumberField<{ initial: 1.0; min: 0; max: 2.0; step: 0.05 }>;

    /** @defaultValue `null` */
    texture: fields.FilePathField<{ categories: ["IMAGE"]; virtual: true }>;

    /** @defaultValue `"swing"` */
    type: fields.StringField<{ initial: "swing"; blank: true }>;
  }

  /** @remarks See {@linkcode foundry.canvas.containers.DoorMesh.AnimationConfiguration} */
  interface AnimationData extends fields.SchemaField.InitializedData<AnimationSchema> {}

  /**
   * The schema for {@linkcode WallDocument}. This is the source of truth for how an WallDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode WallDocument}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends fields.DataSchema {
    /**
     * The _id which uniquely identifies this BaseWall embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
     */
    c: fields.ArrayField<
      fields.NumberField<{ required: true; integer: true; nullable: false }>,
      {
        validate: (c: unknown) => c is Coordinates;
        validationError: "must be a length-4 array of integer coordinates";
      },
      // TODO(LukeAbby): Make the array shape easier to override.
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      fields.ArrayField.AssignmentElementType<fields.NumberField<{ required: true; integer: true; nullable: false }>>,
      fields.ArrayField.InitializedElementType<fields.NumberField<{ required: true; integer: true; nullable: false }>>,
      // FIXME: This field is `required` with no `initial`, so actually required for construction; Currently an AssignmentType override is required to enforce this
      Coordinates,
      Coordinates,
      fields.ArrayField.PersistedElementType<fields.NumberField<{ required: true; integer: true; nullable: false }>>,
      Coordinates
    >;

    /**
     * The illumination restriction type of this wall
     * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL` (`20`)
     */
    light: fields.NumberField<
      {
        required: true;
        choices: Record<CONST.WALL_SENSE_TYPES, string>;
        initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
        validationError: "must be a value in CONST.WALL_SENSE_TYPES";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.WALL_SENSE_TYPES | null | undefined,
      CONST.WALL_SENSE_TYPES | null,
      CONST.WALL_SENSE_TYPES | null
    >;

    /**
     * The movement restriction type of this wall
     * @defaultValue `CONST.WALL_MOVEMENT_TYPES.NORMAL` (`20`)
     */
    move: fields.NumberField<
      {
        required: true;
        choices: Record<CONST.WALL_MOVEMENT_TYPES, string>;
        initial: typeof CONST.WALL_MOVEMENT_TYPES.NORMAL;
        validationError: "must be a value in CONST.WALL_MOVEMENT_TYPES";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.WALL_MOVEMENT_TYPES | null | undefined,
      CONST.WALL_MOVEMENT_TYPES | null,
      CONST.WALL_MOVEMENT_TYPES | null
    >;

    /**
     * The visual restriction type of this wall
     * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL` (`20`)
     */
    sight: fields.NumberField<
      {
        required: true;
        choices: Record<CONST.WALL_SENSE_TYPES, string>;
        initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
        validationError: "must be a value in CONST.WALL_SENSE_TYPES";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.WALL_SENSE_TYPES | null | undefined,
      CONST.WALL_SENSE_TYPES | null,
      CONST.WALL_SENSE_TYPES | null
    >;

    /**
     * The auditory restriction type of this wall
     * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL` (`20`)
     */
    sound: fields.NumberField<
      {
        required: true;
        choices: Record<CONST.WALL_SENSE_TYPES, string>;
        initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
        validationError: "must be a value in CONST.WALL_SENSE_TYPES";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.WALL_SENSE_TYPES | null | undefined,
      CONST.WALL_SENSE_TYPES | null,
      CONST.WALL_SENSE_TYPES | null
    >;

    /**
     * The direction of effect imposed by this wall
     * @defaultValue `CONST.WALL_DIRECTIONS.BOTH`
     */
    dir: fields.NumberField<
      {
        required: true;
        choices: Record<CONST.WALL_DIRECTIONS, string>;
        initial: typeof CONST.WALL_DIRECTIONS.BOTH;
        validationError: "must be a value in CONST.WALL_DIRECTIONS";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.WALL_DIRECTIONS | null | undefined,
      CONST.WALL_DIRECTIONS | null,
      CONST.WALL_DIRECTIONS | null
    >;

    /**
     * The type of door which this wall contains, if any
     * @defaultValue `CONST.WALL_DOOR_TYPES.NONE`
     */
    door: fields.NumberField<
      {
        required: true;
        choices: Record<CONST.WALL_DOOR_TYPES, string>;
        initial: typeof CONST.WALL_DOOR_TYPES.NONE;
        validationError: "must be a value in CONST.WALL_DOOR_TYPES";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.WALL_DOOR_TYPES | null | undefined,
      CONST.WALL_DOOR_TYPES | null,
      CONST.WALL_DOOR_TYPES | null
    >;

    /**
     * The state of the door this wall contains, if any
     * @defaultValue `CONST.WALL_DOOR_STATES.CLOSED`
     */
    ds: fields.NumberField<
      {
        required: true;
        choices: Record<CONST.WALL_DOOR_STATES, string>;
        initial: typeof CONST.WALL_DOOR_STATES.CLOSED;
        validationError: "must be a value in CONST.WALL_DOOR_STATES";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.WALL_DOOR_STATES | null | undefined,
      CONST.WALL_DOOR_STATES | null,
      CONST.WALL_DOOR_STATES | null
    >;

    /**
     * @remarks TThis isn't enforced by the field, but should be in `keyof CONFIG.Wall.doorSounds`
     * @defaultValue `undefined`
     */
    doorSound: fields.StringField<{ required: false; blank: true; initial: undefined }>;

    /**
     * Configuration of threshold data for this wall
     * @defaultValue see properties
     */
    threshold: fields.SchemaField<ThresholdSchema>;

    /** @defaultValue `null` */
    animation: fields.SchemaField<AnimationSchema, { required: true; nullable: true; initial: null }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name, InterfaceToObject<CoreFlags>>;
  }

  interface CoreFlags {
    core?: {
      /** @remarks Checked in `DoorMesh##getClosedPosition` */
      textureGridSize?: number;

      /** @remarks Checked in `DoorMesh##getClosedPosition` */
      elevation?: number;
    };
  }

  namespace Database {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `WallDocument` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<WallDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode WallDocument.get}.
     * @see {@linkcode Document.Database.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `WallDocument` documents.
     * @see {@linkcode Document.Database.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `WallDocument` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode WallDocument.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends
        DatabaseBackend.CreateOperation<WallDocument.CreateInput, WallDocument.Parent, Temporary>,
        DatabaseBackend._CommonCanvasDocumentCreateProperties {}

    /**
     * The interface for passing to {@linkcode WallDocument.create} or {@linkcode WallDocument.createDocuments}.
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
     * can contain `WallDocument` documents. (see {@linkcode WallDocument.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `WallDocument` documents.
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
     * The interface passed to {@linkcode WallDocument._preCreate | WallDocument#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateWallDocument` hook}.
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
     * The interface passed to {@linkcode WallDocument._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode WallDocument._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode WallDocument._onCreate | WallDocument#_onCreate} and
     * {@link Hooks.CreateDocument | the `createWallDocument` hook}.
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
     * The interface passed to {@linkcode WallDocument._onCreateOperation} and `WallDocument`-related collections'
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
     * interface for `WallDocument` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode WallDocument.update | WallDocument#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation
      extends
        DatabaseBackend.UpdateOperation<WallDocument.UpdateInput, WallDocument.Parent>,
        DatabaseBackend._CommonCanvasDocumentUpdateProperties {
      /**
       * @remarks If `false`, prevents {@linkcode Wall._onUpdate | Wall#_onUpdate} from calling
       * {@linkcode Wall._playDoorSound | Wall#_playDoorSound}.
       */
      sound?: boolean;
    }

    /**
     * The interface for passing to {@linkcode WallDocument.update | WallDocument#update}.
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
     * can contain `WallDocument` documents (see {@linkcode WallDocument.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode WallDocument.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `WallDocument` documents.
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
     * The interface passed to {@linkcode WallDocument._preUpdate | WallDocument#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateWallDocument` hook}.
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
     * The interface passed to {@linkcode WallDocument._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode WallDocument._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode WallDocument._onUpdate | WallDocument#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateWallDocument` hook}.
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
     * The interface passed to {@linkcode WallDocument._onUpdateOperation} and `WallDocument`-related collections'
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
     * interface for `WallDocument` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode WallDocument.delete | WallDocument#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<WallDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode WallDocument.delete | WallDocument#delete}.
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
     * can contain `WallDocument` documents (see {@linkcode WallDocument.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode WallDocument.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `WallDocument` documents.
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
     * The interface passed to {@linkcode WallDocument._preDelete | WallDocument#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteWallDocument` hook}.
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
     * The interface passed to {@linkcode WallDocument._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode WallDocument._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode WallDocument._onDelete | WallDocument#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteWallDocument` hook}.
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
     * The interface passed to {@linkcode WallDocument._onDeleteOperation} and `WallDocument`-related collections'
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
        GetDocumentsOperation: WallDocument.Database.GetDocumentsOperation;
        BackendGetOperation: WallDocument.Database.BackendGetOperation;
        GetOperation: WallDocument.Database.GetOperation;

        CreateDocumentsOperation: WallDocument.Database.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: WallDocument.Database.CreateEmbeddedOperation;
        BackendCreateOperation: WallDocument.Database.BackendCreateOperation<Temporary>;
        CreateOperation: WallDocument.Database.CreateOperation<Temporary>;
        PreCreateOptions: WallDocument.Database.PreCreateOptions<Temporary>;
        PreCreateOperation: WallDocument.Database.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: WallDocument.Database.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: WallDocument.Database.OnCreateOptions;
        OnCreateOperation: WallDocument.Database.OnCreateOperation;

        UpdateOneDocumentOperation: WallDocument.Database.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: WallDocument.Database.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: WallDocument.Database.UpdateManyDocumentsOperation;
        BackendUpdateOperation: WallDocument.Database.BackendUpdateOperation;
        UpdateOperation: WallDocument.Database.UpdateOperation;
        PreUpdateOptions: WallDocument.Database.PreUpdateOptions;
        PreUpdateOperation: WallDocument.Database.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: WallDocument.Database.OnUpdateDocumentsOperation;
        OnUpdateOptions: WallDocument.Database.OnUpdateOptions;
        OnUpdateOperation: WallDocument.Database.OnUpdateOperation;

        DeleteOneDocumentOperation: WallDocument.Database.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: WallDocument.Database.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: WallDocument.Database.DeleteManyDocumentsOperation;
        BackendDeleteOperation: WallDocument.Database.BackendDeleteOperation;
        DeleteOperation: WallDocument.Database.DeleteOperation;
        PreDeleteOptions: WallDocument.Database.PreDeleteOptions;
        PreDeleteOperation: WallDocument.Database.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: WallDocument.Database.OnDeleteDocumentsOperation;
        OnDeleteOptions: WallDocument.Database.OnDeleteOptions;
        OnDeleteOperation: WallDocument.Database.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode WallDocument.Implementation}, otherwise {@linkcode WallDocument.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? WallDocument.Implementation : WallDocument.Stored;

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

  /** The interface {@linkcode WallDocument.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode WallDocument.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode WallDocument.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode WallDocument.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode WallDocument.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode WallDocument.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode WallDocument.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends WallDocument.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<WallDocument.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode WallDocument.deleteDialog | WallDocument#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    WallDocument.Stored,
    PassedConfig
  >;

  /* ***********************************************
   *              WALL-SPECIFIC TYPES              *
   *************************************************/

  /**
   * The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
   */
  type Coordinates = [x0: number, y0: number, x1: number, y1: number];

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
 * The client-side Wall document which extends the common BaseWall model.
 *
 * @see {@linkcode Scene}            The Scene document type which contains Wall embedded documents
 * @see {@linkcode WallConfig}       The Wall configuration application
 */
declare class WallDocument extends BaseWall.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `WallDocument`
   * @param context - Construction context options
   */
  constructor(data: WallDocument.CreateData, context?: WallDocument.ConstructionContext);

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

  // Descendant Document operations have been left out because Wall does not have any descendant documents.

  static override defaultName(context?: WallDocument.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends WallDocument.CreateDialogOptions | undefined = undefined,
  >(
    data?: WallDocument.CreateDialogData,
    createOptions?: WallDocument.Database.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<WallDocument.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode WallDocument.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends WallDocument.CreateDialogOptions | undefined = undefined,
  >(
    data: WallDocument.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: WallDocument.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<WallDocument.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: WallDocument.Database.DeleteOneDocumentOperation,
  ): Promise<WallDocument.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: WallDocument.Database.DeleteOneDocumentOperation,
  ): Promise<WallDocument.DeleteDialogReturn<Options>>;

  static override fromDropData(data: WallDocument.DropData): Promise<WallDocument.Implementation | undefined>;

  static override fromImport(
    source: WallDocument.Source,
    context?: Document.FromImportContext<WallDocument.Parent> | null,
  ): Promise<WallDocument.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // Embedded document operations have been left out because Wall does not have any embedded documents.
}

export default WallDocument;
