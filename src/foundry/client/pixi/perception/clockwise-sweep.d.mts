import type { Identity, IntentionalPartial } from "fvtt-types/utils";
import type Edge from "../../../client-esm/canvas/edges/edge.d.mts";

declare global {
  interface PolygonRay extends Ray {
    /**
     * @remarks Only set in `ClockwiseSweepPolygon#_switchEdge` and only consumed in `#visualize`,
     * despite unrelated method(s) having parameters claiming to want a `PolygonRay`
     *
     * Tested for truthiness in `#visualize` before use, so a nullish value is fine but never attains in core
     */
    result?: foundry.canvas.edges.CollisionResult | undefined | null;
  }

  /**
   * A PointSourcePolygon implementation that uses CCW (counter-clockwise) geometry orientation.
   * Sweep around the origin, accumulating collision points based on the set of active walls.
   * This algorithm was created with valuable contributions from https://github.com/caewok
   */
  class ClockwiseSweepPolygon extends PointSourcePolygon {
    // This does not appear in Foundry code, it's a necessary type override
    static override create(origin: Canvas.Point, config: PointSourcePolygon.Config): ClockwiseSweepPolygon;

    // This does not appear in foundry code, it's a necessary type override
    override config: ClockwiseSweepPolygon.StoredConfig;

    /**
     * A mapping of vertices which define potential collision points
     */
    vertices: Map<number, foundry.canvas.edges.PolygonVertex>;

    /**
     * The set of edges which define potential boundaries of the polygon
     */
    edges: Set<Edge>;

    /**
     * A collection of rays which are fired at vertices
     */
    // @ts-expect-error Getter/setter routine is deprecated functionality as of v11, removed in v13
    rays: PolygonRay[];

    override initialize(origin: Canvas.Point, config: PointSourcePolygon.Config): void;

    clone(): this;

    protected override _compute(): void;

    /**
     * Get the super-set of walls which could potentially apply to this polygon.
     * Define a custom collision test used by the Quadtree to obtain candidate Walls.
     */
    protected _identifyEdges(): void;

    /**
     * Determine the edge types and their manner of inclusion for this polygon instance
     */
    protected _determineEdgeTypes(): ClockwiseSweepPolygon.DetermineEdgesReturn;

    /**
     * Test whether a wall should be included in the computed polygon for a given origin and type
     * @param edge      - The Edge being considered
     * @param edgeTypes - Which types of edges are being used? 0=no, 1=maybe, 2=always
     * @param bounds    - The overall bounding box
     * @returns Should the edge be included?
     */
    protected _testEdgeInclusion(
      edge: Edge,
      edgeTypes: ClockwiseSweepPolygon.DetermineEdgesReturn,
      bounds: PIXI.Rectangle,
    ): boolean;

    /**
     * Compute the aggregate bounding box which is the intersection of all boundary shapes.
     * Round and pad the resulting rectangle by 1 pixel to ensure it always contains the origin.
     */
    protected _defineBoundingBox(): PIXI.Rectangle;

    /**
     * Consolidate all vertices from identified edges and register them as part of the vertex mapping.
     */
    protected _identifyVertices(): void;

    /**
     * Add additional vertices for intersections between edges.
     */
    protected _identifyIntersections(edgeMap: Map<string, Edge>): void;

    /**
     * Execute the sweep over wall vertices
     * @privateRemarks Foundry marked `@private`
     */
    protected _executeSweep(): void;

    /**
     * Determine the initial set of active edges as those which intersect with the initial ray
     * @returns A set of initially active edges
     * @privateRemarks Foundry marked `@private`
     */
    protected _initializeActiveEdges(): Set<Edge>;

    /**
     * Sort vertices clockwise from the initial ray (due west).
     * @returns The array of sorted vertices
     * @privateRemarks Foundry marked `@private`
     */
    protected _sortVertices(): foundry.canvas.edges.PolygonVertex[];

    /**
     * Test whether a target vertex is behind some closer active edge.
     * If the vertex is to the left of the edge, is must be behind the edge relative to origin.
     * If the vertex is collinear with the edge, it should be considered "behind" and ignored.
     * We know edge.VertexA is ccw to edge.VertexB because of the logic in _identifyVertices.
     * @param vertex      - The target vertex
     * @param activeEdges - The set of active edges
     * @returns Is the target vertex behind some closer edge?
     * @privateRemarks Foundry marked `@private`
     */
    protected _isVertexBehindActiveEdges(
      vertex: foundry.canvas.edges.PolygonVertex,
      activeEdges: Set<Edge>,
    ): { isBehind: boolean; wasLimited: boolean };

    /**
     * Determine the result for the sweep at a given vertex
     * @param vertex        - The target vertex
     * @param activeEdges   - The set of active edges
     * @param hasCollinear  - Are there collinear vertices behind the target vertex?
     *                        default: `false`
     * @privateRemarks Foundry marked `@private`
     */
    protected _determineSweepResult(
      vertex: foundry.canvas.edges.PolygonVertex,
      activeEdges: Set<Edge>,
      hasCollinear?: boolean,
    ): void;

    /**
     * Switch to a new active edge.
     * Moving from the origin, a collision that first blocks a side must be stored as a polygon point.
     * Subsequent collisions blocking that side are ignored. Once both sides are blocked, we are done.
     *
     * Collisions that limit a side will block if that side was previously limited.
     *
     * If neither side is blocked and the ray internally collides with a non-limited edge, n skip without adding polygon
     * endpoints. Sight is unaffected before this edge, and the internal collision can be ignored.
     *
     * @param result      - The pending collision result
     * @param activeEdges - The set of currently active edges
     * @privateRemarks Foundry marked `@private`
     */
    protected _switchEdge(result: foundry.canvas.edges.CollisionResult, activeEdges: Set<Edge>): void;

    protected override _testCollision<Mode extends PointSourcePolygon.CollisionModes>(
      ray: Ray,
      mode: Mode,
    ): PointSourcePolygon.TestCollision<Mode>;

    override visualize(): PIXI.Graphics;

    /**
     * Visualize the polygon, displaying its computed area, rays, and collision points
     * @privateRemarks Foundry marked `@private`
     */
    protected _visualizeCollision(ray: Ray, collisions: foundry.canvas.edges.PolygonVertex[]): void;
  }

  namespace ClockwiseSweepPolygon {
    interface Any extends AnyClockwiseSweepPolygon {}
    interface AnyConstructor extends Identity<typeof AnyClockwiseSweepPolygon> {}

    interface StoredConfig extends PointSourcePolygon.StoredConfig {
      /** The computed bounding box for the polygon */
      boundingBox: PIXI.Rectangle;
    }
    /**
     * @remarks Foundry types this as `Record<Edge.EdgeTypes, 0 | 1 | 2>`, but some keys are mutually exclusive,
     * and none are ever set to `0`, they're simply omitted and then tested for truthiness in `#_testEdgeInclusion`
     */
    type DetermineEdgesReturn = IntentionalPartial<Record<Edge.EdgeTypes, 1 | 2>>;
  }
}

declare abstract class AnyClockwiseSweepPolygon extends ClockwiseSweepPolygon {
  constructor(arg0: never, ...args: never[]);
}
