import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { Brand, FixedInstanceType, HandleEmptyObject, NullishProps } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { RegionShape, RegionPolygonTree } from "#client/data/region-shapes/_module.d.mts";
import type { RegionGeometry } from "#client/canvas/placeables/regions/_module.d.mts";
import { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.mjs";

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
  constructor(document: RegionDocument.Implementation);

  // fake override; super has to type as if this could be a ControlIcon, but Regions don't use one
  override controlIcon: null;

  static override embeddedName: "Region";

  static override RENDER_FLAGS: Region.RENDER_FLAGS;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<Region.RENDER_FLAGS>;

  /**
   * The scaling factor used for Clipper paths.
   * @defaultValue `100`
   * @remarks Defined using `Object.defineProperty` in a static initialization block
   */
  static readonly CLIPPER_SCALING_FACTOR: 100;

  /**
   * The three movement segment types: ENTER, MOVE, and EXIT.
   * @remarks Defined using `Object.defineProperty` in a static initialization block
   */
  static readonly MOVEMENT_SEGMENT_TYPES: Region.MovementSegmentTypes;

  /**
   * The shapes of this Region in draw order.
   * @privateRemarks Foundry types this as `ReadonlyArray<>`, but does nothing to that effect at runtime.
   * Not reported, as this is deprecated and thus untyped in v13
   */
  get shapes(): RegionShape.Any[];

  /** The bottom elevation of this Region. */
  get bottom(): number;

  /** The top elevation of this Region. */
  get top(): number;

  /**
   * The polygons of this Region.
   * @privateRemarks Foundry types this as `ReadonlyArray<>`, but does nothing to that effect at runtime.
   * Not reported, as this is deprecated and thus untyped in v13
   */
  get polygons(): PIXI.Polygon[];

  /** The polygon tree of this Region. */
  get polygonTree(): RegionPolygonTree;

  /**
   * The Clipper paths of this Region.
   * @privateRemarks Foundry types this as `ReadonlyArray<>`, but does nothing to that effect at runtime.
   * Not reported, as this is deprecated and thus untyped in v13
   */
  get clipperPaths(): ClipperLib.Paths;

  /**
   * The triangulation of this Region
   * @privateRemarks Foundry types this as `Readonly<>`, but does nothing to that effect at runtime.
   * Not reported, as this is deprecated and thus untyped in v13
   */
  get triangulation(): Region.TriangulationData;

  /** The geometry of this Region */
  get geometry(): RegionGeometry;

  override get bounds(): PIXI.Rectangle;

  override get center(): PIXI.Point;

  /** Is this Region currently visible on the Canvas? */
  get isVisible(): boolean;

  /**
   * @throws "`Region#getSnappedPosition` is not supported: `RegionDocument` does not have a (x, y) position"
   */
  override getSnappedPosition(position?: never): never;

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

  // options: not null (destructured)
  protected override _onHoverIn(event: Canvas.Event.Pointer, options?: Region.HoverInOptions): void;

  // options: not null (destructured)
  protected override _onHoverOut(event: Canvas.Event.Pointer, options?: Region.HoverOutOptions): void;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  /**
   * Test whether the given point (at the given elevation) is inside this Region.
   * @param point       - The point.
   * @param elevation   - The elevation of the point.
   * @returns Is the point (at the given elevation) inside this Region?
   * @remarks Only tests elevation if provided, always forwards `position` to {@link RegionPolygonTree.testPoint | `RegionPolygonTree#testPoint`}
   */
  // elevation: not null (`=== undefined` check)
  testPoint(point: Canvas.Point, elevation?: number): boolean;

  /**
   * Split the movement into its segments.
   * @param waypoints - The waypoints of movement.
   * @param samples   - The points relative to the waypoints that are tested. Whenever one of them is inside the region, the moved object is considered to be inside the region.
   * @param options   - Additional options
   * @returns The movement split into its segments.
   */
  // options: not null (destructured)
  segmentizeMovement(
    waypoints: Region.MovementWaypoint[],
    samples: Canvas.Point[],
    options?: Region.SegmentizeMovementOptions,
  ): Region.MovementSegment[];

  // _onUpdate is overridden but with no signature changes.
  // For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.

  // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
  protected override _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): PlaceableObject.DragLeftDropUpdate[];
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

  type _HoverInOptions = NullishProps<{
    /** @defaultValue `true` */
    updateLegend: boolean;
  }>;

  interface HoverInOptions extends _HoverInOptions, PlaceableObject.HoverInOptions {}

  interface HoverOutOptions extends _HoverInOptions {}

  interface MovementWaypoint {
    /** The x-coordinates in pixels (integer) */
    x: number;

    /** The y-coordinates in pixels (integer) */
    y: number;

    /** The elevation in grid units. */
    elevation: number;
  }

  interface MovementSegment {
    /** The type of this segment (see {@linkcode Region.MovementSegmentTypes}) */
    type: MOVEMENT_SEGMENT_TYPES;

    /** The waypoint that this segment starts from */
    from: MovementWaypoint;

    /** The waypoint that this segment goes to */
    to: MovementWaypoint;
  }

  type MOVEMENT_SEGMENT_TYPES = Brand<number, "Region.MOVEMENT_SEGMENT_TYPES">;

  interface MovementSegmentTypes
    extends Readonly<{
      /**
       * The segment crosses the boundary of the region and exits it.
       */
      EXIT: -1 & MOVEMENT_SEGMENT_TYPES;

      /**
       * The segment does not cross the boundary of the region and is contained within it.
       */
      MOVE: 0 & MOVEMENT_SEGMENT_TYPES;

      /**
       * The segment crosses the boundary of the region and enters it.
       */
      ENTER: 1 & MOVEMENT_SEGMENT_TYPES;
    }> {}

  /** @internal */
  type _SegmentizeMovementOptions = NullishProps<{
    /**
     * Is it teleportation?
     * @defaultValue `false`
     * @remarks Can't be `null` because it only has a parameter default
     */
    teleport: boolean;
  }>;

  interface SegmentizeMovementOptions extends _SegmentizeMovementOptions {}
}

export default Region;
