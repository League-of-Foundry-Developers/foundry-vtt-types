/**
 * An object containing the result of a collision test.
 * @internal
 */
declare class CollisionResult {
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
