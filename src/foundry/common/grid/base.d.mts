import type { InexactPartial, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { HexagonalGrid } from "#common/grid/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type GridlessGrid from "#common/grid/gridless.d.mts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type SquareGrid from "#common/grid/square.d.mts";

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
  style: BaseGrid.ConfiguredStyle;

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
   * @privateRemarks The 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  abstract getOffset(coords: BaseGrid.Coordinates3D): BaseGrid.Offset3D;
  abstract getOffset(coords: BaseGrid.Coordinates2D): BaseGrid.Offset2D;

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
   * @privateRemarks The 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  abstract getAdjacentOffsets(coords: BaseGrid.Coordinates3D): BaseGrid.Offset3D[];
  abstract getAdjacentOffsets(coords: BaseGrid.Coordinates2D): BaseGrid.Offset2D[];

  /**
   * Returns true if the grid spaces corresponding to the given coordinates are adjacent to each other.
   * In square and hexagonal grids with illegal diagonals the diagonally neighboring grid spaces are not adjacent.
   * Returns always false in gridless grids.
   * @param coords1 - The first coordinates
   * @param coords2 - The second coordinates
   * @remarks {@linkcode foundry.grid.GridlessGrid.testAdjacency | GridlessGrid#testAdjacency} always returns `false` in core.
   * @privateRemarks The 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  abstract testAdjacency(coords1: BaseGrid.Coordinates3D, coords2: BaseGrid.Coordinates3D): boolean;
  abstract testAdjacency(coords1: BaseGrid.Coordinates2D, coords2: BaseGrid.Coordinates2D): boolean;

  /**
   * Returns the offset of the grid space corresponding to the given coordinates
   * shifted by one grid space in the given direction. The k-coordinate is not changed.
   * In square and hexagonal grids with illegal diagonals the offset of the given coordinates is returned
   * if the direction is diagonal.
   * In gridless grids the point is by the grid size.
   * @param coords    - The coordinates
   * @param direction - The direction (see {@linkcode CONST.MOVEMENT_DIRECTIONS})
   * @returns The offset
   * @privateRemarks The 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  abstract getShiftedOffset(coords: BaseGrid.Coordinates3D, direction: CONST.MOVEMENT_DIRECTIONS): BaseGrid.Offset3D;
  abstract getShiftedOffset(coords: BaseGrid.Coordinates2D, direction: CONST.MOVEMENT_DIRECTIONS): BaseGrid.Offset2D;

  /**
   * Returns the point shifted by the difference between the grid space corresponding to the given coordinates
   * and the shifted grid space in the given direction. The z-coordinate is not changed.
   * In square and hexagonal grids with illegal diagonals the point is not shifted if the direction is diagonal.
   * In gridless grids the point coordinates are shifted by the grid size.
   * @param point     - The point that is to be shifted
   * @param direction - The direction (see {@linkcode CONST.MOVEMENT_DIRECTIONS})
   * @returns The shifted point
   * @privateRemarks The 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  abstract getShiftedPoint(point: Canvas.ElevatedPoint, direction: CONST.MOVEMENT_DIRECTIONS): Canvas.ElevatedPoint;
  abstract getShiftedPoint(point: Canvas.Point, direction: CONST.MOVEMENT_DIRECTIONS): Canvas.Point;

  /**
   * Returns the top-left point of the grid space bounds corresponding to the given coordinates.
   * If given a point, the top-left point of the grid space bounds that contains it is returned.
   * The top-left point lies in the plane of the bottom face of the 3D grid space.
   * In gridless grids a point with the same coordinates as the given point is returned.
   * @param coords - The coordinates
   * @returns The top-left point
   * @privateRemarks The 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  abstract getTopLeftPoint(coords: BaseGrid.Coordinates3D): Canvas.ElevatedPoint;
  abstract getTopLeftPoint(coords: BaseGrid.Coordinates2D): Canvas.Point;

  /**
   * Returns the center point of the grid space corresponding to the given coordinates.
   * If given a point, the center point of the grid space that contains it is returned.
   * The center point lies in the plane of the bottom face of the 3D grid space.
   * In gridless grids a point with the same coordinates as the given point is returned.
   * @param coords - The coordinates
   * @returns The center point
   * @privateRemarks The 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  abstract getCenterPoint(coords: BaseGrid.Coordinates3D): Canvas.ElevatedPoint;
  abstract getCenterPoint(coords: BaseGrid.Coordinates2D): Canvas.Point;

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
   * @privateRemarks The 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  abstract getSnappedPoint(point: Canvas.ElevatedPoint, behavior: BaseGrid.SnappingBehavior): Canvas.ElevatedPoint;
  abstract getSnappedPoint(point: Canvas.Point, behavior: BaseGrid.SnappingBehavior): Canvas.Point;

  /**
   * Measure a shortest, direct path through the given waypoints.
   * @param waypoints - The waypoints the path must pass through
   * @param options   - Additional measurement options (default: `{}`)
   * @returns The measurements a shortest, direct path through the given waypoints.
   * @privateRemarks This uses `never` because it needs to be wide enough to allow the override in
   * {@linkcode HexagonalGrid.measurePath | HexagonalGrid}, but re-narrowing in {@linkcode SquareGrid.measurePath | SquareGrid} and
   * {@linkcode GridlessGrid.measurePath | GridlessGrid} problematic because of the {@linkcode BaseGrid.CostFunction}.
   *
   * In subclasses, the 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  measurePath(waypoints: never, options: never): BaseGrid.MeasurePathResult;

  /**
   * Measures the path and writes the measurements into `result`.
   * Called by {@linkcode BaseGrid.measurePath | BaseGrid#measurePath}.
   * @param waypoints - The waypoints the path must pass through
   * @param options   - Additional measurement options
   * @param result    - The measurement result that the measurements need to be written to
   * @privateRemarks This uses `never` because it needs to be wide enough to allow the override in
   * {@linkcode HexagonalGrid._measurePath | HexagonalGrid}, but re-narrowing in {@linkcode SquareGrid._measurePath | SquareGrid} and
   * {@linkcode GridlessGrid._measurePath | GridlessGrid} proved problematic.
   *
   * In subclasses, the 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  protected abstract _measurePath(waypoints: never, options: never, result: BaseGrid.MeasurePathResult): void;

  /**
   * Returns the sequence of grid offsets of a shortest, direct path passing through the given waypoints.
   * @param waypoints - The waypoints the path must pass through
   * @returns The sequence of grid offsets of a shortest, direct path
   * @privateRemarks The 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  abstract getDirectPath(waypoints: BaseGrid.Coordinates3D[]): BaseGrid.Offset3D[];
  abstract getDirectPath(waypoints: BaseGrid.Coordinates2D[]): BaseGrid.Offset2D[];

  /**
   * Get the point translated in a direction by a distance.
   * The z-coordinate is not changed.
   * @param point     - The point that is to be translated.
   * @param direction - The angle of direction in degrees.
   * @param distance  - The distance in grid units.
   * @returns The translated point.
   * @privateRemarks The 3D signature must precede the 2D for correct inference, because all 3D types extend the relevant 2D type.
   */
  abstract getTranslatedPoint(point: Canvas.ElevatedPoint, direction: number, distance: number): Canvas.ElevatedPoint;
  abstract getTranslatedPoint(point: Canvas.Point, direction: number, distance: number): Canvas.Point;

  /**
   * Get the rectangle polygon given the width and height in grid units for this grid.
   * The points of the polygon are returned ordered in positive orientation.
   * @param origin   - The origin point of the rectangle.
   * @param width    - The width in grid units.
   * @param height   - The height in grid units.
   * @param anchor   - The anchor.
   * @param rotation - The rotation in degrees.
   * @returns The points of the rectangle polygon.
   */
  getRectangle(
    origin: Canvas.Point,
    width: number,
    height: number,
    anchor: Canvas.Point,
    rotation: number,
  ): Canvas.Point[];

  /**
   * Get the line polygon given the length and width in grid units for this grid.
   * The points of the polygon are returned ordered in positive orientation.
   * @param origin    - The origin point of the line.
   * @param length    - The length in grid units.
   * @param width     - The width in grid units.
   * @param direction - The direction in degrees.
   * @returns The points of the line polygon.
   */
  getLine(origin: Canvas.Point, length: number, width: number, direction: number): Canvas.Point[];

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
   * If the angle less than 360 and the cone not empty, the first point of the polygon is the origin.
   * @param origin    - The origin point of the cone
   * @param radius    - The radius in grid units
   * @param direction - The direction in degrees
   * @param angle     - The angle in degrees
   * @returns The points of the cone polygon
   */
  getCone(origin: Canvas.Point, radius: number, direction: number, angle: number): Canvas.Point[];

  /**
   * Get the ellipse polygon given the radius in grid units for this grid.
   * The points of the polygon are returned ordered in positive orientation.
   * In gridless grids an approximation of the true ellipse with a deviation of less than 0.25 pixels is returned.
   * @param center   - The center point of the ellipse.
   * @param radiusX  - The x-radius in grid units.
   * @param radiusY  - The y-radius in grid units.
   * @param rotation - The rotation in degrees.
   * @returns The points of the ellipse polygon.
   * @privateRemarks {@linkcode GridlessGrid.getEllipse | GridlessGrid#getEllipse} returns a flat
   * `[x0, y0, x1, y1, ...]` array rather than an array of points.
   */
  getEllipse(center: Canvas.Point, radiusX: number, radiusY: number, rotation: number): Canvas.Point[] | number[];

  /**
   * Get the ring polygon given the radius and width in grid units for this grid.
   * The points of the polygons are returned ordered in positive orientation.
   * In gridless grids an approximation of the true ring with a deviation of less than 0.25 pixels is returned.
   * @param center     - The center point of the ring.
   * @param radius     - The radius in grid units.
   * @param innerWidth - The inner width in grid units.
   * @param outerWidth - The outer width in grid units.
   * @returns The inner and outer circles of the ring polygon.
   */
  getRing(center: Canvas.Point, radius: number, innerWidth: number, outerWidth: number): BaseGrid.Ring;
}

declare namespace BaseGrid {
  interface Any extends AnyBaseGrid {}
  interface AnyConstructor extends Identity<typeof AnyBaseGrid> {}

  type ConfiguredStyle = keyof CONFIG.Canvas.GridStyles;

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
    style: BaseGrid.ConfiguredStyle;

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

  /** The inner and outer circles of the ring polygon. */
  type Ring = [innerCircle: Canvas.Point[], outerCircle: Canvas.Point[]];

  type Coordinates2D = Offset2D | Canvas.Point;

  type Coordinates3D = Offset3D | Canvas.ElevatedPoint;

  /** @internal */
  type _AnyCoordinates2D = Coordinates2D | HexagonalGrid.Coordinates2D;

  /** @internal */
  type _AnyCoordinates3D = Coordinates3D | HexagonalGrid.Coordinates3D;

  /**
   * The constraint for various machinery involving {@linkcode Waypoint}s. As of 13.351, the hex coords by themselves are the widest types
   * here; this type exists to reduce confusion and to hedge against future changes.
   * @internal
   */
  type _AnyCoordinates = _AnyCoordinates2D | _AnyCoordinates3D;

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
  interface _WaypointData<Coordinates extends _AnyCoordinates> {
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
  type CostFunction<
    Coordinates extends _AnyCoordinates = _AnyCoordinates,
    Segment extends object = Waypoint<Coordinates>,
  > = (from: Coordinates, to: Coordinates, distance: number, segment: Segment) => number;

  /** Data contained in waypoints for {@linkcode BaseGrid.measurePath | #measurePath} other than coordinates/offsets */
  interface WaypointData<Coordinates extends _AnyCoordinates> extends InexactPartial<
    BaseGrid._WaypointData<Coordinates>
  > {}

  /** The type of full waypoints passed to {@linkcode BaseGrid.measurePath | #measurePath} */
  type Waypoint<
    Coordinates extends _AnyCoordinates,
    AllCoordinates extends _AnyCoordinates = Coordinates,
  > = Coordinates extends unknown ? WaypointData<AllCoordinates> & Coordinates : never;

  /** @internal */
  interface _MeasurePathOptions<Coordinates extends _AnyCoordinates> {
    /**
     * The function that returns the cost for a given move between grid spaces (default is the distance traveled)
     */
    cost: BaseGrid.CostFunction<Coordinates>;
  }

  interface MeasurePathOptions<Coordinates extends _AnyCoordinates> extends InexactPartial<
    _MeasurePathOptions<Coordinates>
  > {}

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

    /** The total distance travelled along the path up to this waypoint. */
    distance: number;

    /** The total cost of the direct path ({@linkcode BaseGrid.getDirectPath | BaseGrid#getDirectPath}) up to this waypoint. */
    cost: number;

    /** The total number of spaces moved along a direct path up to this waypoint. */
    spaces: number;

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

    /** The distance travelled in grid units along this segment. */
    distance: number;

    /** The cost of the direct path ({@linkcode BaseGrid.getDirectPath | BaseGrid#getDirectPath}) between the two waypoints. */
    cost: number;

    /** The number of spaces moved along this segment. */
    spaces: number;

    /** The number of diagonals moved along this segment. */
    diagonals: number;

    /** The Euclidean length of the straight line segment between the two waypoints. */
    euclidean: number;
  }

  /** The measurements result of {@linkcode BaseGrid.measurePath | BaseGrid#measurePath}. */
  interface MeasurePathResult {
    /** The measurements at each waypoint. */
    waypoints: MeasurePathResultWaypoint[];

    /** The measurements at each segment. */
    segments: MeasurePathResultSegment[];

    /** The total distance travelled along the path through all waypoints. */
    distance: number;

    /** The total cost of the direct path ({@linkcode BaseGrid.getDirectPath | BaseGrid#getDirectPath}) through all waypoints. */
    cost: number;

    /**
     * The total number of spaces moved along a direct path through all waypoints.
     * Moving from a grid space to any of its neighbors counts as 1 step.
     * Always 0 in gridless grids.
     */
    spaces: number;

    /** The total number of diagonals moved along a direct path through all waypoints. */
    diagonals: number;

    /** The total Euclidean length of the straight line path through all waypoints. */
    euclidean: number;
  }

  /** The return type for {@linkcode BaseGrid.calculateDimensions}. As of 13.351, all subclass overrides return this type exactly. */
  interface Dimensions {
    width: number;
    height: number;
    x: number;
    y: number;
    rows: number;
    columns: number;
  }
}

declare abstract class AnyBaseGrid extends BaseGrid {
  constructor(...args: never);
}

export default BaseGrid;
