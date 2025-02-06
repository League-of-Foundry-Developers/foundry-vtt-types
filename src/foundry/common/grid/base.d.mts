import type { AnyObject, InexactPartial } from "fvtt-types/utils";

/**
 * The base grid class.
 */
declare abstract class BaseGrid {
  /** The base grid constructor. */
  constructor(config: BaseGrid.Configuration);

  size: number;

  sizeX: number;

  sizeY: number;

  distance: number;

  units: string;

  style: string;

  thickness: number;

  color: Color;

  alpha: number;

  /**
   * The grid type (see {@link CONST.GRID_TYPES}).
   */
  type: CONST.GRID_TYPES;

  get isGridless(): boolean;

  get isSquare(): boolean;

  get isHexagonal(): boolean;

  /**
   * Calculate the total size of the canvas with padding applied, as well as the top-left coordinates of the inner
   * rectangle that houses the scene.
   * @param sceneWidth  - The width of the scene.
   * @param sceneHeight - The height of the scene.
   * @param padding     - The percentage of padding.
   */
  abstract calculateDimensions(sceneWidth: number, sceneHeight: number, padding: number): BaseGrid.Dimensions;

  /**
   * Returns the offset of the grid space corresponding to the given coordinates.
   * @param coords -The coordinates
   * @returns The offset
   */
  abstract getOffset(coords: BaseGrid.Coordinates): BaseGrid.Offset;

  /**
   * Returns the smallest possible range containing the offsets of all grid spaces that intersect the given bounds.
   * If the bounds are empty (non-positive width or height), then the offset range is empty.
   * @example
   * ```js
   * const [i0, j0, i1, j1] = grid.getOffsetRange(bounds);
   * for ( let i = i0; i < i1; i++ ) {
   *   for ( let j = j0; j < j1; j++ ) {
   *     const offset = {i, j};
   *     // ...
   *   }
   * }
   * ```
   * @param bounds - The bounds
   * @returns The offset range
   */
  abstract getOffsetRange(bounds: Canvas.Rectangle): BaseGrid.OffsetRange;

  /**
   * Returns the offsets of the grid spaces adjacent to the one corresponding to the given coordinates.
   * Returns an empty array in gridless grids.
   * @param coords - The coordinates
   * @returns The adjacent offsets
   */
  abstract getAdjacentOffsets(coords: BaseGrid.Coordinates): BaseGrid.Offset[];

  /**
   * Returns true if the grid spaces corresponding to the given coordinates are adjacent to each other.
   * In square grids with illegal diagonals the diagonally neighboring grid spaces are not adjacent.
   * Returns false in gridless grids.
   * @param coords1 - The first coordinates
   * @param coords2 - The second coordinates
   */
  abstract testAdjacency(coords1: BaseGrid.Coordinates, coords2: BaseGrid.Coordinates): boolean;

  /**
   * Returns the offset of the grid space corresponding to the given coordinates
   * shifted by one grid space in the given direction.
   * In square grids with illegal diagonals the offset of the given coordinates is returned
   * if the direction is diagonal.
   * @param coords    - The coordinates
   * @param direction - The direction (see {@link CONST.MOVEMENT_DIRECTIONS})
   * @returns The offset
   */
  abstract getShiftedOffset(coords: BaseGrid.Coordinates, direction: number): BaseGrid.Offset;

  /**
   * Returns the point shifted by the difference between the grid space corresponding to the given coordinates
   * and the shifted grid space in the given direction.
   * In square grids with illegal diagonals the point is not shifted if the direction is diagonal.
   * In gridless grids the point coordinates are shifted by the grid size.
   * @param point     - The point that is to be shifted
   * @param direction - The direction (see {@link CONST.MOVEMENT_DIRECTIONS})
   * @returns The shifted point
   */
  abstract getShiftedPoint(point: Canvas.Point, direction: number): Canvas.Point;

  /**
   * Returns the top-left point of the grid space corresponding to the given coordinates.
   * If given a point, the top-left point of the grid space that contains it is returned.
   * In gridless grids a point with the same coordinates as the given point is returned.
   * @param coords - The coordinates
   * @returns The top-left point
   */
  abstract getTopLeftPoint(coords: BaseGrid.Coordinates): Canvas.Point;

  /**
   * Returns the center point of the grid space corresponding to the given coordinates.
   * If given a point, the center point of the grid space that contains it is returned.
   * In gridless grids a point with the same coordinates as the given point is returned.
   * @param coords- The coordinates
   * @returns The center point
   */
  abstract getCenterPoint(coords: BaseGrid.Coordinates): Canvas.Point;

  /**
   * Returns the points of the grid space shape relative to the center point.
   * The points are returned in the same order as in {@link BaseGrid#getVertices}.
   * In gridless grids an empty array is returned.
   * @returns The points of the polygon
   */
  abstract getShape(): Canvas.Point[];

  /**
   * Returns the vertices of the grid space corresponding to the given coordinates.
   * The vertices are returned ordered in positive orientation with the first vertex
   * being the top-left vertex in square grids, the top vertex in row-oriented
   * hexagonal grids, and the left vertex in column-oriented hexagonal grids.
   * In gridless grids an empty array is returned.
   * @param coords - The coordinates
   * @returns The vertices
   */
  abstract getVertices(coords: BaseGrid.Coordinates): Canvas.Point[];

  /**
   * Snaps the given point to the grid.
   * @param point    - The point that is to be snapped
   * @param behavior - The snapping behavior
   * @returns The snapped point
   */
  abstract getSnappedPoint({ x, y }: Canvas.Point, behavior: BaseGrid.SnappingBehavior): Canvas.Point;

  /**
   * Measure a shortest, direct path through the given waypoints.
   * @param waypoints - The waypoints the path must pass through
   * @param options   - Additional measurement options
   * @returns The measurements a shortest, direct path through the given waypoints.
   */
  measurePath(
    waypoints: BaseGrid.MeasurePathWaypoint[],
    options: InexactPartial<{
      /**
       * The function that returns the cost for a given move between
       * grid spaces (default is the distance traveled along the direct path)
       */
      cost: BaseGrid.MeasurePathCostFunction;
    }>,
  ): BaseGrid.MeasurePathResult;

  /**
   * Measures the path and writes the measurements into `result`.
   * Called by {@link BaseGrid#measurePath}.
   * @param waypoints - The waypoints the path must pass through
   * @param options   - Additional measurement options
   * @param result    - The measurement result that the measurements need to be written to
   */
  protected abstract _measurePath(
    waypoints: BaseGrid.MeasurePathWaypoint[],
    options: InexactPartial<{
      /**
       * The function that returns the cost for a given move between
       * grid spaces (default is the distance traveled along the direct path)
       */
      cost: BaseGrid.MeasurePathCostFunction;
    }>,
    result: BaseGrid.MeasurePathResult,
  ): void;

  /**
   * Returns the sequence of grid offsets of a shortest, direct path passing through the given waypoints.
   * @param waypoints - The waypoints the path must pass through
   * @returns The sequence of grid offsets of a shortest, direct path
   */
  abstract getDirectPath(waypoints: BaseGrid.Coordinates[]): BaseGrid.Offset[];

  /**
   * Get the point translated in a direction by a distance.
   * @param point     - The point that is to be translated.
   * @param direction - The angle of direction in degrees.
   * @param distance  - The distance in grid units.
   * @returns The translated point.
   */
  abstract getTranslatedPoint(point: Canvas.Point, direction: number, distance: number): Canvas.Point;

  /**
   * Get the circle polygon given the radius in grid units for this grid.
   * The points of the polygon are returned ordered in positive orientation.
   * In gridless grids an approximation of the true circle with a deviation of less than 0.25 pixels is returned.
   * @param radius - The radius in grid units.
   * @param center - The center point of the circle.
   * @returns The points of the circle polygon.
   */
  abstract getCircle(center: Canvas.Point, radius: number): Canvas.Point[];

  /**
   * Get the cone polygon given the radius in grid units and the angle in degrees for this grid.
   * The points of the polygon are returned ordered in positive orientation.
   * In gridless grids an approximation of the true cone with a deviation of less than 0.25 pixels is returned.
   * @param origin    - The origin point of the cone.
   * @param radius    - The radius in grid units.
   * @param direction - The direction in degrees.
   * @param angle     - The angle in degrees.
   * @returns The points of the cone polygon.
   */
  getCone(origin: Canvas.Point, radius: number, direction: number, angle: number): Canvas.Point[];

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /**
   * Determine a placeable's bounding box based on the size of the grid.
   * @param w - The width in grid spaces.
   * @param h - The height in grid spaces.
   * @deprecated Since v12 until v14. If you need the size of a Token, use Token#getSize instead.
   */
  getRect(w: number, h: number): PIXI.Rectangle;

  /**
   * Calculate the total size of the canvas with padding applied, as well as the top-left co-ordinates of the inner
   * rectangle that houses the scene.
   * @param gridType - The grid type to calculate padding for.
   * @param width    - The width of the scene.
   * @param height   - The height of the scene.
   * @param size     - The grid size.
   * @param padding  - The percentage of padding.
   * @param options  - Options to configure the padding calculation.
   * @deprecated Since v12 until v14. Use {@link BaseGrid#calculateDimensions} instead.
   */
  static calculatePadding(
    gridType: foundry.CONST.GRID_TYPES,
    width: number,
    height: number,
    size: number,
    padding: number,
    options?: InexactPartial<{
      /**
       * Are we computing padding for a legacy scene?
       */
      legacy: boolean;
    }>,
  ): { width: number; height: number; x: number; y: number };

  /**
   * @deprecated Since v12 until v14. Use {@link BaseGrid#sizeX} instead.
   */
  get w(): number;

  /**
   * @deprecated Since v12 until v14. Use {@link BaseGrid#sizeX} instead.
   */
  set w(value: number);

  /**
   * @deprecated Since v12 until v14. Use {@link BaseGrid#sizeY} instead.
   */
  get h(): number;

  /**
   * @deprecated Since v12 until v14. Use {@link BaseGrid#sizeY} instead.
   */
  set h(value: number);

  /**
   * Given a pair of coordinates (x, y) - return the top-left of the grid square which contains that point
   * @returns An Array [x, y] of the top-left coordinate of the square which contains (x, y)
   * @deprecated Since v12 until v14. Use {@link BaseGrid#getTopLeftPoint} instead.
   */
  getTopLeft(x: number, y: number): Canvas.PointArray;

  /**
   * Given a pair of coordinates (x, y), return the center of the grid square which contains that point
   * @param x - The x-coordinate
   * @param y - The y-coordinate
   * @returns An array [cx, cy] of the central point of the grid space which contains (x, y)
   * @deprecated Since v12 until v14. Use {@link BaseGrid#getCenterPoint} instead.
   */
  getCenter(x: number, y: number): Canvas.PointArray;

  /**
   * Get the grid row and column positions which are neighbors of a certain position
   * @param row - The grid row coordinate against which to test for neighbors
   * @param col - The grid column coordinate against which to test for neighbors
   * @returns An array of grid positions which are neighbors of the row and column
   * @deprecated Since v12 until v14. Use {@link BaseGrid#getAdjacentOffsets} instead.
   */
  getNeighbors(row: number, col: number): Canvas.PointArray[];

  /**
   * Given a pair of pixel coordinates, return the grid position as an Array.
   * Always round down to the nearest grid position so the pixels are within the grid space (from top-left).
   * @param x - The x-coordinate pixel position
   * @param y - The y-coordinate pixel position
   * @returns An array representing the position in grid units
   * @deprecated Since v12 until v14. Use {@link BaseGrid#getOffset} instead.
   */
  getGridPositionFromPixels(x: number, y: number): Canvas.PointArray;

  /* -------------------------------------------- */

  /**
   * Given a pair of grid coordinates, return the pixel position as an Array.
   * Always round up to a whole pixel so the pixel is within the grid space (from top-left).
   * @param x - The x-coordinate grid position
   * @param y - The y-coordinate grid position
   * @returns An array representing the position in pixels
   * @deprecated Since v12 until v14. Use {@link BaseGrid#getTopLeftPoint} instead.
   */
  getPixelsFromGridPosition(x: number, y: number): Canvas.PointArray;

  /* -------------------------------------------- */

  /**
   * Shift a pixel position [x,y] by some number of grid units dx and dy
   * @param x  - The starting x-coordinate in pixels
   * @param y  - The starting y-coordinate in pixels
   * @param dx - The number of grid positions to shift horizontally
   * @param dy - The number of grid positions to shift vertically
   * @param options - Additional options to configure shift behavior.
   * @deprecated Since v12 until v14. Use {@link BaseGrid#getShiftedPoint} instead.
   */
  shiftPosition(
    x: number,
    y: number,
    dx: number,
    dy: number,
    options?: InexactPartial<{
      /**
       * The token that is being shifted.
       */
      token: Token;
    }>,
  ): Canvas.PointArray;

  /* -------------------------------------------- */

  /**
   * Measure the distance traversed over an array of measured segments
   * @param segments - An Array of measured movement segments
   * @param options  - Additional options which modify the measurement
   *                   (default: `{}`)
   * @returns An Array of distance measurements for each segment
   * @deprecated Since v12 until v14. Use {@link BaseGrid#measurePath} instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  measureDistances(segments: GridLayer.Segment[], options?: GridLayer.MeasureDistancesOptions): number[];

  /* -------------------------------------------- */

  /**
   * Given a pair of coordinates (x1,y1), return the grid coordinates (x2,y2) which represent the snapped position
   * Under a "gridless" system, every pixel position is a valid snapping position
   *
   * @param x        - The exact target location x
   * @param y        - The exact target location y
   * @param interval - An interval of grid spaces at which to snap.
   *                   At interval=1, snapping occurs at pixel intervals defined by the grid size
   *                   At interval=2, snapping would occur at the center-points of each grid size
   *                   At interval=null, no snapping occurs
   *                   (default: `null`)
   * @param options  - Additional options to configure snapping behavior.
   * @returns An object containing the coordinates of the snapped location
   * @deprecated Since v12 until v14. Use {@link BaseGrid#getSnappedPoint} instead.
   */
  getSnappedPosition(
    x: number,
    y: number,
    interval?: number | null,
    options?: InexactPartial<{
      /** The token that is being moved. */
      token: Token;
    }>,
  ): { x: number; y: number };

  /* -------------------------------------------- */

  /**
   * Highlight a grid position for a certain coordinates
   * @param layer   - The highlight layer to use
   * @param options - Additional options to configure behavior.
   * @deprecated Since v12 until v14. Use {@link GridLayer#highlightPosition} instead.
   */
  highlightGridPosition(layer: GridHighlight, options?: AnyObject): void;

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14. Use {@link Canvas#grid} instead.
   */
  get grid(): BaseGrid;

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14. Use {@link BaseGrid#testAdjacency} instead.
   */
  isNeighbor(r0: number, c0: number, r1: number, c1: number): boolean;

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14. Use {@link BaseGrid#isHexagonal} instead.
   */
  get isHex(): boolean;

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14. Use {@link BaseGrid#measurePath} instead.
   */
  measureDistance(origin: Canvas.Point, target: Canvas.Point, options: AnyObject): number[];

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14.
   */
  get highlight(): unknown;

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14.
   */
  get highlightLayers(): unknown;

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14.
   */
  addHighlightLayer(name: string): unknown;

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14.
   */
  clearHighlightLayer(name: string): unknown;

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14.
   */
  destroyHighlightLayer(name: string): unknown;

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14.
   */
  getHighlightLayer(name: string): unknown;

  /* -------------------------------------------- */

  /**
   * @deprecated Since v12 until v14.
   */
  highlightPosition(name: string, options: AnyObject): unknown;
}

declare namespace BaseGrid {
  interface Configuration {
    /** The size of a grid space in pixels (a positive number) */
    size: number;

    /**
     * The distance of a grid space in units (a positive number)
     * Default: `1`
     */
    distance?: number | undefined;

    /**
     * The units of measurement
     * Default: `""`
     */
    units?: string | undefined;

    /**
     * The style of the grid
     * Default: `"solidLines"`
     */
    style?: string | undefined;

    /**
     * The color of the grid
     * Default: `0`
     */
    color?: Color.Source | undefined;

    /**
     * The alpha of the grid
     * Default: `1`
     */
    alpha?: number | undefined;

    /**
     * The line thickness of the grid
     * Default: `1`
     */
    thickness?: number | undefined;
  }

  interface Offset {
    /** The row coordinate */
    i: number;

    /** The column coordinate */
    j: number;
  }

  type OffsetRange = [i0: number, j0: number, i1: number, j1: number];

  type Coordinates = Offset | Canvas.Point;

  interface SnappingBehavior {
    /** The snapping mode (a union of {@link CONST.GRID_SNAPPING_MODES}) */
    mode: number;

    /**
     * The resolution (a positive integer)
     * Default: `1`
     */
    resolution?: number | undefined;
  }

  type MeasurePathWaypoint = Coordinates | (Configuration & { teleport: boolean });

  /** The measurements of a waypoint. */
  interface MeasurePathResultWaypoint {
    /** The segment from the previous waypoint to this waypoint. */
    backward: MeasurePathResultSegment | null;

    /** The segment from this waypoint to the next waypoint. */
    forward: MeasurePathResultSegment | null;

    /** The total distance traveled along the path up to this waypoint. */
    distance: number;

    /** The total number of spaces moved along a direct path up to this waypoint. */
    spaces: number;

    /** The total cost of the direct path ({@link BaseGrid#getDirectPath}) up to this waypoint. */
    cost: number;
  }

  /** The measurements of a segment. */
  interface MeasurePathResultSegment {
    /** The waypoint that this segment starts from. */
    from: MeasurePathResultWaypoint;

    /** The waypoint that this segment goes to. */
    to: MeasurePathResultWaypoint;

    /** Is teleportation? */
    teleport: boolean;

    /** The distance traveled in grid units along this segment. */
    distance: number;

    /** The number of spaces moved along this segment. */
    spaces: number;

    /** The cost of the direct path ({@link BaseGrid#getDirectPath}) between the two waypoints. */
    cost: number;
  }

  /** The measurements result of {@link BaseGrid#measurePath}. */
  interface MeasurePathResult {
    /** The measurements at each waypoint. */
    waypoints: MeasurePathResultWaypoint[];

    /** The measurements at each segments. */
    segments: MeasurePathResultSegment[];

    /** The total distance traveled along the path through all waypoints. */
    distance: number;

    /**
     * The total number of spaces moved along a direct path through all waypoints.
     * Moving from a grid space to any of its neighbors counts as 1 step.
     * Always 0 in gridless grids.
     */
    spaces: number;

    /** The total cost of the direct path ({@link BaseGrid#getDirectPath}) through all waypoints. */
    cost: number;
  }

  /**
   * A function that returns the cost for a given move between grid spaces.
   * In square and hexagonal grids the grid spaces are always adjacent unless teleported.
   * The distance is 0 if and only if teleported. The function is never called with the same offsets.
   * @param from     - The offset that is moved from.
   * @param to       - The offset that is moved to.
   * @param distance - The distance between the grid spaces, or 0 if teleported.
   * @returns The cost of the move between the grid spaces.
   */
  type MeasurePathCostFunction = (from: Offset, to: Offset, distance: number) => number;

  interface Dimensions {
    width: number;
    height: number;
    x: number;
    y: number;
    rows: number;
    columns: number;
  }
}

export default BaseGrid;
