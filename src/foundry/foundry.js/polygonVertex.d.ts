/**
 * An internal data structure for polygon vertices
 * @internal
 */
declare class PolygonVertex {
  constructor(x: number, y: number, { distance, index }?: PolygonVertexOptions);

  x: number;

  y: number;

  key: number;

  protected _distance: unknown;

  protected _d2: unknown;

  protected _index: unknown;

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

  /**
   * Is this vertex the same point as some other vertex?
   * @param other - Some other vertex
   * @returns Are they the same point?
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
  distance: PolygonVertex['_distance'];
  index: PolygonVertex['_index'];
}
