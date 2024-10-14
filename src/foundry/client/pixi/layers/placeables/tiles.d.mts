import type { DropData } from "../../../data/abstract/client-document.d.mts";

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
     *    zIndex: 0,
     *    controllableObjects: true,
     *    rotatableObjects: true,
     *    elevationSorting: true
     * })
     * ```
     */
    static override get layerOptions(): TilesLayer.LayerOptions;

    override get hookName(): string;

    override get hud(): TileHUD;

    /**
     * An array of Tile objects which are rendered within the objects container
     */
    get tiles(): Tile[];

    /**
     * Get an array of overhead Tile objects which are roofs
     */
    get roofs(): Tile[];

    /**
     * Determine whether to display roofs
     */
    get displayRoofs(): boolean;

    /**
     * A convenience reference to the tile occlusion mask on the primary canvas group.
     */
    get depthMask(): CachedContainer;

    override controllableObjects(): Generator<Tile>;

    override _activate(): void;

    override _deactivate(): void;

    /**
     * Activate a sublayer of the tiles layer, which controls interactivity of placeables and release controlled objects.
     * @param foreground - Which sublayer need to be activated? Foreground or background?
     *                     (default: `false`)
     */
    protected _activateSubLayer(foreground?: boolean): void;

    _tearDown(options?: Record<string, unknown>): Promise<void>;

    protected _onDragLeftStart(event: PIXI.FederatedEvent): Promise<unknown>;

    protected _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected _onDragLeftDrop(event: PIXI.FederatedEvent): Promise<void>;

    protected _onDragLeftCancel(event: PointerEvent): void;

    /**
     * Handle drop events for Tile data on the Tiles Layer
     * @param event - The concluding drag event
     * @param data  - The extracted Tile data
     */
    protected _onDropData(event: DragEvent, data: DropData.Any): Promise<void>;

    /**
     * Prepare the data object when a new Tile is dropped onto the canvas
     * @param event - The concluding drag event
     * @param data  - The extracted Tile data
     * @returns The prepared data to create
     */
    _getDropData(event: DragEvent, data: TilesLayer.DropData): Promise<DropData.Any>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "TilesLayer#textureDataMap has moved to TextureLoader.textureBufferDataMap"
     */
    get textureDataMap(): (typeof TextureLoader)["textureBufferDataMap"];
  }

  namespace TilesLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Tile"> {
      name: "tiles";
      zIndex: 0;
      controllableObjects: true;
      rotatableObjects: true;
      elevationSorting: true;
    }

    interface DropData extends Canvas.DropPosition {
      type: "Tile";
      uuid: string;
    }
  }
}
