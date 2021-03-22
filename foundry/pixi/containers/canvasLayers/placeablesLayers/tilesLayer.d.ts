/**
 * The Tiles canvas layer which provides a container for {@link Tile} objects which are rendered immediately above the
 * {@link BackgroundLayer} and below the {@link GridLayer}.
 *
 * @see {@link Tile}
 * @see {@link TileHUD}
 */
declare class TilesLayer extends PlaceablesLayer<Tile> {
  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.layerOptions, {
   *   zIndex: 10,
   *   controllableObjects: true,
   *   objectClass: Tile,
   *   rotatableObjects: true,
   *   sheetClass: TileConfig
   * })
   * ```
   */
  static get layerOptions(): PlaceablesLayer.LayerOptions;

  /**
   * Tile objects on this layer utilize the TileHUD
   */
  get hud(): TileHUD;

  /**
   * @override
   */
  deactivate(): void;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftDrop(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftCancel(event: PointerEvent): void;

  /**
   * Handle drop events for Tile data on the Tiles Layer
   * @param event - The concluding drag event
   * @param data  - The extracted Tile data
   */
  protected _onDropTileData(event: DragEvent, data: Tile['data']): Promise<Tile>;
}

declare namespace TilesLayer {
  type DropData = {
    type?: 'Tile';
    img?: string;
    tileSize?: number;
    width?: number;
    height?: number;
  } & Canvas.DropPosition &
    DeepPartial<Tile.Data>;
}
