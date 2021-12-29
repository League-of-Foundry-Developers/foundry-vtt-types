/**
 * An internal data structure for polygon edges
 * @internal
 */
declare class PolygonEdge {
  constructor(a: Point, b: Point, type: foundry.CONST.WALL_SENSE_TYPES, wall: Wall);

  /**
   * Is this edge limited in type?
   */
  get isLimited(): boolean;

  /**
   * Construct a PolygonEdge instance from a Wall placeable object.
   * @param wall - The Wall from which to construct an edge
   * @param type - The type of polygon being constructed
   */
  static fromWall(wall: Wall | WallDocument, type: foundry.CONST.WALL_RESTRICTION_TYPES): PolygonEdge;
}
