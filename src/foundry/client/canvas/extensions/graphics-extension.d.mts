export default function extendPIXIGraphics(): void;

declare global {
  namespace PIXI {
    namespace Graphics {
      type Path =
        | [points: number[] | PIXI.IPointData[] | PIXI.Polygon, smoothingFactor?: number]
        | Array<number | PIXI.IPointData>;
    }
  }
}

/**
 * @remarks Internal helper to accommodate for the reuse of functions across the various Graphics classes
 */
interface GraphicsHelper {
  /**
   * Draws a path.
   * @param path - The polygon or points.
   * @returns This Graphics instance.
   */
  drawPath(...path: PIXI.Graphics.Path): this;

  /**
   * Draws a smoothed polygon.
   * @param path - The polygon or points.
   * @returns This Graphics instance.
   */
  drawSmoothedPolygon(...path: PIXI.Graphics.Path): this;

  /**
   * Draws a smoothed path.
   * @param path - The polygon or points.
   * @returns This Graphics instance.
   */
  drawSmoothedPath(...path: PIXI.Graphics.Path): this;
}

declare module "pixi.js" {
  interface Graphics extends GraphicsHelper {}
}

declare module "@pixi/graphics-smooth" {
  interface SmoothGraphics extends GraphicsHelper {}
}
