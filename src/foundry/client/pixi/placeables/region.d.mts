import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { Brand, FixedInstanceType } from "../../../../utils/index.d.mts";
import type RegionShape from "../../../client-esm/canvas/regions/shape.d.mts";
import type RegionPolygonTree from "../../../client-esm/canvas/regions/polygon-tree.d.mts";
import type RegionGeometry from "../../../client-esm/canvas/regions/geometry.d.mts";
import type { Point } from "../../../common/types.d.mts";

declare global {
  namespace Region {
    type ObjectClass = ConfiguredObjectClassOrDefault<typeof Region>;
    type Object = FixedInstanceType<ObjectClass>;

    /**
     * @deprecated {@link Region.ObjectClass | `Region.ObjectClass`}
     */
    type ConfiguredClass = ObjectClass;

    /**
     * @deprecated {@link Region.Object | `Region.Object`}
     */
    type ConfiguredInstance = Object;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `Region` (the `PlaceableObject` that appears on the canvas) and
     * `RegionDocument` (the `Document` that represents the data for a `Region`) is so common that
     * it is useful to have type to forward to `RegionDocument`.
     *
     * @deprecated {@link RegionDocument.Implementation | `RegionDocument.Implementation`}
     */
    type Implementation = RegionDocument.Implementation;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `Region` (the `PlaceableObject` that appears on the canvas) and
     * `RegionDocument` (the `Document` that represents the data for a `Region`) is so common that
     * it is useful to have type to forward to `RegionDocument`.
     *
     * @deprecated {@link RegionDocument.ImplementationClass | `RegionDocument.ImplementationClass`}
     */
    type ImplementationClass = RegionDocument.Implementation;

    interface RenderFlags extends PlaceableObject.RenderFlags {}

    interface RegionMovementWaypoint {
      /** The x-coordinates in pixels (integer) */
      x: number;

      /** The y-coordinates in pixels (integer) */
      y: number;

      /** The elevation in grid units. */
      elevation: number;
    }

    interface RegionMovementSegment {
      /** The type of htis segment (see {@link Region.MovementSegmentTypes}) */
      type: number;

      /** The waypoint that this segment starts from */
      from: RegionMovementWaypoint;

      /** The waypoint that this segment goes to */
      to: RegionMovementWaypoint;
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
  }

  class Region extends PlaceableObject<RegionDocument.ConfiguredInstance> {
    #region: true;

    constructor(document: RegionDocument.ConfiguredInstance);

    static override embeddedName: "Region";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Region.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshBorder"], alias: true }` */
      refresh: RenderFlag<Region.RenderFlags>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<Region.RenderFlags>;

      /** @defaultValue `{}` */
      refreshBorder: RenderFlag<Region.RenderFlags>;
    };

    static CLIPPER_SCALING_FACTOR: number;
    static MOVEMENT_SEGMENT_TYPES: Region.MOVEMENT_SEGMENT_TYPES;

    get shapes(): ReadonlyArray<RegionShape.Any>;

    /** The bottom elevation of this Region. */
    get bottom(): number;

    /** The top elevation of this Region. */
    get top(): number;

    /** The polygons of this Region. */
    get polygons(): ReadonlyArray<PIXI.Polygon>;

    /** The polygon tree of this Region. */
    get polygonTree(): RegionPolygonTree;

    /** The Clipper paths of this Region. */
    get clipperPaths(): ReadonlyArray<ReadonlyArray<ClipperLib.IntPoint>>;

    /** The triangulation of this Region */
    get triangulation(): ReadonlyArray<{ vertices: Float32Array; indices: Uint16Array | Uint32Array }>;

    /** The geometry of this Region */
    get geometry(): RegionGeometry;

    override get bounds(): PIXI.Rectangle;

    override get center(): PIXI.Point;

    /** Is this Region currently visible on the Canvas? */
    get isVisible(): boolean;

    /**
     * @throws      - Region#getSnappedPosition is not supported: RegionDocument does not have a (x, y) position
     */
    override getSnappedPosition(position?: Canvas.Point): never;

    protected override _draw(options?: Record<string, unknown>): Promise<void>;

    protected override _applyRenderFlags(flags: PlaceableObject.RenderFlags): void;

    /** Refresh the state of the Region. */
    protected _refreshState(): void;

    /** Refreshes the border of the Region. */
    protected _refreshBorder(): void;

    protected override _canDrag(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent | null): boolean;

    protected override _canHUD(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent | null): boolean;

    protected override _onControl(options?: PlaceableObject.ControlOptions | null): void;

    protected override _onRelease(options?: PlaceableObject.ReleaseOptions | null): void;

    /** @remarks options cannot accept null because defaults are provided with `options={}` in the parameters  */
    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): false | void;

    protected override _onHoverOut(event: PIXI.FederatedEvent): boolean | void;

    protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

    /**
     * Test whether the given point (at the given elevation) is inside this Region.
     * @param point       - The point.
     * @param elevation   - The elevation of the point.
     * @returns           - Is the point (at the given elevation) inside this Region?
     * @remarks elevation cannot be null because it is explicitly checked against undefined (===) in function body.
     */
    testPoint(point: Point, elevation?: number): boolean;

    /**
     * Split the movement into its segments.
     * @param waypoints                     - The waypoints of movement.
     * @param samples                       - The points relative to the waypoints that are tested.
     *                                        Whenever one of them is inside the region, the moved object
     *                                        is considered to be inside the region.
     * @returns                             - The movement split into its segments.
     */
    segmentizeMovement(
      waypoints: Region.RegionMovementWaypoint[],
      samples: Point[],
      options?: {
        /**
         * Is it teleportation?
         * @remarks options cannot accept null because defaults are provided with `options={}` in the parameters.
         * @defaultValue `false`
         */
        teleport?: boolean | undefined;
      },
    ): Region.RegionMovementSegment[];

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */
  }
}
