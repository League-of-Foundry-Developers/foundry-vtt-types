import type { Identity, InexactPartial } from "#utils";
import type Edge from "./edge.d.mts";
import type { Quadtree } from "../_module.d.mts";

/**
 * A special class of Map which defines all the edges used to restrict perception in a Scene.
 */
declare class CanvasEdges extends Map<string, Edge> {
  /**
   * Clear content and initializes the quadtree.
   * @remarks Calls `"initializeEdges"` hook via `callAll`
   */
  initialize(): void;

  override set(key: string, value: Edge): this;

  override delete(key: string): boolean;

  override clear(): void;

  /**
   * Incrementally refreshes edges by computing intersections between all registered edges.
   * Utilizes the Quadtree to optimize the intersection detection process.
   */
  refresh(): void;

  /**
   * Retrieves edges that intersect with a given rectangle.
   * Utilizes the Quadtree for efficient spatial querying.
   * @param rect - The rectangle to query against.
   * @returns A set of Edge instances that intersect with the provided rectangle.
   */
  getEdges(rect: PIXI.Rectangle, options?: CanvasEdges.GetEdgesOptions): Set<Edge>;

  #CanvasEdges: true;
}

declare namespace CanvasEdges {
  interface Any extends AnyCanvasEdges {}
  interface AnyConstructor extends Identity<typeof AnyCanvasEdges> {}

  /** @internal */
  type _GetEdgesOptions = InexactPartial<{
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
    collisionTest: Quadtree.CollisionTestFunction<Edge>;
  }>;

  interface GetEdgesOptions extends _GetEdgesOptions {}
}

export default CanvasEdges;

declare abstract class AnyCanvasEdges extends CanvasEdges {
  constructor(...args: never);
}
