import type { ConfiguredObjectClassForName } from "../../../../types/helperTypes";

declare global {
  type VertexMap = Map<number, PolygonVertex>;

  type EdgeSet = Set<PolygonEdge>;

  interface ClockwiseSweepPolygonConfig extends PointSourcePolygonConfig {
    /** @defaultValue `canvas.dimensions.maxR` */
    radius?: number;

    /** @defaultValue `360` */
    angle?: number;

    /** @defaultValue `0` */
    rotation?: number;

    /**
     * The desired density of padding rays, a number per PI
     * @defaultValue `12`
     */
    density?: number;

    /**
     * The minimum angle of emission
     * @defaultValue `config.hasLimitedAngle ? Math.normalizeRadians(Math.toRadians(config.rotation + 90 - (config.angle / 2))) : -Math.PI`
     */
    aMin?: number;

    /**
     * The maximum angle of emission
     * @defaultValue `config.hasLimitedAngle ? config.aMin + Math.toRadians(config.angle) : Math.PI`
     */
    aMax?: number;

    /**
     * The minimum ray of emission
     * @defaultValue `Ray.fromAngle(origin.x, origin.y, config.aMin, config.radius)`
     */
    rMin?: PolygonRay;

    /**
     * The maximum ray of emission
     * @defaultValue `config.hasLimitedAngle && Ray.fromAngle(origin.x, origin.y, config.aMax, config.radius)`
     */
    rMax?: PolygonRay;

    /**
     * Does this polygon have a limited radius?
     * @defaultValue `config.radius > 0`
     */
    hasLimitedRadius?: boolean;

    /**
     * Does this polygon have a limited angle?
     * @defaultValue `config.angle !== 0`
     */
    hasLimitedAngle?: boolean;

    /**
     * The squared radius of the polygon, for faster computation later
     * @defaultValue `Math.pow(config.radius, 2)`
     */
    radius2?: number;

    /**
     * A small epsilon used for avoiding floating point precision issues
     * @defaultValue `0.5 / config.radius`
     */
    radiusE?: number;
  }

  interface PolygonRay extends Ray {
    result: CollisionResult;
  }

  /**
   * A PointSourcePolygon implementation that uses CCW (counter-clockwise) geometry orientation.
   * Sweep around the origin, accumulating collision points based on the set of active walls.
   * This algorithm was created with valuable contributions from https://github.com/caewok
   */
  class ClockwiseSweepPolygon extends PointSourcePolygon {
    /**
     * The configuration of this polygon.
     */
    config:
      | ClockwiseSweepPolygonConfig
      | ClockwiseSweepPolygon.InitializedConfig
      | ClockwiseSweepPolygon.LimitedAngleConfig;

    /**
     * A mapping of vertices which define potential collision points
     */
    vertices: VertexMap;

    /**
     * The set of edges which define potential boundaries of the polygon
     */
    edges: EdgeSet;

    /**
     * A collection of rays which are fired at vertices
     */
    rays: PolygonRay[];

    static benchmark(
      iterations: number,
      ...args: Parameters<typeof ClockwiseSweepPolygon["create"]>
    ): ReturnType<typeof foundry.utils.benchmark>;

    static create(
      origin: Point,
      config: Parameters<ClockwiseSweepPolygon["initialize"]>[1]
    ): ReturnType<ClockwiseSweepPolygon["compute"]>;

    /**
     * @param origin - The provided polygon origin
     * @param config - The provided configuration object
     */
    override initialize(origin: Point, config: ClockwiseSweepPolygon.InitConfig): void;

    protected override _compute(): void;

    /**
     * Round vertices of a ray segment
     * @param ray - The provided ray
     * @returns The ray with rounded vertices
     * @internal
     */
    protected _roundRayVertices(ray: PolygonRay): PolygonRay;

    /**
     * Translate walls and other obstacles into edges which limit visibility
     * @internal
     */
    protected _identifyEdges(): void;

    /**
     * Get the super-set of walls which could potentially apply to this polygon.
     * @internal
     */
    protected _getWalls(): ConfiguredObjectClassForName<"Wall">[];

    /**
     * Restrict the set of candidate edges to those which appear within the limited angle of emission.
     * @internal
     */
    protected _restrictEdgesByAngle(): void;

    /**
     * Process the candidate edges to further constrain them using a circular radius of effect.
     * @internal
     */
    protected _constrainEdgesByRadius(): void;

    /**
     * Consolidate all vertices from identified edges and register them as part of the vertex mapping.
     * @internal
     */
    protected _identifyVertices(): void;

    /**
     * Add additional vertices for intersections between edges.
     * @param wallEdgeMap - A mapping of wall IDs to PolygonEdge instances
     * @internal
     */
    protected _identifyIntersections(wallEdgeMap: Map<string, PolygonEdge>): void;

    /**
     * Execute the sweep over wall vertices
     * @internal
     */
    protected _executeSweep(): void;

    /**
     * Determine the initial set of active edges as those which intersect with the initial ray
     * @returns A set of initially active edges
     * @internal
     */
    protected _initializeActiveEdges(): EdgeSet;

    /**
     * Sort vertices clockwise from the initial ray (due west).
     * @returns The array of sorted vertices
     * @internal
     */
    protected _sortVertices(): PolygonVertex[];

    /**
     * Test whether a target vertex is behind some closer active edge
     * @param ray         - The ray being evaluated
     * @param vertex      - The target vertex
     * @param activeEdges - The set of active edges
     * @returns Is the target vertex behind some closer edge?
     * @internal
     */
    protected _isVertexBehindActiveEdges(
      ray: PolygonRay,
      vertex: PolygonVertex,
      activeEdges: EdgeSet
    ): { isBehind: boolean; wasLimited: boolean };

    /**
     * Determine the final result of a candidate ray.
     * @param ray         - The candidate ray being tested
     * @param vertex      - The target vertex
     * @param result      - The result being prepared
     * @param activeEdges - The set of active edges
     * @internal
     */
    protected _determineRayResult(
      ray: PolygonRay,
      vertex: PolygonVertex,
      result: CollisionResult,
      activeEdges: EdgeSet
    ): void;

    /**
     * Jump to a new closest active edge.
     * In this case, our target vertex will be the primary collision.
     * We may have a secondary collision if other active edges exist or if the vertex is prior to the ray endpoint.
     * @internal
     *
     * @param ray             - The ray being emitted
     * @param result          - The pending collision result
     * @param activeEdges     - The set of currently active edges
     * @param isBinding       - Is the target vertex a binding collision point?
     * @param secondaryBefore - Whether to add secondary collision points before ("unshift") or after ("push")
     *                          (default: `true`)
     */
    protected _beginNewEdge(
      ray: PolygonRay,
      result: CollisionResult,
      activeEdges: EdgeSet,
      isBinding: boolean,
      secondaryBefore?: boolean
    ): void;

    /**
     * If the target vertex is connected to a currently active edge, we are terminating that edge.
     * We know the target vertex is not behind another edge, so the target is our initial collision.
     * There may be a second collision afterwards if no connected walls continue clockwise.
     * @internal
     *
     * @param ray         - The ray being emitted
     * @param result      - The pending collision result
     * @param activeEdges - The set of currently active edges
     * @param isBinding   - Is the target vertex a binding collision point?
     */
    protected _completeCurrentEdge(
      ray: PolygonRay,
      result: CollisionResult,
      activeEdges: EdgeSet,
      isBinding: boolean
    ): void;

    /**
     * Augment a CollisionResult with an additional secondary collision.
     * Require secondary collisions to be a greater distance than the target vertex.
     * @param ray    - The ray being evaluated
     * @param result - The collision result
     * @param edges  - The subset of active edges which are candidates for collision
     * @internal
     */
    protected _getSecondaryCollisions(ray: PolygonRay, result: CollisionResult, edges: EdgeSet): PolygonVertex[];

    /**
     * Identify collision points for a required terminal ray.
     * @internal
     *
     * @param ray         - The ray being emitted
     * @param result      - The pending collision result
     * @param activeEdges - The set of currently active edges
     */
    protected _findRequiredCollision(ray: PolygonRay, result: CollisionResult, activeEdges: EdgeSet): void;

    /**
     * Identify the collision points between an emitted Ray and a set of active edges.
     * @param ray             - The candidate ray to test
     * @param activeEdges     - The set of active edges
     * @returns A sorted array of collision points
     * @internal
     */
    protected _getRayCollisions(
      ray: PolygonRay,
      activeEdges: EdgeSet,
      {
        minimumDistance
      }?: {
        /**
         * Require collisions to exceed some minimum distance
         * @defaultValue `0`
         */
        minimumDistance?: number;
      }
    ): PolygonVertex[];

    /**
     * Update the set of active edges given the result of an emitted ray.
     * @param result      - The collision result
     * @param activeEdges - The set of currently active edges
     * @internal
     */
    protected _updateActiveEdges(result: CollisionResult, activeEdges: EdgeSet): void;

    /**
     * Construct the polygon from ray collision points
     * @internal
     */
    protected _constructPolygonPoints(): void;

    /**
     * Add additional points to limited-radius polygons to approximate the curvature of a circle
     * @param r0 - The prior ray that collided with some vertex
     * @param r1 - The next ray that collides with some vertex
     * @internal
     */
    protected _getPaddingPoints(r0: PolygonRay, r1: PolygonRay): Point[];

    /**
     * Test whether a wall should be included in the computed polygon for a given origin and type
     * @param wall   - The Wall being considered
     * @param origin - The origin point for the ray or polygon
     * @param type   - The type of perception or movement restriction being imposed
     * @returns Should the wall be included?
     *
     */
    static testWallInclusion(
      wall: ConfiguredObjectClassForName<"Wall">,
      origin: Point,
      type: foundry.CONST.WALL_RESTRICTION_TYPES
    ): boolean;

    /**
     * Test whether a vertex lies between two boundary rays
     * @param vertex - The target vertex
     * @param rMin   - The counter-clockwise bounding ray
     * @param rMax   - The clockwise bounding ray
     * @param angle  - The angle being tested, in degrees
     * @returns Is the vertex between the two rays?
     */
    static pointBetweenRays(vertex: PolygonVertex, rMin: PolygonRay, rMax: PolygonRay, angle: number): boolean;

    override visualize(): void;

    /**
     * Check whether a given ray intersects with walls.
     * @param ray     - The Ray being tested
     * @param options - Options which customize how collision is tested
     * @returns Whether any collision occurred if mode is "any"
     *          An array of collisions, if mode is "all"
     *          The closest collision, if mode is "closest"
     */
    static getRayCollisions<Mode extends "any" | "closest" | "all">(
      ray: PolygonRay,
      options?: {
        /**
         * Which collision type to check, a value in CONST.WALL_RESTRICTION_TYPES
         * @defaultValue `"move"`
         */
        type?: foundry.CONST.WALL_RESTRICTION_TYPES;

        /**
         * Which type of collisions are returned: any, closest, all
         * @defaultValue `"all"`
         */
        mode?: Mode;

        /**
         * Visualize some debugging data to help understand the collision test
         * @defaultValue `false`
         */
        debug?: boolean;
      }
    ): Mode extends "any" ? boolean : Mode extends "closest" ? PolygonVertex : PolygonVertex[];

    /**
     * Visualize the polygon, displaying its computed area, rays, and collision points
     * @internal
     */
    protected static _visualizeCollision(ray: PolygonRay, edges: EdgeSet, collisions: PolygonVertex[]): void;
  }

  namespace ClockwiseSweepPolygon {
    type InitConfig = Partial<Pick<ClockwiseSweepPolygonConfig, "radius" | "angle" | "rotation" | "density">>;

    interface InitializedConfig extends ClockwiseSweepPolygonConfig {
      hasLimitedRadius: boolean;
      radius: number;
      radius2: number;
      radiusE: number;
      aMin: number;
      aMax: number;
      angle: number;
      rotation: number;
      hasLimitedAngle: boolean;
      density: number;
      rMin: PolygonRay;
    }

    interface LimitedAngleConfig extends InitializedConfig {
      hasLimitedAngle: true;
      rMax: PolygonRay;
    }
  }
}
