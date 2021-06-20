import { BaseTile } from '../../../../common/documents.mjs';

declare global {
  /**
   * A Tile is an implementation of PlaceableObject which represents a static piece of artwork or prop within the Scene.
   * Tiles are drawn above the {@link BackroundLayer} but below the {@link TokenLayer}.
   *
   * @example
   * ```typescript
   * Tile.create<Tile>({
   *   img: "path/to/tile-artwork.png",
   *   width: 300,
   *   height: 300,
   *   scale: 1,
   *   x: 1000,
   *   y: 1000,
   *   z: 370,
   *   rotation: 45,
   *   hidden: false,
   *   locked: true
   * });
   * ```
   *
   * @see {@link TilesLayer}
   * @see {@link TileSheet}
   * @see {@link TileHUD}
   */
  class Tile extends PlaceableObject<BaseTile> {
    /**
     * @remarks Not used for `Tile`
     */
    controlIcon: null;

    /**
     * The Tile border frame
     */
    frame: PIXI.Container | null;

    /**
     * The Tile image container
     */
    tile: PIXI.Container | null;

    /**
     * The primary tile image texture
     */
    texture: PIXI.Texture | null;

    /** @override */
    static get embeddedName(): 'Tile';

    /**
     * Apply initial sanitizations to the provided input data to ensure that a Tile has valid required attributes.
     */
    protected _cleanData(): void;

    /**
     * @remarks
     * Not implemented by Tile
     */
    get bounds(): never;

    /**
     * Get the native aspect ratio of the base texture for the Tile sprite
     */
    get aspectRatio(): number;

    /** @override */
    draw(): Promise<this>;

    /** @override */
    refresh(): this;

    /**
     * Refresh the display of the Tile border
     */
    protected _refreshBorder(b: Rectangle): void;

    /**
     * Refresh the display of the Tile resizing handle
     */
    protected _refreshHandle(b: Rectangle): void;

    /** @override */
    activateListeners(): void;

    /** @override */
    protected _onUpdate(data: Tile.Data): void;

    /** @override */
    protected _canHUD(user?: User, event?: any): boolean;

    /** @override */
    protected _canConfigure(user: User, event?: any): boolean;

    /** @override */
    protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftDrop(event: PIXI.InteractionEvent): Promise<false | this | BaseTile[]>;

    /** @override */
    protected _onDragLeftCancel(event: MouseEvent): void;

    /**
     * Handle mouse-over event on a control handle
     * @param event - The mouseover event
     */
    protected _onHandleHoverIn(event: PIXI.InteractionEvent): void;

    /**
     * Handle mouse-out event on a control handle
     * @param event - The mouseout event
     */
    protected _onHandleHoverOut(event: PIXI.InteractionEvent): void;

    /**
     * When we start a drag event - create a preview copy of the Tile for re-positioning
     * @param event - The mousedown event
     */
    protected _onHandleMouseDown(event: PIXI.InteractionEvent): void;

    /**
     * Handle the beginning of a drag event on a resize handle
     */
    protected _onHandleDragStart(event: PIXI.InteractionEvent): void;

    /**
     * Handle mousemove while dragging a tile scale handler
     * @param event - The mousemove event
     */
    protected _onHandleDragMove(event: PIXI.InteractionEvent): void;

    /**
     * Handle mouseup after dragging a tile scale handler
     * @param event - The mouseup event
     */
    protected _onHandleDragDrop(event: PIXI.InteractionEvent): Promise<this>;

    /**
     * Handle cancellation of a drag event for one of the resizing handles
     */
    protected _onHandleDragCancel(event: PIXI.InteractionEvent): void;

    /**
     * Create a preview tile with a background texture instead of an image
     */
    static createPreview(data: Tile.Data): Tile;
  }

  namespace Tile {
    interface Data {
      height: number;
      hidden: boolean;
      img: string;
      locked: boolean;
      rotation: number;
      scale: number;
      width: number;
      x: number;
      y: number;
      z: number;
    }
  }
}
