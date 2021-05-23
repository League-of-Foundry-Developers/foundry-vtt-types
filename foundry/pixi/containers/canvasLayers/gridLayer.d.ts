/**
 * A CanvasLayer responsible for drawing a square grid
 */
declare class GridLayer extends CanvasLayer {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.layerOptions, {
   *   zIndex: 30
   * }
   * ```
   */
  static get layerOptions(): CanvasLayer.LayerOptions;

  constructor();

  /**
   * The Grid container
   * @defaultValue `null`
   */
  grid: BaseGrid | null;

  /**
   * The Grid Highlight container
   * @defaultValue `null`
   */
  highlight: PIXI.Container | null;

  /**
   * Map named highlight layers
   * @defaultValue `{}`
   */
  highlightLayers: Record<string, GridHighlight>;

  /**
   * Get grid unit height
   */
  get h(): BaseGrid['h'];

  /**
   * A boolean flag for whether the current grid is hexagonal
   */
  get isHex(): boolean;

  /**
   * A convenient reference to the pixel grid size used throughout this layer
   */
  get size(): number;

  /**
   * The grid type rendered in this Scene
   */
  get type(): Const.GridType;

  /**
   * Get grid unit width
   */
  get w(): BaseGrid['w'];

  /**
   * Define a new Highlight graphic
   */
  addHighlightLayer(name: string): GridHighlight;

  /**
   * Clear a specific Highlight graphic
   */
  clearHighlightLayer(name: string): void;

  /**
   * Destroy a specific Highlight graphic
   */
  destroyHighlightLayer(name: string): void;

  /**
   * Draw the grid
   * @param preview - Override settings used in place of those saved to the Scene data
   */
  draw({
    type,
    dimensions,
    gridColor,
    gridAlpha
  }?: {
    type?: Const.GridType | null;
    dimensions?: Canvas['dimensions'] | null;
    gridColor?: number | string | null;
    gridAlpha?: number | null;
  }): Promise<this>;

  /**
   * Given a pair of coordinates (x, y), return the center of the grid square which contains that point
   * @returns An Array [x, y] of the central point of the square which contains (x, y)
   */
  getCenter(x: number, y: number): PointArray;

  getHighlightLayer(name: string): GridHighlight | undefined;

  /**
   * Given a pair of coordinates (x1,y1), return the grid coordinates (x2,y2) which represent the snapped position
   * @param x        - The exact target location x
   * @param y        - The exact target location y
   * @param interval - An interval of grid spaces at which to snap, default is 1.
   */
  getSnappedPosition(x: number, y: number, interval: number): { x: number; y: number };

  /**
   * Given a pair of coordinates (x, y) - return the top-left of the grid square which contains that point
   * @returns An Array [x, y] of the top-left coordinate of the square which contains (x, y)
   */
  getTopLeft(x: number, y: number): PointArray;

  highlightPosition(name: string, options?: Parameters<BaseGrid['highlightGridPosition']>[1]): false | void;

  /**
   * Test if a specific row and column position is a neighboring location to another row and column coordinate
   */
  isNeighbor(r0: number, c0: number, r1: number, c1: number): boolean;

  /**
   * Measure the grid-wise distance between two point coordinates.
   * @param origin - The origin point
   * @param target - The target point
   * @returns The measured distance between these points
   *
   * @example
   * ```typescript
   * let distance = canvas.grid.measureDistance((x: 1000, y: 1000), (x: 2000, y: 2000));
   * ```
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
   * @param options  - Additional options which modify the measurement
   */
  measureDistances(
    segments: { ray: Ray; label?: Ruler['labels']['children'][number] }[],
    options?: { gridSpaces?: boolean }
  ): number[];
}
