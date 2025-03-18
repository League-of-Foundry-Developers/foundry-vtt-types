/** The node of a {@link RegionPolygonTree | `RegionPolygonTree`}.*/
declare class RegionPolygonTreeNode {
  /**
   * Create a RegionPolygonTreeNode.
   * @param parent    - The parent node.
   * @remarks Foundry marked `@internal`
   */
  constructor(parent: RegionPolygonTreeNode | null);

  /**
   * Create a node from the Clipper path and add it to the children of the parent.
   * @param clipperPath   - The clipper path of this node.
   * @param parent        - The parent node or `null` if root.
   * @remarks Foundry marked `@internal`, called exclusively  {@link RegionPolygonTree._fromClipperPolyTree | `RegionPolygonTree._fromClipperPolyTree`}
   */
  protected static _fromClipperPath(
    clipperPath: ClipperLib.Path,
    parent: RegionPolygonTreeNode | null,
  ): RegionPolygonTreeNode;

  /** The parent of this node or `null` if this is the root node. */
  get parent(): RegionPolygonTreeNode | null;

  /**
   * The children of this node.
   * @remarks Foundry types this as `ReadonlyArray<>`, but does nothing to prevent writes
   * at runtime, just returning a reference to `this.#children`
   */
  get children(): RegionPolygonTreeNode[];

  /**
   * The depth of this node.
   *
   * The depth of the root node is 0.
   */
  get depth(): number;

  /**
   * Is this a hole?
   *
   * The root node is a hole.
   */
  get isHole(): boolean;

  /**
   * The Clipper path of this node.
   *
   * It is empty in case of the root node.
   * @remarks Foundry types this as `ReadonlyArray<>`, but does nothing to prevent writes
   * at runtime, just returning a reference to `this.#clipperPath`
   */
  get clipperPath(): ClipperLib.Path | null;

  /**
   * The polygon of this node.
   *
   * It is `null` in case of the root node.
   */
  get polygon(): PIXI.Polygon | null;

  /**
   * The points of the polygon ([x0, y0, x1, y1, ...]).
   *
   * They are `null` in case of the root node.
   * @remarks Foundry types this as `ReadonlyArray<>`, but does nothing to prevent writes
   * at runtime, just returning a reference to `this.polygon.points`
   */
  get points(): number[] | null;

  /**
   * The bounds of the polygon.
   *
   * They are `null` in case of the root node.
   */
  get bounds(): PIXI.Rectangle | null;

  /** @privateRemarks Recursively iterates all child nodes */
  [Symbol.iterator](): Generator<RegionPolygonTreeNode>;

  /**
   * Test whether given point is contained within this node.
   * @param point - The point.
   */
  testPoint(point: Canvas.Point): boolean;

  /**
   * Test circle containment/intersection with this node.
   * @param center    - The center point of the circle.
   * @param radius    - The radius of the circle.
   * @returns         - -1: the circle is in the exterior and does not intersect the boundary.
   *                  - 0: the circle is intersects the boundary.
   *                  - 1: the circle is in the interior and does not intersect the boundary.
   */
  testCircle(center: Canvas.Point, radius: number): -1 | 0 | 1;
}

declare namespace RegionPolygonTreeNode {
  interface Any extends AnyRegionPolygonTreeNode {}
  type AnyConstructor = typeof AnyRegionPolygonTreeNode;
}

/** The polygon tree of a {@link Region | `Region`}. */
declare class RegionPolygonTree extends RegionPolygonTreeNode {
  /**
   * Create a RegionPolygonTree
   * @remarks Foundry marked `@internal`
   */
  constructor();

  /**
   * Create the tree from a Clipper polygon tree.
   * @remarks Foundry marked `@internal`, called exclusively from {@link Region#polygonTree | `Region#polygonTree`}
   */
  protected static _fromClipperPolyTree(clipperPolyTree: ClipperLib.PolyTree): RegionPolygonTree;
}

declare namespace RegionPolygonTree {
  interface Any extends AnyRegionPolygonTree {}
  type AnyConstructor = typeof AnyRegionPolygonTree;
}

declare abstract class AnyRegionPolygonTreeNode extends RegionPolygonTreeNode {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyRegionPolygonTree extends RegionPolygonTree {
  constructor(arg0: never, ...args: never[]);
}

export default RegionPolygonTree;
