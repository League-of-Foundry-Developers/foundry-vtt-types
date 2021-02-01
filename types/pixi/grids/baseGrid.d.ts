/**
 * The base grid class.
 * This double-dips to implement the "gridless" option
 */
declare class BaseGrid extends PIXI.Container {
  /**
     * Grid Unit Width
     */
  w: any

  /**
     * Grid Unit Height
     */
  h: any

  /**
     * Highlight active grid spaces
     */
  highlight: object

  constructor (options: PIXI.Container)
  /**
     * TODO: comment what this does
     */
  draw (): this

  /**
   * Highlight a grid position for a certain coordinates
   * @param layer  - The highlight layer to use
   *                 (type: `GridHighlight`)
   * @param x      - The x-coordinate of the highlighted position
   *                 (type: `number`)
   * @param y      - The y-coordinate of the highlighted position
   *                 (type: `number`)
   * @param color  - The hex fill color of the highlight
   *                 (type: `number`)
   *                 (default: `0x33BBFF`)
   * @param border - The hex border color of the highlight
   *                 (type: `number`)
   *                 (default: `null`)
   * @param alpha  - The opacity of the highlight
   *                 (type: `number`)
   *                 (default: `0.25`)
   * @param shape  - A predefined shape to highlight
   *                 (type: `PIXI.Polygon`)
   *                 (default: `null`)
   */
  highlightGridPosition (
    layer: GridHighlight,
    options: {
      x: number
      y: number
      color: number
      border: number
      alpha: number
      shape: PIXI.Polygon
    }
  ): void

  /* -------------------------------------------- */
  /*  Grid Measurement Methods
  /* -------------------------------------------- */

  /**
   * Given a pair of coordinates (x, y) - return the top-left of the grid square which contains that point
   * @param x - The x-coordinate
   *            (type: `number`)
   * @param y - The y-coordinate
   *            (type: `number`)
   * @returns - An Array [x, y] of the top-left coordinate of the square which contains (x, y)
   *            (type: `number[]`)
   */
  getTopLeft (
    x: number,
    y: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Given a pair of coordinates (x, y), return the center of the grid square which contains that point
   * @param x - The x-coordinate
   *            (type: `number`)
   * @param y - The y-coordinate
   *            (type: `number`)
   * @returns - An array [cx, cy] of the central point of the grid space which contains (x, y)
   *            (type: `number[]`)
   */
  getCenter (
    x: number,
    y: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Given a pair of coordinates (x1,y1), return the grid coordinates (x2,y2) which represent the snapped position
   * Under a "gridless" system, every pixel position is a valid snapping position
   *
   * @param x        - The exact target location x
   *                   (type: `number`)
   * @param y        - The exact target location y
   *                   (type: `number`)
   * @param interval - An interval of grid spaces at which to snap.
   *                   At interval=1, snapping occurs at pixel intervals defined by the grid size
   *                   At interval=2, snapping would occur at the center-points of each grid size
   *                   At interval=null, no snapping occurs
   *                   (type: `number|null`)
   *                   (default: `null`)
   * @returns        - An object containing the coordinates of the snapped location
   *                   (type: `{number, number}`)
   */
  getSnappedPosition (
    x: number,
    y: number,
    interval: number|null
  ): {x: number, y: number}
  /* -------------------------------------------- */

  /**
   * Given a pair of pixel coordinates, return the grid position as an Array.
   * Always round down to the nearest grid position so the pixels are within the grid space (from top-left).
   * @param x - The x-coordinate pixel position
   *            (type: `number`)
   * @param y - The y-coordinate pixel position
   *            (type: `number`)
   * @returns - An array [x, y] representing the position in grid units
   *            (type: `number[]`)
   */
  getGridPositionFromPixels (
    x: number,
    y: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Given a pair of grid coordinates, return the pixel position as an Array.
   * Always round up to a whole pixel so the pixel is within the grid space (from top-left).
   * @param x - The x-coordinate grid position
   *            (type: `number`)
   * @param y - The y-coordinate grid position
   *            (type: `number`)
   * @returns - An array [x, y] representing the position in pixels
   *            (type: `number[]`)
   */
  getPixelsFromGridPosition (
    x: number,
    y: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Shift a pixel position [x,y] by some number of grid units dx and dy
   * @param x  - The starting x-coordinate in pixels
   *             (type: `number`)
   * @param y  - The starting y-coordinate in pixels
   *             (type: `number`)
   * @param dx - The number of grid positions to shift horizontally
   *             (type: `number`)
   * @param dy - The number of grid positions to shift vertically
   *             (type: `number`)
   * @returns  - An array [x, y] representing the new position in pixels
   *             (type: `number[]`)
   */
  shiftPosition (
    x: number,
    y: number,
    dx: number,
    dy: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Measure the distance traversed over an array of measured segments
   * @param segments - An Array of measured movement segments
   *                   (type: `object[]`)
   * @param options  - Additional options which modify the measurement
   *                   (type: `Options`)
   *                   (default: `{}`)
   * @returns        - An Array of distance measurements for each segment
   *                   (type: `number[]`)
   */
  measureDistances (
    segments: object[],
    options: Options
  ): number[]

  /* -------------------------------------------- */

  /**
   * Get the grid row and column positions which are neighbors of a certain position
   * @param row - The grid row coordinate against which to test for neighbors
   *              (type: `number`)
   * @param col - The grid column coordinate against which to test for neighbors
   *              (type: `number`)
   * @returns   - An array of grid positions which are neighbors of the row and column
   *              (type: `number[]`)
   */
  getNeighbors (
    row: number,
    col: number
  ): number[]
}
