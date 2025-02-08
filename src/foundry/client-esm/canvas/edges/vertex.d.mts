import type { NullishProps } from "../../../../utils/index.d.mts";
import type Edge from "./edge.d.mts";

/**
 * A specialized point data structure used to represent vertices in the context of the ClockwiseSweepPolygon.
 * This class is not designed or intended for use outside of that context.
 * @internal
 */
declare class PolygonVertex {
  constructor(x: number, y: number, options?: PolygonVertex.ConstructorOptions);

  x: number;

  y: number;

  /** @defaultValue `PolygonVertex.getKey(this.x, this.y)` */
  key: number;

  /**
   * @defaultValue `undefined`
   * @remarks Accessed externally in {@link ClockwiseSweepPolygon#_testCollision}
   */
  _distance: number | undefined | null;

  /**
   * @defaultValue `undefined`
   * @remarks Set to `undefined` in the constructor, otherwise only set externally in `ClockwiseSweepPolygon` methods
   */
  _d2: number | undefined;

  /**
   * @defaultValue `undefined`
   * @remarks Accessed externally in `ClockwiseSweepPolygon` methods
   */
  _index: number | undefined | null;

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
   * @defaultValue `CONST.WALL_SENSE_TYPES.NONE`
   * @remarks Actually initialized to `0` literal, but is meant as a `WALL_SENSE_TYPES`
   */
  restriction: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * Record whether this PolygonVertex has been visited in the sweep
   * @defaultValue `false`
   * @remarks Set externally during `ClockwiseSweeepPolygon` initialization
   * @privateRemarks Foundry marked `@internal`
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
  attachEdge(edge: Edge, orientation: number, type: foundry.CONST.WALL_RESTRICTION_TYPES): void;

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
  static fromPoint(point: Canvas.Point, options?: PolygonVertex.ConstructorOptions): PolygonVertex;
}

declare namespace PolygonVertex {
  interface Any extends AnyPolygonVertex {}
  type AnyConstructor = typeof AnyPolygonVertex;

  /** @internal */
  type _ConstructorOptions = NullishProps<{
    distance: number;
    index: number;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}
}

declare abstract class AnyPolygonVertex extends PolygonVertex {
  constructor(arg0: never, ...args: never[]);
}

export default PolygonVertex;
