import type { Point } from "../../../common/types.d.mts";

/** The node of a {@link RegionPolygonTree}.*/
declare class RegionPolygonTreeNode {
  /**
   * Create a RegionPolygonTreeNode.
   * @param parent    - The parent node.
   * @internal
   */
  constructor(parent: RegionPolygonTreeNode | null);

  /**
   * Create a node from the Clipper path and add it to the children of the parent.
   * @param clipperPath   - The clipper path of this node.
   * @param parent        - The parent node or `null` if root.
   * @internal
   */
  static _fromClipperPath(
    clipperPath: ClipperLib.IntPoint[],
    parent: RegionPolygonTreeNode | null,
  ): RegionPolygonTreeNode;

  /** The parent of this node or `null` if this is the root node. */
  get parent(): RegionPolygonTreeNode | null;
  #parent: RegionPolygonTreeNode | null;

  /** The children of this node. */
  get children(): ReadonlyArray<RegionPolygonTreeNode>;
  #children: RegionPolygonTreeNode[];

  /**
   * The depth of this node.
   * The depth of the root node is 0.
   */
  get depth(): number;
  #depth: number;

  /**
   * Is this a hole?
   * The root node is a hole.
   */
  get isHole(): boolean;
  #isHole: boolean;

  /**
   * The Clipper path of this node.
   * It is empty in case of the root node.
   */
  get clipperPath(): ReadonlyArray<ClipperLib.IntPoint> | null;
  #clipperPath: ClipperLib.IntPoint[] | null;

  /**
   * The polygon of this node.
   * It is `null` in case of the root node.
   */
  get polygon(): PIXI.Polygon | null;
  #polygon: PIXI.Polygon | null;

  /**
   * The points of the polygon ([x0, y0, x1, y1, ...]).
   * They are `null` in case of the root node.
   */
  get points(): ReadonlyArray<number> | null;

  /**
   * The bounds of the polygon.
   * They are `null` in case of the root node.
   */
  get bounds(): PIXI.Rectangle | null;
  #bounds: PIXI.Rectangle | null;

  [Symbol.iterator](): Generator<RegionPolygonTreeNode>;

  /**
   * Test whether given point is contained within this node.
   * @param point     - The point.
   */
  testPoint(point: Point): boolean;

  /**
   * Test point containment.
   * @param point           - The point.
   * @returns               - 0: not contained within the polygon of this node.
   *                        - 1: contained within the polygon of this node but also contained
   *                             inside the polygon of a sub-node that is a hole.
   *                        - 2: contained within the polygon of this node and not contained
   *                             inside any polygon of a sub-node that is a hole.
   */
  #testPoint(point: Point): 0 | 1 | 2;

  /**
   * Test circle containment/intersection with this node.
   * @param center    - The center point of the circle.
   * @param radius    - The radius of the circle.
   * @returns         - -1: the circle is in the exterior and does not intersect the boundary.
   *                  - 0: the circle is intersects the boundary.
   *                  - 1: the circle is in the interior and does not intersect the boundary.
   */
  testCircle(center: Point, radius: number): -1 | 0 | 1;

  /**
   * Test circle containment/intersection with this node.
   * @param center    - The center point of the circle.
   * @param radius    - The radius of the circle.
   * @returns         - 0: does not intersect the boundary or interior of this node.
   *                  - 1: contained within the polygon of this node but also contained
   *                       inside the polygon of a sub-node that is a hole.
   *                  - 2: contained within the polygon of this node and not contained
   *                       inside any polygon of a sub-node that is a hole.
   *                  - 3: intersects the boundary of this node or any sub-node.
   */
  #testCircle(center: Point, radius: number): 0 | 1 | 2 | 3;

  /** Create the polygon of this node. */
  #createPolygon(): void;
}

/** The polygon tree of a {@link Region}. */
declare class RegionPolygonTree extends RegionPolygonTreeNode {
  /**
   * Create a RegionPolygonTree
   * @internal
   */
  constructor();

  /**
   * Create the tree from a Clipper polygon tree.
   * @internal
   */
  static _fromClipperPolyTree(clipperPolyTree: ClipperLib.PolyTree): RegionPolygonTree;
}

export default RegionPolygonTree;
