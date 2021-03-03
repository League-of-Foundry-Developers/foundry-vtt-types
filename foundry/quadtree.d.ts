declare interface QuadTreeObject<T> {
  /**
   * Rectangle of this object
   */
  r: Rectangle;
  /**
   * The stored data
   */
  t: T;
  /**
   * Set of quadtrees that hold this object
   */
  n: Set<Quadtree<T>>;
}

/**
 * A Quadtree implementation that supports collision detection for rectangles.
 */
declare class Quadtree<T> {
  /**
   * @param bounds  - The outer bounds of the region
   * @param options - Additional options which configure the Quadtree
   */
  constructor(bounds: Rectangle, { maxObjects, maxDepth, _depth }?: Quadtree.Options);

  /**
   * The bounding rectangle of the region
   */
  bounds: Rectangle;

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
  objects: QuadTreeObject<T>[];

  /**
   * Children of this node
   * @defaultValue `[]`
   */
  nodes: Quadtree<T>[];

  /**
   * Return an array of all the objects in the Quadtree (recursive)
   */
  get all(): QuadTreeObject<T>[];

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
  insert(obj: QuadTreeObject<T>): Quadtree<T>[];

  /**
   * Remove an object from the quadtree
   * @param target - The quadtree target being removed
   * @returns The Quadtree for method chaining
   */
  remove(target: T): this;

  /**
   * Split this node into 4 sub-nodes.
   * @returns The split Quadtree
   */
  split(): this;

  /**
   * Get all the objects which could collide with the provided rectangle
   * @param rect - The target rectangle
   * @param _s   - The existing result set, for internal use.
   * @returns The objects in the Quadtree which represent potential collisions
   */
  getObjects(rect: Rectangle, _s: Set<T>): Set<T>;

  /**
   * Obtain the leaf nodes to which a target rectangle belongs.
   * This traverses the quadtree recursively obtaining the final nodes which have no children.
   * @param rect - The target rectangle.
   * @returns The Quadtree nodes to which the target rectangle belongs
   */
  getLeafNodes(rect: Rectangle): Quadtree<T>[];

  /**
   * Obtain the child nodes within the current node which a rectangle belongs to.
   * Note that this function is not recursive, it only returns nodes at the current or child level.
   * @param rect - The target rectangle.
   * @returns The Quadtree nodes to which the target rectangle belongs
   */
  getChildNodes(rect: Rectangle): Quadtree<T>[];

  /**
   * Visualize the nodes and objects in the quadtree
   * @param objects - Visualize the rectangular bounds of objects in the Quadtree. Default is false.
   */
  visualize({ objects }?: { objects?: boolean }): void;

  /**
   * A constant that enumerates the index order of the quadtree nodes from top-left to bottom-right.
   */
  static readonly INDICES: {
    tl: 0;
    tr: 1;
    bl: 2;
    br: 3;
  };
}

declare namespace Quadtree {
  /**
   * Additional options which configure the Quadtree
   */
  interface Options {
    /**
     * The maximum number of objects per node
     */
    maxObjects?: number;
    /**
     * The maximum number of levels within the root Quadtree
     */
    maxDepth?: number;
    /**
     * The depth level of the sub-tree. For internal use only
     * @internal
     */
    _depth?: number;
  }
}
