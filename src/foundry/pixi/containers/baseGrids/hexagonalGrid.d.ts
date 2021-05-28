// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * Construct a hexagonal grid
 */
declare class HexagonalGrid extends BaseGrid {
  columns: boolean;

  even: boolean;

  h: number;

  w: number;
  constructor(options: {
    dimensions: Canvas['dimensions'];
    color: string;
    alpha: Scene['data']['gridAlpha'];
    columns?: boolean;
    even?: boolean;
  });

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

  /** @override */
  draw(): this;

  /**
   * A convenience method for getting all the polygon points relative to a top-left [x,y] coordinate pair
   * @param x - The top-left x-coordinate
   * @param y - The top-right y-coordinate
   * @param w - An optional polygon width
   * @param h - An optional polygon height
   */
  getPolygon(x: number, y: number, w: number, h: number): PointArray[];

  protected _drawGrid(): PIXI.Graphics;

  protected _drawRows(grid: PIXI.Graphics, nrows: number, ncols: number): void;

  protected _drawColumns(grid: PIXI.Graphics, nrows: number, ncols: number): void;

  /** @override */
  getGridPositionFromPixels(x: number, y: number): PointArray;

  /** @override */
  getPixelsFromGridPosition(row: number, col: number): PointArray;

  /** @override */
  getTopLeft(x: number, y: number): PointArray;

  /** @override */
  getCenter(x: number, y: number): PointArray;

  /** @override  */
  getSnappedPosition(x: number, y: number, interval: number): { x: number; y: number };

  /** @override */
  shiftPosition(x: number, y: number, dx: number, dy: number): PointArray;

  /** @override */
  highlightGridPosition(
    layer: GridHighlight,
    options: {
      x: number;
      y: number;
      color: number;
      border: number;
      alpha: number;
      shape: PIXI.Polygon;
    }
  ): void;

  /** @override */
  getNeighbors(row: number, col: number): [number, number][];

  /** @override */
  measureDistances(
    segments: { ray: Ray; label?: Ruler['labels']['children'][number] }[],
    options?: { gridSpaces?: boolean }
  ): number[];

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
  static pixelToCube(x: number, y: number): [number, number, number];

  /**
   * Measure the distance in hexagons between two cube coordinates
   */
  static cubeDistance(a: number, b: number): number;

  /**
   * @deprecated since 0.7.4
   * @see HexagonalGrid#getPolygon
   */
  getFlatHexPolygon(x: number, y: number, w: number, h: number): PointArray[];

  /**
   * @deprecated since 0.7.4
   * @see HexagonalGrid.getPolygon
   */
  getPointyHexPolygon(x: number, y: number, w: number, h: number): PointArray[];
}
