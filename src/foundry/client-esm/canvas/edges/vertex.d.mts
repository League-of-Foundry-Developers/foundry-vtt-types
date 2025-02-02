import type Edge from "./edge.d.mts";

/**
 * A specialized point data structure used to represent vertices in the context of the ClockwiseSweepPolygon.
 * This class is not designed or intended for use outside of that context.
 * @internal
 */
declare class PolygonVertex {
  constructor(x: number, y: number, { distance, index }?: PolygonVertex.Options);

  x: number;

  y: number;

  key: number;

  protected _distance: number | undefined;

  protected _d2: undefined;

  protected _index: number | undefined;

  /**
   * The set of edges which connect to this vertex.
   * This set is initially empty and populated later after vertices are de-duplicated.
   * @defaultValue `new Set()`
   */
  edges: Set<Edge>;

  /**
   * The subset of edges which continue clockwise from this vertex.
   * @defaultValue `new Set()`
   */
  cwEdges: Set<Edge>;

  /**
   * The subset of edges which continue counter-clockwise from this vertex.
   * @defaultValue `new Set()`
   */
  ccwEdges: Set<Edge>;

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
   * Does this vertex result from an internal collision?
   * @defaultValue `false`
   */
  isInternal: boolean;

  /**
   * The maximum restriction imposed by this vertex.
   * @defaultValue `0`
   * @remarks Possibly tied to `CONST.WALL_SENSE_TYPES`?
   */
  restriction: number;

  /**
   * Record whether this PolygonVertex has been visited in the sweep
   * @defaultValue `false`
   * @internal
   */
  _visited: boolean;

  /**
   * Is this vertex limited in type?
   */
  get isLimited(): boolean;

  /**
   * Associate an edge with this vertex.
   * @param edge        - The edge being attached
   * @param orientation - The orientation of the edge with respect to the origin
   * @param type        - The restriction type of the polygon being created
   */
  attachEdge(edge: Edge, orientation: number, type: string): void;

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
  static fromPoint(point: Canvas.Point, options?: PolygonVertex.Options): PolygonVertex;
}

declare namespace PolygonVertex {
  interface Options {
    distance: PolygonVertex["_distance"];
    index: PolygonVertex["_index"];
  }
}

export default PolygonVertex;
