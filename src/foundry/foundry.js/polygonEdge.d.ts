import type { ConfiguredObjectClassOrDefault } from './config.js';

declare global {
  /**
   * An internal data structure for polygon edges
   * @internal
   */
  class PolygonEdge {
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
    static fromWall(
      wall: ConfiguredObjectClassOrDefault<typeof Wall> | WallDocument,
      type: foundry.CONST.WALL_RESTRICTION_TYPES
    ): PolygonEdge;
  }
}
