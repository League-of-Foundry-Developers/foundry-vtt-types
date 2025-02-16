import type { HandleEmptyObject } from "fvtt-types/utils";

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

    override get hookName(): "TilesLayer";

    override get hud(): NonNullable<Canvas["hud"]>["tile"];

    /**
     * An array of Tile objects which are rendered within the objects container
     */
    get tiles(): Tile.ConfiguredInstance[];

    /**
     * @remarks Only produces foreground or non-forground tiles, depending on the state
     * of the foregound layer toggle control
     */
    override controllableObjects(): Generator<Tile.ConfiguredInstance>;

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
     * @remarks Foundry marked `@private`
     */
    protected _onDropData(
      event: DragEvent,
      data: TilesLayer.DropData,
    ): Promise<TileDocument.ConfiguredInstance | false | void>;

    /**
     * Prepare the data object when a new Tile is dropped onto the canvas
     * @param event - The concluding drag event
     * @param data  - The extracted Tile data
     * @returns The prepared data to create
     */
    protected _getDropData(
      event: DragEvent,
      data: TilesLayer.DropData,
    ): Promise<foundry.documents.BaseTile.ConstructorData>;

    /**
     * Get an array of overhead Tile objects which are roofs
     * @deprecated since v12 until v14
     * @remarks "TilesLayer#roofs has been deprecated without replacement."
     */
    get roofs(): Tile.ConfiguredInstance[];

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "TilesLayer#textureDataMap has moved to TextureLoader.textureBufferDataMap"
     */
    get textureDataMap(): Map<unknown, unknown>;

    /**
     * A convenience reference to the tile occlusion mask on the primary canvas group.
     * @deprecated since v11 until v13
     * @remarks "TilesLayer#depthMask is deprecated without replacement. Use canvas.masks.depth instead"
     */
    get depthMask(): CanvasDepthMask.Any;
  }

  namespace TilesLayer {
    interface Any extends AnyTilesLayer {}
    type AnyConstructor = typeof AnyTilesLayer;

    interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Tile"> {
      name: "tiles";
      zIndex: 300;
      controllableObjects: true;
      rotatableObjects: true;
    }

    /** @internal  */
    type _DropData = Required<Pick<TileDocument.ConstructorData, "elevation" | "height" | "width" | "sort">>;

    interface DropData extends Canvas.DropPosition, _DropData {
      type: "Tile";
      fromFilePicker: boolean;
      tileSize: number;
      texture: { src: string };
      occlusion: { mode: foundry.CONST.OCCLUSION_MODES };
    }
  }
}

declare abstract class AnyTilesLayer extends TilesLayer {
  constructor(arg0: never, ...args: never[]);
}
