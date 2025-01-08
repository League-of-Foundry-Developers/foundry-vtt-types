/** The node of a {@link RegionPolygonTree}.*/
declare class RegionPolygonTreeNode {}

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
  static _fromClipperPolyTree(clipperPolyTree: ClipperLib.PolyTree): RegionPolygonTree
}

export default RegionPolygonTree;