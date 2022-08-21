/**
 * A CanvasLayer responsible for drawing a square grid
 */
declare class GridLayer extends CanvasLayer<GridLayer.LayerOptions> {
  constructor();

  /**
   * The Grid container
   * @defaultValue `undefined`
   */
  grid: BaseGrid | undefined;

  /**
   * The Grid Highlight container
   * @defaultValue `undefined`
   */
  highlight: PIXI.Container | undefined;

  /**
   * Map named highlight layers
   * @defaultValue `{}`
   */
  highlightLayers: Record<string, GridHighlight>;

  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["grid"];

  /**
   * @defaultValue
   * ```typescript
   * mergeObject(super.layerOptions, {
   *   name: "grid",
   *   zIndex: 30
   * }
   * ```
   */
  static override get layerOptions(): GridLayer.LayerOptions;

  /**
   * The grid type rendered in this Scene
   */
  get type(): foundry.CONST.GRID_TYPES;

  /**
   * A convenient reference to the pixel grid size used throughout this layer
   */
  get size(): number;

  /**
   * Get grid unit width
   */
  get w(): BaseGrid["w"];

  /**
   * Get grid unit height
   */
  get h(): BaseGrid["h"];

  /**
   * A boolean flag for whether the current grid is hexagonal
   */
  get isHex(): boolean;

  /**
   * Draw the grid
   * @param preview - Override settings used in place of those saved to the Scene data
   */
  draw(preview?: DrawOptions): Promise<this>;

  /**
   * Given a pair of coordinates (x1,y1), return the grid coordinates (x2,y2) which represent the snapped position
   * @param x        - The exact target location x
   * @param y        - The exact target location y
   * @param interval - An interval of grid spaces at which to snap, default is 1. If the interval is zero, no snapping occurs.
   *                   (defaultValue: `1`)
   */
  getSnappedPosition(x: number, y: number, interval?: number): { x: number; y: number };

  /**
   * Given a pair of coordinates (x, y) - return the top-left of the grid square which contains that point
   * @returns An Array [x, y] of the top-left coordinate of the square which contains (x, y)
   */
  getTopLeft(x: number, y: number): PointArray;

  /**
   * Given a pair of coordinates (x, y), return the center of the grid square which contains that point
   * @returns An Array [x, y] of the central point of the square which contains (x, y)
   */
  getCenter(x: number, y: number): PointArray;

  /**
   * Measure the distance between two point coordinates.
   * @param origin  - The origin point
   * @param target  - The target point
   * @param options - Additional options which modify the measurement
   *                  (default: `{}`)
   * @returns The measured distance between these points
   *
   * @example
   * ```typescript
   * let distance = canvas.grid.measureDistance({x: 1000, y: 1000}, {x: 2000, y: 2000});
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
    },
    options?: MeasureDistancesOptions | undefined
  ): number;

  /**
   * Measure the distance traveled over an array of distance segments.
   * @param segments - An array of measured segments
   * @param options  - Additional options which modify the measurement
   *                   (default: `{}`)
   */
  measureDistances(segments: GridLayer.Segment[], options?: MeasureDistancesOptions | undefined): number[];

  /**
   * Define a new Highlight graphic
   * @param name - The name for the referenced highlight layer
   */
  addHighlightLayer(name: string): GridHighlight;

  /**
   * Clear a specific Highlight graphic
   * @param name - The name for the referenced highlight layer
   */
  clearHighlightLayer(name: string): void;

  /**
   * Destroy a specific Highlight graphic
   * @param name - The name for the referenced highlight layer
   */
  destroyHighlightLayer(name: string): void;

  /**
   * Obtain the highlight layer graphic by name
   * @param name - The name for the referenced highlight layer
   */
  getHighlightLayer(name: string): GridHighlight | undefined;

  /**
   * Add highlighting for a specific grid position to a named highlight graphic
   * @param name    - The name for the referenced highlight layer
   * @param options - Options for the grid position that should be highlighted
   */
  highlightPosition(name: string, options?: Parameters<BaseGrid["highlightGridPosition"]>[1]): false | void;

  /**
   * Test if a specific row and column position is a neighboring location to another row and column coordinate
   * @param r0 - The original row position
   * @param c0 - The original column position
   * @param r1 - The candidate row position
   * @param c1 - The candidate column position
   */
  isNeighbor(r0: number, c0: number, r1: number, c1: number): boolean;
}

declare namespace GridLayer {
  interface LayerOptions extends CanvasLayer.LayerOptions {
    name: "grid";
    zIndex: 30;
  }

  interface Segment {
    ray: Ray;
    label?: Ruler["labels"]["children"][number];
  }
}

interface DrawOptions {
  /**
   * @defaultValue `null`
   */
  type?: foundry.CONST.GRID_TYPES | null;

  /**
   * @defaultValue `null`
   */
  dimensions?: Canvas["dimensions"] | null;

  /**
   * @defaultValue `null`
   */
  gridColor?: number | string | null;

  /**
   * @defaultValue `null`
   */
  gridAlpha?: number | null;
}

interface MeasureDistancesOptions {
  /** Return the distance in grid increments rather than the co-ordinate distance. */
  gridSpaces?: boolean;
}
