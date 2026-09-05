import type { DeepReadonly, FixedInstanceType, HandleEmptyObject, InexactPartial } from "#utils";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import ShapeObjectMixin from "#client/canvas/placeables/mixins/shapes.mjs";
import type { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.d.mts";
import type { RegionGeometry } from "#client/canvas/placeables/regions/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PolygonTree } from "#client/data/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.d.mts";
import type { BaseGrid } from "#common/grid/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      Region: Region.Implementation;
    }
  }
}

/**
 * A Region is an implementation of PlaceableObject which represents a Region document
 * within a viewed Scene on the game canvas.
 * @see {@linkcode RegionDocument}
 * @see {@linkcode RegionLayer}
 */
declare class Region extends ShapeObjectMixin(PlaceableObject<RegionDocument.Implementation>) {
  // fake type override
  static override get implementation(): Region.ImplementationClass;

  // fake override; super has to type as if this could be a ControlIcon, but Regions don't use one
  override controlIcon: null;

  static override embeddedName: "Region";

  static override RENDER_FLAGS: Region.RENDER_FLAGS;

  // fake type override
  renderFlags: RenderFlags<Region.RENDER_FLAGS>;

  /**
   * The geometry of this Region.
   *
   * The value of this property must not be mutated.
   */
  get geometry(): RegionGeometry;

  override get bounds(): PIXI.Rectangle;

  override get center(): PIXI.Point;

  override get isVisible(): boolean;

  override get isInteractable(): boolean;

  /**
   * The animation state of this Region.
   */
  get animationState(): DeepReadonly<Region.AnimationState>;

  /**
   * Is this Region currently animating?
   */
  get isAnimating(): boolean;

  /**
   * @remarks
   * @throws "`Region#getSnappedPosition` is not supported: `RegionDocument` does not have a (x, y) position"
   */
  override getSnappedPosition(position?: never): never;

  override _pasteObject(offset: Canvas.Point, options?: PlaceableObject.PasteObjectOptions): Region.PasteObjectData;

  // fake type override
  override draw(options?: HandleEmptyObject<Region.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<Region.DrawOptions>): Promise<void>;

  /**
   * Re-draw the shape controls.
   * @internal
   */
  _redrawShapeControls(): void;

  protected override _clear(): void;

  protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

  protected override _getMeasuredShapes(): BaseShapeData[];

  protected override _applyRenderFlags(flags: Region.RenderFlags): void;

  protected override _refreshVisibility(): void;

  protected override _refreshState(): void;

  /**
   * Refresh the shapes of the Region.
   */
  protected _refreshShapes(): void;

  /**
   * Refresh the geometry of the Region.
   */
  protected _refreshGeometry(): void;

  /** Refresh the border of the Region. */
  protected _refreshBorder(): void;

  /**
   * Get the grid space offsets that are covered by this Region.
   */
  protected _getCoveredGridSpaceOffsets(): BaseGrid.Offset2D[];

  /**
   * Update the animation state of this Region based on the animation state.
   * @internal
   */
  _onTokenAnimationFrame(): void;

  /**
   * Called when the animation state of the Region has changed.
   */
  protected _onAnimationStateChange(): void;

  protected override _canHUD(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  /**
   * @remarks Throws when {@linkcode Region.HoverInOptions.updateLegend | options.updateLegend} is truthy: the
   * override still calls `this.layer.legend`, but `RegionLegend` was removed in v14 and
   * {@linkcode foundry.canvas.layers.RegionLayer | RegionLayer} no longer defines a `legend` getter.
   */
  protected override _onHoverIn(event: Canvas.Event.Pointer | Event, options?: Region.HoverInOptions): boolean | void;

  /** @remarks See {@linkcode Region._onHoverIn | Region#_onHoverIn}. */
  protected override _onHoverOut(event?: Canvas.Event.Pointer | Event, options?: Region.HoverOutOptions): void;

  protected override _onControl(options: Region.ControlOptions): void;

  protected override _onRelease(options: HandleEmptyObject<Region.ReleaseOptions>): void;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  protected override _updateDragPreviews(event: Canvas.Event.Pointer): void;

  protected override _onUpdate(
    changed: RegionDocument.UpdateData,
    options: RegionDocument.Database.OnUpdateOptions,
    userId: string,
  ): void;

  /**
   * The scaling factor used for Clipper paths.
   * @defaultValue `100`
   * @deprecated "`Region.CLIPPER_SCALING_FACTOR` has been deprecated in favor of {@linkcode CONST.CLIPPER_SCALING_FACTOR}."
   * (since v13, until v15)
   */
  static get CLIPPER_SCALING_FACTOR(): number;

  /**
   * The three movement segment types: ENTER, MOVE, and EXIT.
   * @deprecated "`Region.MOVEMENT_SEGMENT_TYPES` has been deprecated in favor of {@linkcode CONST.REGION_MOVEMENT_SEGMENTS}."
   * (since v13, until v15)
   */
  static get MOVEMENT_SEGMENT_TYPES(): typeof CONST.REGION_MOVEMENT_SEGMENTS;

  /**
   * The bottom elevation of this Region.
   * @deprecated "`Region#bottom` has been deprecated in favor of
   * {@linkcode RegionDocument.ElevationSchema.bottom | RegionDocument#elevation.bottom}." (since v13, until v15)
   */
  get bottom(): number;

  /**
   * The top elevation of this Region.
   * @deprecated "`Region#top` has been deprecated in favor of
   * {@linkcode RegionDocument.ElevationSchema.top | RegionDocument#elevation.top}." (since v13, until v15)
   */
  get top(): number;

  /**
   * The shapes of this Region in draw order.
   * @deprecated "`Region#shapes` has been deprecated in favor of {@linkcode RegionDocument.regionShapes | RegionDocument#regionShapes}."
   * (since v13, until v15)
   */
  get shapes(): RegionDocument.Implementation["regionShapes"];

  /**
   * The polygons of this Region.
   * @deprecated "`Region#polygons` has been deprecated in favor of {@linkcode RegionDocument.polygons | RegionDocument#polygons}."
   * (since v13, until v15)
   */
  get polygons(): RegionDocument.Implementation["polygons"];

  /**
   * The polygon tree of this Region.
   * @deprecated "`Region#polygonTree` has been deprecated in favor of {@linkcode RegionDocument.polygonTree | RegionDocument#polygonTree}."
   * (since v13, until v15)
   */
  get polygonTree(): RegionDocument.Implementation["polygonTree"];

  /**
   * The Clipper paths of this Region.
   * @deprecated "`Region#clipperPaths` has been deprecated in favor of
   * {@linkcode RegionDocument.clipperPaths | RegionDocument#clipperPaths}." (since v13, until v15)
   */
  get clipperPaths(): ClipperLib.Paths;

  /**
   * The triangulation of this Region
   * @deprecated "`Region#triangulation` has been deprecated in favor of
   * {@linkcode RegionDocument.triangulation | RegionDocument#triangulation}." (since v13, until v15)
   */
  get triangulation(): Region.TriangulationData;

  /**
   * Split the movement into its segments.
   * @param waypoints - The waypoints of movement.
   * @param samples   - The points relative to the waypoints that are tested. Whenever one of them is inside the region, the moved object is considered to be inside the region.
   * @param options   - Additional options
   * @returns The movement split into its segments.
   * @deprecated "`Region#segmentizeMovement` has been deprecated in favor of
   * {@linkcode RegionDocument.segmentizeMovementPath | RegionDocument#segmentizeMovementPath}." (since v13, until v15)
   */
  segmentizeMovement(
    waypoints: RegionDocument.SegmentizeMovementPathWaypoint[],
    samples: Canvas.Point[],
    options?: Region.SegmentizeMovementOptions,
  ): RegionDocument.MovementSegment[];

  /**
   * Test whether the given point (at the given elevation) is inside this Region.
   * @param point       - The point.
   * @param elevation   - The elevation of the point.
   * @returns Is the point (at the given elevation) inside this Region?
   * @deprecated "`Region#testPoint(point: Point, elevation?: number)` has been deprecated in favor of
   * {@linkcode RegionDocument.testPoint | RegionDocument#testPoint(point: ElevatedPoint)}." (since v13, until v15)
   */
  testPoint(point: Canvas.Point, elevation?: number): boolean;

  #Region: true;
}

declare namespace Region {
  interface AnimationElevation {
    bottom: number;
    top: number;
    topInclusive: boolean;
  }

  interface AnimationState {
    shapes: readonly BaseShapeData[];
    elevation: AnimationElevation;
    polygons: PIXI.Polygon[];
    polygonTree: PolygonTree;
    clipperPaths: ClipperLib.Path[];
    clipperPolyTree: ClipperLib.PolyTree;
    triangulation: PolygonTree.Triangulation;
    bounds: PIXI.Rectangle;
    area: number;
    testPoint: (point: Canvas.ElevatedPoint) => boolean;
  }

  interface PasteObjectData {
    shapes: BaseShapeData.Source[];
    levels: string[];
  }

  /**
   * The implementation of the `Region` placeable configured through `CONFIG.Region.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode RegionDocument.Implementation}
   * which refers to the implementation for the region document.
   */
  type Implementation = FixedInstanceType<ImplementationClass>;

  /**
   * The implementation of the `Region` placeable configured through `CONFIG.Region.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode RegionDocument.ImplementationClass}
   * which refers to the implementation for the region document.
   */
  type ImplementationClass = PlaceableObject.ImplementationClassFor<"Region">;

  interface RENDER_FLAGS extends PlaceableObject.RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshBorder"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
    refreshState: RenderFlag<this, "refreshState">;

    /** @defaultValue `{}` */
    refreshVisibility: RenderFlag<this, "refreshVisibility">;

    /** @defaultValue `{}` */
    refreshBorder: RenderFlag<this, "refreshBorder">;
  }

  interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

  interface TriangulationData {
    vertices: Float32Array;
    indices: Uint16Array | Uint32Array;
  }

  interface DrawOptions extends PlaceableObject.DrawOptions {}

  interface RefreshOptions extends PlaceableObject.RefreshOptions {}

  interface ControlOptions extends PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

  interface HoverInOptions extends PlaceableObject.HoverInOptions {}

  interface HoverOutOptions extends PlaceableObject.HoverOutOptions {}

  /** @internal */
  interface _SegmentizeMovementOptions {
    /**
     * Is it teleportation?
     * @defaultValue `false`
     */
    teleport: boolean;
  }

  interface SegmentizeMovementOptions extends InexactPartial<_SegmentizeMovementOptions> {}
}

export default Region;
