import type { Brand } from "../../../../../types/helperTypes.d.mts";
import type { NullishProps } from "../../../../../types/utils.d.mts";

export {};

declare global {
  interface QuadtreeObject<T> {
    r: Canvas.Rectangle;
    t: T;
    n: Set<Quadtree<T>>;
  }

  /**
   * A Quadtree implementation that supports collision detection for rectangles.
   */
  class Quadtree<T> {
    /**
     * @param bounds  - The outer bounds of the region
     * @param options - Additional options which configure the Quadtree
     */
    constructor(bounds: NullishProps<Canvas.Rectangle>, options?: Quadtree.Options<T>);

    /**
     * The bounding rectangle of the region
     */
    bounds: PIXI.Rectangle;

    /**
     * The maximum number of objects allowed within this node before it must split
     * @defaultValue `20`
     */
    maxObjects: number;

    /**
     * The maximum number of levels that the base quadtree is allowed
     * @defaultValue `4`
     */
    maxDepth: number;

    /**
     * The depth of this node within the root Quadtree
     * @defaultValue `0`
     */
    depth: number;

    /**
     * The objects contained at this level of the tree
     * @defaultValue `[]`
     */
    objects: QuadtreeObject<T>[];

    /**
     * Children of this node
     * @defaultValue `[]`
     */
    nodes: Quadtree<T>[];

    /**
     * The root Quadtree
     */
    root: Quadtree<T>;

    /**
     * A constant that enumerates the index order of the quadtree nodes from top-left to bottom-right.
     * @defaultValue `{tl: 0, tr: 1, bl: 2, br: 3}`
     */
    static INDICES: Record<"tl" | "tr" | "bl" | "br", Quadtree.INDICES>;

    /**
     * Return an array of all the objects in the Quadtree (recursive)
     */
    get all(): QuadtreeObject<T>[];

    /**
     * Split this node into 4 sub-nodes.
     * @returns The split Quadtree
     */
    split(): this;

    /**
     * Clear the quadtree of all existing contents
     * @returns The cleared Quadtree
     */
    clear(): this;

    /**
     * Add a rectangle object to the tree
     * @param obj - The object being inserted
     * @returns The Quadtree nodes the object was added to.
     */
    insert(obj: QuadtreeObject<T>): Quadtree<T>[];

    /**
     * Remove an object from the quadtree
     * @param target - The quadtree target being removed
     * @returns The Quadtree for method chaining
     */
    remove(target: T): this;

    /**
     * Remove an existing object from the quadtree and re-insert it with a new position
     * @param obj - The object being inserted
     * @returns The Quadtree nodes the object was added to
     */
    update(obj: QuadtreeObject<T>): Quadtree<T>[];

    /**
     * Get all the objects which could collide with the provided rectangle
     * @param rect - The normalized target rectangle
     * @param options - Options affecting the collision test.
     * @returns The objects in the Quadtree which represent potential collisions
     */
    getObjects(
      rect: Canvas.Rectangle,
      options?: NullishProps<{
        /* Function to further refine objects to return
         * after a potential collision is found. Parameters are the object and rect, and the
         * function should return true if the object should be added to the result set.
         */
        collisionTest: (o: QuadtreeObject<T>, rect: Canvas.Rectangle) => boolean;

        /** The existing result set, for internal use.
         *  (default: `new Set<T>()`)
         */
        _s?: Set<T>;
      }>,
    ): Set<T>;

    /**
     * Obtain the leaf nodes to which a target rectangle belongs.
     * This traverses the quadtree recursively obtaining the final nodes which have no children.
     * @param rect - The target rectangle.x
     * @returns The Quadtree nodes to which the target rectangle belongs
     */
    getLeafNodes(rect: Canvas.Rectangle): Quadtree<T>[];

    /**
     * Obtain the child nodes within the current node which a rectangle belongs to.
     * Note that this function is not recursive, it only returns nodes at the current or child level.
     * @param rect - The target rectangle.
     * @returns The Quadtree nodes to which the target rectangle belongs
     */
    getChildNodes(rect: Canvas.Rectangle): Quadtree<T>[];

    /**
     * Identify all nodes which are adjacent to this one within the parent Quadtree.
     */
    getAdjacentNodes(): Quadtree<T>[];

    /**
     * Visualize the nodes and objects in the quadtree
     * @param objects - Visualize the rectangular bounds of objects in the Quadtree. Default is false.
     *                  (default: `false`)
     */
    visualize({ objects }?: NullishProps<{ objects: boolean }>): void;
  }

  namespace Quadtree {
    type INDICES = Brand<number, "Quadtree.INDICIES">;

    type AnyConstructor = typeof AnyQuadtree;

    /**
     * Additional options which configure the Quadtree
     */
    interface Options<T> {
      /**
       * The maximum number of objects per node
       * @defaultValue `20`
       */
      maxObjects?: number | undefined;

      /**
       * The maximum number of levels within the root Quadtree
       * @defaultValue `4`
       */
      maxDepth?: number | undefined;

      /**
       * The depth level of the sub-tree. For internal use
       * @defaultValue `0`
       * @internal
       */
      _depth?: number | undefined;

      /**
       * The root of the quadtree. For internal use
       * @internal
       */
      _root?: Quadtree<T> | undefined | null;
    }
  }
  /**
   * A subclass of Quadtree specifically intended for classifying the location of objects on the game canvas.
   */
  class CanvasQuadtree extends Quadtree<object> {
    constructor(options?: Quadtree.Options<object>);

    readonly bounds: PIXI.Rectangle;
  }
}

declare abstract class AnyQuadtree extends Quadtree<any> {
  constructor(arg0: never, ...args: never[]);
}
