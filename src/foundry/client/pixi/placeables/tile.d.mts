import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { FixedInstanceType } from "fvtt-types/utils";

declare global {
  namespace Tile {
    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof Tile>;
    type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;

    interface RenderFlags extends PlaceableObject.RenderFlags {
      refreshShape: boolean;

      refreshMesh: boolean;

      refreshFrame: boolean;

      refreshElevation: boolean;

      refreshPerception: boolean;

      refreshVideo: boolean;
    }

    interface RefreshOptions {
      /**
       * Also refresh the perception layer.
       * @defaultValue `false`
       */
      refreshPerception?: boolean | undefined;
    }

    interface PlayOptions {
      /** Should the video loop? */
      loop?: boolean | undefined;
      /** A specific timestamp between 0 and the video duration to begin playback */
      offset?: number | undefined;
      /** Desired volume level of the video's audio channel (if any) */
      volume?: number | undefined;
    }

    interface OcclusionOptions {
      /**
       * Test corners of the hit-box in addition to the token center?
       * @defaultValue `true`
       */
      corners?: boolean | undefined;
    }

    interface AlphaMapOptions {
      /**
       * Keep the Uint8Array of pixel alphas?
       * @defaultValue `false`
       */
      keepPixels?: boolean | undefined;

      /**
       * Keep the pure white RenderTexture?
       * @defaultValue `false`
       */
      keepTexture?: boolean | undefined;
    }
  }

  /**
   * A Tile is an implementation of PlaceableObject which represents a static piece of artwork or prop within the Scene.
   * Tiles are drawn inside the {@link TilesLayer} container.
   *
   * @see {@link TileDocument}
   * @see {@link TilesLayer}
   */
  class Tile extends PlaceableObject<TileDocument.ConfiguredInstance> {
    static override embeddedName: "Tile";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Tile.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshShape", "refreshElevation", "refreshVideo"], alias: true }` */
      refresh: RenderFlag<Tile.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshFrame"] }` */
      refreshState: RenderFlag<Tile.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshMesh", "refreshPerception", "refreshFrame"] }` */
      refreshShape: RenderFlag<Tile.RenderFlags>;

      /** @defaultValue `{}` */
      refreshMesh: RenderFlag<Tile.RenderFlags>;

      /** @defaultValue `{}` */
      refreshFrame: RenderFlag<Tile.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshMesh"] }` */
      refreshElevation: RenderFlag<Tile.RenderFlags>;

      /** @defaultValue `{}` */
      refreshPerception: RenderFlag<Tile.RenderFlags>;

      /** @defaultValue `{}` */
      refreshVideo: RenderFlag<Tile.RenderFlags>;
    };

    /**
     * The Tile border frame
     */
    frame:
      | (PIXI.Container & {
          border: PIXI.Graphics;
          handle: ResizeHandle;
        })
      | undefined;

    /**
     * The primary tile image texture
     * @defaultValue `undefined`
     */
    texture: PIXI.Texture | undefined;

    /**
     * The Tile image sprite
     * @defaultValue `undefined`
     */
    tile: PIXI.Sprite | undefined;

    /**
     * A Tile background which is displayed if no valid image texture is present
     * @defaultValue `undefined`
     */
    bg: PIXI.Graphics | undefined;

    /**
     * A flag which tracks if the Tile is currently playing
     * @defaultValue `false`
     */
    playing: boolean;

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
     * Is this tile a roof?
     */
    get isRoof(): boolean;

    /**
     * Is this tile occluded?
     * @defaultValue `false`
     */
    get occluded(): boolean;

    /**
     * The effective volume at which this Tile should be playing, including the global ambient volume modifier
     */
    get volume(): number;

    /**
     * Debounce assignment of the Tile occluded state to avoid cases like animated token movement which can rapidly
     */
    debounceSetOcclusion(occluded: boolean): void;

    /**
     * Create a preview tile with a background texture instead of an image
     * @param data - Initial data with which to create the preview Tile
     */
    static createPreview(data: foundry.documents.BaseTile.ConstructorData): Tile.ConfiguredInstance;

    protected override _draw(options?: Record<string, unknown>): Promise<void>;

    override clear(): void;

    protected override _destroy(options?: PIXI.IDestroyOptions | boolean): void;

    protected override _applyRenderFlags(flags: Tile.RenderFlags): void;

    /**
     * Refresh the display of the Tile resizing handle.
     * Shift the position of the drag handle from the bottom-right (default) depending on which way we are dragging.
     */
    protected _refreshHandle(b: Canvas.Rectangle): void;

    /**
     * @privateRemarks _onUpdate and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    override activateListeners(): void;

    protected override _canConfigure(user: User, event?: PIXI.FederatedEvent): boolean;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): Promise<unknown>;

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
    protected _onHandleDragDrop(event: PIXI.FederatedEvent): Promise<this>;

    /**
     * Handle cancellation of a drag event for one of the resizing handles
     */
    protected _onHandleDragCancel(event: PIXI.FederatedEvent): void;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "Tile#testOcclusion has been deprecated in favor of PrimaryCanvasObject#testOcclusion"
     */
    testOcclusion(token: Token.ConfiguredInstance, options?: Tile.OcclusionOptions): boolean;

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

    /**
     * @remarks Not used
     */
    controlIcon: null;
  }
}
