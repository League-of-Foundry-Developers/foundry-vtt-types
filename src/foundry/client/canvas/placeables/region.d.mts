import type { FixedInstanceType, HandleEmptyObject, InexactPartial } from "#utils";
import type { ConfiguredObjectClassOrDefault } from "#client/config.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.d.mts";
import type { RegionGeometry } from "#client/canvas/placeables/regions/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

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
declare class Region extends PlaceableObject<RegionDocument.Implementation> {
  // fake type override
  static override get implementation(): Region.ImplementationClass;

  // fake override; super has to type as if this could be a ControlIcon, but Regions don't use one
  override controlIcon: null;

  static override embeddedName: "Region";

  static override RENDER_FLAGS: Region.RENDER_FLAGS;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<Region.RENDER_FLAGS>;

  /**
   * The geometry of this Region.
   *
   * The value of this property must not be mutated.
   *
   * This property is updated only by a document update.
   */
  get geometry(): RegionGeometry;

  override get bounds(): PIXI.Rectangle;

  override get center(): PIXI.Point;

  /** Is this Region currently visible on the Canvas? */
  get isVisible(): boolean;

  /**
   * @remarks
   * @throws "`Region#getSnappedPosition` is not supported: `RegionDocument` does not have a (x, y) position"
   */
  override getSnappedPosition(position?: never): never;

  // fake type override
  override draw(options?: HandleEmptyObject<Region.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<Region.DrawOptions>): Promise<void>;

  // fake override; super has to account for misbehaving siblings returning void
  override clear(): this;

  protected override _applyRenderFlags(flags: Region.RenderFlags): void;

  /** Refresh the state of the Region. */
  protected _refreshState(): void;

  /** Refreshes the border of the Region. */
  protected _refreshBorder(): void;

  protected override _canDrag(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _canHUD(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _onControl(options: Region.ControlOptions): void;

  protected override _onRelease(options: HandleEmptyObject<Region.ReleaseOptions>): void;

  // Foundry reiterates the JSDoc here to add `updateLegend` to the options; omitted because redundant
  protected override _onHoverIn(event: Canvas.Event.Pointer, options?: Region.HoverInOptions): boolean | void;

  protected override _onHoverOut(event: Canvas.Event.Pointer, options?: Region.HoverOutOptions): void;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  protected override _onUpdate(
    changed: RegionDocument.UpdateData,
    options: RegionDocument.Database.OnUpdateOptions,
    userId: string,
  ): void;

  // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
  protected override _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): PlaceableObject.DragLeftDropUpdate[];

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
  // eslint-disable-next-line no-restricted-syntax
  type ImplementationClass = ConfiguredObjectClassOrDefault<typeof Region>;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshBorder"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{}` */
    refreshState: RenderFlag<this, "refreshState">;

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

  /** @internal */
  interface _HoverInOptions {
    /**
     * Highlight corresponding entry in the RegionLegend.
     * @defaultValue `true`
     */
    updateLegend: boolean;
  }

  interface HoverInOptions extends InexactPartial<_HoverInOptions>, PlaceableObject.HoverInOptions {}

  interface HoverOutOptions extends InexactPartial<_HoverInOptions> {}

  /** @internal */
  interface _SegmentizeMovementOptions {
    /**
     * Is it teleportation?
     * @defaultValue `false`
     */
    teleport: boolean;
  }

  interface SegmentizeMovementOptions extends InexactPartial<_SegmentizeMovementOptions> {}

  /** @deprecated Use {@linkcode CONST.REGION_MOVEMENT_SEGMENTS} instead. This type will be removed in v14. */
  type MOVEMENT_SEGMENT_TYPES = CONST.REGION_MOVEMENT_SEGMENTS;

  /** @deprecated Use {@linkcode CONST.REGION_MOVEMENT_SEGMENTS} instead. This type will be removed in v14. */
  type MovementSegmentTypes = typeof CONST.REGION_MOVEMENT_SEGMENTS;

  /** @deprecated Use {@linkcode RegionDocument.MovementSegment} instead. This type will be removed in v14. */
  type MovementSegment = RegionDocument.MovementSegment;

  /** @deprecated Use {@linkcode RegionDocument.SegmentizeMovementPathWaypoint} instead. This type will be removed in v14. */
  type MovementWaypoint = RegionDocument.SegmentizeMovementPathWaypoint;
}

export default Region;
