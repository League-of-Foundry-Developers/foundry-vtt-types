import type Edge from "./edge.d.mts";
/**
 * A specialized object that contains the result of a collision in the context of the ClockwiseSweepPolygon.
 * This class is not designed or intended for use outside of that context.
 * @internal
 */
declare class CollisionResult {
  constructor(values?: {
    target?: foundry.canvas.edges.PolygonVertex;
    collisions?: foundry.canvas.edges.PolygonVertex[];
    cwEdges?: Set<Edge>;
    ccwEdges?: Set<Edge>;
    isBehind?: boolean;
    isLimited?: boolean;
    wasLimited?: boolean;
  });

  /**
   * The vertex that was the target of this result
   * @defaultValue `null`
   */
  target: foundry.canvas.edges.PolygonVertex | null;

  /**
   * The array of collision points which apply to this result
   * @defaultValue `[]`
   */
  collisions: foundry.canvas.edges.PolygonVertex[];

  /**
   * The set of edges connected to the target vertex that continue clockwise
   * @defaultValue `new Set()`
   */
  cwEdges: Set<Edge>;

  /**
   * The set of edges connected to the target vertex that continue counter-clockwise
   * @defaultValue `new Set()`
   */
  ccwEdges: Set<Edge>;

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

export default CollisionResult;
