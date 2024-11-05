export {};

type GraphicsPath = [number[] | PIXI.IPointData[] | PIXI.Polygon] | Array<number | PIXI.IPointData>;

/**
 * @remarks Internal helper to accommodate for the reuse of functions across the various Graphics classes
 */
interface GraphicsHelper {
  /**
   * Draws a path.
   * @param path - The polygon or points.
   * @returns This Graphics instance.
   */
  drawPath(...path: GraphicsPath): this;

  /**
   * Draws a smoothed polygon.
   * @param path - The polygon or points.
   * @returns This Graphics instance.
   */
  drawSmoothedPolygon(...path: GraphicsPath): this;

  /**
   * Draws a smoothed path.
   * @param path - The polygon or points.
   * @returns This Graphics instance.
   */
  drawSmoothedPath(...path: GraphicsPath): this;
}

declare module "pixi.js" {
  interface Graphics extends GraphicsHelper {}
  // interface LegacyGraphics extends GraphicsHelper {}
  interface SmoothGraphics extends GraphicsHelper {}
}
