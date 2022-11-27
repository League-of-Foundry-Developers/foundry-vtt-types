import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type {
  AmbientLightDataConstructorData,
  AmbientLightDataSource
} from "../../../common/data/data.mjs/ambientLightData";
import type {
  AmbientSoundDataConstructorData,
  AmbientSoundDataSource
} from "../../../common/data/data.mjs/ambientSoundData";
import type { DrawingDataConstructorData, DrawingDataSource } from "../../../common/data/data.mjs/drawingData";
import type {
  MeasuredTemplateDataConstructorData,
  MeasuredTemplateDataSource
} from "../../../common/data/data.mjs/measuredTemplateData";
import type { NoteDataConstructorData, NoteDataSource } from "../../../common/data/data.mjs/noteData";
import type { TileDataConstructorData, TileDataSource } from "../../../common/data/data.mjs/tileData";
import type { TokenDataConstructorData, TokenDataSource } from "../../../common/data/data.mjs/tokenData";
import type { WallDataConstructorData, WallDataSource } from "../../../common/data/data.mjs/wallData";

import type { SceneDataConstructorData } from "../../../common/data/data.mjs/sceneData";

declare global {
  /**
   * The client-side Scene document which extends the common BaseScene abstraction.
   * Each Scene document contains SceneData which defines its data schema.
   *
   * @see {@link data.SceneData}              The Scene data schema
   * @see {@link documents.Scenes}            The world-level collection of Scene documents
   * @see {@link applications.SceneConfig}    The Scene configuration application
   *
   */
  class Scene extends ClientDocumentMixin(foundry.documents.BaseScene) {
    /**
     * @param data - Initial data provided to construct the Scene document
     */
    constructor(
      data: ConstructorParameters<typeof foundry.documents.BaseScene>[0],
      context?: ConstructorParameters<typeof foundry.documents.BaseScene>[1]
    );

    /**
     * Determine the canvas dimensions this Scene would occupy, if rendered
     * @defaultValue `{}`
     */
    dimensions: ReturnType<this["getDimensions"]> | Record<string, never>;

    /**
     * Track whether the scene is the active view
     */
    protected _view: this["data"]["active"];

    /**
     * Track the viewed position of each scene (while in memory only, not persisted)
     * When switching back to a previously viewed scene, we can automatically pan to the previous position.
     * @defaultValue `{}`
     * @remarks This is intentionally public because it is used in Canvas._initializeCanvasPosition() and Canvas.pan()
     */
    _viewPosition: { x: number; y: number; scale: number } | {};

    /**
     * A convenience accessor for whether the Scene is currently active
     */
    get active(): this["data"]["active"];

    /**
     * A convenience accessor for the background image of the Scene
     */
    get img(): this["data"]["img"];

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this["data"]["thumb"];

    /**
     * A convenience accessor for whether the Scene is currently viewed
     */
    get isView(): boolean;

    /**
     * A reference to the JournalEntry document associated with this Scene, or null
     */
    get journal(): InstanceType<ConfiguredDocumentClass<typeof JournalEntry>> | null;

    /**
     * A reference to the Playlist document for this Scene, or null
     */
    get playlist(): InstanceType<ConfiguredDocumentClass<typeof Playlist>> | null;

    /**
     * A reference to the PlaylistSound document which should automatically play for this Scene, if any
     */
    get playlistSound(): InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BasePlaylistSound>> | null;

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
    override clone(
      createData?: DeepPartial<SceneDataConstructorData | (SceneDataConstructorData & Record<string, unknown>)>,
      options?: { save?: boolean; keepId?: boolean }
    ): TemporaryDocument<this> | Promise<TemporaryDocument<this | undefined>>;

    override prepareBaseData(): void;

    /**
     * Get the Canvas dimensions which would be used to display this Scene.
     * Apply padding to enlarge the playable space and round to the nearest 2x grid size to ensure symmetry.
     * The rounding accomplishes that the padding buffer around the map always contains whole grid spaces.
     */
    getDimensions(): SceneDimensions;

    protected override _preCreate(
      data: SceneDataConstructorData,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    protected override _onCreate(
      data: foundry.data.SceneData["_source"],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _preUpdate(
      changed: DeepPartial<SceneDataConstructorData>,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    protected override _onUpdate(
      changed: DeepPartial<foundry.data.SceneData["_source"]> & Record<string, unknown>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _preDelete(
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Handle Scene activation workflow if the active state is changed to true
     * @param active - Is the scene now active?
     */
    protected _onActivate(active: boolean): ReturnType<this["view"]> | ReturnType<Canvas["draw"]> | void;

    override _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: DrawingDataConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: TokenDataConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: AmbientLightDataConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: NoteDataConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: AmbientSoundDataConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: MeasuredTemplateDataConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: TileDataConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: WallDataConstructorData[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof DrawingDocument>>[],
      result: DeepPartial<DrawingDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>[],
      result: DeepPartial<TokenDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientLightDocument>>[],
      result: DeepPartial<AmbientLightDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof NoteDocument>>[],
      result: DeepPartial<NoteDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientSoundDocument>>[],
      result: DeepPartial<AmbientSoundDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof MeasuredTemplateDocument>>[],
      result: DeepPartial<MeasuredTemplateDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TileDocument>>[],
      result: DeepPartial<TileDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof WallDocument>>[],
      result: DeepPartial<WallDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    override _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<DrawingDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<TokenDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<AmbientLightDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<NoteDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<AmbientSoundDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<MeasuredTemplateDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<TileDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<WallDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof DrawingDocument>>[],
      result: DeepPartial<DrawingDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>[],
      result: DeepPartial<TokenDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientLightDocument>>[],
      result: DeepPartial<AmbientLightDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof NoteDocument>>[],
      result: DeepPartial<NoteDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientSoundDocument>>[],
      result: DeepPartial<AmbientSoundDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof MeasuredTemplateDocument>>[],
      result: DeepPartial<MeasuredTemplateDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TileDocument>>[],
      result: DeepPartial<TileDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof WallDocument>>[],
      result: DeepPartial<WallDataSource>[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    override _preDeleteEmbeddedDocuments(
      embeddedName: string,
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof DrawingDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientLightDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof NoteDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof AmbientSoundDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof MeasuredTemplateDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TileDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof WallDocument>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    override toCompendium(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null | undefined,
      options?: ClientDocumentMixin.CompendiumExportOptions | undefined
    ): Omit<foundry.data.SceneData["_source"], "_id" | "folder" | "permission"> & {
      permission?: foundry.data.SceneData extends { toObject(): infer U } ? U : never;
    };

    /**
     * Create a 300px by 100px thumbnail image for this scene background
     * @param data - (default: `{}`)
     * @returns The created thumbnail data.
     */
    createThumbnail(data?: Partial<ThumbnailCreationData>): ReturnType<typeof ImageHelper["createThumbnail"]>;
  }

  interface SceneDimensions {
    /** The width of the canvas. */
    width: number;

    /** The height of the canvas. */
    height: number;

    /** The grid size. */
    size: number;

    /** The canvas rectangle. */
    rect: Rectangle;

    /** The X coordinate of the scene rectangle within the larger canvas. */
    sceneX: number;

    /** The Y coordinate of the scene rectangle within the larger canvas. */
    sceneY: number;

    /** The width of the scene. */
    sceneWidth: number;

    /** The height of the scene. */
    sceneHeight: number;

    /** The scene rectangle. */
    sceneRect: Rectangle;

    /** The number of distance units in a single grid space. */
    distance: number;

    /** The aspect ratio of the scene rectangle. */
    ratio: number;

    /** The length of the longest line that can be drawn on the canvas. */
    maxR: number;
  }
}

interface ThumbnailCreationData extends ImageHelper.TextureToImageOptions {
  /**
   * A background image to use for thumbnail creation, otherwise the current scene
   * background is used.
   */
  img: string;

  /**
   * The desired thumbnail width. Default is 300px
   * @defaultValue `300`
   */
  width: number;

  /**
   * The desired thumbnail height. Default is 100px;
   * @defaultValue `100`
   */
  height: number;
}
