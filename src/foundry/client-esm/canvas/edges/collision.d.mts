import type { NullishProps } from "../../../../utils/index.d.mts";
import type Edge from "./edge.d.mts";
import type PolygonVertex from "./vertex.d.mts";

/**
 * A specialized object that contains the result of a collision in the context of the ClockwiseSweepPolygon.
 * This class is not designed or intended for use outside of that context.
 */
declare class CollisionResult {
  constructor(values?: CollisionResult.ConstructorValues);

  /**
   * The vertex that was the target of this result
   */
  target: PolygonVertex;

  /**
   * The array of collision points which apply to this result
   * @defaultValue `[]`
   */
  collisions: PolygonVertex[];

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
   * @remarks Set directly from the constructor, so possibly was passed nullish
   */
  isBehind: boolean | undefined | null;

  /**
   * Does the target vertex for this result impose a limited collision?
   * @remarks Set directly from the constructor, so possibly was passed nullish
   */
  isLimited: boolean | undefined | null;

  /**
   * Has the set of collisions for this result encountered a limited edge?
   * @remarks Set directly from the constructor, so possibly was passed nullish
   */
  wasLimited: boolean | undefined | null;

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

declare namespace CollisionResult {
  interface Any extends AnyCollisionResult {}
  type AnyConstructor = typeof AnyCollisionResult;

  type _ConstructorValues = NullishProps<{
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

    /** Is the target vertex for this result behind some closer active edge? */
    isBehind: boolean;

    /** Does the target vertex for this result impose a limited collision? */
    isLimited: boolean;

    /** Has the set of collisions for this result encountered a limited edge? */
    wasLimited: boolean;
  }>;

  interface ConstructorValues extends _ConstructorValues {
    /**
     * The vertex that was the target of this result
     */
    target: PolygonVertex;

    /**
     * The array of collision points which apply to this result
     * @defaultValue `[]`
     * @remarks Can't be `null` as it only has a parameter default
     */
    collisions?: PolygonVertex[] | undefined;
  }
}

declare abstract class AnyCollisionResult extends CollisionResult {
  constructor(arg0: never, ...args: never[]);
}

export default CollisionResult;
