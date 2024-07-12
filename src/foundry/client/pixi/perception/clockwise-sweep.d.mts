export {};

declare global {
  type VertexMap = Map<number, foundry.canvas.edges.PolygonVertex>;

  type EdgeSet = Set<PolygonEdge>;

  interface PolygonRay extends Ray {
    result: foundry.canvas.edges.CollisionResult;
  }

  /**
   * A PointSourcePolygon implementation that uses CCW (counter-clockwise) geometry orientation.
   * Sweep around the origin, accumulating collision points based on the set of active walls.
   * This algorithm was created with valuable contributions from https://github.com/caewok
   */
  class ClockwiseSweepPolygon extends PointSourcePolygon {
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
    // @ts-expect-error Getter/setter routine is deprecated functionality as of v11, removed in v13
    rays: PolygonRay[];

    override initialize(origin: Point, config: PointSourcePolygonConfig): void;

    clone(): this;

    protected override _compute(): void;

    /**
     * Translate walls and other obstacles into edges which limit visibility
     * @internal
     */
    protected _identifyEdges(): void;

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
     * Update active edges at a given vertex
     * Must delete first, in case the edge is in both sets.
     * @param vertex      - The current vertex
     * @param activeEdges - A set of currently active edges
     * @internal
     */
    protected _updateActiveEdges(vertex: foundry.canvas.edges.PolygonVertex, activeEdges: EdgeSet): void;

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
    protected _sortVertices(): foundry.canvas.edges.PolygonVertex[];

    /**
     * Test whether a target vertex is behind some closer active edge.
     * If the vertex is to the left of the edge, is must be behind the edge relative to origin.
     * If the vertex is collinear with the edge, it should be considered "behind" and ignored.
     * We know edge.A is ccw to edge.B because of the logic in _identifyVertices.
     * @param vertex      - The target vertex
     * @param activeEdges - The set of active edges
     * @returns Is the target vertex behind some closer edge?
     * @internal
     */
    protected _isVertexBehindActiveEdges(
      vertex: foundry.canvas.edges.PolygonVertex,
      activeEdges: EdgeSet,
    ): { isBehind: boolean; wasLimited: boolean };

    /**
     * Determine the result for the sweep at a given vertex
     * @param vertex        - The target vertex
     * @param activeEdges   - The set of active edges
     * @param hasCollinear  - Are there collinear vertices behind the target vertex?
     * @internal
     */
    protected _determineSweepResult(
      vertex: foundry.canvas.edges.PolygonVertex,
      activeEdges: EdgeSet,
      hasCollinear: boolean,
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
     * @internal
     *
     * @param result      - The pending collision result
     * @param activeEdges - The set of currently active edges
     */
    _switchEdge(result: foundry.canvas.edges.CollisionResult, activeEdges: EdgeSet): void;

    /**
     * Identify the collision points between an emitted Ray and a set of active edges.
     * @param ray           - The candidate ray to test
     * @param internalEdges - The set of edges to check for collisions against the ray
     * @returns A sorted array of collision points
     * @internal
     */
    protected _getInternalEdgeCollisions(ray: PolygonRay, internalEdges: EdgeSet): foundry.canvas.edges.PolygonVertex[];

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks ClockwiseSweepPolygon.getRayCollisions has been renamed to ClockwiseSweepPolygon.testCollision
     */
    static getRayCollisions(
      ray: PolygonRay,
      config: PointSourcePolygonConfig,
    ): boolean | foundry.canvas.edges.PolygonVertex | foundry.canvas.edges.PolygonVertex[] | null;

    /**
     * Determine the set of collisions which occurs for a Ray.
     * @param ray  - The Ray to test
     * @param mode - The collision mode being tested
     * @returns The collision test result
     */
    protected override _testCollision<Mode extends PointSourcePolygon.CollisionModes>(
      ray: Ray,
      mode: Mode,
    ): PointSourcePolygon.TestCollision<Mode>;

    override visualize(): PIXI.Graphics | undefined;

    /**
     * Visualize the polygon, displaying its computed area, rays, and collision points
     * @internal
     */
    protected _visualizeCollision(ray: Ray, collisions: foundry.canvas.edges.PolygonVertex[]): void;
  }
}
