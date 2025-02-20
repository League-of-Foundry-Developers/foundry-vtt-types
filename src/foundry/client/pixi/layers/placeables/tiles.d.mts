import type { HandleEmptyObject } from "../../../../../utils/index.d.mts";

declare global {
  /**
   * A PlaceablesLayer designed for rendering the visual Scene for a specific vertical cross-section.
   */
  class TilesLayer extends PlaceablesLayer<"Tile"> {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["tiles"];

    static override documentName: "Tile";

    override options: TilesLayer.LayerOptions;

    /**
     * @defaultValue
     * ```js
     * foundry.utils.mergeObject(super.layerOptions, {
     *    name: "tiles",
     *    zIndex: 300,
     *    controllableObjects: true,
     *    rotatableObjects: true,
     * })
     * ```
     */
    static override get layerOptions(): TilesLayer.LayerOptions;

    override get hookName(): string;

    override get hud(): TileHUD;

    /**
     * An array of Tile objects which are rendered within the objects container
     */
    get tiles(): Tile.Object[];

    override controllableObjects(): Generator<Tile.Object>;

    override getSnappedPoint(point: Canvas.Point): Canvas.Point;

    protected override _tearDown(options: HandleEmptyObject<TilesLayer.TearDownOptions>): Promise<void>;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    /**
     * Handle drop events for Tile data on the Tiles Layer
     * @param event - The concluding drag event
     * @param data  - The extracted Tile data
     */
    protected _onDropData(
      event: DragEvent,
      data: TileDocument.CreateData,
    ): Promise<TileDocument.Implementation | false | void>;

    /**
     * Prepare the data object when a new Tile is dropped onto the canvas
     * @param event - The concluding drag event
     * @param data  - The extracted Tile data
     * @returns The prepared data to create
     */
    _getDropData(event: DragEvent, data: TileDocument.CreateData): Promise<TileDocument.CreateData>;

    /**
     * Get an array of overhead Tile objects which are roofs
     * @deprecated since v12 until v14
     * @remarks "TilesLayer#roofs has been deprecated without replacement."
     */
    get roofs(): Tile.Object[];

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "TilesLayer#textureDataMap has moved to TextureLoader.textureBufferDataMap"
     */
    get textureDataMap(): (typeof TextureLoader)["textureBufferDataMap"];

    /**
     * A convenience reference to the tile occlusion mask on the primary canvas group.
     * @deprecated since v11 until v13
     * @remarks "TilesLayer#depthMask is deprecated without replacement. Use canvas.masks.depth instead"
     */
    get depthMask(): CachedContainer;
  }

  namespace TilesLayer {
    type AnyConstructor = typeof AnyTilesLayer;

    interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<Tile.ObjectClass> {
      name: "tiles";
      zIndex: 300;
      controllableObjects: true;
      rotatableObjects: true;
    }

    interface DropData extends Canvas.DropPosition {
      type: "Tile";
      uuid: string;
    }
  }
}

declare abstract class AnyTilesLayer extends TilesLayer {
  constructor(arg0: never, ...args: never[]);
}
