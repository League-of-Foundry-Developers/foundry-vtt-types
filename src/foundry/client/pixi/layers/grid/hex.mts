import type { CONST } from "../../../../common/module.mts";

declare global {
  type HexGridConfiguration = {
    /**
     * Columnar orientation?
     * @defaultValue `true`
     */
    columns: boolean;

    /**
     * Offset even rows?
     * @defaultValue `false`
     */
    even: boolean;

    /**
     * Hex size in pixels
     * @defaultValue `100`
     */
    size: number;

    /**
     * Hex width in pixels
     */
    width?: number | undefined;

    /**
     * Hex height in pixels
     */
    height?: number | undefined;

    /**
     * Legacy hex grid computation (not recommended)
     */
    legacy?: boolean | undefined;
  };

  type HexCubeCoordinate = {
    /**
     * Coordinate along the SW - NE axis
     */
    q: number;

    /**
     * Coordinate along the S - N axis
     */
    r: number;

    /**
     * Coordinate along the NW - SE axis
     */
    s: number;
  };

  type HexOffsetCoordinate = {
    /**
     * The row coordinate
     */
    row: number;

    /**
     * The column coordinate
     */
    col: number;
  };

  /**
   * A helper class which represents a single hexagon as part of a HexagonalGrid.
   * This class relies on having an active canvas scene in order to know the configuration of the hexagonal grid.
   */
  class GridHex {
    constructor(coordinate: HexOffsetCoordinate | HexCubeCoordinate, config: HexGridConfiguration);

    /**
     * The hexagonal grid type which this hex belongs to.
     */
    config: HexGridConfiguration;

    /**
     * The cube coordinates representation of this Hexagon
     */
    cube: HexCubeCoordinate;

    /**
     * The offset coordinates representation of this Hexagon
     */
    offset: HexOffsetCoordinate;

    /**
     * Return a reference to the pixel point in the center of this hexagon.
     */
    get center(): Point;

    /**
     * Return a reference to the pixel point of the top-left corner of this hexagon.
     */
    get topLeft(): Point;

    /**
     * Return the array of hexagons which are neighbors of this one.
     * This result is un-bounded by the confines of the game canvas and may include hexes which are off-canvas.
     */
    getNeighbors(): GridHex[];

    /**
     * Get a neighboring hex by shifting along cube coordinates
     * @param dq - A number of hexes to shift along the q axis
     * @param dr - A number of hexes to shift along the r axis
     * @param ds - A number of hexes to shift along the s axis
     * @returns The shifted hex
     */
    shiftCube(dq: number, dr: number, ds: number): GridHex;

    /**
     * Return whether this GridHex equals the same position as some other GridHex instance.
     * @param other - Some other GridHex
     * @returns Are the positions equal?
     */
    equals(other: GridHex): boolean;
  }
  /**
   * Construct a hexagonal grid
   */
  class HexagonalGrid extends BaseGrid {
    constructor(config: HexGridConfiguration);

    /**
     * Is this hex grid column-based (flat-topped), or row-based (pointy-topped)?
     * @defaultValue `false`
     */
    columnar: boolean;

    /**
     * Is this hex grid even or odd?
     * @defaultValue `false`
     */
    even: boolean;

    w: number;

    h: number;

    /**
     * Compute the grid configuration from a provided type
     * @param type - The grid type
     * @param size - The grid size in pixels
     */
    static getConfig(type: number, size: number): HexGridConfiguration;

    /**
     * Special border polygons for different token sizes.
     */
    static POINTY_HEX_BORDERS: Record<number, PointArray[]>;

    /**
     * Special border polygons for different token sizes.
     */
    static FLAT_HEX_BORDERS: Record<number, PointArray[]>;

    /**
     * A matrix of x and y offsets which is multiplied by the width/height vector to get pointy-top polygon coordinates
     */
    static get pointyHexPoints(): PointArray[];

    /**
     * A matrix of x and y offsets which is multiplied by the width/height vector to get flat-top polygon coordinates
     */
    static get flatHexPoints(): PointArray[];

    /**
     * An array of the points which define a hexagon for this grid shape
     */
    get hexPoints(): PointArray[];

    override draw(options?: BaseGrid.DrawOptions | undefined): this;

    /**
     * A convenience method for getting all the polygon points relative to a top-left [x,y] coordinate pair
     * @param x      - The top-left x-coordinate
     * @param y      - The top-right y-coordinate
     * @param w      - An optional polygon width
     * @param h      - An optional polygon height
     * @param points - An optional list of polygon points.
     */
    getPolygon(x: number, y: number, w?: number, h?: number, points?: PointArray[]): PointArray[];

    /**
     * Draw the grid lines.
     * @param preview - Override settings used in place of those saved to the scene data.
     * @internal
     */
    protected _drawGrid(options?: BaseGrid.DrawOptions): PIXI.Graphics;

    /** @internal */
    protected _drawRows(grid: PIXI.Graphics, nrows: number, ncols: number): void;

    /** @internal */
    protected _drawColumns(grid: PIXI.Graphics, nrows: number, ncols: number): void;

    /**
     * Draw a hexagon from polygon points.
     * @param grid - Reference to the grid graphics.
     * @param poly - Array of points to draw the hexagon.
     */
    protected _drawHexagon(grid: PIXI.Graphics, poly: number[]): void;

    /**
     * Get the position in grid space from a pixel coordinate.
     * @param x      - The origin x-coordinate
     * @param y      - The origin y-coordinate
     * @param method - The rounding method applied
     *                 (default: `"floor"`)
     * @returns The row, column combination
     */
    getGridPositionFromPixels(x: number, y: number, method?: "floor" | "ceil" | "round"): PointArray;

    override getPixelsFromGridPosition(row: number, col: number): PointArray;

    override getCenter(x: number, y: number): PointArray;

    /**
     * @param interval - (default: `1`)
     */
    override getSnappedPosition(
      x: number,
      y: number,
      interval?: number | null,
      options?: InexactPartial<{
        token: Token;
      }>,
    ): { x: number; y: number };

    /** @internal */
    protected _getClosestVertex(xc: number, yc: number, ox: number, oy: number): { x: number; y: number };

    override shiftPosition(
      x: number,
      y: number,
      dx: number,
      dy: number,
      options?: InexactPartial<{
        token: Token;
      }>,
    ): PointArray;

    protected override _getRulerDestination(ray: Ray, offset: Point, token: Token): { x: number; y: number };

    /**
     * Implement special rules for snapping tokens of various sizes on a hex grid.
     * @param x     - The X co-ordinate of the hexagon's top-left bounding box.
     * @param y     - The Y co-ordinate of the hexagon's top-left bounding box.
     * @param token - The token.
     */
    protected _adjustSnapForTokenSize(x: number, y: number, token: Token): [x: number, y: number];

    /**
     * Implement special rules for determining the grid position of tokens of various sizes on a hex grid.
     * @param row   - The row number.
     * @param col   - The column number.
     * @param token - The token.
     * @returns The adjusted row and column number.
     */
    protected _adjustPositionForTokenSize(row: number, col: number, token: Token): [x: number, y: number];

    override getRect(w: number, h: number): PIXI.Rectangle;

    static override calculatePadding(
      gridType: CONST.GRID_TYPES,
      width: number,
      height: number,
      size: number,
      padding: number,
      options?: InexactPartial<{ legacy?: boolean }>,
    ): { width: number; height: number; x: number; y: number };

    /**
     * @param options - (default: `{}`)
     */
    override highlightGridPosition(layer: GridHighlight, options?: BaseGrid.HighlightGridPositionOptions): void;

    override getNeighbors(row: number, col: number): PointArray[];

    override measureDistances(segments: GridLayer.Segment[], options?: GridLayer.MeasureDistancesOptions): number[];

    /**
     * Measure the distance in grid units between two pixel-based coordinates.
     * @param p0 - The initial point
     * @param p1 - The terminal point
     * @returns The measured distance in grid units
     */
    measureDistance(p0: Point, p1: Point): number;

    /**
     * Compute the shortest path between two hexagons using the A-star algorithm.
     * See https://www.redblobgames.com/pathfinding/a-star/introduction.html for reference
     * @param start - The starting hexagon
     * @param goal  - The objective hexagon
     * @returns The optimal path of hexagons to traverse
     */
    getAStarPath(start: GridHex, goal: GridHex): { cost: number; path: GridHex[] };

    /**
     * Convert an offset coordinate (row, col) into a cube coordinate (q, r, s).
     * See https://www.redblobgames.com/grids/hexagons/ for reference
     * Source code available https://www.redblobgames.com/grids/hexagons/codegen/output/lib-functions.js
     * @param offset - The offset coordinate
     * @param config - The hex grid configuration
     */
    static offsetToCube(
      offset: HexOffsetCoordinate,
      config?: InexactPartial<{
        columns: boolean;
        even: boolean;
      }>,
    ): HexCubeCoordinate;

    /**
     * Convert a cube coordinate (q, r, s) into an offset coordinate (row, col).
     * See https://www.redblobgames.com/grids/hexagons/ for reference
     * Source code available https://www.redblobgames.com/grids/hexagons/codegen/output/lib-functions.js
     * @param cube   - The cube coordinate
     * @param config - The hex grid configuration
     * @returns The offset coordinate
     */
    static cubeToOffset(cube: HexCubeCoordinate, config: HexGridConfiguration): HexOffsetCoordinate;

    /**
     * Given a cursor position (x, y), obtain the cube coordinate hex (q, r, s) of the hex which contains it
     * http://justinpombrio.net/programming/2020/04/28/pixel-to-hex.html
     * @param point  - The pixel point
     * @param config - The hex grid configuration
     * @returns The cube coordinate
     */
    static pixelToCube(point: Point, config: HexGridConfiguration): HexCubeCoordinate;

    /**
     * Measure the distance in hexagons between two cube coordinates
     * @param a - The first cube coordinate
     * @param b - The second cube coordinate
     * @returns The distance between the two cube coordinates in hexagons
     */
    static cubeDistance(a: HexCubeCoordinate, b: HexCubeCoordinate): number;

    /**
     * Compute the top-left pixel coordinate of a hexagon from its offset coordinate.
     * @param offset - The offset coordinate
     * @param config - The hex grid configuration
     * @returns The coordinate in pixels
     */
    static offsetToPixels(offset: HexOffsetCoordinate, config: HexGridConfiguration): Point;

    /**
     * Compute the offset coordinate of a hexagon from a pixel coordinate contained within that hex.
     * @param point  - The pixel coordinate
     * @param config - The hex grid configuration
     * @param method - Which Math rounding method to use
     *                 (default: "floor")
     * @returns The offset coordinate
     */
    static pixelsToOffset(point: Point, config: HexGridConfiguration, method?: keyof Math): HexOffsetCoordinate;

    /**
     * We set the 'size' of a hexagon (the distance from a hexagon's centre to a vertex) to be equal to the grid size
     * divided by √3. This makes the distance from top-to-bottom on a flat-topped hexagon, or left-to-right on a pointy-
     * topped hexagon equal to the grid size.
     * @param config - The grid configuration
     * @returns The width and height of a single hexagon, in pixels.
     */
    static computeDimensions(config: HexGridConfiguration): { width: number; height: number };

    /**
     * @see {@link HexagonalGrid.offsetToCube}
     * @deprecated since v11, will be removed in v13
     * @remarks "HexagonalGrid#offsetToCube is deprecated in favor of the HexagonalGrid.offsetToCube static method."
     */
    offsetToCube(offset: HexOffsetCoordinate): HexCubeCoordinate;

    /**
     * @see {@link HexagonalGrid.cubeToOffset}
     * @deprecated since v11, will be removed in v13
     * @remarks "HexagonalGrid#cubeToOffset is deprecated in favor of the HexagonalGrid.cubeToOffset static method."
     */
    cubeToOffset(cube: HexCubeCoordinate): HexOffsetCoordinate;
  }
}
