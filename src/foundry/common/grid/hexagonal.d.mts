import type BaseGrid from "./base.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

import type { InexactPartial } from "#utils";

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

  /** Is this grid column-based (flat-topped) or row-based (pointy-topped)yy? */
  columns: boolean;

  /** Is this grid even or odd? */
  even: boolean;

  getOffset(coords: HexagonalGrid.Coordinates): HexagonalGrid.Offset;

  getOffsetRange(bounds: Canvas.Rectangle): HexagonalGrid.OffsetRange;

  getAdjacentOffsets(coords: HexagonalGrid.Coordinates): HexagonalGrid.Offset[];

  testAdjacency(coords1: HexagonalGrid.Coordinates, coords2: HexagonalGrid.Coordinates): boolean;

  getShiftedOffset(coords: HexagonalGrid.Coordinates, direction: number): HexagonalGrid.Offset;

  getShiftedPoint(point: Canvas.Point, direction: number): Canvas.Point;

  /**
   * Returns the cube coordinates of the grid space corresponding to the given coordinates.
   * @param coords - The coordinates
   * @returns The cube coordinates
   */
  getCube(coords: HexagonalGrid.Coordinates): HexagonalGrid.Cube;

  /**
   * Returns the cube coordinates of grid spaces adjacent to the one corresponding to the given coordinates.
   * @param coords - The coordinates
   * @returns The adjacent cube coordinates
   */
  getAdjacentCubes(coords: HexagonalGrid.Coordinates): HexagonalGrid.Cube[];

  /**
   * Returns the cube coordinates of the grid space corresponding to the given coordinates
   * shifted by one grid space in the given direction.
   * @param coords    - The coordinates
   * @param direction - The direction (see {@linkcode CONST.MOVEMENT_DIRECTIONS})
   * @returns The cube coordinates
   */
  getShiftedCube(coords: HexagonalGrid.Coordinates, direction: number): HexagonalGrid.Cube;

  getTopLeftPoint(coords: HexagonalGrid.Coordinates): Canvas.Point;

  getCenterPoint(coords: HexagonalGrid.Coordinates): Canvas.Point;

  getShape(): Canvas.Point[];

  getVertices(coords: HexagonalGrid.Coordinates): Canvas.Point[];

  getSnappedPoint({ x, y }: Canvas.Point, behavior: HexagonalGrid.SnappingBehavior): Canvas.Point;

  /** @privateRemarks This is added so that ts knows this class has a private method. */
  #snapToCenter();

  calculateDimensions(sceneWidth: number, sceneHeight: number, padding: number): HexagonalGrid.Dimensions;

  /**
   * Calculate the total size of the canvas with padding applied, as well as the top-left coordinates of the inner
   * rectangle that houses the scene. (Legacy)
   * @param columns     - Column or row orientation?
   * @param legacySize  - The legacy size of the grid.
   * @param sceneWidth  - The width of the scene.
   * @param sceneHeight - The height of the scene.
   * @param padding     - The percentage of padding.
   */
  protected static _calculatePreV10Dimensions(
    columns: number,
    legacySize: number,
    sceneWidth: number,
    sceneHeight: number,
    padding: number,
  ): HexagonalGrid.Dimensions;

  protected _measurePath(
    waypoints: HexagonalGrid.MeasurePathWaypoint[],
    options: InexactPartial<{ cost: HexagonalGrid.MeasurePathCostFunction }>,
    result: HexagonalGrid.MeasurePathResult,
  ): void;

  getDirectPath(waypoints: HexagonalGrid.Coordinates[]): HexagonalGrid.Offset[];

  getTranslatedPoint(point: Canvas.Point, direction: number, distance: number): Canvas.Point;

  getCircle(center: Canvas.Point, radius: number): Canvas.Point[];

  /**
   * Round the fractional cube coordinates (q, r, s).
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param cube- The fractional cube coordinates
   * @returns The rounded integer cube coordinates
   */
  static cubeRound(cube: HexagonalGrid.Cube): HexagonalGrid.Cube;

  /**
   * Convert point coordinates (x, y) into cube coordinates (q, r, s).
   * Inverse of {@link HexagonalGrid.cubeToPoint | `HexagonalGrid#cubeToPoint`}.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param point - The point
   * @returns The (fractional) cube coordinates
   */
  pointToCube(point: Canvas.Point): HexagonalGrid.Cube;

  /**
   * Convert cube coordinates (q, r, s) into point coordinates (x, y).
   * Inverse of {@link HexagonalGrid.pointToCube | `HexagonalGrid#pointToCube`}.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param cube - The cube coordinates
   * @returns The point coordinates
   */
  cubeToPoint(cube: HexagonalGrid.Cube): Canvas.Point;

  /**
   * Convert offset coordinates (i, j) into integer cube coordinates (q, r, s).
   * Inverse of {@link HexagonalGrid.cubeToOffset | `HexagonalGrid#cubeToOffset`}.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param offset - The offset coordinates
   * @returns The integer cube coordinates
   */
  offsetToCube(offset: HexagonalGrid.Offset): HexagonalGrid.Cube;

  /**
   * Convert integer cube coordinates (q, r, s) into offset coordinates (i, j).
   * Inverse of {@link HexagonalGrid.offsetToCube | `HexagonalGrid#offsetToCube`}.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param cube - The cube coordinates
   * @returns The offset coordinates
   */
  cubeToOffset(cube: HexagonalGrid.Cube): HexagonalGrid.Offset;

  /**
   * Measure the distance in hexagons between two cube coordinates.
   * @see {@link https://www.redblobgames.com/grids/hexagons/}
   * @param a - The first cube coordinates
   * @param b - The second cube coordinates
   * @returns The distance between the two cube coordinates in hexagons
   */
  static cubeDistance(a: HexagonalGrid.Cube, b: HexagonalGrid.Cube): number;

  /** Used by {@link HexagonalGrid.snapToCenter | `HexagonalGrid#snapToCenter`}. */
  static #TEMP_POINT: Canvas.Point;

  /**
   * Used by {@link HexagonalGrid.snapToCenter | `HexagonalGrid#snapToCenter`}.
   * Always an odd grid!
   */
  static #TEMP_GRID: HexagonalGrid;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /**
   * Special border polygons for different token sizes.
   * @deprecated Since v12 until v14. No Replacement
   */
  static get POINTY_HEX_BORDERS(): Record<number, Canvas.PointTuple[]>;

  /**
   * @deprecated Since v12 until v14. No Replacement
   */
  static #POINTY_HEX_BORDERS: Record<number, number[][]>;

  /**
   * Special border polygons for different token sizes.
   * @deprecated Since v12 until v14. No Replacement
   */
  static get FLAT_HEX_BORDERS(): Record<number, Canvas.PointTuple[]>;

  /**
   * A matrix of x and y offsets which is multiplied by the width/height vector to get pointy-top polygon coordinates
   * @deprecated Since v12 until v14. No Replacement
   */
  static get pointyHexPoints(): Canvas.PointTuple[];

  /**
   * A matrix of x and y offsets which is multiplied by the width/height vector to get flat-top polygon coordinates
   * @deprecated Since v12 until v14. No Replacement
   */
  static get flatHexPoints(): Canvas.PointTuple[];

  /**
   * An array of the points which define a hexagon for this grid shape
   * @deprecated Since v12 until v14. No Replacement
   */
  get hexPoints(): Canvas.PointTuple[];

  /**
   * A convenience method for getting all the polygon points relative to a top-left [x,y] coordinate pair
   * @param x      - The top-left x-coordinate
   * @param y      - The top-right y-coordinate
   * @param w      - An optional polygon width
   * @param h      - An optional polygon height
   * @param points - An optional list of polygon points.
   * @deprecated Since v12 until v14. You can get the shape of the hex with {@link HexagonalGrid.getShape | `HexagonalGrid#getShape`}
   *             and the polygon with {@link HexagonalGrid.getVertices | `HexagonalGrid#getVertices`}.
   */
  getPolygon(x: number, y: number, w?: number, h?: number, points?: Canvas.PointTuple[]): Canvas.PointTuple[];

  /**
   * @deprecated Since v12 until v14. If you need the shape of a Token, use {@link Token.getShape | `Token#getShape`} instead.
   */
  getBorderPolygon(w: number, h: number, p: number): Canvas.PointTuple[];

  /**
   * @deprecated Since v12 until v14. If you need the size of a Token, use {@link Token.getSize | `Token#getSize`} instead.
   */
  getRect(w: number, h: number): PIXI.Rectangle;

  /**
   * Implement special rules for snapping tokens of various sizes on a hex grid.
   * @param x     - The X co-ordinate of the hexagon's top-left bounding box.
   * @param y     - The Y co-ordinate of the hexagon's top-left bounding box.
   * @param token - The token.
   * @deprecated Since v12 until v14. No Replacement
   */
  protected _adjustSnapForTokenSize(x: number, y: number, token: Token.Implementation): [x: number, y: number];

  /**
   * We set the 'size' of a hexagon (the distance from a hexagon's centre to a vertex) to be equal to the grid size
   * divided by √3. This makes the distance from top-to-bottom on a flat-topped hexagon, or left-to-right on a pointy-
   * topped hexagon equal to the grid size.
   * @param config - The grid configuration
   * @returns The width and height of a single hexagon, in pixels.
   * @deprecated Since v12 until v14. No Replacement
   */
  static computeDimensions(config: HexagonalGrid.Configuration): { width: number; height: number };

  /**
   * Is this hex grid column-based (flat-topped), or row-based (pointy-topped)?
   * @deprecated Since v12 until v14. Use {@link HexagonalGrid.columns | `HexagonalGrid#columns`} instead.
   */
  get columnar(): boolean;

  /**
   * Is this hex grid column-based (flat-topped), or row-based (pointy-topped)?
   * @deprecated Since v12 until v14. Use {@link HexagonalGrid.columns | `HexagonalGrid#columns`} instead.
   */
  set columnar(value: boolean);

  /**
   * Implement special rules for determining the grid position of tokens of various sizes on a hex grid.
   * @param row   - The row number.
   * @param col   - The column number.
   * @param token - The token.
   * @returns The adjusted row and column number.
   * @deprecated Since v12 until v14. No Replacement
   */
  protected _adjustPositionForTokenSize(row: number, col: number, token: Token.Implementation): [x: number, y: number];

  /**
   * Compute the grid configuration from a provided type
   * @param type - The grid type
   * @param size - The grid size in pixels
   * @deprecated Since v12 until v14. No Replacement
   */
  static getConfig(type: number, size: number): HexagonalGrid.Configuration;

  /**
   * Convert an offset coordinate (row, col) into a cube coordinate (q, r, s).
   * See https://www.redblobgames.com/grids/hexagons/ for reference
   * Source code available https://www.redblobgames.com/grids/hexagons/codegen/output/lib-functions.js
   * @param offset - The offset coordinate
   * @param config - The hex grid configuration
   * @deprecated Since v12 until v14. Use {@link HexagonalGrid.offsetToCube | `HexagonalGrid#offsetToCube`} instead.
   */
  static offsetToCube(
    offset: unknown,
    config?: InexactPartial<{
      columns: boolean;
      even: boolean;
    }>,
  ): HexagonalGrid.Cube;

  /**
   * Convert a cube coordinate (q, r, s) into an offset coordinate (row, col).
   * See https://www.redblobgames.com/grids/hexagons/ for reference
   * Source code available https://www.redblobgames.com/grids/hexagons/codegen/output/lib-functions.js
   * @param cube   - The cube coordinate
   * @param config - The hex grid configuration
   * @returns The offset coordinate
   * @deprecated Since v12 until v14. Use {@link HexagonalGrid.cubeToOffset | `HexagonalGrid#cubeToOffset`} instead.
   */
  static cubeToOffset(cube: unknown, config: HexagonalGrid.Configuration): HexagonalGrid.Offset;

  /**
   * Given a cursor position (x, y), obtain the cube coordinate hex (q, r, s) of the hex which contains it
   * http://justinpombrio.net/programming/2020/04/28/pixel-to-hex.html
   * @param point  - The pixel point
   * @param config - The hex grid configuration
   * @returns The cube coordinate
   * @deprecated Since v12 until v14. Use {@link HexagonalGrid.pointToCube | `HexagonalGrid#pointToCube`} instead.
   */
  static pixelToCube(point: Canvas.Point, config: HexagonalGrid.Configuration): HexagonalGrid.Coordinates;

  /**
   * Compute the top-left pixel coordinate of a hexagon from its offset coordinate.
   * @param offset - The offset coordinate
   * @param config - The hex grid configuration
   * @returns The coordinate in pixels
   * @deprecated Since v12 until v14. Use {@link HexagonalGrid.getTopLeftPoint | `HexagonalGrid#getTopLeftPoint`} instead.
   */
  static offsetToPixels(offset: unknown, config: HexagonalGrid.Configuration): Canvas.Point;

  /**
   * Compute the offset coordinate of a hexagon from a pixel coordinate contained within that hex.
   * @param point  - The pixel coordinate
   * @param config - The hex grid configuration
   * @param method - Which Math rounding method to use
   *                 (default: "floor")
   * @returns The offset coordinate
   * @deprecated Since v12 until v14. No Replacement
   */
  static pixelsToOffset(
    point: Canvas.Point,
    config: HexagonalGrid.Configuration,
    method?: keyof Math,
  ): HexagonalGrid.Coordinates;

  /**
   * Compute the shortest path between two hexagons using the A-star algorithm.
   * See https://www.redblobgames.com/pathfinding/a-star/introduction.html for reference
   * @param start - The starting hexagon
   * @param goal  - The objective hexagon
   * @returns The optimal path of hexagons to traverse
   * @deprecated Since v12 until v14. No Replacement
   */
  getAStarPath(start: unknown, goal: unknown): { cost: number; path: unknown[] };
}

declare namespace HexagonalGrid {
  interface Configuration extends BaseGrid.Configuration {
    /**
     * Is this grid column-based (flat-topped) or row-based (pointy-topped)yy?
     * Default: `false`
     */
    columns: boolean;

    /**
     * Is this grid even or odd?
     * Default: `false`
     */
    even: boolean;
  }

  /** Cube coordinates in a hexagonal grid. q + r + s = 0. */
  interface Cube {
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

  interface Offset extends BaseGrid.Offset {}

  interface OffsetRange extends BaseGrid.OffsetRange {}

  /** Cube coordinates in a hexagonal grid. q + r + s = 0. */
  type Coordinates = BaseGrid.Coordinates | Cube;

  interface SnappingBehavior extends BaseGrid.SnappingBehavior {}

  type MeasurePathWaypoint = BaseGrid.MeasurePathWaypoint;

  interface MeasurePathResultWaypoint extends BaseGrid.MeasurePathResultWaypoint {}

  interface MeasurePathResultSegment extends BaseGrid.MeasurePathResultSegment {}

  interface MeasurePathResult extends BaseGrid.MeasurePathResult {}

  type MeasurePathCostFunction = BaseGrid.MeasurePathCostFunction;

  interface Dimensions extends BaseGrid.Dimensions {}
}

export default HexagonalGrid;
