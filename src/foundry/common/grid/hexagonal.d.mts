import type { InexactPartial } from "#utils";
import type { BaseGrid, GridHex } from "#common/grid/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

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

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /**
   * Special border polygons for different token sizes.
   * @deprecated "`HexagonalGrid.POINTY_HEX_BORDERS` is deprecated without replacement." (since v12, until v14)
   */
  static get POINTY_HEX_BORDERS(): Record<number, Canvas.PointTuple[]>;

  /**
   * Special border polygons for different token sizes.
   * @deprecated "`HexagonalGrid.FLAT_HEX_BORDERS` is deprecated without replacement." (since v12, until v14)
   */
  static get FLAT_HEX_BORDERS(): Record<number, Canvas.PointTuple[]>;

  /**
   * A matrix of x and y offsets which is multiplied by the width/height vector to get pointy-top polygon coordinates
   * @deprecated "`HexagonalGrid.pointyHexPoints` is deprecated without replacement." (since v12, until v14)
   */
  static get pointyHexPoints(): Canvas.PointTuple[];

  /**
   * A matrix of x and y offsets which is multiplied by the width/height vector to get flat-top polygon coordinates
   * @deprecated "`HexagonalGrid.flatHexPoints` is deprecated without replacement." (since v12, until v14)
   */
  static get flatHexPoints(): Canvas.PointTuple[];

  /**
   * An array of the points which define a hexagon for this grid shape
   * @deprecated "`HexagonalGrid#hexPoints` is deprecated without replacement." (since v12, until v14)
   */
  get hexPoints(): Canvas.PointTuple[];

  /**
   * A convenience method for getting all the polygon points relative to a top-left [x,y] coordinate pair
   * @param x      - The top-left x-coordinate
   * @param y      - The top-right y-coordinate
   * @param w      - An optional polygon width
   * @param h      - An optional polygon height
   * @param points - An optional list of polygon points.
   * @deprecated "`HexagonalGrid#getPolygon` is deprecated. You can get the shape of the hex with
   * {@linkcode HexagonalGrid.getShape | HexagonalGrid#getShape} and the polygon with
   * {@linkcode HexagonalGrid.getVertices | HexagonalGrid#getVertices}." (since v12, until v14)
   */
  getPolygon(x: number, y: number, w?: number, h?: number, points?: Canvas.PointTuple[]): Canvas.PointTuple[];

  /**
   * @deprecated "`HexagonalGrid#getBorderPolygon` is deprecated. If you need the shape of a Token, use
   * {@linkcode Token.getShape | Token#getShape} instead." (since v12, until v14)
   */
  getBorderPolygon(w: number, h: number, p: number): Canvas.PointTuple[];

  /**
   * @deprecated "`HexagonalGrid#getRect` is deprecated. If you need the size of a Token, use {@linkcode Token.getSize | Token#getSize}
   * instead." (since v12, until v14)
   */
  getRect(w: number, h: number): PIXI.Rectangle;

  /**
   * Implement special rules for snapping tokens of various sizes on a hex grid.
   * @param x     - The X co-ordinate of the hexagon's top-left bounding box.
   * @param y     - The Y co-ordinate of the hexagon's top-left bounding box.
   * @param token - The token.
   * @deprecated "`HexagonalGrid#_adjustSnapForTokenSize` is deprecated." (since v12, until v14)
   */
  protected _adjustSnapForTokenSize(x: number, y: number, token: Token.Implementation): [x: number, y: number];

  /**
   * We set the 'size' of a hexagon (the distance from a hexagon's centre to a vertex) to be equal to the grid size
   * divided by √3. This makes the distance from top-to-bottom on a flat-topped hexagon, or left-to-right on a pointy-
   * topped hexagon equal to the grid size.
   * @param config - The grid configuration
   * @returns The width and height of a single hexagon, in pixels.
   * @deprecated "`HexagonalGrid.computeDimensions` is deprecated without replacement." (since v12, until v14)
   */
  static computeDimensions(config: HexagonalGrid.Configuration): { width: number; height: number };

  /**
   * Is this hex grid column-based (flat-topped), or row-based (pointy-topped)?
   * @deprecated "`HexagonalGrid#columnar` is deprecated in favor of  {@linkcode HexagonalGrid.columns | HexagonalGrid#columns}."
   * (since v12, until v14)
   */
  get columnar(): boolean;

  /**
   * Is this hex grid column-based (flat-topped), or row-based (pointy-topped)?
   * @deprecated "`HexagonalGrid#columnar` is deprecated in favor of  {@linkcode HexagonalGrid.columns | HexagonalGrid#columns}."
   * (since v12, until v14)
   */
  set columnar(value: boolean);

  /**
   * @deprecated "`HexagonalGrid#getCenter` is deprecated. Use {@linkcode HexagonalGrid.getCenterPoint | HexagonalGrid#getCenterPoint}
   * instead." (since v12, until v14)
   */
  getCenter(x: number, y: number): Canvas.PointTuple;

  /**
   * @deprecated "`HexagonalGrid#getSnappedPosition` is deprecated. Use
   * {@linkcode HexagonalGrid.getSnappedPoint | HexagonalGrid#getSnappedPoint} instead." (since v12, until v14)
   */
  getSnappedPosition(
    x: number,
    y: number,
    interval?: number,
    options?: { token?: Token.Implementation | undefined },
  ): PIXI.IPointData;

  /**
   * @deprecated "`HexagonalGrid#getGridPositionFromPixels` is deprecated. This function is based on the 'brick wall' grid. For getting the
   * offset coordinates of the hex containing the given point use {@linkcode HexagonalGrid.getOffset | HexagonalGrid#getOffset}."
   * (since v12, until v14)
   */
  getGridPositionFromPixels(x: number, y: number): [row: number, col: number];

  /**
   * @deprecated "`HexagonalGrid#getPixelsFromGridPosition` is deprecated. This function is based on the 'brick wall' grid. For getting the
   * top-left coordinates of the hex at the given offset coordinates use
   * {@linkcode HexagonalGrid.getTopLeftPoint | HexagonalGrid#getTopLeftPoint}." (since v12, until v14))
   */
  getPixelsFromGridPosition(row: number, col: number): Canvas.PointTuple;

  // shiftPosition deprecated override changes neither signature nor (erroneously) class name in deprecation warning. (since v12, until v14)

  /**
   * @deprecated "`HexagonalGrid#measureDistance` now returns the same result as
   * {@linkcode foundry.canvas.layers.GridLayer.measureDistance | GridLayer#measureDistance} instead of the cube distance (breaking). Use
   * {@linkcode HexagonalGrid.measurePath | HexagonalGrid#measurePath} instead to get the number of steps (cube distance) between the origin
   * and target." (since v12, until v14)
   */
  measureDistance(origin: Canvas.Point, target: Canvas.Point, options?: object): number[];

  /**
   * @deprecated "`HexagonalGrid#measureDistances` is deprecated. Use {@linkcode HexagonalGrid.measurePath | HexagonalGrid#measurePath}
   * instead, which returns grid distance (`gridSpaces: true`) and Euclidean distance (`gridSpaces: false`)." (since v12, until v14)
   */
  measureDistances(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    segments: BaseGrid.Segment[],
    options?: {
      /** @defaultValue `false` */
      gridSpaces?: boolean | undefined;
    },
  ): number[];

  /**
   * Implement special rules for determining the grid position of tokens of various sizes on a hex grid.
   * @param row   - The row number.
   * @param col   - The column number.
   * @param token - The token.
   * @returns The adjusted row and column number.
   * @deprecated "`HexagonalGrid#_adjustPositionForTokenSize` is deprecated." (since v12, until v14)
   */
  protected _adjustPositionForTokenSize(row: number, col: number, token: Token.Implementation): [x: number, y: number];

  /**
   * Compute the grid configuration from a provided type
   * @param type - The grid type
   * @param size - The grid size in pixels
   * @deprecated "`HexagonalGrid.getConfig` is deprecated without replacement." (since v12, until v14)
   */
  static getConfig(type: number, size: number): HexagonalGrid.Configuration;

  /**
   * Convert an offset coordinate (row, col) into a cube coordinate (q, r, s).
   * See https://www.redblobgames.com/grids/hexagons/ for reference
   * Source code available https://www.redblobgames.com/grids/hexagons/codegen/output/lib-functions.js
   * @param offset - The offset coordinate
   * @param config - The hex grid configuration
   * @deprecated "`HexagonalGrid.offsetToCube` is deprecated. Use {@linkcode HexagonalGrid.offsetToCube | HexagonalGrid#offsetToCube}
   * instead." (since v12, until v14)
   */
  static offsetToCube(offset: { row: number; col: number }, config?: HexagonalGrid.Configuration): HexagonalGrid.Cube2D;

  /**
   * Convert a cube coordinate (q, r, s) into an offset coordinate (row, col).
   * See https://www.redblobgames.com/grids/hexagons/ for reference
   * Source code available https://www.redblobgames.com/grids/hexagons/codegen/output/lib-functions.js
   * @param cube   - The cube coordinate
   * @param config - The hex grid configuration
   * @returns The offset coordinate
   * @deprecated "`HexagonalGrid.cubeToOffset` is deprecated. Use {@linkcode HexagonalGrid.cubeToOffset | HexagonalGrid#cubeToOffset}
   * instead." (since v12, until v14)
   */
  static cubeToOffset(cube: HexagonalGrid.Cube2D, config?: HexagonalGrid.Configuration): { row: number; col: number };

  /**
   * Given a cursor position (x, y), obtain the cube coordinate hex (q, r, s) of the hex which contains it
   * http://justinpombrio.net/programming/2020/04/28/pixel-to-hex.html
   * @param point  - The pixel point
   * @param config - The hex grid configuration
   * @returns The cube coordinate
   * @deprecated "`HexagonalGrid.pixelToCube` is deprecated. Use {@linkcode HexagonalGrid.pointToCube | HexagonalGrid#pointToCube} instead.
   */
  static pixelToCube(point: Canvas.Point, config: HexagonalGrid.Configuration): HexagonalGrid.Cube2D;

  /**
   * Compute the top-left pixel coordinate of a hexagon from its offset coordinate.
   * @param offset - The offset coordinate
   * @param config - The hex grid configuration
   * @returns The coordinate in pixels
   * @deprecated "`HexagonalGrid.offsetToPixels` is deprecated. Use
   * {@linkcode HexagonalGrid.getTopLeftPoint | HexagonalGrid#getTopLeftPoint} instead." (since v12, until v14)
   */
  static offsetToPixels(offset: { row: number; col: number }, config: HexagonalGrid.Configuration): Canvas.Point;

  /**
   * Compute the offset coordinate of a hexagon from a pixel coordinate contained within that hex.
   * @param point  - The pixel coordinate
   * @param config - The hex grid configuration
   * @param method - Which Math rounding method to use (default: `"floor"`)
   * @returns The offset coordinate
   * @deprecated "`HexagonalGrid.pixelsToOffset` is deprecated without replacement. This function is based on the 'brick wall' grid. For
   * getting the offset coordinates of the hex containing the given point use {@linkcode HexagonalGrid.getOffset | HexagonalGrid#getOffset}."
   * (since v12, until v14)
   */
  static pixelsToOffset(
    point: Canvas.Point,
    config: HexagonalGrid.Configuration,
    method?: keyof Math,
  ): { row: number; col: number };

  /**
   * Compute the shortest path between two hexagons using the A-star algorithm.
   * See https://www.redblobgames.com/pathfinding/a-star/introduction.html for reference
   * @param start - The starting hexagon
   * @param goal  - The objective hexagon
   * @returns The optimal path of hexagons to traverse
   * @deprecated "`HexagonalGrid#getAStarPath` is deprecated without replacement." (since v12, until v14)
   */
  getAStarPath(
    start: GridHex,
    goal: GridHex,
    options?: object,
  ): { from: GridHex; to: GridHex; cost: number; path: GridHex[] };

  #HexagonalGrid: true;
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
   * @deprecated Use either {@linkcode HexagonalGrid.Cube2D} or {@linkcode HexagonalGrid.Cube3D} as appropriate.
   * This warning will be removed in v14.
   */
  type Cube = Cube2D | Cube3D;

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

  /** @deprecated Use {@linkcode BaseGrid.Offset2D} or {@linkcode BaseGrid.Offset3D} as appropriate. This warning will be removed in v14. */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type Offset = BaseGrid.Offset;

  /** @deprecated Use {@linkcode BaseGrid.OffsetRange} instead. This type will be removed in v14. */
  type OffsetRange = BaseGrid.OffsetRange;

  /**
   * @deprecated Use {@linkcode HexagonalGrid.Coordinates2D} or {@linkcode HexagonalGrid.Coordinates3D} as appropriate.
   * This warning will be removed in v14.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type Coordinates = BaseGrid.Coordinates | HexagonalGrid.Cube;

  /**
   * 2D hexagonal cube coordinates, a 2D offset of a grid space, or a 2D point with pixel coordinates.
   */
  type Coordinates2D = BaseGrid.Coordinates2D | Cube2D;

  /**
   * 3D hexagonal cube coordinates, a 3D offset of a grid space, or a 3D point with pixel coordinates.
   */
  type Coordinates3D = BaseGrid.Coordinates3D | Cube3D;

  /** @deprecated Use {@linkcode BaseGrid.SnappingBehavior} instead. This warning will be removed in v14. */
  type SnappingBehavior = BaseGrid.SnappingBehavior;

  /**
   * @deprecated Use {@linkcode BaseGrid.Waypoint}`<`{@linkcode HexagonalGrid.Coordinates2D}`>`/`<`{@linkcode HexagonalGrid.Coordinates3D}`>`
   * instead as appropriate. This warning will be removed in v14.
   */
  type MeasurePathWaypoint = BaseGrid.Waypoint<HexagonalGrid.Coordinates2D | HexagonalGrid.Coordinates3D>;

  /** @deprecated Use {@linkcode BaseGrid.MeasurePathResultWaypoint} instead. This warning will be removed in v14. */
  type MeasurePathResultWaypoint = BaseGrid.MeasurePathResultWaypoint;

  /** @deprecated Use {@linkcode BaseGrid.MeasurePathResultSegment} instead. This warning will be removed in v14. */
  type MeasurePathResultSegment = BaseGrid.MeasurePathResultSegment;

  /** @deprecated Use {@linkcode BaseGrid.MeasurePathResult} instead. This warning will be removed in v14. */
  type MeasurePathResult = BaseGrid.MeasurePathResult;

  /** @deprecated Use {@linkcode BaseGrid.CostFunction} with an appropriate coordinate type instead. This warning will be removed in v14. */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type MeasurePathCostFunction = BaseGrid.MeasurePathCostFunction2D | BaseGrid.MeasurePathCostFunction3D;

  /** @deprecated Use {@linkcode BaseGrid.Dimensions} instead. This warning will be removed in v14. */
  type Dimensions = BaseGrid.Dimensions;
}

export default HexagonalGrid;
