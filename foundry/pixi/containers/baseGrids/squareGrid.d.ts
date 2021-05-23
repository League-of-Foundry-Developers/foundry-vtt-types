/**
 * Construct a square grid container
 */
declare class SquareGrid extends BaseGrid {
  /** @override */
  draw(): this;

  /** @override */
  getCenter(x: number, y: number): PointArray;

  /** @override */
  getGridPositionFromPixels(x: number, y: number): PointArray;

  /** @override */
  getNeighbors(row: number, col: number): [number, number][];

  /** @override */
  getPixelsFromGridPosition(row: number, col: number): PointArray;

  /** @override */
  getSnappedPosition(x: number, y: number, interval?: number | null): { x: number; y: number };

  /** @override */
  getTopLeft(x: number, y: number): PointArray;

  /** @override */
  highlightGridPosition(
    layer: GridHighlight,
    options?: {
      x: number;
      y: number;
      color: number;
      border: number;
      alpha: number;
      shape: PIXI.Polygon;
    }
  ): void;

  /** @override */
  measureDistances(
    segments: { ray: Ray; label?: Ruler['labels']['children'][number] }[],
    options?: { gridSpaces?: boolean }
  ): number[];

  /**
   * Shift a pixel position [x,y] by some number of grid units dx and dy
   * @param x  - The starting x-coordinate in pixels
   * @param y  - The starting y-coordinate in pixels
   * @param dx - The number of grid positions to shift horizontally
   * @param dy - The number of grid positions to shift vertically
   */
  shiftPosition(x: number, y: number, dx: number, dy: number): PointArray;

  protected _drawLine(points: [number, number, number, number], lineColor: number, lineAlpha: number): PIXI.Graphics;

  protected _getNearestVertex(x: number, y: number): PointArray;
}
