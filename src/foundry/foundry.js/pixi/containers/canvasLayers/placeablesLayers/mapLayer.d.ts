import { ConfiguredDocumentClassForName, ConfiguredObjectClassForName } from '../../../../../../types/helperTypes';

declare global {
  /**
   * A PlaceablesLayer designed for rendering the visual Scene for a specific vertical cross-section.
   * Each MapLayer contains a single background image as well as an arbitrary number of Tile objects.
   */
  class MapLayer<Options extends MapLayer.LayerOptions = MapLayer.LayerOptions<'background'>> extends PlaceablesLayer<
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
     * It returns the BackgroundLayer but ForegroundLayer has been added for subclasses.
     */
    static get instance(): Canvas['background'] | Canvas['foreground'];

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

    /**
     * @override
     * @remarks It returns Promise<this> but is overridden by a subclass in this way.
     */
    draw(): Promise<this | undefined>;

    /**
     * Draw the background Sprite for the layer, aligning its dimensions with those configured for the canvas.
     * @returns The rendered Sprite, or undefined if no background is present
     */
    protected _drawBackground(): PIXI.Sprite | undefined;

    protected _onDragLeftStart(event: PIXI.InteractionEvent): Promise<void>;

    protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

    protected _onDragLeftDrop(event: PIXI.InteractionEvent): void;

    protected _onDragLeftCancel(event: PointerEvent): void;

    /**
     * Handle drop events for Tile data on the Tiles Layer
     * @param event - The concluding drag event
     * @param data - The extracted Tile data
     */
    protected _onDropData(
      event: DragEvent,
      data:
        | { type: 'Tile'; img: string; tileSize?: number; x: number; y: number }
        | ({ type: string } & Partial<Record<string, unknown>>)
    ): Promise<InstanceType<ConfiguredDocumentClassForName<'Tile'>> | undefined>;

    /**
     * Prepare the data object when a new Tile is dropped onto the canvas
     * @param event - The concluding drag event
     * @param data  - The extracted Tile data
     * @returns The prepared data to create
     */
    protected _getDropData(
      event: DragEvent,
      data: MapLayer.DropData
    ): Promise<ConstructorParameters<typeof foundry.documents.BaseTile>[0]>;
  }

  namespace MapLayer {
    interface LayerOptions<Name extends 'background' | 'foreground' = 'background' | 'foreground'>
      extends PlaceablesLayer.LayerOptions<'Tile'> {
      name: Name;
    }

    type DropData =
      | { type: 'Tile'; img: string; tileSize?: number; x: number; y: number }
      | ({ type: string } & Partial<Record<string, unknown>>);
  }
}

interface MapLayerConstructorData {
  bgPath?: string;
  /**
   * @defaultValue `1`
   */
  level?: number;
}
