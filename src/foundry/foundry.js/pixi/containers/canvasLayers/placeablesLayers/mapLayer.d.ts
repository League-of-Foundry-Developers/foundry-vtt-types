import { ConfiguredDocumentClassForName, ConfiguredObjectClassForName } from '../../../../../../types/helperTypes';

declare global {
  /**
   * A PlaceablesLayer designed for rendering the visual Scene for a specific vertical cross-section.
   * Each MapLayer contains a single background image as well as an arbitrary number of Tile objects.
   */
  class MapLayer<Options extends MapLayer.LayerOptions = MapLayer.LayerOptions> extends PlaceablesLayer<
    'Tile',
    Options
  > {
    /**
     * @param data - (default: `{}`)
     */
    constructor(data?: MapLayerConstructorData);

    /**
     * The numeric Scene level to which this layer belongs
     */
    level: number;

    /**
     * The background source path
     */
    bgPath: string | undefined;

    /**
     * The layer background image
     */
    bg: PIXI.Sprite | undefined;

    static documentName: 'Tile';

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): BackgroundLayer;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.layerOptions, {
     *   name: 'background',
     *   zIndex: 0,
     *   controllableObjects: true,
     *   rotatableObjects: true
     * })
     * ```
     */
    static get layerOptions(): MapLayer.LayerOptions;

    /**
     * Return the base HTML image or video element which is used to generate the background Sprite.
     */
    get bgSource(): HTMLImageElement | HTMLVideoElement | null;

    get hud(): TileHUD;

    /**
     * Is the background texture used in this layer a video?
     */
    get isVideo(): boolean;

    /**
     * An array of Tile objects which are rendered within the objects container
     */
    get tiles(): InstanceType<ConfiguredObjectClassForName<'Tile'>>[];

    deactivate(): this;

    tearDown(): Promise<this>;

    draw(): Promise<this>;

    /**
     * Draw the background Sprite for the layer, aligning its dimensions with those configured for the canvas.
     * @returns The rendered Sprite, or undefined if no background is present
     */
    _drawBackground(): PIXI.Sprite | undefined;

    _onDragLeftStart(event: PIXI.InteractionEvent): Promise<void>;

    _onDragLeftMove(event: PIXI.InteractionEvent): void;

    _onDragLeftDrop(event: PIXI.InteractionEvent): undefined;

    _onDragLeftCancel(event: PointerEvent): void;

    /**
     * Handle drop events for Tile data on the Tiles Layer
     * @param event - The concluding drag event
     * @param data - The extracted Tile data
     */
    _onDropData(
      event: DragEvent,
      data: Record<string, unknown>
    ): Promise<InstanceType<ConfiguredDocumentClassForName<'Tile'>> | undefined>;

    /**
     * Prepare the data object when a new Tile is dropped onto the canvas
     * @param event - The concluding drag event
     * @param data  - The extracted Tile data
     * @returns The prepared data to create
     */
    _getDropData(
      event: DragEvent,
      data: Record<string, unknown>
    ): Promise<ConstructorParameters<typeof foundry.documents.BaseTile>[0]>;
  }

  namespace MapLayer {
    interface LayerOptions<Name extends string = 'background'> extends PlaceablesLayer.LayerOptions<'Tile'> {
      name: Name;
      zIndex: 0;
      controllableObjects: true;
      rotatableObjects: true;
    }
  }
}

interface MapLayerConstructorData {
  bgPath?: string;
  /**
   * @defaultValue `1`
   */
  level?: number;
}
