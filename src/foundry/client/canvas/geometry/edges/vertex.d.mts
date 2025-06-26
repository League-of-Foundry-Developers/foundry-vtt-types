import type { Identity, InexactPartial } from "#utils";
import type Edge from "./edge.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { LineIntersection } from "#common/utils/geometry.mjs";

/**
 * A specialized point data structure used to represent vertices in the context of the ClockwiseSweepPolygon.
 * This class is not designed or intended for use outside of that context.
 */
declare class PolygonVertex {
  constructor(x: number, y: number, options?: PolygonVertex.ConstructorOptions);

  x: number;

  y: number;

  /** @defaultValue `PolygonVertex.getKey(this.x, this.y)` */
  key: number;

  /**
   * Determine the sort key to use for this vertex, arranging points from north-west to south-east.
   * @param x - The x-coordinate
   * @param y - The y-coordinate
   * @returns The key used to identify the vertex
   */
  static getKey(x: number, y: number): number;

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
   * @defaultValue `new Set()`
   */
  collinearVertices: Set<PolygonVertex>;

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
   * @defaultValue {@linkcode CONST.WALL_SENSE_TYPES.NONE}
   * @remarks Actually initialized to `0` literal, but is meant as a `WALL_SENSE_TYPES`
   */
  restriction: CONST.WALL_SENSE_TYPES;

  /**
   * Record whether this PolygonVertex has been visited in the sweep
   * @defaultValue `false`
   * @remarks Set externally during {@linkcode ClockwiseSweepPolygon} initialization
   * @internal
   */
  protected _visited: boolean;

  /**
   * The distance from a polygon origin to this vertex.
   * @defaultValue `undefined`
   * @remarks Set to the value passed in construction options. Accessed externally in {@linkcode ClockwiseSweepPolygon._testCollision | ClockwiseSweepPolygon#_testCollision}
   * @internal
   */
  protected _distance: number | undefined;

  /**
   * The squared distance from a polygon origin to this vertex.
   * @defaultValue `undefined`
   * @remarks Only set *or* read externally in {@linkcode ClockwiseSweepPolygon} methods
   * @internal
   */
  protected _d2: number | undefined;

  /**
   * The integer index of this vertex in an ordered sweep.
   * @remarks Set to the value passed in construction options. Accessed externally in {@linkcode ClockwiseSweepPolygon} methods
   * @internal
   */
  protected _index: number | undefined;

  /**
   * The angle of the ray from the origin to this vertex.
   * @remarks Only set *or* read externally in {@linkcode ClockwiseSweepPolygon._sortVertices | ClockwiseSweepPolygon#_sortVertices}
   * @internal
   */
  protected _angle: number | undefined;

  /**
   * The line intersection coordinates of the two edges that create this vertex.
   * @remarks Only set *or* read externally in {@linkcode ClockwiseSweepPolygon} methods
   * @internal
   */
  protected _intersectionCoordinates: LineIntersection | undefined;

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
  attachEdge(edge: Edge, orientation: number, type: CONST.WALL_RESTRICTION_TYPES): void;

  /**
   * Is this vertex terminal (at the maximum radius)
   */
  get isTerminal(): boolean;

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
  static fromPoint(point: Canvas.Point, options?: PolygonVertex.ConstructorOptions): PolygonVertex;

  #PolygonVertex: true;
}

declare namespace PolygonVertex {
  interface Any extends AnyPolygonVertex {}
  interface AnyConstructor extends Identity<typeof AnyPolygonVertex> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /** A known distance from a polygon origin to this vertex. */
    distance: number;

    /** An integer index of this vertex in an ordered sweep. */
    index: number;

    /**
     * Whether to round the input `{x,y}` coordinates provided.
     * @defaultValue `false`
     */
    round: boolean;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}
}

export default PolygonVertex;

declare abstract class AnyPolygonVertex extends PolygonVertex {
  constructor(...args: never);
}
