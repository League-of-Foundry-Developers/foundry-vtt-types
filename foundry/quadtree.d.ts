/**
 * Additional options which configure the Quadtree
 */
declare interface QuadTreeOptions {
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
   * A constant that enumerates the index order of the quadtree nodes from top-left to bottom-right.
   */
  static readonly INDICES: Record<'tl' | 'tr' | 'bl' | 'br', number>;

  constructor(bounds: Rectangle, options?: QuadTreeOptions);

  /**
   * The bounding rectangle of the region
   */
  public bounds: Rectangle;

  /**
   * The maximum number of objects allowed within this node before it must split
   * @defaultValue 20
   */
  public maxObjects: number;

  /**
   * The maximum number of levels that the base quadtree is allowed
   * @defaultValue 4
   */
  public maxDepth: number;

  /**
   * The depth of this node within the root Quadtree
   * @defaultValue 0
   */
  public depth: number;

  /**
   * The objects contained at this level of the tree
   */
  public objects: QuadTreeObject<T>[];

  /**
   * Children of this node
   */
  public nodes: Quadtree<T>[];

  /**
   * Return an array of all the objects in the Quadtree (recursive)
   */
  readonly all: QuadTreeObject<T>[];

  /**
   * Clear the quadtree of all existing contents
   * @returns The cleared Quadtree
   */
  public clear(): Quadtree<T>;

  /**
   * Add a rectangle object to the tree
   * @param obj - The object being inserted
   * @returns The Quadtree nodes the object was added to.
   */
  public insert(obj: QuadTreeObject<T>): Quadtree<T>[];

  /**
   * Remove an object from the quadtree
   * @param target - The quadtree target being removed
   * @returns The Quadtree for method chaining
   */
  public remove(target: T): Quadtree<T>;

  /**
   * Split this node into 4 sub-nodes.
   * @returns The split Quadtree
   */
  public split(): Quadtree<T>;

  /**
   * Get all the objects which could collide with the provided rectangle
   * @param rect - The target rectangle
   * @param _s - The existing result set, for internal use.
   * @returns The objects in the Quadtree which represent potential collisions
   */
  public getObjects(rect: Rectangle, _s: Set<T>): Set<T>;

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
}
