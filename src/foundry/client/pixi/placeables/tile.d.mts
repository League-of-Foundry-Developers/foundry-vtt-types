import type { HandleEmptyObject } from "../../../../types/helperTypes.d.mts";
import type { NullishProps } from "../../../../types/utils.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  /**
   * A Tile is an implementation of PlaceableObject which represents a static piece of artwork or prop within the Scene.
   * Tiles are drawn inside the {@link TilesLayer} container.
   *
   * @see {@link TileDocument}
   * @see {@link TilesLayer}
   */
  class Tile<
    ControlOptions extends Tile.ControlOptions = Tile.ControlOptions,
    DestroyOptions extends Tile.DestroyOptions | boolean = Tile.DestroyOptions | boolean,
    DrawOptions extends Tile.DrawOptions = Tile.DrawOptions,
    ReleaseOptions extends Tile.ReleaseOptions = Tile.ReleaseOptions,
  > extends PlaceableObject<
    TileDocument.ConfiguredInstance,
    ControlOptions,
    DestroyOptions,
    DrawOptions,
    ReleaseOptions
  > {
    static override embeddedName: "Tile";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshMesh", "refreshElevation", "refreshVideo"], alias: true }` */
      refresh: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPerception"] }` */
      refreshState: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshRotation", "refreshSize"], alias: true }` */
      refreshTransform: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPerception"] }` */
      refreshPosition: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPerception", "refreshFrame"] }` */
      refreshRotation: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshFrame"] }` */
      refreshSize: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshMesh: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshFrame: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPerception"] }` */
      refreshElevation: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshPerception: RenderFlag<Partial<Tile.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshVideo: RenderFlag<Partial<Tile.RenderFlags>>;

      /**
       * @defaultValue `{ propagate: ["refreshTransform", "refreshMesh", "refreshElevation"] }`
       * @deprecated since v12, until v14
       */
      refreshShape: RenderFlag<Partial<Tile.RenderFlags>>;
    };

    /**
     * The Tile border frame
     */
    frame: PlaceableObject.Frame | undefined;

    /**
     * The primary tile image texture
     */
    texture: PIXI.Texture | undefined;

    /**
     * A Tile background which is displayed if no valid image texture is present
     */
    bg: PIXI.Graphics | undefined;

    /**
     * A reference to the SpriteMesh which displays this Tile in the PrimaryCanvasGroup.
     */
    mesh: PrimarySpriteMesh | undefined;

    /**
     * Get the native aspect ratio of the base texture for the Tile sprite
     */
    get aspectRatio(): number;

    override get bounds(): PIXI.Rectangle;

    /**
     * The HTML source element for the primary Tile texture
     */
    get sourceElement(): HTMLImageElement | HTMLVideoElement | undefined;

    /**
     * Does this Tile depict an animated video texture?
     */
    get isVideo(): boolean;

    /**
     * Is this Tile currently visible on the Canvas?
     */
    get isVisible(): boolean;

    /**
     * Is this tile occluded?
     * @defaultValue `false`
     */
    get occluded(): boolean;

    /**
     * Is the tile video playing?
     */
    get playing(): boolean;

    /**
     * The effective volume at which this Tile should be playing, including the global ambient volume modifier
     */
    get volume(): number;

    protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

    /**
     * Create a preview tile with a background texture instead of an image
     * @param data - Initial data with which to create the preview Tile
     */
    static createPreview(data: foundry.documents.BaseTile.ConstructorData): Tile.ConfiguredInstance;

    protected override _draw(options?: HandleEmptyObject<DrawOptions>): Promise<void>;

    override clear(): void;

    protected override _destroy(options?: DestroyOptions): void;

    protected override _applyRenderFlags(flags: NullishProps<Tile.RenderFlags>): void;

    /**
     * Refresh the position.
     */
    protected _refreshPosition(): void;

    /**
     * Refresh the rotation.
     */
    protected _refreshRotation(): void;

    /**
     * Refresh the size.
     */
    protected _refreshSize(): void;

    /**
     * Refresh the displayed state of the Tile.
     * Updated when the tile interaction state changes, when it is hidden, or when its elevation changes.
     */
    protected _refreshState(): void;

    /**
     * Refresh the appearance of the tile.
     */
    protected _refreshMesh(): void;

    /**
     * Refresh the elevation.
     */
    protected _refreshElevation(): void;

    /**
     * Refresh the border frame that encloses the Tile.
     */
    protected _refreshFrame(): void;

    /**
     * Refresh changes to the video playback state.
     */
    protected _refreshVideo(): void;

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. This method historically has been the source of a large amount of computation from tsc.
     */

    override activateListeners(): void;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): false | undefined;

    protected override _onDragLeftCancel(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouse-over event on a control handle
     * @param event - The mouseover event
     */
    protected _onHandleHoverIn(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouse-out event on a control handle
     * @param event - The mouseout event
     */
    protected _onHandleHoverOut(event: PIXI.FederatedEvent): void;

    /**
     * When we start a drag event - create a preview copy of the Tile for re-positioning
     * @param event - The mousedown event
     */
    protected _onHandleMouseDown(event: PIXI.FederatedEvent): void;

    /**
     * Handle the beginning of a drag event on a resize handle
     * @param event - The mousedown event
     */
    protected _onHandleDragStart(event: PIXI.FederatedEvent): void;

    /**
     * Handle mousemove while dragging a tile scale handler
     * @param event - The mousemove event
     */
    protected _onHandleDragMove(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouseup after dragging a tile scale handler
     * @param event - The mouseup event
     */
    protected _onHandleDragDrop(event: PIXI.FederatedEvent): void;

    /**
     * Handle cancellation of a drag event for one of the resizing handles
     */
    protected _onHandleDragCancel(event: PIXI.FederatedEvent): void;

    /**
     * Is this tile a roof?
     * @deprecated since v12, until v14
     * @remarks "Tile#isRoof has been deprecated without replacement."
     */
    get isRoof(): boolean;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "Tile#testOcclusion has been deprecated in favor of PrimaryCanvasObject#testOcclusion"
     */
    testOcclusion(
      token: Token.ConfiguredInstance,
      options?: NullishProps<{
        /**
         * Test corners of the hit-box in addition to the token center?
         * @defaultValue `true`
         */
        corners: boolean;
      }>,
    ): boolean;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "Tile#containsPixel has been deprecated in favor of PrimaryCanvasObject#containsPixel"
     */
    containsPixel(x: number, y: number): boolean;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "Tile#getPixelAlpha has been deprecated in favor of PrimaryCanvasObject#getPixelAlpha"
     */
    getPixelAlpha(...args: any[]): unknown;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "Tile#_getAlphaBounds has been deprecated in favor of PrimaryCanvasObject#_getAlphaBounds"
     */
    _getAlphaBounds(): unknown;
  }

  namespace Tile {
    type AnyConstructor = typeof AnyTile;

    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof Tile>;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    interface ControlOptions extends PlaceableObject.ControlOptions {}

    interface DestroyOptions extends PlaceableObject.DestroyOptions {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    interface RenderFlags extends PlaceableObject.RenderFlags {
      refreshTransform: boolean;

      refreshPosition: boolean;

      refreshRotation: boolean;

      refreshSize: boolean;

      refreshMesh: boolean;

      refreshFrame: boolean;

      refreshElevation: boolean;

      refreshPerception: boolean;

      refreshVideo: boolean;

      /** @deprecated since v12, until v14 */
      refreshShape: boolean;
    }
  }
}

declare abstract class AnyTile extends Tile {
  constructor(arg0: never, ...args: never[]);
}
