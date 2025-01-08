import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { FixedInstanceType, ValueOf } from "../../../../utils/index.d.mts";
import type RegionShape from "../../../client-esm/canvas/regions/shape.d.mts";
import type RegionPolygonTree from "../../../client-esm/canvas/regions/polygon-tree.d.mts";
import type RegionGeometry from "../../../client-esm/canvas/regions/geometry.d.mts";
import type RegionMesh from "../../../client-esm/canvas/regions/mesh.d.mts";
import type { Point } from "../../../common/types.d.mts";

declare global {
  namespace Region {
    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof Region>;
    type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;

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
      /** The type of htis segment (see {@link Region.MOVEMENT_SEGMENT_TYPES}) */
      type: number;
      /** The waypoint that this segment starts from */
      from: RegionMovementWaypoint;
      /** The waypoint that this segment goes to */
      to: RegionMovementWaypoint;
    }

    const _MOVEMENT_SEGMENT_TYPES: Readonly<{
      /**
       * The segment crosses the boundary of the region and exits it.
       */
      EXIT: -1;

      /**
       * The segment does not cross the boundary of the region and is contained within it.
       */
      MOVE: 0;

      /**
       * The segment crosses the boundary of the region and enters it.
       */
      ENTER: 1;
    }>;
    type MOVEMENT_SEGMENT_TYPES = ValueOf<typeof _MOVEMENT_SEGMENT_TYPES>;
  }

  class Region extends PlaceableObject<RegionDocument.ConfiguredInstance> {
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
    static MOVEMENT_SEGMENT_TYPES: typeof Region._MOVEMENT_SEGMENT_TYPES;

    /** A temporary point used by this class. */
    static #SHARED_POINT: PIXI.Point;

    get shapes(): ReadonlyArray<RegionShape.Any>;
    #shapes: ReadonlyArray<RegionShape.Any>;

    /** The bottom elevation of this Region. */
    get bottom(): number;

    /** The top elevation of this Region. */
    get top(): number;

    /** The polygons of this Region. */
    get polygons(): ReadonlyArray<PIXI.Polygon>;
    #polygons: ReadonlyArray<PIXI.Polygon> | undefined;

    /** The polygon tree of this Region. */
    get polygonTree(): RegionPolygonTree;
    #polygonTree: RegionPolygonTree | undefined;

    /** The Clipper paths of this Region. */
    get clipperPaths(): ReadonlyArray<ReadonlyArray<ClipperLib.IntPoint>>;
    #clipperPaths: ReadonlyArray<ReadonlyArray<ClipperLib.IntPoint>> | undefined;

    /** The triangulation of this Region */
    get triangulation(): ReadonlyArray<{ vertices: Float32Array; indices: Uint16Array | Uint32Array }>;
    #triangulation: ReadonlyArray<{ vertices: Float32Array; indices: Uint16Array | Uint32Array }> | undefined;

    /** The geometry of this Region */
    get geometry(): RegionGeometry;
    #geometry: RegionGeometry | undefined;

    override get bounds(): PIXI.Rectangle;
    #bounds: PIXI.Rectangle | undefined;

    override get center(): PIXI.Point;

    /** Is this Region currently visible on the Canvas? */
    get isVisible(): boolean;

    /** The highlight of this Region. */
    #highlight: RegionMesh | undefined;

    /** The border of this Region. */
    #border: PIXI.Graphics | undefined;

    /**
     * @throws      - Region#getSnappedPosition is not supported: RegionDocument does not have a (x, y) position
     */
    override getSnappedPosition(position?: Canvas.Point): never;

    /** Initialize the region */
    #initialize(): void;

    protected override _draw(options?: Record<string, unknown>): Promise<void>;

    protected override _applyRenderFlags(flags: PlaceableObject.RenderFlags): void;

    /** Refresh the state of the Region. */
    protected _refreshState(): void;

    /** Refreshes the border of the Region. */
    protected _refreshBorder(): void;

    protected override _canDrag(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _canHUD(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _onControl(options?: PlaceableObject.ControlOptions): void;

    protected override _onRelease(options?: PlaceableObject.ReleaseOptions): void;

    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): false | void;

    protected override _onHoverOut(event: PIXI.FederatedEvent): boolean | void;

    protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

    /**
     * Test whether the given point (at the given elevation) is inside this Region.
     * @param point       - The point.
     * @param elevation   - The elevation of the point.
     * @returns           - Is the point (at the given elevation) inside this Region?
     */
    testPoint(point: Point, elevation?: number): boolean;

    /** Update the shapes of this region. */
    #updateShapes(): void;

    /** Create the Clipper polygon tree for this Region. */
    #createClipperPolyTree(): ClipperLib.PolyTree;

    /** Build the Clipper batches. */
    #buildClipperBatches(): {
      paths: ClipperLib.IntPoint[][];
      fillType: ClipperLib.PolyFillType;
      clipType: ClipperLib.ClipType;
    }[];

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
         * @defaultValue `false`
         */
        teleport?: boolean;
      },
    ): Region.RegionMovementSegment[];

    /**
     * Split the movement into its segments.
     * @param origin        - The origin of movement.
     * @param destination   - The destination of movement.
     * @param samples       - The points relative to the waypoints that are tested.
     * @param teleport      - Is it teleportation?
     * @returns             - The movement split into its segments.
     */
    #segmentizeMovement(
      origin: Region.RegionMovementWaypoint,
      destination: Region.RegionMovementWaypoint,
      samples: Point[],
      teleport: boolean,
    ): Region.RegionMovementSegment[];

    /**
     * Get the teleporation segment from the origin to the destination.
     * @param originX                 - The x-coordinate of the origin.
     * @param originY                 - The y-coordinate of the origin.
     * @param originElevation         - The elevation of the destination.
     * @param destinationX            - The x-coordinate of the destination.
     * @param destinationY            - The y-coordinate of the destination.
     * @param destinationElevation    - The elevation of the destination.
     * @param samples                 - The samples relative to the position.
     * @returns                       - The teleportation segment, if any.
     */
    #getTeleportationSegment(
      originX: number,
      originY: number,
      originElevation: number,
      destinationX: number,
      destinationY: number,
      destinationElevation: number,
      samples: Point[],
    ): Region.RegionMovementSegment | void;

    /**
     * Test whether one of the samples relative to the given position is contained within this Region.
     * @param x         - The x-coordinate of the position.
     * @param y         - The y-coordinate of the position.
     * @param samples   - The samples relative to the position.
     * @returns         - Is one of the samples contained within this Region?
     */
    #testSamples(x: number, y: number, samples: Point[]): boolean;

    /**
     * Split the movement into its segments.
     * @param originX                 - The x-coordinate of the origin.
     * @param originY                 - The y-coordinate of the origin.
     * @param originElevation         - The elevation of the destination.
     * @param destinationX            - The x-coordinate of the destination.
     * @param destinationY            - The y-coordinate of the destination.
     * @param destinationElevation    - The elevation of the destination.
     * @param samples                 - The samples relative to the position.
     * @returns                       - The intervals where we have an intersection.
     */
    #getMovementSegments(
      originX: number,
      originY: number,
      originElevation: number,
      destinationX: number,
      destinationY: number,
      destinationElevation: number,
      samples: Point[],
    ): { start: number; end: number }[];

    /**
     * Test whether the movement could intersect this Region.
     * @param originX         - The x-coordinate of the origin.
     * @param originY         - The y-coordinate of the origin.
     * @param destinationX    - The x-coordinate of the destination.
     * @param destinationY    - The y-coordinate of the destination.
     * @param samples         - The samples relative to the position.
     * @returns               - Could the movement intersect?
     */
    #couldMovementIntersect(
      originX: number,
      originY: number,
      destinationX: number,
      destinationY: number,
      samples: Point[],
    ): boolean;

    /**
     * Compute the intervals of intersection of the movement.
     * @param originX         - The x-coordinate of the origin.
     * @param originY         - The y-coordinate of the origin.
     * @param destinationX    - The x-coordinate of the destination.
     * @param destinationY    - The y-coordinate of the destination.
     * @param samples         - The samples relative to the position.
     * @returns               - The intervals where we have an intersection.
     */
    #computeSegmentIntervals(
      originX: number,
      originY: number,
      destinationX: number,
      destinationY: number,
      samples: Point[],
    ): { start: number; end: number }[];

    /**
     * Find the crossing (enter or exit) at the current position between the start and end position, if possible.
     * The current position should be very close to crossing, otherwise we test a lot of pixels potentially.
     * We use Bresenham's line algorithm to walk forward/backwards to find the crossing.
     * @see {@link https://en.wikipedia.org/wiki/Bresenham's_line_algorithm}
     * @param startX      - The start x-coordinate.
     * @param startY      - The start y-coordinate.
     * @param currentX    - The current x-coordinate.
     * @param currentY    - The current y-coordinate.
     * @param endX        - The end x-coordinate.
     * @param endY        - The end y-coordinate.
     * @param samples     - The samples.
     * @param enter       - Find enter? Otherwise find exit.
     */
    #findBoundaryCrossing(
      startX: number,
      startY: number,
      currentX: number,
      currentY: number,
      endX: number,
      endY: number,
      samples: boolean,
      enter: boolean,
    ): [from: { x: number; y: number; inside: boolean }, to: { x: number; y: number; inside: boolean }];

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */
  }
}
