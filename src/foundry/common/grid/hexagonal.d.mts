import type { InexactPartial } from "#utils";
import type { BaseGrid } from "#common/grid/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

declare class HexagonalGrid extends BaseGrid {
  /**
   * The hexagonal grid constructor.
   */
  constructor(config: HexagonalGrid.Configuration);

  // declared here for type-checking, but values are limited to these in constructor
  override type:
    | typeof CONST.GRID_TYPES.HEXEVENQ
    | typeof CONST.GRID_TYPES.HEXODDQ
    | typeof CONST.GRID_TYPES.HEXEVENR
    | typeof CONST.GRID_TYPES.HEXODDR;

  // fake type override
  override get isGridless(): false;

  // fake type override
  override get isHexagonal(): true;

  // fake type override
  override get isSquare(): false;

  /**
   * Is this grid column-based (flat-topped) or row-based (pointy-topped)?
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  columns: boolean;

  /**
   * Is this grid even or odd?
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  even: boolean;

  /**
   * The rule for diagonal measurement (see {@linkcode CONST.GRID_DIAGONALS}).
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  diagonals: CONST.GRID_DIAGONALS;

  override getOffset(coords: HexagonalGrid.Coordinates3D): BaseGrid.Offset3D;
  override getOffset(coords: HexagonalGrid.Coordinates2D): BaseGrid.Offset2D;

  override getOffsetRange(bounds: Canvas.Rectangle): BaseGrid.OffsetRange;

  override getAdjacentOffsets(coords: HexagonalGrid.Coordinates3D): BaseGrid.Offset3D[];
  override getAdjacentOffsets(coords: HexagonalGrid.Coordinates2D): BaseGrid.Offset2D[];

  override testAdjacency(coords1: HexagonalGrid.Coordinates3D, coords2: HexagonalGrid.Coordinates3D): boolean;
  override testAdjacency(coords1: HexagonalGrid.Coordinates2D, coords2: HexagonalGrid.Coordinates2D): boolean;

  override getShiftedOffset(
    coords: HexagonalGrid.Coordinates3D,
    direction: CONST.MOVEMENT_DIRECTIONS,
  ): BaseGrid.Offset3D;
  override getShiftedOffset(
    coords: HexagonalGrid.Coordinates2D,
    direction: CONST.MOVEMENT_DIRECTIONS,
  ): BaseGrid.Offset2D;

  override getShiftedPoint(point: Canvas.ElevatedPoint, direction: CONST.MOVEMENT_DIRECTIONS): Canvas.ElevatedPoint;
  override getShiftedPoint(point: Canvas.Point, direction: CONST.MOVEMENT_DIRECTIONS): Canvas.Point;

  /**
   * Returns the cube coordinates of the grid space corresponding to the given coordinates.
   * @param coords - The coordinates
   * @returns The cube coordinates
   */
  getCube(coords: HexagonalGrid.Coordinates3D): HexagonalGrid.Cube3D;
  getCube(coords: HexagonalGrid.Coordinates2D): HexagonalGrid.Cube2D;

  /**
   * Returns the cube coordinates of grid spaces adjacent to the one corresponding to the given coordinates.
   * @param coords - The coordinates
   * @returns The adjacent cube coordinates
   */
  getAdjacentCubes(coords: HexagonalGrid.Coordinates3D): HexagonalGrid.Cube3D[];
  getAdjacentCubes(coords: HexagonalGrid.Coordinates2D): HexagonalGrid.Cube2D[];

  /**
   * Returns the cube coordinates of the grid space corresponding to the given coordinates
   * shifted by one grid space in the given direction.
   * @param coords    - The coordinates
   * @param direction - The direction (see {@linkcode CONST.MOVEMENT_DIRECTIONS})
   * @returns The cube coordinates
   */
  getShiftedCube(coords: HexagonalGrid.Coordinates3D, direction: CONST.MOVEMENT_DIRECTIONS): HexagonalGrid.Cube3D;
  getShiftedCube(coords: HexagonalGrid.Coordinates2D, direction: CONST.MOVEMENT_DIRECTIONS): HexagonalGrid.Cube2D;

  override getTopLeftPoint(coords: HexagonalGrid.Coordinates3D): Canvas.ElevatedPoint;
  override getTopLeftPoint(coords: HexagonalGrid.Coordinates2D): Canvas.Point;

  override getCenterPoint(coords: HexagonalGrid.Coordinates3D): Canvas.ElevatedPoint;
  override getCenterPoint(coords: HexagonalGrid.Coordinates2D): Canvas.Point;

  override getShape(): Canvas.Point[];

  override getVertices(coords: HexagonalGrid.Coordinates2D): Canvas.Point[];

  override getSnappedPoint(point: Canvas.ElevatedPoint, behavior: BaseGrid.SnappingBehavior): Canvas.ElevatedPoint;
  override getSnappedPoint(point: Canvas.Point, behavior: BaseGrid.SnappingBehavior): Canvas.Point;

  override calculateDimensions(sceneWidth: number, sceneHeight: number, padding: number): BaseGrid.Dimensions;

  /**
   * Calculate the total size of the canvas with padding applied, as well as the top-left coordinates of the inner
   * rectangle that houses the scene. (Legacy)
   * @param columns     - Column or row orientation?
   * @param legacySize  - The legacy size of the grid.
   * @param sceneWidth  - The width of the scene.
   * @param sceneHeight - The height of the scene.
   * @param padding     - The percentage of padding.
   * @internal
   */
  static _calculatePreV10Dimensions(
    columns: number,
    legacySize: number,
    sceneWidth: number,
    sceneHeight: number,
    padding: number,
  ): BaseGrid.Dimensions;

  // fake type override
  override measurePath(
    waypoints: BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>[],
    options?: BaseGrid.MeasurePathOptions<HexagonalGrid.Coordinates3D>,
  ): BaseGrid.MeasurePathResult;
  // fake type override
  override measurePath(
    waypoints: BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>[],
    options?: BaseGrid.MeasurePathOptions<HexagonalGrid.Coordinates2D>,
  ): BaseGrid.MeasurePathResult;

  protected override _measurePath(
    waypoints: BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>[],
    options: BaseGrid.MeasurePathOptions<HexagonalGrid.Coordinates3D>,
    result: BaseGrid.MeasurePathResult,
  ): void;
  protected override _measurePath(
    waypoints: BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>[],
    options: BaseGrid.MeasurePathOptions<HexagonalGrid.Coordinates2D>,
    result: BaseGrid.MeasurePathResult,
  ): void;

  override getDirectPath(waypoints: HexagonalGrid.Coordinates3D[]): BaseGrid.Offset3D[];
  override getDirectPath(waypoints: HexagonalGrid.Coordinates2D[]): BaseGrid.Offset2D[];

  override getTranslatedPoint(point: Canvas.ElevatedPoint, direction: number, distance: number): Canvas.ElevatedPoint;
  override getTranslatedPoint(point: Canvas.Point, direction: number, distance: number): Canvas.Point;

  override getCircle(center: Canvas.Point, radius: number): Canvas.Point[];

  // fake type override
  override getEllipse(center: Canvas.Point, radiusX: number, radiusY: number, rotation: number): Canvas.Point[];

  /**
   * Round the fractional cube coordinates (q, r, s) / (q, r, s, k).
   * The k-coordinate is floored.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param cube - The fractional cube coordinates
   * @returns The rounded integer cube coordinates
   */
  static cubeRound(cube: HexagonalGrid.Cube3D): HexagonalGrid.Cube3D;
  static cubeRound(cube: HexagonalGrid.Cube2D): HexagonalGrid.Cube2D;

  /**
   * Convert point coordinates (x, y) / (x, y, elevation) into cube coordinates (q, r, s) / (q, r, s, k).
   * Inverse of {@linkcode HexagonalGrid.cubeToPoint | HexagonalGrid#cubeToPoint}.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param point - The point
   * @returns The (fractional) cube coordinates
   */
  pointToCube(point: Canvas.ElevatedPoint): HexagonalGrid.Cube3D;
  pointToCube(point: Canvas.Point): HexagonalGrid.Cube2D;

  /**
   * Convert cube coordinates (q, r, s) / (q, r, s, k) into point coordinates (x, y) / (x, y, elevation).
   * Inverse of {@linkcode HexagonalGrid.pointToCube | HexagonalGrid#pointToCube}.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param cube - The cube coordinates
   * @returns The point coordinates
   */
  cubeToPoint(cube: HexagonalGrid.Cube3D): Canvas.ElevatedPoint;
  cubeToPoint(cube: HexagonalGrid.Cube2D): Canvas.Point;

  /**
   * Convert offset coordinates (i, j) / (i, j, k) into integer cube coordinates (q, r, s) / (q, r, s, k).
   * Inverse of {@linkcode HexagonalGrid.cubeToOffset | HexagonalGrid#cubeToOffset}.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param offset - The offset coordinates
   * @returns The integer cube coordinates
   */
  offsetToCube(offset: BaseGrid.Offset3D): HexagonalGrid.Cube3D;
  offsetToCube(offset: BaseGrid.Offset2D): HexagonalGrid.Cube2D;

  /**
   * Convert integer cube coordinates (q, r, s) / (q, r, s, k) into offset coordinates (i, j) / (i, j, k).
   * Inverse of {@linkcode HexagonalGrid.offsetToCube | HexagonalGrid#offsetToCube}.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param cube - The cube coordinates
   * @returns The offset coordinates
   */
  cubeToOffset(cube: HexagonalGrid.Cube3D): BaseGrid.Offset3D;
  cubeToOffset(cube: HexagonalGrid.Cube2D): BaseGrid.Offset2D;

  /**
   * Measure the distance in hexagons between two cube coordinates.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param a - The first cube coordinates
   * @param b - The second cube coordinates
   * @returns The distance between the two cube coordinates in hexagons
   */
  static cubeDistance(a: HexagonalGrid.Cube2D, b: HexagonalGrid.Cube2D): number;

  #HexagonalGrid: true;

  static #HexagonalGridStatic: true;
}

declare namespace HexagonalGrid {
  /** @internal */
  interface _Configuration {
    /**
     * Is this grid column-based (flat-topped) or row-based (pointy-topped)?
     * @defaultValue `false`
     */
    columns: boolean;

    /**
     * Is this grid even or odd?
     * @defaultValue `false`
     */
    even: boolean;
  }

  interface Configuration
    extends InexactPartial<BaseGrid._Diagonals>, InexactPartial<_Configuration>, BaseGrid.Configuration {}

  /**
   * 2D cube coordinates in a hexagonal grid. q + r + s = 0.
   */
  interface Cube2D {
    /**
     * The coordinate along the E-W (columns) or SW-NE (rows) axis.
     * Equal to the offset column coordinate if column orientation.
     */
    q: number;

    /**
     * The coordinate along the NE-SW (columns) or N-S (rows) axis.
     * Equal to the offset row coordinate if row orientation.
     */
    r: number;

    /** The coordinate along the SE-NW axis. */
    s: number;
  }

  /**
   * 3D cube coordinates in a hexagonal grid. q + r + s = 0.
   */
  interface Cube3D extends Cube2D {
    /**
     * The vertical coordinate.
     */
    k: number;
  }

  /**
   * 2D hexagonal cube coordinates, a 2D offset of a grid space, or a 2D point with pixel coordinates.
   */
  type Coordinates2D = BaseGrid.Coordinates2D | Cube2D;

  /**
   * 3D hexagonal cube coordinates, a 3D offset of a grid space, or a 3D point with pixel coordinates.
   */
  type Coordinates3D = BaseGrid.Coordinates3D | Cube3D;
}

export default HexagonalGrid;
