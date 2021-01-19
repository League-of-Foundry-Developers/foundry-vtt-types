/**
 * The base grid class.
 * This double-dips to implement the "gridless" option
 */
declare class BaseGrid extends PIXI.Container{

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
     * @type {Object}
     */
    highlight: object

    /**
     * TODO: comment what this does
     */
    draw (): this

    /**
   * Highlight a grid position for a certain coordinates
   * @param {GridHighlight} layer The highlight layer to use
   * @param {number} x            The x-coordinate of the highlighted position
   * @param {number} y            The y-coordinate of the highlighted position
   * @param {number} color        The hex fill color of the highlight
   * @param {number} border       The hex border color of the highlight
   * @param {number} alpha        The opacity of the highlight
   * @param {PIXI.Polygon} shape  A predefined shape to highlight
   *                              (type: ``PIXI.Polygon``) 
   */
  highlightGridPosition(
        layer: GridHighlight
        x: number
        y: number
        color: number
        border: number
        alpha: number
        shape: PIXI.Polygon
    ): void

  /* -------------------------------------------- */
  /*  Grid Measurement Methods
  /* -------------------------------------------- */

  /**
   * Given a pair of coordinates (x, y) - return the top-left of the grid square which contains that point
   * @param {number} x          The x-coordinate
   * @param {number} y          The y-coordinate
   * @return {number[]}    An Array [x, y] of the top-left coordinate of the square which contains (x, y)
   */
  getTopLeft(
      x: number
      y: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Given a pair of coordinates (x, y), return the center of the grid square which contains that point
   * @param {number} x          The x-coordinate
   * @param {number} y          The y-coordinate
   * @return {number[]}         An array [cx, cy] of the central point of the grid space which contains (x, y)
   */
  getCenter(
      x: number
      y: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Given a pair of coordinates (x1,y1), return the grid coordinates (x2,y2) which represent the snapped position
   * Under a "gridless" system, every pixel position is a valid snapping position
   *
   * @param {number} x          The exact target location x
   * @param {number} y          The exact target location y
   * @param {number|null} [interval]  An interval of grid spaces at which to snap.
   *                                  At interval=1, snapping occurs at pixel intervals defined by the grid size
   *                                  At interval=2, snapping would occur at the center-points of each grid size
   *                                  At interval=null, no snapping occurs
   *                                  (default: ``null``)
   *
   * @return {{x, y}}           An object containing the coordinates of the snapped location
   */
   getSnappedPosition(
       x: number
       y: number
       interval: number|null
   ): number[]

   /* -------------------------------------------- */

  /**
   * Given a pair of pixel coordinates, return the grid position as an Array.
   * Always round down to the nearest grid position so the pixels are within the grid space (from top-left).
   * @param {number} x    The x-coordinate pixel position
   * @param {number} y    The y-coordinate pixel position
   * @return {number[]}   An array representing the position in grid units
   */
  getGridPositionFromPixels(
      x: number
      y: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Given a pair of grid coordinates, return the pixel position as an Array.
   * Always round up to a whole pixel so the pixel is within the grid space (from top-left).
   * @param {number} x    The x-coordinate grid position
   * @param {number} y    The y-coordinate grid position
   * @return {number[]}   An array representing the position in pixels
   */
  getPixelsFromGridPosition(
      x: number
      y: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Shift a pixel position [x,y] by some number of grid units dx and dy
   * @param {number} x    The starting x-coordinate in pixels
   * @param {number} y    The starting y-coordinate in pixels
   * @param {number} dx   The number of grid positions to shift horizontally
   * @param {number} dy   The number of grid positions to shift vertically
   * @return {number[]}   An array representing the new position in pixels
   */
  shiftPosition(
      x: number
      y: number
      dx: number
      dy: number
  ): number[]

  /* -------------------------------------------- */

  /**
   * Measure the distance traversed over an array of measured segments
   * @param {object[]} segments     An Array of measured movement segments
   * @param {Options} options       Additional options which modify the measurement
   *                                (default: ``{}``)
   * @return {number[]}             An Array of distance measurements for each segment
   */
  measureDistances(
      segments: object[]
      options: Options
  ): number[]

  /* -------------------------------------------- */

  /**
   * Get the grid row and column positions which are neighbors of a certain position
   * @param {number} row  The grid row coordinate against which to test for neighbors
   * @param {number} col  The grid column coordinate against which to test for neighbors
   * @return {number[]}   An array of grid positions which are neighbors of the row and column
   */
  getNeighbors(
      row: number
      col: number
  ): number[]

  constructor (options: object)
}