/**
 * Construct a hexagonal grid
 */
declare class HexagonalGrid extends BaseGrid {
  constructor(options: BaseGrid.GridOptions);

  columns: boolean;

  even: boolean;

  h: number;

  w: number;

  /**
   * A matrix of x and y offsets which is multiplied by the width/height vector to get pointy-top polygon coordinates
   */
  static get pointyHexPoints(): PointArray[];

  /**
   * A matrix of x and y offsets which is multiplied by the width/height vector to get flat-top polygon coordinates
   */
  static get flatHexPoints(): PointArray[];

  /**
   * An array of the points which define a hexagon for this grid shape
   */
  get hexPoints(): PointArray[];

  override draw(preview?: BaseGrid.Preview | undefined): this;

  /**
   * A convenience method for getting all the polygon points relative to a top-left [x,y] coordinate pair
   * @param x - The top-left x-coordinate
   * @param y - The top-right y-coordinate
   * @param w - An optional polygon width
   * @param h - An optional polygon height
   */
  getPolygon(x: number, y: number, w?: number, h?: number): PointArray[];

  /**
   * Draw the grid lines.
   * @param preview - Override settings used in place of those saved to the scene data.
   * @internal
   */
  protected _drawGrid(preview?: BaseGrid.Preview | undefined): PIXI.Graphics;

  /** @internal */
  protected _drawRows(grid: PIXI.Graphics, nrows: number, ncols: number): void;

  /** @internal */
  protected _drawColumns(grid: PIXI.Graphics, nrows: number, ncols: number): void;

  /**
   * Get the position in grid space from a pixel coordinate.
   * @param x      - The origin x-coordinate
   * @param y      - The origin y-coordinate
   * @param method - The rounding method applied
   *                 (default: `"floor"`)
   * @returns The row, column combination
   */
  getGridPositionFromPixels(x: number, y: number, method?: "floor" | "ceil" | "round"): PointArray;

  override getPixelsFromGridPosition(row: number, col: number): PointArray;

  override getCenter(x: number, y: number): PointArray;

  /**
   * @param interval - (default: `1`)
   */
  override getSnappedPosition(x: number, y: number, interval?: number | null): { x: number; y: number };

  /** @internal */
  protected _getClosestVertex(xc: number, yc: number, ox: number, oy: number): { x: number; y: number };

  override shiftPosition(x: number, y: number, dx: number, dy: number): PointArray;

  /**
   * @param options - (default: `{}`)
   */
  override highlightGridPosition(layer: GridHighlight, options?: BaseGrid.HighlightGridPositionOptions): void;

  override getNeighbors(row: number, col: number): PointArray[];

  override measureDistances(segments: GridLayer.Segment[], options?: MeasureDistancesOptions): number[];

  /**
   * Convert an offset coordinate (row, col) into a cube coordinate (q, r, s).
   * See https://www.redblobgames.com/grids/hexagons/ for reference
   * Source code available https://www.redblobgames.com/grids/hexagons/codegen/output/lib-functions.js
   * @param row - The row number
   * @param col - The column number
   */
  offsetToCube(row: number, col: number): { q: number; r: number; s: number };

  /**
   * Convert a cube coordinate (q, r, s) into an offset coordinate (row, col).
   * See https://www.redblobgames.com/grids/hexagons/ for reference
   * Source code available https://www.redblobgames.com/grids/hexagons/codegen/output/lib-functions.js
   * @param q - Cube coordinate 1
   * @param r - Cube coordinate 2
   * @param s - Cube coordinate 3
   */
  cubeToOffset(q: number, r: number, s: number): { row: number; col: number };

  /**
   * Given a cursor position (x, y), obtain the cube coordinate hex (q, r, s) of the hex which contains it
   * http://justinpombrio.net/programming/2020/04/28/pixel-to-hex.html
   * @param x - The x-coordinate in pixels
   * @param y - The y-coordinate in pixels
   */
  static pixelToCube(x: number, y: number): [q: number, r: number, s: number];

  /**
   * Measure the distance in hexagons between two cube coordinates
   */
  static cubeDistance(a: { q: number; r: number; s: number }, b: { q: number; r: number; s: number }): number;
}
