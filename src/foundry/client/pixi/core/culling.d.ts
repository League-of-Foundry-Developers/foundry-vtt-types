/**
 * A tool for culling the renderable state of objects which are outside the current viewport.
 */
declare class ScreenCulling {
  constructor();

  /**
   * Toggle the renderable state of objects based on the current viewport rectangle
   */
  cull(rect: Rectangle): void;

  /**
   * Test whether rectangular bounds intersect
   * @param rect   - The target rectangle (the screen)
   * @param bounds - The reference rectangle (the object)
   * @returns Do they intersect?
   */
  intersects(rect: Rectangle, bounds: Rectangle): boolean;
}

/**
 * An experimental approach to culling using the quadtree mapping rather than the screen rectangle.
 * @internal
 */
declare class QuadtreeCulling {
  constructor();

  cull(screen: Rectangle): void;

  protected _getRect(screen: Rectangle): NormalizedRectangle;
}

/**
 * Benchmark the performance of different culling methods
 * @internal
 */
declare function benchmarkCulling(n?: number): Promise<void>;
