import type PolygonVertex from "./vertex.d.mts";
import type { LineIntersection } from "../../../common/utils/geometry.d.mts";
import type { NullishProps } from "fvtt-types/utils";
import type { WallThresholdData } from "../../../common/documents/_types.d.mts";

/**
 * A data structure used to represent potential edges used by the ClockwiseSweepPolygon.
 * Edges are not polygon-specific, meaning they can be reused across many polygon instances.
 */
declare class Edge {
  /**
   * Construct an Edge by providing the following information.
   * @param a - The first endpoint of the edge
   * @param b - The second endpoint of the edge
   * @param options - Additional options which describe the edge
   */
  constructor(a: Canvas.Point, b: Canvas.Point, options?: Edge.ConstructorOptions);

  /**
   * The first endpoint of the edge.
   */
  a: PIXI.Point;

  /**
   * The second endpoint of the edge.
   */
  b: PIXI.Point;

  /**
   * A string used to uniquely identify this edge.
   * @defaultValue `object?.id ?? undefined`
   */
  id: string | undefined;

  /**
   * A PlaceableObject that is responsible for this edge, if any
   * @remarks This property is never read by Foundry, so it being nullish won't break anything as of 12.331
   */
  object: PlaceableObject.Any | undefined | null;

  /**
   * The type of edge
   * @defaultValue `"wall"`
   */
  type: Edge.EdgeTypes;

  /**
   * The direction of effect for the edge.
   */
  direction: foundry.CONST.WALL_DIRECTIONS;

  /**
   * How this edge restricts light.
   * @defaultValue `CONST.WALL_SENSE_TYPES.NONE`
   */
  light: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * How this edge restricts movement.
   * @defaultValue `CONST.WALL_SENSE_TYPES.NONE`
   */
  move: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * How this edge restricts sight.
   * @defaultValue `CONST.WALL_SENSE_TYPES.NONE`
   */
  sight: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * How this edge restricts sound.
   * @defaultValue `CONST.WALL_SENSE_TYPES.NONE`
   */
  sound: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * Specialized threshold data for this edge.
   * @remarks Foundry only accesses this in nullish-safe ways as of 12.331
   */
  threshold: WallThresholdData | undefined | null;

  /**
   * The endpoint of the edge which is oriented towards the top-left.
   */
  nw: Canvas.Point;

  /**
   * The endpoint of the edge which is oriented towards the bottom-right.
   */
  se: Canvas.Point;

  /**
   * The rectangular bounds of the edge. Used by the quadtree.
   */
  bounds: PIXI.Rectangle;

  /**
   * Record other edges which this one intersects with.
   */
  intersections: Edge.IntersectionEntry[];

  /**
   * A PolygonVertex instance.
   * Used as part of ClockwiseSweepPolygon computation.
   * @defaultValue `undefined`
   * @remarks Only set in {@link ClockwiseSweepPolygon#_identifyVertices} (part of CSP initialization)
   */
  vertexA: PolygonVertex | undefined;

  /**
   * A PolygonVertex instance.
   * Used as part of ClockwiseSweepPolygon computation.
   * @defaultValue `undefined`
   * @remarks Only set in {@link ClockwiseSweepPolygon#_identifyVertices} (part of CSP initialization)
   */
  vertexB: PolygonVertex | undefined;

  /**
   * Is this edge limited for a particular type?
   */
  isLimited(type: foundry.CONST.WALL_RESTRICTION_TYPES): boolean;

  /**
   * Create a copy of the Edge which can be safely mutated.
   */
  clone(): this;

  /**
   * Get an intersection point between this Edge and another.
   */
  getIntersection(other: Edge): LineIntersection | void;

  /**
   * Test whether to apply a proximity threshold to this edge.
   * If the proximity threshold is met, this edge excluded from perception calculations.
   * @param sourceType     - Sense type for the source
   * @param sourceOrigin   - The origin or position of the source on the canvas
   * @param externalRadius - The external radius of the source
   *                         (default: `0`)
   * @returns True if the edge has a threshold greater than 0 for the source type,
   *          and the source type is within that distance.
   */
  applyThreshold(sourceType: Edge.AttenuationTypes, sourceOrigin: Canvas.Point, externalRadius?: number): boolean;

  /**
   * Determine the orientation of this Edge with respect to a reference point.
   * @param point - Some reference point, relative to which orientation is determined
   * @returns An orientation in CONST.WALL_DIRECTIONS which indicates whether the Point is left,
   *          right, or collinear (both) with the Edge
   */
  orientPoint(point: Canvas.Point): foundry.CONST.WALL_DIRECTIONS;

  /**
   * Identify intersections between a provided iterable of edges.
   * @param edges - An iterable of edges
   */
  static identifyEdgeIntersections(edges: Iterable<Edge>): void;

  /**
   * Record the intersections between two edges.
   * @param other - Another edge to test and record
   */
  recordIntersections(other: Edge): void;

  /**
   * Remove intersections of this edge with all other edges.
   */
  removeIntersections(): void;
}

declare namespace Edge {
  interface Any extends AnyEdge {}
  type AnyConstructor = typeof AnyEdge;

  /** @internal */
  type _ConstructorOptions = NullishProps<{
    /**
     * A string used to uniquely identify this edge
     *
     */
    id: string | null;

    /**
     * A PlaceableObject that is responsible for this edge, if any
     * @remarks `Edge#object` is never read by Foundry, so this being nullish won't break anything as of 12.331
     */
    object: PlaceableObject.Any;

    /**
     * The type of edge
     * @defaultValue `"wall"`
     */
    type: Edge.EdgeTypes;

    /**
     * How this edge restricts light
     * @defaultValue `CONST.WALL_SENSE_TYPES.NONE`
     */
    light: foundry.CONST.WALL_SENSE_TYPES;

    /**
     * How this edge restricts movement
     * @defaultValue `CONST.WALL_SENSE_TYPES.NONE`
     */
    move: foundry.CONST.WALL_SENSE_TYPES;

    /**
     * How this edge restricts sight
     * @defaultValue `CONST.WALL_SENSE_TYPES.NONE`
     */
    sight: foundry.CONST.WALL_SENSE_TYPES;

    /**
     * How this edge restricts sound
     * @defaultValue `CONST.WALL_SENSE_TYPES.NONE`
     */
    sound: foundry.CONST.WALL_SENSE_TYPES;

    /**
     * A direction of effect for the edge
     * @defaultValue `CONST.WALL_DIRECTIONS.BOTH`
     */
    direction: foundry.CONST.WALL_DIRECTIONS;

    /**
     * Configuration of threshold data for this edge
     * @remarks Foundry only accesses this in nullish-safe ways as of 12.331
     */
    threshold: WallThresholdData;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}

  type EdgeTypes = "wall" | "darkness" | "innerBounds" | "outerBounds";

  type AttenuationTypes = Exclude<foundry.CONST.WALL_RESTRICTION_TYPES, "move">;

  interface IntersectionEntry {
    edge: Edge;
    intersection: LineIntersection;
  }
}

declare abstract class AnyEdge extends Edge {
  constructor(arg0: never, ...args: never[]);
}

export default Edge;
