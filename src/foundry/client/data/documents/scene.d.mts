import type { InexactPartial } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";
import type BaseScene from "../../../common/documents/scene.d.mts";

declare global {
  namespace Scene {
    type Metadata = Document.MetadataFor<Scene>;

    type ConfiguredClass = Document.ConfiguredClassForName<"Scene">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Scene">;

    /* eslint-disable @typescript-eslint/no-empty-object-type */
    export interface DatabaseOperations
      extends Document.Database.Operations<
        Scene,
        {},
        { thumb: (string | null)[]; autoReposition: boolean; animateDarkness: number },
        {}
      > {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */

    // Helpful aliases
    type ConstructorData = BaseScene.ConstructorData;
    type UpdateData = BaseScene.UpdateData;
    type Schema = BaseScene.Schema;
    type Source = BaseScene.Source;
  }

  /**
   * The client-side Scene document which extends the common BaseScene model.
   *
   * @see {@link Scenes}            The world-level collection of Scene documents
   * @see {@link SceneConfig}       The Scene configuration application
   *
   */
  class Scene extends ClientDocumentMixin(foundry.documents.BaseScene) {
    static override metadata: Scene.Metadata;

    static get implementation(): Scene.ConfiguredClass;

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
      createData?: foundry.documents.BaseScene.ConstructorData,
      context?: InexactPartial<
        {
          /**
           * Save the clone to the World database?
           * @defaultValue `false`
           */
          save: Save;

          /**
           * Keep the same ID of the original document
           * @defaultValue `false`
           */
          keepId: boolean;
        } & Document.ConstructionContext<this["parent"]>
      >,
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
    protected _repositionObject(
      sceneUpdateData: foundry.documents.BaseScene.ConstructorData,
    ): foundry.documents.BaseScene.ConstructorData;

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
    createThumbnail(data?: ThumbnailCreationData): ReturnType<typeof ImageHelper.createThumbnail>;
  }

  interface SceneDimensions {
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
