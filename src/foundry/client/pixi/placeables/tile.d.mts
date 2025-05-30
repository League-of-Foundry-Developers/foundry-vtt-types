import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { FixedInstanceType, HandleEmptyObject } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      Tile: Tile.Implementation;
    }
  }
}

declare global {
  /**
   * A Tile is an implementation of PlaceableObject which represents a static piece of artwork or prop within the Scene.
   * Tiles are drawn inside the {@linkcode TilesLayer} container.
   *
   * @see {@linkcode TileDocument}
   * @see {@linkcode TilesLayer}
   */
  class Tile extends PlaceableObject<TileDocument.Implementation> {
    static override embeddedName: "Tile";

    static override RENDER_FLAGS: Tile.RENDER_FLAGS;

    // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
    // `RENDER_FLAGS` and so it has to be adjusted here.
    renderFlags: RenderFlags<Tile.RENDER_FLAGS>;

    // fake override; super has to type as if this could be a ControlIcon, but Tiles don't use one
    override controlIcon: null;

    /**
     * The Tile border frame
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw
     */
    frame: Tile.FrameContainer | undefined;

    /**
     * The primary tile image texture
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw or after {@link Tile._destroy | `Tile#_destroy`} is called
     *
     * Thereafter, `null` if no valid `texture.src` exists on this Tile's document (or the original Tile's, if this is a preview clone)
     */
    texture: PIXI.Texture | null | undefined;

    /**
     * A Tile background which is displayed if no valid image texture is present
     * @defaultValue `undefined`
     */
    bg: PIXI.Graphics | undefined;

    /**
     * A reference to the SpriteMesh which displays this Tile in the PrimaryCanvasGroup.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw.
     *
     * Thereafter, `null` if no valid `texture.src` exists on this Tile's document (or the original Tile's, if this is a preview clone)
     */
    mesh: PrimarySpriteMesh | null | undefined;

    /**
     * Get the native aspect ratio of the base texture for the Tile sprite
     */
    get aspectRatio(): number;

    override get bounds(): PIXI.Rectangle;

    /**
     * The HTML source element for the primary Tile texture
     * @privateRemarks Foundry types this as `HTMLImageElement | HTMLVideoElement`, but this just
     * returns `this.texture?.baseTexture.resource.source`, which could be any of `PIXI.ImageSource`,
     * and returns `ImageBitmap`, not `HTMLImageElement`, for static images.
     */
    get sourceElement(): PIXI.ImageSource | undefined;

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
    static createPreview(data: TileDocument.CreateData): Tile.Implementation;

    protected override _draw(options: HandleEmptyObject<Tile.DrawOptions>): Promise<void>;

    override clear(): void;

    protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

    protected override _applyRenderFlags(flags: Tile.RenderFlags): void;

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

    // _onUpdate is overridden but with no signature changes.
    // For type simplicity it is left off. This method historically has been the source of a large amount of computation from tsc.

    override activateListeners(): void;

    // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
    // options: not null (destructured)
    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): void;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): void;

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

    // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
    protected override _prepareDragLeftDropUpdates(event: PIXI.FederatedEvent): PlaceableObject.DragLeftDropUpdate[];

    /**
     * Is this tile a roof?
     * @deprecated since v12, until v14
     * @remarks "`Tile#isRoof `has been deprecated without replacement."
     */
    get isRoof(): boolean;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "`Tile#testOcclusion` has been deprecated in favor of {@link PrimaryOccludableObjectMixin.AnyMixed.testOcclusion | `PrimaryOccludableObject#testOcclusion`}"
     *
     * The runtime deprecation warning erroneously points to `PrimaryCanvasObject#testOcclusion`
     */
    // options: not null (destructured where forwarded)
    testOcclusion(token: Token.Implementation, options?: PrimaryOccludableObjectMixin.TestOcclusionOptions): boolean;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "Tile#containsPixel has been deprecated in favor of {@link PrimaryOccludableObjectMixin.AnyMixed.containsPixel | `PrimaryOccludableObject#containsPixel`}"
     *
     * The runtime deprecation warning erroneously points to `PrimaryCanvasObject#containsPixel`
     */
    containsPixel(x: number, y: number, alphaThreshold?: number): boolean;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "`Tile#getPixelAlpha` has been deprecated in favor of {@link PrimarySpriteMesh.getPixelAlpha | `PrimarySpriteMesh#getPixelAlpha`}"
     *
     * The runtime deprecation warning erroneously points to `PrimaryCanvasObject#getPixelAlpha`
     */
    getPixelAlpha(x: number, y: number): number;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "`Tile#_getAlphaBounds` has been deprecated in favor of {@link PrimarySpriteMesh._getAlphaBounds | `PrimarySpriteMesh#_getAlphaBounds`}"
     *
     * The runtime deprecation warning doesn't point anywhere, despite forwarding the call (to `mesh?._getAlphaBounds`, thus the `| undefined`).
     */
    _getAlphaBounds(): PIXI.Rectangle | undefined;
  }

  namespace Tile {
    /**
     * The implementation of the `Tile` placeable configured through `CONFIG.Tile.objectClass`
     * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
     *
     * Not to be confused with {@linkcode TileDocument.Implementation}
     * which refers to the implementation for the Tile document.
     */
    type Implementation = FixedInstanceType<ImplementationClass>;

    /**
     * The implementation of the `Tile` placeable configured through `CONFIG.Tile.objectClass`
     * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
     *
     * Not to be confused with {@linkcode TileDocument.ImplementationClass}
     * which refers to the implementation for the Tile document.
     */
    // eslint-disable-next-line no-restricted-syntax
    type ImplementationClass = ConfiguredObjectClassOrDefault<typeof Tile>;

    interface RENDER_FLAGS {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<this, "redraw">;

      /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshMesh", "refreshElevation", "refreshVideo"], alias: true }` */
      refresh: RenderFlag<this, "refresh">;

      /** @defaultValue `{ propagate: ["refreshPerception"] }` */
      refreshState: RenderFlag<this, "refreshState">;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshRotation", "refreshSize"], alias: true }` */
      refreshTransform: RenderFlag<this, "refreshTransform">;

      /** @defaultValue `{ propagate: ["refreshPerception"] }` */
      refreshPosition: RenderFlag<this, "refreshPosition">;

      /** @defaultValue `{ propagate: ["refreshPerception", "refreshFrame"] }` */
      refreshRotation: RenderFlag<this, "refreshRotation">;

      /** @defaultValue `{}` */
      refreshMesh: RenderFlag<this, "refreshMesh">;

      /** @defaultValue `{}` */
      refreshFrame: RenderFlag<this, "refreshFrame">;

      /** @defaultValue `{ propagate: ["refreshPerception"] }` */
      refreshElevation: RenderFlag<this, "refreshElevation">;

      /** @defaultValue `{}` */
      refreshPerception: RenderFlag<this, "refreshPerception">;

      /** @defaultValue `{}` */
      refreshVideo: RenderFlag<this, "refreshVideo">;

      /**
       * @defaultValue
       * ```js
       * {
       *   propagate: ["refreshTransform", "refreshMesh", "refreshElevation"],
       *   deprecated: { since: 12, until: 14, alias: true }
       * }
       * ```
       * @deprecated since v12, until v14
       * @remarks The `alias: true` should be a sibling of `deprecated`, not a child, this is a Foundry bug in 12.331
       */
      refreshShape: RenderFlag<this, "refreshShape">;
    }

    interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

    interface FrameContainer extends PIXI.Container {
      bounds: PIXI.Rectangle;
      interaction: PIXI.Container;
      border: PIXI.Graphics;
      handle: ResizeHandle;
    }

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface RefreshOptions extends PlaceableObject.RefreshOptions {}

    interface ControlOptions extends PlaceableObject.ControlOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}
  }
}
