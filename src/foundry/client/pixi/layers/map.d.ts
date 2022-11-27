import {
  ConfiguredDocumentClassForName,
  ConfiguredObjectClassForName,
  DataSourceForPlaceable
} from "../../../../types/helperTypes";

declare global {
  /**
   * A PlaceablesLayer designed for rendering the visual Scene for a specific vertical cross-section.
   * Each MapLayer contains a single background image as well as an arbitrary number of Tile objects.
   */
  class MapLayer<Options extends MapLayer.LayerOptions = MapLayer.LayerOptions<"background">> extends PlaceablesLayer<
    "Tile",
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

    static documentName: "Tile";

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     * It returns the BackgroundLayer but ForegroundLayer has been added for subclasses.
     */
    // @ts-expect-error FIXME: MapLayer does not exist anymore, should be removed.
    static get instance(): Canvas["background"] | Canvas["foreground"];

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.layerOptions, {
     *   name: "background",
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
    get tiles(): InstanceType<ConfiguredObjectClassForName<"Tile">>[];

    deactivate(): this;

    tearDown(): Promise<this>;

    /**
     * @remarks It returns Promise<this> but is overridden by a subclass in this way.
     */
    override draw(): Promise<this | undefined>;

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
        | { type: "Tile"; img: string; tileSize?: number; x: number; y: number }
        | ({ type: string } & Partial<Record<string, unknown>>)
    ): Promise<InstanceType<ConfiguredDocumentClassForName<"Tile">> | undefined>;

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
    interface LayerOptions<Name extends "background" | "foreground" = "background" | "foreground">
      extends PlaceablesLayer.LayerOptions<"Tile"> {
      name: Name;
    }

    type DropData =
      | { type: "Tile"; img: string; tileSize?: number; x: number; y: number }
      | ({ type: string } & Partial<Record<string, unknown>>);
  }

  /**
   * An extension of the MapLayer that displays underfoot in the background of the Scene.
   */
  class BackgroundLayer extends MapLayer {
    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    // @ts-expect-error FIXME: BackgroundLayer does not exist anymore, should be removed.
    static get instance(): Canvas["background"];

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get layerOptions(): MapLayer.LayerOptions<"background">;

    /**
     * The outline of the scene.
     * Not rendered within the BackgroundLayer, but rather beneath it so it does not impact the PrimaryMesh texture.
     */
    outline: PIXI.Graphics | undefined;

    /**
     * Draw a background outline which emphasizes what portion of the canvas is playable space and what is buffer.
     * @param outline - The outline graphics to use
     */
    drawOutline(outline: PIXI.Graphics): void;

    getDocuments(): Exclude<this["documentCollection"], null> | InstanceType<ConfiguredDocumentClassForName<"Tile">>[];

    getZIndex(): number;

    storeHistory(
      type: PlaceablesLayer.HistoryEventType,
      data: DataSourceForPlaceable<InstanceType<ConfiguredObjectClassForName<"Tile">>>
    ): void;
  }

  /**
   * An extension of the MapLayer that displays overhead in the foreground of the Scene.
   */
  class ForegroundLayer extends MapLayer<MapLayer.LayerOptions<"foreground">> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.layerOptions, {
     *   name: "foreground"
     * })
     * ```
     */
    static get layerOptions(): MapLayer.LayerOptions<"foreground">;

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    // @ts-expect-error FIXME: ForegroundLayer does not exist anymore, should be removed.
    static get instance(): Canvas["foreground"];

    /**
     * Get an array of overhead Tile objects which are roofs
     */
    get roofs(): InstanceType<ConfiguredObjectClassForName<"Tile">>[];

    /**
     * Determine whether to display roofs
     */
    get displayRoofs(): boolean;

    draw(): Promise<undefined>;

    /**
     * Draw the container used to cache the position of Token occlusion shapes to a RenderTexture
     */
    protected _drawOcclusionMask(): CachedContainer;

    /**
     * Perform one-time initialization actions which affect the foreground layer.
     * These actions presume and require that the layer has already been drawn.
     */
    initialize(): void;

    override activate(): this;

    deactivate(): this;

    tearDown(): Promise<this>;

    getZIndex(): number;

    getDocuments(): Exclude<this["documentCollection"], null> | InstanceType<ConfiguredDocumentClassForName<"Tile">>[];

    /**
     * Refresh the display of tiles on the Foreground Layer depending on Token occlusion.
     */
    refresh(): void;

    /**
     * Add a roof sprite to the occlusion roof mask container
     * @param tile - The roof tile being added
     */
    addRoofSprite(tile: InstanceType<ConfiguredObjectClassForName<"Tile">>): void;

    /**
     * Remove a roof sprite from occlusion roof mask container
     * @param tile - The roof tile being removed
     */
    removeRoofSprite(tile: InstanceType<ConfiguredObjectClassForName<"Tile">>): void;

    /**
     * Update occlusion for all tiles on the foreground layer
     */
    updateOcclusion(): void;

    /**
     * Draw the container which caches token-based occlusion shapes
     * @param tokens - The set of currently observed tokens
     */
    protected _drawOcclusionShapes(tokens: ConfiguredObjectClassForName<"Token">[]): void;

    protected _getDropData(
      event: DragEvent,
      data:
        | { type: "Tile"; img: string; tileSize?: number; x: number; y: number }
        | ({ type: string } & Partial<Record<string, unknown>>)
    ): Promise<ConstructorParameters<typeof foundry.documents.BaseTile>[0]>;
  }
}

interface MapLayerConstructorData {
  bgPath?: string;
  /**
   * @defaultValue `1`
   */
  level?: number;
}
