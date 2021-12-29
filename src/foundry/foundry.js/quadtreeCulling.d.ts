/**
 * An experimental approach to culling using the quadtree mapping rather than the screen rectangle.
 * @internal
 */
declare class QuadtreeCulling {
  constructor();

  cull(screen: Rectangle): void;

  _getRect(screen: Rectangle): NormalizedRectangle;
}
