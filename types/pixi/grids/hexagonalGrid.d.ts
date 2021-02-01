/**
 * Construct a hexagonal grid
 * @extends BaseGrid
 */
declare class HexagonalGrid extends BaseGrid {
  columns: boolean

  even: boolean

  h: number

  w: number
  constructor (options: object)
  /**
   * A matrix of x and y offsets which is multiplied by the width/height vector to get pointy-top polygon coordinates
   */
  pointyHexPoints (): number[][]

  /* -------------------------------------------- */

  /**
   * A matrix of x and y offsets which is multiplied by the width/height vector to get flat-top polygon coordinates
   */
  flatHexPoints (): number[][]

  /**
   * An array of the points which define a hexagon for this grid shape
   */
  hexPoints (): PointArray[]

  /* -------------------------------------------- */
  /*  Grid Rendering
  /* -------------------------------------------- */

  /** @override */
  draw (): this

  /* -------------------------------------------- */

  /**
   * A convenience method for getting all the polygon points relative to a top-left [x,y] coordinate pair
   * @param x - The top-left x-coordinate
   *            (type: `number`)
   * @param y - The top-right y-coordinate
   *            (type: `number`)
   * @param w - An optional polygon width
   *            (type: `number`)
   * @param h - An optional polygon height
   *            (type: `number`)
   * @returns - (type: `PointArray[]`)
   */
  getPolygon (
    x: number,
    y: number,
    w: number,
    h: number
  ): PointArray[]

  /* -------------------------------------------- */

  _drawGrid (): PIXI.Graphics

  _drawRows (
    grid: any,
    nrows: any,
    ncols: any
  ): void

  _drawColumns (
    grid: any,
    nrows: any,
    ncols: any
  ): void

  /* -------------------------------------------- */
  /*  Grid Measurement Methods
  /* -------------------------------------------- */

  /** @override */
  getGridPositionFromPixels (
    x: any,
    y: any
  ): number[]

  /* -------------------------------------------- */

  /** @override */
  getPixelsFromGridPosition (
    row: any,
    col: any
  ): number[]

  /* -------------------------------------------- */

  /** @override */
  getTopLeft (
    x: any,
    y: any
  ): number[]

  /* -------------------------------------------- */

  /** @override */
  /**
   *
   * @param x - (type: `any`)
   * @param y - (type: `any`)
   */
  getCenter (
    x: any,
    y: any
  ): number[]

  /* -------------------------------------------- */

  /** @override  */
  /**
   * @param x        - (type: `any`)
   * @param y        - (type: `any`)
   * @param interval - (type: `number`)
   *                   (default: `1`)
   */
  getSnappedPosition (
    x: any,
    y: any,
    interval: number
  ): {x: number, y: number}

  /* -------------------------------------------- */

  /** @override */
  shiftPosition (
    x: any,
    y: any,
    dx: any,
    dy: any
  ): any

  /* -------------------------------------------- */
  /*  Grid Highlighting
  /* -------------------------------------------- */

  /** @override */
  highlightGridPosition (
    layer: any,
    options: any
  ): any

  /* -------------------------------------------- */

  /** @override */
  getNeighbors (
    row: any,
    col: any
  ): number[]

  /* -------------------------------------------- */

  /** @override */
  measureDistances (
    segments: any,
    options: any
  ): number[]

  /* -------------------------------------------- */
  /*  Helper Functions
  /* -------------------------------------------- */

  /**
   * Convert an offset coordinate (row, col) into a cube coordinate (q, r, s).
   * See https://www.redblobgames.com/grids/hexagons/ for reference
   * Source code available https://www.redblobgames.com/grids/hexagons/codegen/output/lib-functions.js
   * @param row - The row number
   *              (type: `number`)
   * @param col - The column number
   *              (type: `number`)
   * @returns   - (type: `{number, number, number}`)
   */
  offsetToCube (
    row: number,
    col: number
  ): {q: number, r: number, s: number}

  /* -------------------------------------------- */

  /**
   * Convert a cube coordinate (q, r, s) into an offset coordinate (row, col).
   * See https://www.redblobgames.com/grids/hexagons/ for reference
   * Source code available https://www.redblobgames.com/grids/hexagons/codegen/output/lib-functions.js
   * @param q - Cube coordinate 1
   *            (type: `number`)
   * @param r - Cube coordinate 2
   *            (type: `number`)
   * @param s - Cube coordinate 3
   *            (type: `number`)
   * @returns - (type: `{row: number, col: number}`)
   */
  cubeToOffset (
    q: number,
    r: number,
    s: number
  ): {row: number, col: number}

  /* -------------------------------------------- */

  /**
   * Given a cursor position (x, y), obtain the cube coordinate hex (q, r, s) of the hex which contains it
   * http://justinpombrio.net/programming/2020/04/28/pixel-to-hex.html
   * @param x - The x-coordinate in pixels
   *            (type: `number`)
   * @param y - The y-coordinate in pixels
   *            (type: `number`)
   */
  static pixelToCube (
    x: number,
    y: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Measure the distance in hexagons between two cube coordinates
   */
  static cubeDistance (
    a: number,
    b: number
  ): number

  /* -------------------------------------------- */
  /*  Deprecated Functions                        */
  /* -------------------------------------------- */

  /**
   * @deprecated since 0.7.4
   * @see HexagonalGrid#getPolygon
   */
  getFlatHexPolygon (
    x: number,
    y: number,
    w: number,
    h: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * @deprecated since 0.7.4
   * @see HexagonalGrid#getPolygon
   */
  getPointyHexPolygon (
    x: number,
    y: number,
    w: number,
    h: number
  ): number[]
}
