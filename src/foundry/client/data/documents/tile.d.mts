import type { InterfaceToObject } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields, TextureData } from "../../../common/data/module.d.mts";

declare global {
  namespace TileDocument {
    /**
     * The implementation of the TileDocument document instance configured through `CONFIG.Tile.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredTileDocument | `configuration/ConfiguredTileDocument`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Tile">;

    /**
     * The implementation of the TileDocument document configured through `CONFIG.Tile.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Tile">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Tile"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Scene.Implementation | null;

    /**
     * An instance of `TileDocument` that comes from the database.
     */
    interface Stored extends Document.Stored<TileDocument.Implementation> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link TileDocument._source | `TileDocument._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link TileDocument.create | `TileDocument.create`}
     * and {@link TileDocument | `new TileDocument(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link TileDocument.name | `TileDocument#name`}.
     *
     * This is data transformed from {@link TileDocument.Source | `TileDocument.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link TileDocument.update | `TileDocument#update`}.
     * It is a distinct type from {@link TileDocument.CreateData | `DeepPartial<TileDocument.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link TileDocument | `TileDocument`}. This is the source of truth for how an TileDocument document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link TileDocument | `TileDocument`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
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
       * @defaultValue `null`
       */
      texture: TextureData<{ categories: ("IMAGE" | "VIDEO")[]; initial: null; wildcard: false }>;

      /**
       * The pixel width of the tile
       */
      width: fields.NumberField<{
        required: true;
        min: 0;
        nullable: false;
        step: 0.1;
      }>;

      /**
       * The pixel height of the tile
       */
      height: fields.NumberField<{ required: true; min: 0; nullable: false; step: 0.1 }>;

      /**
       * The x-coordinate position of the top-left corner of the tile
       * @defaultValue `0`
       */
      x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

      /**
       * The y-coordinate position of the top-left corner of the tile
       * @defaultValue `0`
       */
      y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

      /**
       * The z-index ordering of this tile relative to its siblings
       * @defaultValue `100`
       */
      z: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 100 }>;

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

      /**
       * Is the tile an overhead tile?
       * @defaultValue `false`
       */
      overhead: fields.BooleanField;

      /**
       * Is the tile a roof?
       * @defaultValue `false`
       */
      roof: fields.BooleanField;

      /**
       * The tile's occlusion settings
       * @defaultValue see properties
       */
      occlusion: fields.SchemaField<{
        /**
         * The occlusion mode from CONST.TILE_OCCLUSION_MODES
         * @defaultValue `1`
         */
        mode: fields.NumberField<{
          choices: CONST.OCCLUSION_MODES[];
          initial: typeof CONST.OCCLUSION_MODES.FADE;
          validationError: "must be a value in CONST.TILE_OCCLUSION_MODES";
        }>;

        /**
         * The occlusion alpha between 0 and 1
         * @defaultValue `0`
         */
        alpha: fields.AlphaField<{ initial: 0 }>;

        /**
         * An optional radius of occlusion used for RADIAL mode
         * @defaultValue `null`
         */
        radius: fields.NumberField<{ positive: true }>;
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
      flags: fields.ObjectField.FlagsField<"Tile", InterfaceToObject<CoreFlags>>;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for TileDocuments */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<TileDocument.Parent> {}
      /** Options passed along in Create operations for TileDocuments */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          TileDocument.CreateData,
          TileDocument.Parent,
          Temporary
        > {}
      /** Options passed along in Delete operations for TileDocuments */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<TileDocument.Parent> {}
      /** Options passed along in Update operations for TileDocuments */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<TileDocument.UpdateData, TileDocument.Parent> {}

      /** Options for {@link TileDocument.createDocuments | `TileDocument.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link TileDocument._preCreateOperation | `TileDocument._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link TileDocument#_preCreate | `TileDocument#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link TileDocument#_onCreate | `TileDocument#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link TileDocument.updateDocuments | `TileDocument.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link TileDocument._preUpdateOperation | `TileDocument._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link TileDocument#_preUpdate | `TileDocument#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link TileDocument#_onUpdate | `TileDocument#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link TileDocument.deleteDocuments | `TileDocument.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link TileDocument._preDeleteOperation | `TileDocument._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link TileDocument#_preDelete | `TileDocument#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link TileDocument#_onDelete | `TileDocument#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    interface CoreFlags {
      core?: {
        randomizeVideo?: boolean;
      };
    }

    /**
     * @deprecated - {@link TileDocument.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<TileDocument> {}

    /**
     * @deprecated {@link TileDocument.CreateData | `TileDocument.CreateData`}
     */
    interface ConstructorData extends TileDocument.CreateData {}

    /**
     * @deprecated {@link TileDocument.implementation | `TileDocument.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link TileDocument.Implementation | `TileDocument.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Tile document which extends the common BaseTile model.
   *
   * @see {@link Scene}            The Scene document type which contains Tile embedded documents
   * @see {@link TileConfig}       The Tile configuration application
   */
  class TileDocument extends CanvasDocumentMixin(foundry.documents.BaseTile) {
    /**
     * @param data    - Initial data from which to construct the `TileDocument`
     * @param context - Construction context options
     *
     * @deprecated Constructing `TileDocument` directly is not advised. While `new TileDocument(...)` would create a
     * temporary document it would not respect a system's subclass of `TileDocument`, if any.
     *
     * You should use {@link TileDocument.implementation | `new TileDocument.implementation(...)`} instead which
     * will give you a system specific implementation of `TileDocument`.
     */
    constructor(...args: Document.ConstructorParameters<TileDocument.CreateData, TileDocument.Parent>);

    static override metadata: TileDocument.Metadata;

    static get implementation(): TileDocument.ImplementationClass;

    override prepareDerivedData(): void;
  }
}
