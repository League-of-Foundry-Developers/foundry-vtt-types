/**
 * A CanvasLayer responsible for drawing a square grid
 */
declare class GridLayer extends CanvasLayer {
  /**
   * The Grid container
   * (default: `null`)
   */
  grid: PIXI.Container;

  /**
   * The Grid Highlight container
   * (default: `null`)
   */
  highlight: PIXI.Container;

  /**
   * Map named highlight layers
   */
  highlightLayers: GridHighlight;
  constructor();
  /* -------------------------------------------- */

  /** @override */
  static get layerOptions(): any;

  /* -------------------------------------------- */

  /**
   * The grid type rendered in this Scene
   */
  get type(): string;

  /**
   * A convenient reference to the pixel grid size used throughout this layer
   */
  get size(): number;

  /**
   * Get grid unit width
   */
  get w(): any;

  /**
   * Get grid unit height
   */
  get h(): any;

  /**
   * A boolean flag for whether the current grid is hexagonal
   */
  get isHex(): boolean;

  /* -------------------------------------------- */

  /**
   * Draw the grid
   * @param preview - Override settings used in place of those saved to the Scene data
   *                  (type: `object`)
   */
  draw(): Promise<this>;

  /**
   * Given a pair of coordinates (x1,y1), return the grid coordinates (x2,y2) which represent the snapped position
   * @param x        - The exact target location x
   *                   (type: `number`)
   * @param y        - The exact target location y
   *                   (type: `number`)
   * @param interval - An interval of grid spaces at which to snap, default is 1.
   *                   (type: `number`)
   */
  getSnappedPosition(x: number, y: number, interval: number): PIXI.Container;

  /**
   * Given a pair of coordinates (x, y) - return the top-left of the grid square which contains that point
   * @returns - An Array [x, y] of the top-left coordinate of the square which contains (x, y)
   *            (type: `number[]`)
   */
  getTopLeft(x: number, y: number): number[];

  /**
   * Given a pair of coordinates (x, y), return the center of the grid square which contains that point
   * @returns - An Array [x, y] of the central point of the square which contains (x, y)
   *            (type: `number[]`)
   */
  getCenter(x: number, y: number): number[];

  /**
   * Measure the grid-wise distance between two point coordinates.
   * @param origin - The origin point
   *                 (type: `{x: number, y: number}`)
   * @param target - The target point
   *                 (type: `{x: number, y: number}`)
   * @returns      - The measured distance between these points
   *                 (type: `number`)
   *
   * @example
   * let distance = canvas.grid.measureDistance((x: 1000, y: 1000), (x: 2000, y: 2000));
   */
  measureDistance(
    origin: {
      x: number;
      y: number;
    },
    target: {
      x: number;
      y: number;
    }
  ): number;

  /**
   * Measure the distance traveled over an array of distance segments.
   * @param segments - An array of measured segments
   *                   (type: `object[]`)
   * @param options  - Additional options which modify the measurement
   *                   (type: `Options`)
   */
  measureDistances(segments: object[], options: Options): PIXI.Container;

  /* -------------------------------------------- */
  /*  Grid Highlighting Methods
  /* -------------------------------------------- */

  /**
   * Define a new Highlight graphic
   * @param name - (type: `any`)
   */
  addHighlightLayer(name: any): any;

  /**
   * Clear a specific Highlight graphic
   * @param name - (type: `any`)
   */
  clearHighlightLayer(name: any): void;

  /**
   * Destroy a specific Highlight graphic
   * @param name - (type: `any`)
   */
  destroyHighlightLayer(name: any): void;

  getHighlightLayer(name: any): any;

  highlightPosition(name: any, options: any): boolean;

  /**
   * Test if a specific row and column position is a neighboring location to another row and column coordinate
   */
  isNeighbor(r0: any, c0: any, r1: any, c1: any): any;
}
