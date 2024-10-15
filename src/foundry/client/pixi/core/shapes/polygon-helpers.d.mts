import type Document from "../../../../common/abstract/document.d.mts";

declare global {
  /**
   * An internal data structure for polygon vertices
   * @internal
   */
  class PolygonVertex {
    constructor(x: number, y: number, { distance, index }?: PolygonVertexOptions);

    x: number;

    y: number;

    key: number;

    protected _distance: number | undefined;

    protected _d2: undefined;

    protected _index: number | undefined;

    /** @defaultValue `false` */
    protected _inLimitedAngle: boolean;

    /**
     * The set of edges which connect to this vertex.
     * This set is initially empty and populated later after vertices are de-duplicated.
     * @defaultValue `new Set()`
     */
    edges: EdgeSet;

    /**
     * The subset of edges which continue clockwise from this vertex.
     * @defaultValue `new Set()`
     */
    cwEdges: EdgeSet;

    /**
     * The subset of edges which continue counter-clockwise from this vertex.
     * @defaultValue `new Set()`
     */
    ccwEdges: EdgeSet;

    /**
     * The set of vertices collinear to this vertex
     */
    collinearVertices: Set<PolygonVertex>;

    /**
     * The maximum restriction type of this vertex
     * @defaultValue `null`
     */
    type: number | null;

    /**
     * Is this vertex an endpoint of one or more edges?
     */
    isEndpoint: boolean | undefined;

    /**
     * Does this vertex have a single counterclockwise limiting edge?
     */
    isLimitingCCW: boolean | undefined;

    /**
     * Does this vertex have a single clockwise limiting edge?
     */
    isLimitingCW: boolean | undefined;

    /**
     * Does this vertex have non-limited edges or 2+ limited edges counterclockwise?
     */
    isBlockingCCW: boolean | undefined;

    /**
     * Does this vertex have non-limited edges or 2+ limited edges clockwise?
     */
    isBlockingCW: boolean | undefined;

    /**
     * Associate an edge with this vertex.
     * @param edge        - The edge being attached
     * @param orientation - The orientation of the edge with respect to the origin
     */
    attachEdge(edge: PolygonEdge, orientation: number): void;

    /**
     * Is this vertex limited in type?
     */
    get isLimited(): boolean;

    /**
     * Is this vertex terminal (at the maximum radius)
     */
    get isTerminal(): boolean;

    /**declareme point?
     */
    equals(other: PolygonVertex): boolean;

    /**
     * Construct a PolygonVertex instance from some other Point structure.
     * @param point   - The point
     * @param options - Additional options that apply to this vertex
     * @returns The constructed vertex
     */
    static fromPoint(point: Point, options?: PolygonVertexOptions): PolygonVertex;
  }

  interface PolygonVertexOptions {
    distance: PolygonVertex["_distance"];
    index: PolygonVertex["_index"];
  }

  /**
   * An internal data structure for polygon edges
   * @internal
   */
  class PolygonEdge {
    constructor(a: Point, b: Point, type: foundry.CONST.WALL_SENSE_TYPES, wall: Wall);

    /**
     * An internal flag used to record whether an Edge represents a canvas boundary.
     */
    protected _isBoundary: boolean;

    /**
     * Is this edge limited in type?
     */
    get isLimited(): boolean;

    /**
     * Construct a PolygonEdge instance from a Wall placeable object.
     * @param wall - The Wall from which to construct an edge
     * @param type - The type of polygon being constructed
     */
    static fromWall(
      wall: Document.ConfiguredObjectClassForName<"Wall"> | WallDocument,
      type: foundry.CONST.WALL_RESTRICTION_TYPES,
    ): PolygonEdge;
  }

  /**
   * An object containing the result of a collision test.
   * @internal
   */
  class CollisionResult {
    constructor(values?: {
      target?: PolygonVertex | null;
      collisions?: PolygonVertex[];
      cwEdges?: EdgeSet;
      ccwEdges?: EdgeSet;
      isBehind?: boolean;
      isLimited?: boolean;
      wasLimited?: boolean;
    });

    /**
     * The vertex that was the target of this result
     * @defaultValue `null`
     */
    target: PolygonVertex | null;

    /**
     * The array of collision points which apply to this result
     * @defaultValue `[]`
     */
    collisions: PolygonVertex[];

    /**
     * The set of edges connected to the target vertex that continue clockwise
     * @defaultValue `new Set()`
     */
    cwEdges: EdgeSet;

    /**
     * The set of edges connected to the target vertex that continue counter-clockwise
     * @defaultValue `new Set()`
     */
    ccwEdges: EdgeSet;

    /**
     * Is the target vertex for this result behind some closer active edge?
     */
    isBehind: boolean | undefined;

    /**
     * Does the target vertex for this result impose a limited collision?
     */
    isLimited: boolean | undefined;

    /**
     * Has the set of collisions for this result encountered a limited edge?
     */
    wasLimited: boolean | undefined;

    /**
     * Is this result limited in the clockwise direction?
     * @defaultValue `false`
     */
    limitedCW: boolean;

    /**
     * Is this result limited in the counter-clockwise direction?
     * @defaultValue `false`
     */
    limitedCCW: boolean;

    /**
     * Is this result blocking in the clockwise direction?
     * @defaultValue `false`
     */
    blockedCW: boolean;

    /**
     * Is this result blocking in the counter-clockwise direction?
     * @defaultValue `false`
     */
    blockedCCW: boolean;

    /**
     * Previously blocking in the clockwise direction?
     * @defaultValue `false`
     */
    blockedCWPrev: boolean;

    /**
     * Previously blocking in the counter-clockwise direction?
     * @defaultValue `false`
     */
    blockedCCWPrev: boolean;
  }
}
