export {};

// The structure of this file is a bit unusual to accommodate for the reuse of functions across the various Graphics classes

type PolygonOrPoints = number[] | PIXI.IPointData[] | PIXI.Polygon[];

interface GraphicsHelper {
    /**
     * Draws a path.
     * @param path - The polygon or points.
     * @returns This Graphics instance.
     */
    drawPath(...path: PolygonOrPoints): this;

    /**
     * Draws a smoothed polygon.
     * @param path - The polygon or points.
     * @returns This Graphics instance.
     */
    drawSmoothedPolygon(...path: PolygonOrPoints): this;

    /**
     * Draws a smoothed path.
     * @param path - The polygon or points.
     * @returns This Graphics instance.
     */
    drawSmoothedPath(...path: PolygonOrPoints): this;
}

declare module "pixi.js" {
  interface Graphics extends GraphicsHelper {}
  // interface LegacyGraphics extends GraphicsHelper {}
  interface SmoothGraphics extends GraphicsHelper {}
}
