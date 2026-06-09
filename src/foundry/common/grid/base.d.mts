import type { InexactPartial, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { GridHighlight } from "#client/canvas/containers/_module.d.mts";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type { HexagonalGrid } from "#common/grid/_module.d.mts";

/**
 * The base grid class.
 */
declare abstract class BaseGrid {
  /** The base grid constructor. */
  constructor(config: BaseGrid.Configuration);

  /**
   * The size of a grid space in pixels.
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  size: number;

  /**
   * The width of a grid space in pixels.
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  sizeX: number;

  /**
   * The height of a grid space in pixels.
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  sizeY: number;

  /**
   * The distance of a grid space in units.
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  distance: number;

  /**
   * The distance units used in this grid.
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  units: string;

  /**
   * The style of the grid.
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  style: string;

  /**
   * The thickness of the grid.
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  thickness: number;

  /**
   * The color of the grid.
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  color: Color;

  /**
   * The opacity of the grid.
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  alpha: number;

  /**
   * The grid type (see {@linkcode CONST.GRID_TYPES}).
   * @privateRemarks Foundry marks `@readonly` but does nothing to enforce that at runtime.
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
   * @param coords - The coordinates
   * @returns The offset
   */
  abstract getOffset(coords: BaseGrid.Coordinates2D): BaseGrid.Offset2D;
  abstract getOffset(coords: BaseGrid.Coordinates3D): BaseGrid.Offset3D;

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
   * Returns always an empty array in gridless grids.
   * @param coords - The coordinates
   * @returns The adjacent offsets
   * @remarks {@linkcode foundry.grid.GridlessGrid.getAdjacentOffsets | GridlessGrid#getAdjacentOffsets} always returns `[]` in core.
   */
  abstract getAdjacentOffsets(coords: BaseGrid.Coordinates2D): BaseGrid.Offset2D[];
  abstract getAdjacentOffsets(coords: BaseGrid.Coordinates3D): BaseGrid.Offset3D[];

  /**
   * Returns true if the grid spaces corresponding to the given coordinates are adjacent to each other.
   * In square and hexagonal grids with illegal diagonals the diagonally neighboring grid spaces are not adjacent.
   * Returns always false in gridless grids.
   * @param coords1 - The first coordinates
   * @param coords2 - The second coordinates
   * @remarks {@linkcode foundry.grid.GridlessGrid.testAdjacency | GridlessGrid#testAdjacency} always returns `false` in core.
   */
  abstract testAdjacency(coords1: BaseGrid.Coordinates2D, coords2: BaseGrid.Coordinates2D): boolean;
  abstract testAdjacency(coords1: BaseGrid.Coordinates3D, coords2: BaseGrid.Coordinates3D): boolean;

  /**
   * Returns the offset of the grid space corresponding to the given coordinates
   * shifted by one grid space in the given direction. The k-coordinate is not changed.
   * In square and hexagonal grids with illegal diagonals the offset of the given coordinates is returned
   * if the direction is diagonal.
   * In gridless grids the point is by the grid size.
   * @param coords    - The coordinates
   * @param direction - The direction (see {@linkcode CONST.MOVEMENT_DIRECTIONS})
   * @returns The offset
   */
  abstract getShiftedOffset(coords: BaseGrid.Coordinates2D, direction: CONST.MOVEMENT_DIRECTIONS): BaseGrid.Offset2D;
  abstract getShiftedOffset(coords: BaseGrid.Coordinates3D, direction: CONST.MOVEMENT_DIRECTIONS): BaseGrid.Offset3D;

  /**
   * Returns the point shifted by the difference between the grid space corresponding to the given coordinates
   * and the shifted grid space in the given direction. The z-coordinate is not changed.
   * In square and hexagonal grids with illegal diagonals the point is not shifted if the direction is diagonal.
   * In gridless grids the point coordinates are shifted by the grid size.
   * @param point     - The point that is to be shifted
   * @param direction - The direction (see {@linkcode CONST.MOVEMENT_DIRECTIONS})
   * @returns The shifted point
   */
  abstract getShiftedPoint(point: Canvas.Point, direction: CONST.MOVEMENT_DIRECTIONS): Canvas.Point;
  abstract getShiftedPoint(point: Canvas.ElevatedPoint, direction: CONST.MOVEMENT_DIRECTIONS): Canvas.ElevatedPoint;

  /**
   * Returns the top-left point of the grid space bounds corresponding to the given coordinates.
   * If given a point, the top-left point of the grid space bounds that contains it is returned.
   * The top-left point lies in the plane of the bottom face of the 3D grid space.
   * In gridless grids a point with the same coordinates as the given point is returned.
   * @param coords - The coordinates
   * @returns The top-left point
   */
  abstract getTopLeftPoint(coords: BaseGrid.Coordinates2D): Canvas.Point;
  abstract getTopLeftPoint(coords: BaseGrid.Coordinates3D): Canvas.ElevatedPoint;

  /**
   * Returns the center point of the grid space corresponding to the given coordinates.
   * If given a point, the center point of the grid space that contains it is returned.
   * The center point lies in the plane of the bottom face of the 3D grid space.
   * In gridless grids a point with the same coordinates as the given point is returned.
   * @param coords - The coordinates
   * @returns The center point
   */
  abstract getCenterPoint(coords: BaseGrid.Coordinates2D): Canvas.Point;
  abstract getCenterPoint(coords: BaseGrid.Coordinates3D): Canvas.ElevatedPoint;

  /**
   * Returns the points of the grid space shape relative to the center point.
   * The points are returned in the same order as in {@linkcode BaseGrid.getVertices | BaseGrid#getVertices}.
   * In gridless grids an empty array is returned.
   * @returns The points of the polygon
   * @remarks {@linkcode foundry.grid.GridlessGrid.getShape | GridlessGrid#getShape} always returns `[]` in core.
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
   * @remarks {@linkcode foundry.grid.GridlessGrid.getVertices | GridlessGrid#getVertices} always returns `[]` in core.
   */
  abstract getVertices(coords: BaseGrid.Coordinates2D): Canvas.Point[];

  /**
   * Snaps the given point to the grid.
   * In square and hexagonal grids the z-coordinate of the point is rounded to the nearest multiple of the grid size.
   * In gridless grids a point with the same coordinates as the given point is returned regardless of the
   * snapping behavior.
   * @param point    - The point that is to be snapped
   * @param behavior - The snapping behavior
   * @returns The snapped point
   */
  abstract getSnappedPoint(point: Canvas.Point, behavior: BaseGrid.SnappingBehavior): Canvas.Point;
  abstract getSnappedPoint(point: Canvas.ElevatedPoint, behavior: BaseGrid.SnappingBehavior): Canvas.ElevatedPoint;

  /**
   * Measure a shortest, direct path through the given waypoints.
   * @param waypoints - The waypoints the path must pass through
   * @param options   - Additional measurement options
   * @returns The measurements a shortest, direct path through the given waypoints.
   */
  measurePath(waypoints: never, options?: never): BaseGrid.MeasurePathResult;
  measurePath(waypoints: never, options?: never): BaseGrid.MeasurePathResult;

  /**
   * Measures the path and writes the measurements into `result`.
   * Called by {@linkcode BaseGrid.measurePath | BaseGrid#measurePath}.
   * @param waypoints - The waypoints the path must pass through
   * @param options   - Additional measurement options
   * @param result    - The measurement result that the measurements need to be written to
   */
  protected abstract _measurePath(waypoints: never, options: never, result: BaseGrid.MeasurePathResult): void;
  protected abstract _measurePath(waypoints: never, options: never, result: BaseGrid.MeasurePathResult): void;

  /**
   * Returns the sequence of grid offsets of a shortest, direct path passing through the given waypoints.
   * @param waypoints - The waypoints the path must pass through
   * @returns The sequence of grid offsets of a shortest, direct path
   */
  abstract getDirectPath(waypoints: BaseGrid.Coordinates2D[]): BaseGrid.Offset2D[];
  abstract getDirectPath(waypoints: BaseGrid.Coordinates3D[]): BaseGrid.Offset3D[];

  /**
   * Get the point translated in a direction by a distance.
   * The z-coordinate is not changed.
   * @param point     - The point that is to be translated.
   * @param direction - The angle of direction in degrees.
   * @param distance  - The distance in grid units.
   * @returns The translated point.
   */
  abstract getTranslatedPoint(point: Canvas.Point, direction: number, distance: number): Canvas.Point;
  abstract getTranslatedPoint(point: Canvas.ElevatedPoint, direction: number, distance: number): Canvas.ElevatedPoint;

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
   * @param origin    - The origin point of the cone
   * @param radius    - The radius in grid units
   * @param direction - The direction in degrees
   * @param angle     - The angle in degrees
   * @returns The points of the cone polygon
   */
  getCone(origin: Canvas.Point, radius: number, direction: number, angle: number): Canvas.Point[];

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /**
   * Determine a placeable's bounding box based on the size of the grid.
   * @param w - The width in grid spaces.
   * @param h - The height in grid spaces.
   * @deprecated "`BaseGrid#getRect` is deprecated. If you need the size of a `Token`, use {@linkcode Token.getSize | Token#getSize} instead."
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
   * @deprecated "`BaseGrid.calculatePadding` is deprecated. Use {@linkcode BaseGrid.calculateDimensions | BaseGrid#calculateDimensions}
   * instead." (since v12, until v14)
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
   * @deprecated "`BaseGrid#w` is deprecated in favor of {@linkcode BaseGrid.sizeX | BaseGrid#sizeX}." (since v12 until v14)
   */
  get w(): number;

  /**
   * @deprecated "`BaseGrid#w` is deprecated in favor of {@linkcode BaseGrid.sizeX | BaseGrid#sizeX}." (since v12 until v14)
   */
  set w(value: number);

  /**
   * @deprecated "`BaseGrid#h` is deprecated in favor of {@linkcode BaseGrid.sizeY | BaseGrid#sizeY}." (since v12 until v14)
   */
  get h(): number;

  /**
   * @deprecated "`BaseGrid#h` is deprecated in favor of {@linkcode BaseGrid.sizeY | BaseGrid#sizeY}." (since v12 until v14)
   */
  set h(value: number);

  /**
   * Given a pair of coordinates (x, y) - return the top-left of the grid square which contains that point
   * @returns An Array [x, y] of the top-left coordinate of the square which contains (x, y)
   * @deprecated "`BaseGrid#getTopLeft` is deprecated. Use {@linkcode BaseGrid.getTopLeftPoint | BaseGrid#getTopLeftPoint} instead."
   * (since v12, until v14)
   */
  getTopLeft(x: number, y: number): Canvas.PointTuple;

  /**
   * Given a pair of coordinates (x, y), return the center of the grid square which contains that point
   * @param x - The x-coordinate
   * @param y - The y-coordinate
   * @returns An array [cx, cy] of the central point of the grid space which contains (x, y)
   * @deprecated "`BaseGrid#getCenter`. Use {@linkcode BaseGrid.getCenterPoint | BaseGrid#getCenterPoint} instead." (since v12, until v14)
   */
  getCenter(x: number, y: number): Canvas.PointTuple;

  /**
   * Get the grid row and column positions which are neighbors of a certain position
   * @param row - The grid row coordinate against which to test for neighbors
   * @param col - The grid column coordinate against which to test for neighbors
   * @returns An array of grid positions which are neighbors of the row and column
   * @deprecated "`BaseGrid#getNeighbors` is deprecated. Use {@linkcode BaseGrid.getAdjacentOffsets | BaseGrid#getAdjacentOffsets} instead."
   * (since v12, until v14)
   */
  getNeighbors(row: number, col: number): Canvas.PointTuple[];

  /**
   * Given a pair of pixel coordinates, return the grid position as an Array.
   * Always round down to the nearest grid position so the pixels are within the grid space (from top-left).
   * @param x - The x-coordinate pixel position
   * @param y - The y-coordinate pixel position
   * @returns An array representing the position in grid units
   * @deprecated "`BaseGrid#getGridPositionFromPixels` is deprecated. Use {@linkcode BaseGrid.getOffset | BaseGrid#getOffset} instead."
   * (since v12, until v15)
   */
  getGridPositionFromPixels(x: number, y: number): Canvas.PointTuple;

  /* -------------------------------------------- */

  /**
   * Given a pair of grid coordinates, return the pixel position as an Array.
   * Always round up to a whole pixel so the pixel is within the grid space (from top-left).
   * @param x - The x-coordinate grid position
   * @param y - The y-coordinate grid position
   * @returns An array representing the position in pixels
   * @deprecated "`BaseGrid#getPixelsFromGridPosition` is deprecated. Use {@linkcode BaseGrid.getTopLeftPoint | BaseGrid#getTopLeftPoint}
   * instead." (since v12, until v14)
   */
  getPixelsFromGridPosition(x: number, y: number): Canvas.PointTuple;

  /* -------------------------------------------- */

  /**
   * Shift a pixel position [x,y] by some number of grid units dx and dy
   * @param x  - The starting x-coordinate in pixels
   * @param y  - The starting y-coordinate in pixels
   * @param dx - The number of grid positions to shift horizontally
   * @param dy - The number of grid positions to shift vertically
   * @param options - Additional options to configure shift behavior.
   * @deprecated "`BaseGrid#shiftPosition` is deprecated. Use {@linkcode BaseGrid.getShiftedPoint | BaseGrid#getShiftedPoint} instead."
   * (since v12, until v14)
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
      token: Token.Implementation;
    }>,
  ): Canvas.PointTuple;

  /* -------------------------------------------- */

  /**
   * Measure the distance traversed over an array of measured segments
   * @param segments - An Array of measured movement segments
   * @param options  - Additional options which modify the measurement (default: `{}`)
   * @returns An Array of distance measurements for each segment
   * @deprecated "`BaseGrid#measureDistances` is deprecated. Use {@linkcode BaseGrid.measurePath | BaseGrid#measurePath} instead."
   * (since v12, until v14)
   */
  measureDistances(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    segments: BaseGrid.Segment[],
    options?: object,
  ): number[];

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
   *                   At interval=null, no snapping occurs (default: `null`)
   * @param options  - Additional options to configure snapping behavior.
   * @returns An object containing the coordinates of the snapped location
   * @deprecated "`BaseGrid#getSnappedPosition` is deprecated. Use {@linkcode BaseGrid.getSnappedPoint | BaseGrid#getSnappedPoint} instead."
   * (since v12, until v14)
   */
  getSnappedPosition(
    x: number,
    y: number,
    interval?: number | null,

    options?: object,
  ): PIXI.IPointData;

  /* -------------------------------------------- */

  /**
   * Highlight a grid position for a certain coordinates
   * @param layer   - The highlight layer to use
   * @param options - Additional options to configure behavior.
   * @deprecated "`BaseGrid#highlightGridPosition` is deprecated. Use
   * {@linkcode foundry.canvas.layers.GridLayer.highlightPosition | GridLayer#highlightPosition} instead." (since v12, until v14)
   */
  highlightGridPosition(layer: GridHighlight, options?: object): void;

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.grid` is deprecated. Use {@linkcode canvas.grid} instead." (since v12, until v14)
   */
  get grid(): this;

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.isNeighbor` is deprecated. Use {@linkcode canvas.grid.testAdjacency} instead." (since v12, until v14)
   */
  isNeighbor(r0: number, c0: number, r1: number, c1: number): boolean;

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.isHex` is deprecated. Use {@linkcode canvas.grid.isHexagonal} instead." (since v12, until v14)
   */
  get isHex(): boolean;

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.measureDistance` is deprecated. Use {@linkcode canvas.grid.measurePath} instead, which returns grid distance
   * (`gridSpaces: true`) and Euclidean distance (`gridSpaces: false`)." (since v12, until v14)
   */
  measureDistance(origin: Canvas.Point, target: Canvas.Point, options?: object): number[];

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.highlight` is deprecated. Use {@linkcode canvas.interface.grid.highlight} instead."
   * (since v12, until v14)
   */
  get highlight(): PIXI.Container | undefined;

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.highlightLayers` is deprecated. Use {@linkcode canvas.interface.grid.highlightLayers} instead."
   * (since v12, until v14)
   */
  get highlightLayers(): Record<string, GridHighlight>;

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.addHighlightLayer` is deprecated. Use {@linkcode canvas.interface.grid.addHighlightLayer} instead."
   * (since v12, until v14)
   */
  addHighlightLayer(name: string): GridHighlight;

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.clearHighlightLayer` is deprecated. Use {@linkcode canvas.interface.grid.clearHighlightLayer} instead."
   * (since v12, until v14)
   */
  clearHighlightLayer(name: string): void;

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.destroyHighlightLayer` is deprecated. Use {@linkcode canvas.interface.grid.destroyHighlightLayer} instead."
   * (since v12, until v14)
   */
  destroyHighlightLayer(name: string): void;

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.getHighlightLayer` is deprecated. Use {@linkcode canvas.interface.grid.getHighlightLayer} instead."
   * (since v12, until v14)
   */
  getHighlightLayer(name: string): GridHighlight | undefined;

  /* -------------------------------------------- */

  /**
   * @deprecated "`canvas.grid.highlightPosition` is deprecated. Use {@linkcode canvas.interface.grid.highlightPosition} instead."
   * (since v12, until v14)
   */
  highlightPosition(name: string, options?: object): void;
}

declare namespace BaseGrid {
  interface Any extends AnyBaseGrid {}
  interface AnyConstructor extends Identity<typeof AnyBaseGrid> {}

  /** @internal */
  interface _Configuration {
    /**
     * The distance of a grid space in units (a positive number)
     * @defaultValue `1`
     */
    distance: number;

    /**
     * The units of measurement
     * @defaultValue `""`
     */
    units: string;

    /**
     * The style of the grid
     * @defaultValue `"solidLines"`
     */
    style: string;

    /**
     * The color of the grid
     * @defaultValue `new Color(0)`
     */
    color: Color.Source;

    /**
     * The alpha of the grid
     * @defaultValue `1`
     */
    alpha: number;

    /**
     * The line thickness of the grid
     * @defaultValue `1`
     */
    thickness: number;

    /**
     * @deprecated "The constructor `BaseGrid({dimensions, color, alpha})` is deprecated in favor of
     * `BaseGrid({size, distance, units, style, thickness, color, alpha})`." (since v12, until v14)
     */
    dimensions: { size: number; distance?: number | undefined };
  }

  interface Configuration extends InexactPartial<_Configuration> {
    /** The size of a grid space in pixels (a positive number) */
    size: number;
  }

  /**
   * Property common to both square and hex grid configs
   * @internal
   */
  interface _Diagonals {
    /**
     * The rule for diagonal measurement (see {@linkcode CONST.GRID_DIAGONALS}).
     * @defaultValue {@linkcode CONST.GRID_DIAGONALS.EQUIDISTANT}
     */
    diagonals: CONST.GRID_DIAGONALS;
  }

  /**
   * @deprecated Use {@linkcode BaseGrid.Offset2D} or {@linkcode BaseGrid.Offset3D} as appropriate instead.
   * This warning will be removed in v14.
   */
  type Offset = Offset2D | Offset3D;

  /**
   * 2D offset coordinates of a grid space.
   */
  interface Offset2D {
    /** The row coordinate (an integer) */
    i: number;

    /** The column coordinate (an integer) */
    j: number;
  }

  /**
   * 3D offset coordinates of a grid space.
   */
  interface Offset3D extends Offset2D {
    /**
     * The vertical coordinate (an integer)
     */
    k: number;
  }

  type OffsetRange = [i0: number, j0: number, i1: number, j1: number];

  /**
   * @deprecated Use {@linkcode BaseGrid.Coordinates2D} or {@linkcode BaseGrid.Coordinates3D} as appropriate instead.
   * This warning will be removed in v14.
   */
  type Coordinates = Coordinates2D | Coordinates3D;

  type Coordinates2D = Offset2D | Canvas.Point;

  type Coordinates3D = Offset3D | Canvas.ElevatedPoint;

  /**
   * This type is effectively identical to {@linkcode HexagonalGrid.Coordinates2D}, but using that name in the signatures for
   * {@linkcode BaseGrid.measurePath | BaseGrid#measurePath} and {@linkcode BaseGrid._measurePath | #_measurePath} felt wrong,
   * despite them being required
   */
  type _WideCoordinates2D = Coordinates2D | HexagonalGrid.Coordinates2D;

  /**
   * This type is effectively identical to {@linkcode HexagonalGrid.Coordinates3D}, but using that name in the signatures for
   * {@linkcode BaseGrid.measurePath | BaseGrid#measurePath} and {@linkcode BaseGrid._measurePath | #_measurePath} felt wrong,
   * despite them being required
   */
  type _WideCoordinates3D = Coordinates3D | HexagonalGrid.Coordinates3D;

  /** @internal */
  interface _SnappingBehavior {
    /**
     * The resolution (a positive integer)
     * @defaultValue `1`
     */
    resolution: number;
  }

  interface SnappingBehavior extends InexactPartial<_SnappingBehavior> {
    /** The snapping mode (a union of {@linkcode CONST.GRID_SNAPPING_MODES}) */
    mode: number;
  }

  /** @internal */
  interface _WaypointData<Coordinates extends _WideCoordinates2D | _WideCoordinates3D> {
    /**
     * Teleport to this waypoint?
     * @defaultValue `false`
     */
    teleport: boolean;

    /**
     * Measure of the segment from the previous to this waypoint? The distance, cost, spaces,
     * diagonals, and Euclidean length of a segment that is not measured are always 0.
     * @defaultValue `true`
     * @privateRemarks default provided by `!== false` checks in all three `#_measurePath` overrides
     */
    measure: boolean;

    /**
     * A predetermined cost (nonnegative) or a cost function to be used instead of `options.cost`.
     */
    cost: number | CostFunction<Coordinates>;
  }

  /**
   * @deprecated Use {@linkcode BaseGrid.WaypointData | BaseGrid.WaypointData<BaseGrid.Coordinates2D>} instead.
   * This warning will be removed in v14.
   */
  type MeasurePathWaypointData2D = WaypointData<Coordinates2D>;

  /**
   * @deprecated Use {@linkcode BaseGrid.WaypointData | BaseGrid.WaypointData<BaseGrid.Coordinates2D>} instead.
   * This warning will be removed in v14.
   */
  type MeasurePathWaypointData3D = WaypointData<Coordinates3D>;

  type CostFunction<Coordinates extends _WideCoordinates2D | _WideCoordinates3D> = (
    from: Coordinates,
    to: Coordinates,
    distance: number,
    segment: Waypoint<Coordinates>,
  ) => number;

  /**
   * Data contained in waypoints for {@linkcode BaseGrid.measurePath | #measurePath} other than coordinates/offsets
   */
  interface WaypointData<Coordinates extends _WideCoordinates2D | _WideCoordinates3D> extends InexactPartial<
    BaseGrid._WaypointData<Coordinates>
  > {}

  /**
   * Hack to make {@linkcode Waypoint} work
   * @internal
   */
  type _AllKeys = keyof HexagonalGrid.Cube3D | keyof BaseGrid.Offset3D | keyof Canvas.ElevatedPoint | "cost";

  /**
   * The type of full waypoints passed to {@linkcode BaseGrid.measurePath | #measurePath}
   */
  type Waypoint<Coordinates extends _WideCoordinates2D | _WideCoordinates3D> = Coordinates extends unknown
    ? WaypointData<Coordinates> & Coordinates
    : never;

  type _x = Waypoint<_WideCoordinates2D>;

  /** @internal */
  interface _MeasurePathOptions<Coordinates extends _WideCoordinates2D | _WideCoordinates3D> {
    /**
     * The function that returns the cost for a given move between grid spaces (default is the distance traveled)
     */
    cost: BaseGrid.CostFunction<Coordinates>;
  }

  interface MeasurePathOptions<Coordinates extends _WideCoordinates2D | _WideCoordinates3D> extends InexactPartial<
    _MeasurePathOptions<Coordinates>
  > {}

  type MeasurePathWaypoint2D = Waypoint<Coordinates2D>;

  type MeasurePathWaypoint3D = Waypoint<Coordinates3D>;

  type MeasurePathWaypoint = MeasurePathWaypoint2D | MeasurePathWaypoint3D;

  /** The measurements of a waypoint. */
  interface MeasurePathResultWaypoint {
    /**
     * The segment from the previous waypoint to this waypoint.
     * @remarks Only `null` in the first waypoint
     */
    backward: MeasurePathResultSegment | null;

    /**
     * The segment from this waypoint to the next waypoint.
     * @remarks Only `null` in the last waypoint
     */
    forward: MeasurePathResultSegment | null;

    /** The total distance traveled along the path up to this waypoint. */
    distance: number;

    /** The total number of spaces moved along a direct path up to this waypoint. */
    spaces: number;

    /** The total cost of the direct path ({@linkcode BaseGrid.getDirectPath | BaseGrid#getDirectPath}) up to this waypoint. */
    cost: number;

    /** The total number of diagonals moved along a direct path up to this waypoint. */
    diagonals: number;

    /** The total Euclidean length of the straight line path up to this waypoint. */
    euclidean: number;
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

    /** The cost of the direct path ({@linkcode BaseGrid.getDirectPath | BaseGrid#getDirectPath}) between the two waypoints. */
    cost: number;
  }

  /** The measurements result of {@linkcode BaseGrid.measurePath | BaseGrid#measurePath}. */
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

    /** The total cost of the direct path ({@linkcode BaseGrid.getDirectPath | BaseGrid#getDirectPath}) through all waypoints. */
    cost: number;

    /** The total number of diagonals moved along a direct path through all waypoints. */
    diagonals: number;

    /** The total Euclidean length of the straight line path through all waypoints. */
    euclidean: number;
  }

  /**
   * @deprecated in favor of {@linkcode MeasurePathCostFunction2D}. This warning will be removed in v14.
   */
  type MeasurePathCostFunction = MeasurePathCostFunction2D;

  /**
   * A function that returns the cost for a given move between grid spaces in 2D.
   * In square and hexagonal grids the grid spaces are always adjacent unless teleported.
   * The function is never called with the same offsets.
   * @param from     - The offset that is moved from
   * @param to       - The offset that is moved to
   * @param distance - The distance between the grid spaces
   * @param segment  - The properties of the segment
   * @returns The cost of the move between the grid spaces (nonnegative)
   * @remarks foundry marks `from`, `to`, and `segment` as readonly
   */
  type MeasurePathCostFunction2D = CostFunction<Coordinates2D>;

  /**
   * A function that returns the cost for a given move between grid spaces in 3D.
   * In square and hexagonal grids the grid spaces are always adjacent unless teleported.
   * The function is never called with the same offsets.
   * @param from     - The offset that is moved from
   * @param to       - The offset that is moved to
   * @param distance - The distance between the grid spaces
   * @param segment  - The properties of the segment
   * @returns The cost of the move between the grid spaces (nonnegative)
   * @remarks foundry marks `from`, `to`, and `segment` as readonly
   */
  type MeasurePathCostFunction3D = CostFunction<Coordinates3D>;

  interface Dimensions {
    width: number;
    height: number;
    x: number;
    y: number;
    rows: number;
    columns: number;
  }

  /**
   * @deprecated This type is only used with deprecated methods and will be removed with them. This warning will be removed in v14.
   */
  interface Segment {
    ray: Ray;
  }
}

declare abstract class AnyBaseGrid extends BaseGrid {
  constructor(...args: never);
}

export default BaseGrid;
