import type Document from "../../../../common/abstract/document.d.mts";

declare global {
  /**
   * An internal data structure for polygon edges
   * @internal
   */
  class PolygonEdge {
    constructor(a: Point, b: Point, type: foundry.CONST.WALL_SENSE_TYPES, wall: Wall);

    /**
     * An internal flag used to record whether an Edge represents a canvas boundary.
     */
    protected _isBoundary: boolean;

    /**
     * Is this edge limited in type?
     */
    get isLimited(): boolean;

    /**
     * Construct a PolygonEdge instance from a Wall placeable object.
     * @param wall - The Wall from which to construct an edge
     * @param type - The type of polygon being constructed
     */
    static fromWall(
      wall: Document.ConfiguredObjectClassForName<"Wall"> | WallDocument,
      type: foundry.CONST.WALL_RESTRICTION_TYPES,
    ): PolygonEdge;
  }
}
