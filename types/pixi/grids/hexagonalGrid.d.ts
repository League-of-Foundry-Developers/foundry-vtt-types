/**
 * Construct a hexagonal grid
 * @extends {BaseGrid}
 */
declare class HexagonalGrid extends BaseGrid {

  columns: boolean

  even: boolean

  h: number

  w: number

  /**
   * A matrix of x and y offsets which is multiplied by the width/height vector to get pointy-top polygon coordinates
   * @type {Array<number[]>}
   */
  pointyHexPoints (): Array<number[]>

  /* -------------------------------------------- */

  /**
   * A matrix of x and y offsets which is multiplied by the width/height vector to get flat-top polygon coordinates
   * @type {Array<number[]>}
   */
  flatHexPoints (): Array<number[]>

  /**
   * An array of the points which define a hexagon for this grid shape
   * @return {PointArray[]}
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
   * @param {number} x    The top-left x-coordinate
   * @param {number} y    The top-right y-coordinate
   * @param {number} [w]  An optional polygon width
   * @param {number} [h]  An optional polygon height
   * @return {PointArray[]}
   */
  getPolygon (
    x: number
    y: number
    w: number
    h: number
  ): PointArray[]

  /* -------------------------------------------- */

  _drawGrid (): PIXI.Graphics

  _drawRows (
    grid: any
    nrows: any
    ncols: any
  ): void

  _drawColumns (
    grid: any
    nrows: any
    ncols: any
  ): void

  /* -------------------------------------------- */
  /*  Grid Measurement Methods
  /* -------------------------------------------- */

  /** @override */
  getGridPositionFromPixels (
    x: any
    y: any
  ): number[]

  /* -------------------------------------------- */

  /** @override */
  getPixelsFromGridPosition (
    row: any
    col: any
  ): number[]

   /* -------------------------------------------- */

  /** @override */
  getTopLeft (
    x: any
    y: any
  ): number[]

  /* -------------------------------------------- */

  /** @override */
  /**
   * 
   * @param {any} x 
   * @param {any} y 
   */
  getCenter (
    x: any
    y: any
  ): number[]

  /* -------------------------------------------- */

  /** @override  */
  /**
   * 
   * @param {any} x 
   * @param {any} y 
   * @param {number} interval (default: ``1``)
   */
  getSnappedPosition (
    x: any
    y: any
    interval: number
  ): number[]

  /* -------------------------------------------- */

  /** @override */
  shiftPosition (
    x: any
    y: any
    dx: any
    dy: any
  ): any

  /* -------------------------------------------- */
  /*  Grid Highlighting
  /* -------------------------------------------- */

  /** @override */
  highlightGridPosition (
    layer: any
    options: any
  ): any

  /* -------------------------------------------- */

  /** @override */
  getNeighbors (
    row: any
    col: any
  ): number[][]

  /* -------------------------------------------- */

  /** @override */
  measureDistances (
    segments: any
    options: any
  ): number

  //TODO: helper functions

  constructor (options: object)
}