import type { InexactPartial } from "fvtt-types/utils";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields, TextureData } from "../../../common/data/module.d.mts";

declare global {
  namespace Scene {
    /**
     * The implementation of the Scene document instance configured through `CONFIG.Scene.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredScene | `configuration/ConfiguredScene`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Scene">;

    /**
     * The implementation of the Scene document configured through `CONFIG.Scene.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Scene">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Scene"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `Scene` that comes from the database.
     */
    interface Stored extends Document.Stored<Scene.Implementation> {}

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
     * The data put in {@link Scene._source | `Scene._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Scene.create | `Scene.create`}
     * and {@link Scene | `new Scene(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Scene.name | `Scene#name`}.
     *
     * This is data transformed from {@link Scene.Source | `Scene.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Scene.update | `Scene#update`}.
     * It is a distinct type from {@link Scene.CreateData | `DeepPartial<Scene.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Scene | `Scene`}. This is the source of truth for how an Scene document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Scene | `Scene`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this Scene document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The name of this scene
       * @defaultValue `""`
       */
      name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

      /**
       * Is this scene currently active? Only one scene may be active at a given time
       * @defaultValue `false`
       */
      active: fields.BooleanField;

      /**
       * Is this scene displayed in the top navigation bar?
       * @defaultValue `true`
       */
      navigation: fields.BooleanField<{ initial: true }>;

      /**
       * The sorting order of this Scene in the navigation bar relative to siblings
       * @defaultValue `0`
       */
      navOrder: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;

      /**
       * A string which overrides Scene name for display in the navigation bar
       * @defaultValue `""`
       */
      navName: fields.HTMLField<{ textSearch: true }>;

      /**
       * An image or video file that provides the background texture for the scene.
       * @defaultValue see {@link TextureData}
       */
      background: TextureData<{ categories: ["IMAGE", "VIDEO"]; initial: null; wildcard: false }>;

      /**
       * An image or video file path providing foreground media for the scene
       * @defaultValue `null`
       */
      foreground: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"] }>;

      /**
       * The elevation of the foreground layer where overhead tiles reside
       * @defaultValue `null`
       */
      foregroundElevation: fields.NumberField<{ required: false; positive: true; integer: true }>;

      /**
       * A thumbnail image which depicts the scene at lower resolution
       * @defaultValue `null`
       */
      thumb: fields.FilePathField<{ categories: ["IMAGE"] }>;

      /**
       * The width of the scene canvas, normally the width of the background media
       * @defaultValue `4000`
       */
      width: fields.NumberField<{ integer: true; positive: true; initial: 4000 }>;

      /**
       * The height of the scene canvas, normally the height of the background media
       * @defaultValue `3000`
       */
      height: fields.NumberField<{ integer: true; positive: true; initial: 3000 }>;

      /**
       * The proportion of canvas padding applied around the outside of the scene
       * dimensions to provide additional buffer space
       * @defaultValue `0.25`
       */
      padding: fields.NumberField<{ required: true; nullable: false; min: 0; max: 0.5; step: 0.05; initial: 0.25 }>;

      /**
       * The initial view coordinates for the scene
       * @defaultValue `undefined`
       */
      initial: fields.SchemaField<{
        x: fields.NumberField<{ integer: true; nullable: true; initial: undefined }>;
        y: fields.NumberField<{ integer: true; nullable: true; initial: undefined }>;
        scale: fields.NumberField<{ nullable: true; min: 0.25; max: 3; initial: undefined }>;
      }>;

      /**
       * The color of the canvas displayed behind the scene background
       * @defaultValue `"#999999"`
       */
      backgroundColor: fields.ColorField<{ initial: "#999999" }>;

      /**
       * Grid configuration for the scene
       * @defaultValue see properties
       */
      grid: fields.SchemaField<{
        /**
         * The type of grid, a number from CONST.GRID_TYPES.
         * @defaultValue `CONST.GRID_TYPES.SQUARE`
         */
        type: fields.NumberField<{
          required: true;
          choices: CONST.GRID_TYPES[];
          initial: typeof CONST.GRID_TYPES.SQUARE;
          validationError: "must be a value in CONST.GRID_TYPES";
        }>;

        /**
         * The grid size which represents the width (or height) of a single grid space.
         * @defaultValue `100`
         */
        size: fields.NumberField<{
          required: true;
          nullable: false;
          integer: true;
          min: typeof CONST.GRID_MIN_SIZE;
          initial: 100;
          validationError: `must be an integer number of pixels, ${typeof CONST.GRID_MIN_SIZE} or greater`;
        }>;

        /**
         * A string representing the color used to render the grid lines.
         * @defaultValue `"#000000"`
         */
        color: fields.ColorField<{ required: true; nullable: false; initial: "#000000" }>;

        /**
         * A number between 0 and 1 for the opacity of the grid lines.
         * @defaultValue `0.2`
         */
        alpha: fields.AlphaField<{ initial: 0.2 }>;

        /**
         * The number of distance units which are represented by a single grid space.
         * @defaultValue `game.system.gridDistance || 1`
         */
        distance: fields.NumberField<{ required: true; nullable: false; positive: true; initial: () => number }>;

        /**
         * A label for the units of measure which are used for grid distance.
         * @defaultValue `game.system.gridUnits ?? ""`
         */
        units: fields.StringField<{ initial: () => string }>;
      }>;

      /**
       * Do Tokens require vision in order to see the Scene environment?
       * @defaultValue `true`
       */
      tokenVision: fields.BooleanField<{ initial: true }>;

      /**
       * Is a global source of illumination present which provides dim light to all
       * areas of the Scene?
       * @defaultValue `true`
       */
      fogExploration: fields.BooleanField<{ initial: true }>;

      /**
       * The ambient darkness level in this Scene, where 0 represents midday
       * (maximum illumination) and 1 represents midnight (maximum darkness)
       * @defaultValue `Date.now`
       */
      fogReset: fields.NumberField<{ nullable: false; initial: number }>;

      /**
       * A darkness threshold between 0 and 1. When the Scene darkness level
       * exceeds this threshold Global Illumination is automatically disabled
       * @defaultValue `false`
       */
      globalLight: fields.BooleanField;

      /**
       * Should fog exploration progress be tracked for this Scene?
       * @defaultValue `null`
       */
      globalLightThreshold: fields.AlphaField<{ nullable: true; initial: null }>;

      /**
       * The timestamp at which fog of war was last reset for this Scene.
       * @defaultValue `0`
       */
      darkness: fields.AlphaField<{ initial: 0 }>;

      /**
       * A special overlay image or video texture which is used for fog of war
       * @defaultValue `null`
       */
      fogOverlay: fields.FilePathField<{ categories: ("IMAGE" | "VIDEO")[] }>;

      /**
       * A color tint applied to explored regions of fog of war
       * @defaultValue `null`
       */
      fogExploredColor: fields.ColorField<{ label: "SCENES.FogExploredColor" }>;

      /**
       * A color tint applied to unexplored regions of fog of war
       * @defaultValue `null`
       */
      fogUnexploredColor: fields.ColorField<{ label: "SCENES.FogUnexploredColor" }>;

      /**
       * A collection of embedded Drawing objects.
       * @defaultValue `[]`
       */
      drawings: fields.EmbeddedCollectionField<typeof documents.BaseDrawing, Scene.Implementation>;

      /**
       * A collection of embedded Tile objects.
       * @defaultValue `[]`
       */
      tokens: fields.EmbeddedCollectionField<typeof documents.BaseToken, Scene.Implementation>;

      /**
       * A collection of embedded Token objects.
       * @defaultValue `[]`
       */
      lights: fields.EmbeddedCollectionField<typeof documents.BaseAmbientLight, Scene.Implementation>;

      /**
       * A collection of embedded AmbientLight objects.
       * @defaultValue `[]`
       */
      notes: fields.EmbeddedCollectionField<typeof documents.BaseNote, Scene.Implementation>;

      /**
       * A collection of embedded Note objects.
       * @defaultValue `[]`
       */
      sounds: fields.EmbeddedCollectionField<typeof documents.BaseAmbientSound, Scene.Implementation>;

      /**
       * A collection of embedded Region documents.
       * @defaultValue `[]`
       */
      regions: fields.EmbeddedCollectionField<typeof documents.BaseRegion, Scene.Implementation>;

      /**
       * A collection of embedded AmbientSound objects.
       * @defaultValue `[]`
       */
      templates: fields.EmbeddedCollectionField<typeof documents.BaseMeasuredTemplate, Scene.Implementation>;

      /**
       * A collection of embedded MeasuredTemplate objects.
       * @defaultValue `[]`
       */
      tiles: fields.EmbeddedCollectionField<typeof documents.BaseTile, Scene.Implementation>;

      /**
       * A collection of embedded Wall objects
       * @defaultValue `[]`
       */
      walls: fields.EmbeddedCollectionField<typeof documents.BaseWall, Scene.Implementation>;

      /**
       * A linked Playlist document which should begin automatically playing when this
       * Scene becomes active.
       * @defaultValue `null`
       */
      playlist: fields.ForeignDocumentField<typeof documents.BasePlaylist>;

      /**
       * A linked PlaylistSound document from the selected playlist that will
       * begin automatically playing when this Scene becomes active
       * @defaultValue `null`
       */
      playlistSound: fields.ForeignDocumentField<typeof documents.BasePlaylistSound, { idOnly: true }>;

      /**
       * A JournalEntry document which provides narrative details about this Scene
       * @defaultValue `null`
       */
      journal: fields.ForeignDocumentField<typeof documents.BaseJournalEntry>;

      /**
       * A document ID for a JournalEntryPage which provides narrative details about this Scene
       * @defaultValue `null`
       */
      journalEntryPage: fields.ForeignDocumentField<typeof documents.BaseJournalEntryPage, { idOnly: true }>;

      /**
       * A named weather effect which should be rendered in this Scene.
       * @defaultValue `""`
       */
      weather: fields.StringField;

      /**
       * The _id of a Folder which contains this Actor
       * @defaultValue `null`
       */
      folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

      /**
       * The numeric sort value which orders this Actor relative to its siblings
       * @defaultValue `0`
       */
      sort: fields.IntegerSortField;

      /**
       * An object which configures ownership of this Scene
       * @defaultValue see {@link fields.DocumentOwnershipField}
       */
      ownership: fields.DocumentOwnershipField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Scene">;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for Scenes */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Scene.Parent> {}
      /** Options passed along in Create operations for Scenes */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Scene.CreateData, Scene.Parent, Temporary> {}
      /** Options passed along in Delete operations for Scenes */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Scene.Parent> {}
      /** Options passed along in Update operations for Scenes */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Scene.UpdateData, Scene.Parent> {
        thumb?: (string | null)[];
        autoReposition?: boolean;
        animateDarkness?: number;
      }

      /** Options for {@link Scene.createDocuments | `Scene.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Scene._preCreateOperation | `Scene._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Scene#_preCreate | `Scene#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link Scene#_onCreate | `Scene#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link Scene.updateDocuments | `Scene.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link Scene._preUpdateOperation | `Scene._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Scene#_preUpdate | `Scene#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link Scene#_onUpdate | `Scene#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link Scene.deleteDocuments | `Scene.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link Scene._preDeleteOperation | `Scene._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Scene#_preDelete | `Scene#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Scene#_onDelete | `Scene#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    interface Dimensions {
      /** The width of the canvas. */
      width: number;

      /** The height of the canvas. */
      height: number;

      /** The grid size. */
      size: number;

      /** The canvas rectangle. */
      rect: Canvas.Rectangle;

      /** The X coordinate of the scene rectangle within the larger canvas. */
      sceneX: number;

      /** The Y coordinate of the scene rectangle within the larger canvas. */
      sceneY: number;

      /** The width of the scene. */
      sceneWidth: number;

      /** The height of the scene. */
      sceneHeight: number;

      /** The scene rectangle. */
      sceneRect: Canvas.Rectangle;

      /** The number of distance units in a single grid space. */
      distance: number;

      /** The factor to convert distance units to pixels */
      distancePixels: number;

      /** The units of distance */
      units: string;

      /** The aspect ratio of the scene rectangle. */
      ratio: number;

      /** The length of the longest line that can be drawn on the canvas. */
      maxR: number;

      /** The number of grid rows on the canvas */
      rows: number;

      /** The number of grid columns on the canvas */
      columns: number;
    }

    interface _ThumbnailCreationData extends ImageHelper.TextureToImageOptions {
      /**
       * A background image to use for thumbnail creation, otherwise the current scene
       * background is used.
       *
       * @remarks This cannot be `null` because Foundry writes `const newImage = img !== undefined;`.
       */
      img: string;

      /**
       * The desired thumbnail width. Default is 300px
       * @defaultValue `300`
       */
      width: number | null;

      /**
       * The desired thumbnail height. Default is 100px;
       * @defaultValue `100`
       */
      height: number | null;

      /**
       * Which image format should be used? image/png, image/jpeg, or image/webp
       * @defaultValue `"image/webp"`
       *
       * @remarks Foundry writes `image/jpg` but this functions the same as `image/png  `.
       * The correct MIME type is `image/jpeg`.
       */
      format: ImageHelper.Format | null;

      /**
       * What compression quality should be used for jpeg or webp, between 0 and 1
       * @defaultValue `0.8`
       */
      quality: number | null;
    }

    interface ThumbnailCreationData extends InexactPartial<_ThumbnailCreationData> {}

    /**
     * @deprecated - {@link Scene.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<Scene> {}

    /**
     * @deprecated {@link Scene.CreateData | `Scene.CreateData`}
     */
    interface ConstructorData extends Scene.CreateData {}

    /**
     * @deprecated {@link Scene.implementation | `Scene.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Scene.Implementation | `Scene.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Scene document which extends the common BaseScene model.
   *
   * @see {@link Scenes}            The world-level collection of Scene documents
   * @see {@link SceneConfig}       The Scene configuration application
   *
   */
  class Scene extends ClientDocumentMixin(foundry.documents.BaseScene) {
    /**
     * @param data    - Initial data from which to construct the `Scene`
     * @param context - Construction context options
     *
     * @deprecated Constructing `Scene` directly is not advised. While `new Scene(...)` would create a
     * temporary document it would not respect a system's subclass of `Scene`, if any.
     *
     * You should use {@link Scene.implementation | `new Scene.implementation(...)`} instead which
     * will give you a system specific implementation of `Scene`.
     */
    constructor(...args: Document.ConstructorParameters<Scene.CreateData, Scene.Parent>);

    /**
     * Track the viewed position of each scene (while in memory only, not persisted)
     * When switching back to a previously viewed scene, we can automatically pan to the previous position.
     * @defaultValue `{}`
     * @remarks This is intentionally public because it is used in Canvas._initializeCanvasPosition() and Canvas.pan()
     */
    _viewPosition: Canvas.ViewPosition;

    /**
     * Track whether the scene is the active view
     */
    protected _view: this["active"];

    /**
     * The grid instance
     */
    grid: foundry.grid.BaseGrid;

    /**
     * Determine the canvas dimensions this Scene would occupy, if rendered
     * @defaultValue `{}`
     */
    dimensions: ReturnType<this["getDimensions"]>;

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this["thumb"];

    /**
     * A convenience accessor for whether the Scene is currently viewed
     */
    get isView(): boolean;

    /**
     * Set this scene as currently active
     * @returns A Promise which resolves to the current scene once it has been successfully activated
     */
    activate(): Promise<this | undefined>;

    /**
     * Set this scene as the current view
     */
    view(): Promise<this | undefined>;

    /**
     * @param createData - (default: `{}`)
     * @param options    - (default: `{}`)
     */
    override clone<Save extends boolean = false>(
      createData?: Scene.CreateData,
      context?: Document.CloneContext<Save> & InexactPartial<Document.ConstructionContext<Scene.Parent>>,
    ): Save extends true ? Promise<this> : this;

    override reset(): void;

    override prepareBaseData(): void;

    /**
     * Get the Canvas dimensions which would be used to display this Scene.
     * Apply padding to enlarge the playable space and round to the nearest 2x grid size to ensure symmetry.
     * The rounding accomplishes that the padding buffer around the map always contains whole grid spaces.
     */
    getDimensions(): SceneDimensions;

    override _onClickDocumentLink(event: MouseEvent): unknown;

    /**
     * @privateRemarks _onCreate, _preUpdate, _onUpdate, _preDelete, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Handle repositioning of placed objects when the Scene dimensions change
     */
    protected _repositionObject(sceneUpdateData: Scene.CreateData): Scene.CreateData;

    /**
     * Handle Scene activation workflow if the active state is changed to true
     * @param active - Is the scene now active?
     */
    protected _onActivate(active: boolean): ReturnType<this["view"]> | ReturnType<Canvas["draw"]>;

    /**
     * @privateRemarks _preCreateDescendantDocuments, _preUpdateDescendantDocuments, _preDeleteDescendantDocuments, and_onUpdateDescendantDocuments are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    override toCompendium<
      FlagsOpt extends boolean = false,
      SourceOpt extends boolean = true,
      SortOpt extends boolean = true,
      FolderOpt extends boolean = false,
      OwnershipOpt extends boolean = false,
      StateOpt extends boolean = true,
      IdOpt extends boolean = false,
    >(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null,
      options?: InexactPartial<
        ClientDocument.CompendiumExportOptions<FlagsOpt, SourceOpt, SortOpt, FolderOpt, OwnershipOpt, StateOpt, IdOpt>
      >,
    ): Omit<
      this["_source"],
      | (IdOpt extends false ? "_id" : never)
      | ClientDocument.OmitProperty<SortOpt, "sort" | "navigation" | "navOrder">
      | ClientDocument.OmitProperty<FolderOpt, "folder">
      | ClientDocument.OmitProperty<FlagsOpt, "flags">
      | ClientDocument.OmitProperty<OwnershipOpt, "ownership">
      | ClientDocument.OmitProperty<StateOpt, "active" | "fogReset" | "playing">
    >;

    /**
     * Create a 300px by 100px thumbnail image for this scene background
     * @param data - (default: `{}`)
     * @returns The created thumbnail data.
     */
    createThumbnail(data?: Scene.ThumbnailCreationData): ReturnType<typeof ImageHelper.createThumbnail>;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(context?: Document.DefaultNameContext<string, Scene.Parent>): string;

    static override createDialog(
      data?: Scene.CreateData,
      context?: Document.CreateDialogContext<string, Scene.Parent>,
    ): Promise<Scene.Implementation | null | undefined>;

    static override fromDropData(
      data: Document.DropData<Scene.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Scene.Implementation | undefined>;

    static override fromImport(
      source: Scene.Source,
      context?: Document.FromImportContext<Scene.Parent>,
    ): Promise<Scene.Implementation>;
  }

  /** @deprecated Use {@link Scene.Dimensions} */
  interface SceneDimensions extends Scene.Dimensions {}
}
