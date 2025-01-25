import type { InexactPartial } from "fvtt-types/utils";
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
  constructor(
    a: Canvas.Point,
    b: Canvas.Point,
    options?: InexactPartial<{
      /** A string used to uniquely identify this edge */
      id?: string;
      /** A PlaceableObject that is responsible for this edge, if any */
      object?: PlaceableObject;
      /** The type of edge */
      type?: Edge.EdgeTypes;
      /** How this edge restricts light */
      light?: foundry.CONST.WALL_SENSE_TYPES;
      /** How this edge restricts movement */
      move?: foundry.CONST.WALL_SENSE_TYPES;
      /** How this edge restricts sight */
      sight?: foundry.CONST.WALL_SENSE_TYPES;
      /** How this edge restricts sound */
      sound?: foundry.CONST.WALL_SENSE_TYPES;
      /**
       * A direction of effect for the edge
       * @defaultValue `0`
       */
      direction?: foundry.CONST.WALL_DIRECTIONS;
      /** Configuration of threshold data for this edge */
      threshold?: WallThresholdData;
    }>,
  );

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
   */
  id: string;

  object: PlaceableObject;

  type: Edge.EdgeTypes;

  /**
   * The direction of effect for the edge.
   */
  direction: foundry.CONST.WALL_DIRECTIONS;

  /**
   * How this edge restricts light.
   */
  light: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * How this edge restricts movement.
   */
  move: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * How this edge restricts sight.
   */
  sight: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * How this edge restricts sound.
   */
  sound: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * Specialized threshold data for this edge.
   */
  threshold: WallThresholdData;

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
  intersections: {
    edge: Edge;
    intersection: foundry.utils.LineIntersection;
  }[];

  /**
   * A PolygonVertex instance.
   * Used as part of ClockwiseSweepPolygon computation.
   */
  vertexA: foundry.canvas.edges.PolygonVertex;

  /**
   * A PolygonVertex instance.
   * Used as part of ClockwiseSweepPolygon computation.
   */
  vertexB: foundry.canvas.edges.PolygonVertex;

  /**
   * Is this edge limited for a particular type?
   */
  isLimited(type: "direction" | "light" | "move" | "sight" | "sound"): boolean;

  /**
   * Create a copy of the Edge which can be safely mutated.
   */
  clone(): Edge;

  /**
   * Get an intersection point between this Edge and another.
   */
  getIntersection(other: Edge): foundry.utils.LineIntersection | void;

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
  applyThreshold(sourceType: string, sourceOrigin: Canvas.Point, externalRadius?: number): boolean;

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
  type EdgeTypes = "wall" | "darkness" | "innerBounds" | "outerBounds";
}

export default Edge;
