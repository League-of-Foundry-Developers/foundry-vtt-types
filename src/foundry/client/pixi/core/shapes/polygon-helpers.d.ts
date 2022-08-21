import type { ConfiguredObjectClassForName } from "../../../../../types/helperTypes";

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
     * The maximum restriction type of this vertex
     * @defaultValue `null`
     */
    type: number | null;

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

    /**
     * Does this vertex have a limited edge connected to it?
     */
    get hasLimitedEdge(): boolean;

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
     * Is this edge limited in type?
     */
    get isLimited(): boolean;

    /**
     * Construct a PolygonEdge instance from a Wall placeable object.
     * @param wall - The Wall from which to construct an edge
     * @param type - The type of polygon being constructed
     */
    static fromWall(
      wall: ConfiguredObjectClassForName<"Wall"> | WallDocument,
      type: foundry.CONST.WALL_RESTRICTION_TYPES
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
      isRequired?: boolean;
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
     * Is this result required due to a limited angle?
     */
    isRequired: boolean | undefined;

    /**
     * Has the set of collisions for this result encountered a limited edge?
     */
    wasLimited: boolean | undefined;
  }

  /**
   * A special subclass of PIXI.Point which is used for modeling Wall endpoints.
   * A wall endpoint must have integer coordinates.
   *
   * This was used for the RadialSweepPolygon but can now be deleted once that is
   * @deprecated since v9d2
   */
  class WallEndpoint extends PIXI.Point {
    /**
     * @param x - The integer x-coordinate
     * @param y - The integer y-coordinate
     */
    constructor(x: number, y: number);

    /**
     * Express the point as a 32-bit integer with 16 bits allocated to x and 16 bits allocated to y
     */
    key: number;

    /**
     * The angle between this point and the polygon origin
     * @defaultValue `undefined`
     */
    angle: number | undefined;

    /**
     * Record the set of walls which connect to this Endpoint
     */
    walls: Set<ConfiguredObjectClassForName<"Wall">>;

    /**
     * Record whether this point is the endpoint of any Wall
     * @defaultValue `false`
     */
    isEndpoint: boolean;

    /**
     * Record whether this point is a midpoint of any wall?
     * @defaultValue `false`
     */
    isMidpoint: boolean;

    /**
     * Record whether this point is the termination of the Ray
     * @defaultValue `false`
     */
    isTerminal: boolean;

    /**
     * Aggregate the maximum of each wall restriction type
     */
    types: Record<foundry.CONST.WALL_RESTRICTION_TYPES, number>;

    /**
     * An intermediate variable used to store the proportional distance of this point from a SightRay origin
     * @defaultValue `undefined`
     */
    protected _r: number | undefined;

    /**
     * An intermediate variable used to cache the continuation attributes for a certain point
     * @defaultValue `undefined`
     */
    protected _c: { left: boolean; right: boolean } | undefined;

    attachWall(wall: ConfiguredObjectClassForName<"Wall">): this;

    /**
     * Does this endpoint equal some other endpoint?
     * @param other - Some other point with x and y coordinates
     * @returns Are the points equal?
     */
    equals(other: Point): boolean;

    /**
     * Is this point one that provides only limited perspective?
     * @param type - The perspective type being tested
     * @returns Is perspective limited?
     */
    isLimited(type: foundry.CONST.WALL_RESTRICTION_TYPES): boolean;

    /**
     * Encode a x/y coordinate as a 32-bit integer
     * @param x - The x-coordinate
     * @param y - The y-coordinate
     */
    static getKey(x: number, y: number): number;
  }
}
