import type DataModel from '../../../common/abstract/data.mjs';
import type { DocumentModificationOptions } from '../../../common/abstract/document.mjs';

type SceneDimensions = {
  /**
   * The width of the canvas.
   */
  width: number;

  /**
   * The height of the canvas.
   */
  height: number;

  /**
   * The grid size.
   */
  size: number;

  /**
   * The canvas rectangle.
   */
  rect: Rectangle;

  /**
   * The X coordinate of the scene rectangle within the larger canvas.
   */
  sceneX: number;

  /**
   * The Y coordinate of the scene rectangle within the larger canvas.
   */
  sceneY: number;

  /**
   * The width of the scene.
   */
  sceneWidth: number;

  /**
   * The height of the scene.
   */
  sceneHeight: number;

  /**
   * The scene rectangle.
   */
  sceneRect: Rectangle;

  /**
   * The number of distance units in a single grid space.
   */
  distance: number;

  /**
   * The aspect ratio of the scene rectangle.
   */
  ratio: number;

  /**
   * The length of the longest line that can be drawn on the canvas.
   */
  maxR: number;
};

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
    dimensions: ReturnType<typeof Canvas.getDimensions> | {};

    /**
     * Track whether the scene is the active view
     */
    protected _view: this['active'];

    /**
     * Track the viewed position of each scene (while in memory only, not persisted)
     * When switching back to a previously viewed scene, we can automatically pan to the previous position.
     * @defaultValue `{}`
     * @remarks This is intentionally public because it is used in Canvas._initializeCanvasPosition() and Canvas.pan()
     */
    _viewPosition: { x: number; y: number; scale: number } | {};

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this['thumb'];

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
    override clone(
      createData?: DeepPartial<
        | DataModel.SchemaToSourceInput<this['schema']>
        | (DataModel.SchemaToSourceInput<this['schema']> & Record<string, unknown>)
      >,
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
      data: DataModel.SchemaToSourceInput<this['schema']>,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    protected override _onCreate(data: this['_source'], options: DocumentModificationOptions, userId: string): void;

    protected override _preUpdate(
      changed: DeepPartial<DataModel.SchemaToSourceInput<this['schema']>>,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    protected override _onUpdate(
      changed: DeepPartial<this['_source']>,
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
    protected _onActivate(active: boolean): ReturnType<this['view']> | ReturnType<Canvas['draw']> | void;

    override _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: DataModel.SchemaToSourceInput<foundry.documents.BaseDrawing['schema']>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: DataModel.SchemaToSourceInput<foundry.documents.BaseToken['schema']>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: DataModel.SchemaToSourceInput<foundry.documents.BaseAmbientLight['schema']>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: DataModel.SchemaToSourceInput<foundry.documents.BaseNote['schema']>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: DataModel.SchemaToSourceInput<foundry.documents.BaseAmbientSound['schema']>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: DataModel.SchemaToSourceInput<foundry.documents.BaseMeasuredTemplate['schema']>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: DataModel.SchemaToSourceInput<foundry.documents.BaseTile['schema']>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
    _preCreateEmbeddedDocuments(
      embeddedName: string,
      result: DataModel.SchemaToSourceInput<foundry.documents.BaseWall['schema']>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDrawingDocument>[],
      result: DeepPartial<foundry.documents.BaseDrawing['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredTokenDocument>[],
      result: DeepPartial<foundry.documents.BaseToken['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredAmbientLightDocument>[],
      result: DeepPartial<foundry.documents.BaseAmbientLight['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredNoteDocument>[],
      result: DeepPartial<foundry.documents.BaseNote['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredAmbientSoundDocument>[],
      result: DeepPartial<foundry.documents.BaseAmbientSound['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredMeasuredTemplateDocument>[],
      result: DeepPartial<foundry.documents.BaseMeasuredTemplate['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredTileDocument>[],
      result: DeepPartial<foundry.documents.BaseTile['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredWallDocument>[],
      result: DeepPartial<foundry.documents.BaseWall['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    override _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<foundry.documents.BaseDrawing['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<foundry.documents.BaseToken['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<foundry.documents.BaseAmbientLight['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<foundry.documents.BaseNote['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<foundry.documents.BaseAmbientSound['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<foundry.documents.BaseMeasuredTemplate['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<foundry.documents.BaseTile['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _preUpdateEmbeddedDocuments(
      embeddedName: string,
      result: DeepPartial<foundry.documents.BaseWall['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDrawingDocument>[],
      result: DeepPartial<foundry.documents.BaseDrawing['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredTokenDocument>[],
      result: DeepPartial<foundry.documents.BaseToken['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredAmbientLightDocument>[],
      result: DeepPartial<foundry.documents.BaseAmbientLight['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredNoteDocument>[],
      result: DeepPartial<foundry.documents.BaseNote['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredAmbientSoundDocument>[],
      result: DeepPartial<foundry.documents.BaseAmbientSound['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredMeasuredTemplateDocument>[],
      result: DeepPartial<foundry.documents.BaseMeasuredTemplate['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredTileDocument>[],
      result: DeepPartial<foundry.documents.BaseTile['_source']>[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredWallDocument>[],
      result: DeepPartial<foundry.documents.BaseWall['_source']>[],
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
      documents: InstanceType<ConfiguredDrawingDocument>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredTokenDocument>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredAmbientLightDocument>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredNoteDocument>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredAmbientSoundDocument>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredMeasuredTemplateDocument>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredTileDocument>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;
    _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredWallDocument>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    override toCompendium(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null | undefined,
      options?: ClientDocumentMixin.CompendiumExportOptions | undefined
    ): Omit<foundry.documents.BaseScene['_source'], '_id' | 'folder' | 'permission'> & {
      ownership?: foundry.documents.BaseScene['_source'] extends { toObject(): infer U } ? U : never;
    };

    /**
     * Create a 300px by 100px thumbnail image for this scene background
     * @param data - (default: `{}`)
     * @returns The created thumbnail data.
     */
    createThumbnail(data?: Partial<ThumbnailCreationData>): ReturnType<typeof ImageHelper['createThumbnail']>;
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
