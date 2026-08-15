import type { Identity, InexactPartial, ToMethod } from "#utils";
import type { Level } from "#client/documents/_module.d.mts";
import type Edge from "./edge.d.mts";

/**
 * A specialized Map class that manages all edges used to restrict perception in a Scene.
 * Integrates with a Quadtree for efficient spatial queries.
 */
declare class CanvasEdges extends Map<string, Edge> {
  /**
   * @param level - The Level these edges belong to
   * @throws If `level` is not a {@linkcode foundry.documents.Level | Level} instance
   */
  constructor(level: Level.Implementation);

  /**
   * The Level these edges belong to.
   */
  get level(): Level.Implementation;

  /**
   * @throws If the edges of the parent Scene have not been initialized yet
   */
  override set(key: string, value: Edge): this;

  override delete(key: string): boolean;

  /** @remarks Unlike {@linkcode Map.clear | Map#clear}, this returns the `CanvasEdges` for method chaining */
  override clear(): this;

  /**
   * Retrieves edges that overlap with a given rectangle.
   * Utilizes the Quadtree for efficient spatial querying.
   * This function computes edge intersections if necessary.
   * @param rect - The rectangle to query against.
   * @returns A set of {@linkcode Edge} instances that intersect with the provided rectangle.
   */
  getEdges(rect: PIXI.Rectangle, options?: CanvasEdges.GetEdgesOptions): Set<Edge>;

  /**
   * Identify all edge intersections.
   */
  identifyIntersections(): void;

  /**
   * @deprecated Renamed to {@linkcode CanvasEdges.initialize | initialize} in v14.366.
   */
  inititalize(): never;

  /**
   * @deprecated "CanvasEdges#inititalize has been deprecated. Use Scene#initializeEdges instead." (since v14, until v16)
   * @remarks The deprecation warning Foundry logs still names the method `inititalize`, its pre-14.366 spelling.
   */
  initialize(): void;

  /**
   * @deprecated "CanvasEdges#refresh has been deprecated. CanvasEdges#getEdges computes edge intersections
   * automatically if necessary." (since v14, until v16)
   */
  refresh(): void;

  #CanvasEdges: true;
}

declare namespace CanvasEdges {
  interface Any extends AnyCanvasEdges {}
  interface AnyConstructor extends Identity<typeof AnyCanvasEdges> {}

  type CollisionTestFunction = ToMethod<(edge: Edge) => boolean>;

  /** @internal */
  interface _GetEdgesOptions {
    /**
     * Should inner bounds be added?
     * @defaultValue `false`
     */
    includeInnerBounds: boolean;

    /**
     * Should outer bounds be added?
     * @defaultValue `true`
     */
    includeOuterBounds: boolean;

    /**
     * Collision function to test edge inclusion.
     */
    collisionTest: CollisionTestFunction;

    /**
     * Apply collision test to bounds?
     * @defaultValue `false`
     */
    collisionTestBounds: boolean;
  }

  interface GetEdgesOptions extends InexactPartial<_GetEdgesOptions> {}
}

export default CanvasEdges;

declare abstract class AnyCanvasEdges extends CanvasEdges {
  constructor(...args: never);
}
