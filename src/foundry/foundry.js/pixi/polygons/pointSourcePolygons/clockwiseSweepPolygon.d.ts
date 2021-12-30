type VertexMap = Map<number, PolygonVertex>;

type EdgeSet = Set<PolygonEdge>;

interface ClockwiseSweepPolygonConfig extends PointSourcePolygonConfig {
  /**
   * The desired density of padding rays, a number per PI
   * @defaultValue `12`
   */
  density: number;

  /** The minimum angle of emission */
  aMin: number;

  /** The maximum angle of emission */
  aMax: number;

  /** The minimum ray of emission */
  rMin: Ray;

  /** The maximum ray of emission */
  rMax: Ray;

  /** Does this polygon have a limited radius? */
  hasLimitedRadius: boolean;

  /** Does this polygon have a limited angle? */
  hasLimitedAngle: boolean;

  /** The squared radius of the polygon, for faster computation later */
  radius2: number;

  /** A small epsilon used for avoiding floating point precision issues */
  radiusE: number;
}

/**
 * A PointSourcePolygon implementation that uses CCW (counter-clockwise) geometry orientation.
 * Sweep around the origin, accumulating collision points based on the set of active walls.
 * This algorithm was created with valuable contributions from https://github.com/caewok
 */
declare class ClockwiseSweepPolygon extends PointSourcePolygon {
  /**
   * The configuration of this polygon.
   */
  config: ClockwiseSweepPolygonConfig;

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
  rays: SightRay[];

  /**
   * @override
   * @param origin - The provided polygon origin
   * @param config - The provided configuration object
   */
  initialize(origin: Point, config: ClockwiseSweepPolygonConfig): void;

  /** @override */
  protected _compute(): void;

  /**
   * Translate walls and other obstacles into edges which limit visibility
   * @internal
   */
  protected _identifyEdges(): void;

  /**
   * Get the super-set of walls which could potentially apply to this polygon.
   * @internal
   */
  protected _getWalls(): Wall[];

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
   *                      (unused)
   * @param vertex      - The target vertex
   * @param activeEdges - The set of active edges
   * @returns Is the target vertex behind some closer edge?
   * @internal
   */
  protected _isVertexBehindActiveEdges(
    ray: Ray,
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
  protected _determineRayResult(ray: Ray, vertex: PolygonVertex, result: CollisionResult, activeEdges: EdgeSet): void;

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
    ray: Ray,
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
  protected _completeCurrentEdge(ray: Ray, result: CollisionResult, activeEdges: EdgeSet, isBinding: boolean): void;

  /**
   * Augment a CollisionResult with an additional secondary collision.
   * Require secondary collisions to be a greater distance than the target vertex.
   * @param ray    - The ray being evaluated
   * @param result - The collision result
   * @param edges  - The subset of active edges which are candidates for collision
   * @internal
   */
  protected _getSecondaryCollisions(ray: Ray, result: CollisionResult, edges: EdgeSet): PolygonVertex[];

  /**
   * Identify collision points for a required terminal ray.
   * @internal
   *
   * @param ray         - The ray being emitted
   * @param result      - The pending collision result
   * @param activeEdges - The set of currently active edges
   */
  protected _findRequiredCollision(ray: Ray, result: CollisionResult, activeEdges: EdgeSet): void;

  /**
   * Identify the collision points between an emitted Ray and a set of active edges.
   * @param ray             - The candidate ray to test
   * @param activeEdges     - The set of active edges
   * @returns A sorted array of collision points
   * @internal
   */
  protected _getRayCollisions(
    ray: Ray,
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
  protected _getPaddingPoints(r0: Ray, r1: Ray): Point[];

  /**
   * Test whether a wall should be included in the computed polygon for a given origin and type
   * @param wall   - The Wall being considered
   * @param origin - The origin point for the ray or polygon
   * @param type   - The type of perception or movement restriction being imposed
   * @returns Should the wall be included?
   *
   */
  static testWallInclusion(wall: Wall, origin: Point, type: foundry.CONST.WALL_RESTRICTION_TYPES): boolean;

  /**
   * Test whether a vertex lies between two boundary rays
   * @param vertex - The target vertex
   * @param rMin   - The counter-clockwise bounding ray
   * @param rMax   - The clockwise bounding ray
   * @param angle  - The angle being tested, in degrees
   * @returns Is the vertex between the two rays?
   */
  static pointBetweenRays(vertex: PolygonVertex, rMin: Ray, rMax: Ray, angle: number): boolean;

  /** @override */
  visualize(): void;

  /**
   * Check whether a given ray intersects with walls.
   * @param ray     - The Ray being tested
   * @param options - Options which customize how collision is tested
   * @returns Whether any collision occurred if mode is "any"
   *          An array of collisions, if mode is "all"
   *          The closest collision, if mode is "closest"
   */
  static getRayCollisions<Mode extends 'any' | 'closest' | 'all'>(
    ray: Ray,
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
  ): Mode extends 'any' ? boolean : Mode extends 'closest' ? PolygonVertex : PolygonVertex[];

  /**
   * Visualize the polygon, displaying its computed area, rays, and collision points
   * @internal
   */
  protected static _visualizeCollision(ray: Ray, edges: EdgeSet, collisions: PolygonVertex[]): void;
}
