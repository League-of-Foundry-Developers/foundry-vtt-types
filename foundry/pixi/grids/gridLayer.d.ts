/**
 * A CanvasLayer responsible for drawing a square grid
 */
declare class GridLayer extends CanvasLayer {
  constructor();

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
  highlightLayers: Record<string, GridHighlight>;

  /** @override */
  static get layerOptions(): CanvasLayer.LayerOptions;

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

  /**
   * Draw the grid
   * @param preview - Override settings used in place of those saved to the Scene data
   *                  (type: `object`)
   */
  draw({
    type,
    dimensions,
    gridColor,
    gridAlpha
  }?: {
    type?: string | null;
    dimensions?: Canvas['dimensions'];
    gridColor?: number | null;
    gridAlpha?: number | null;
  }): Promise<this>;

  /**
   * Given a pair of coordinates (x1,y1), return the grid coordinates (x2,y2) which represent the snapped position
   * @param x        - The exact target location x
   * @param y        - The exact target location y
   * @param interval - An interval of grid spaces at which to snap, default is 1.
   */
  getSnappedPosition(x: number, y: number, interval: number): { x: number; y: number };

  /**
   * Given a pair of coordinates (x, y) - return the top-left of the grid square which contains that point
   * @returns - An Array [x, y] of the top-left coordinate of the square which contains (x, y)
   */
  getTopLeft(x: number, y: number): PointArray;

  /**
   * Given a pair of coordinates (x, y), return the center of the grid square which contains that point
   * @returns - An Array [x, y] of the central point of the square which contains (x, y)
   */
  getCenter(x: number, y: number): PointArray;

  /**
   * Measure the grid-wise distance between two point coordinates.
   * @param origin - The origin point
   * @param target - The target point
   * @returns        The measured distance between these points
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
  ): PIXI.Container;

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

  getHighlightLayer(name: string): GridHighlight;

  highlightPosition(
    name: string,
    options: {
      x: number;
      y: number;
      color: number;
      border: number;
      alpha: number;
      shape: PIXI.Polygon;
    }
  ): false | void;

  /**
   * Test if a specific row and column position is a neighboring location to another row and column coordinate
   */
  isNeighbor(r0: number, c0: number, r1: number, c1: number): boolean;
}
