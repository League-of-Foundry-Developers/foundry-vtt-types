import type { InexactPartial } from "../../../../../types/utils.d.mts";
import type { CONST } from "../../../../common/module.d.mts";

declare global {
  /**
   * The base grid class.
   * This double-dips to implement the "gridless" option
   */
  class BaseGrid extends PIXI.Container {
    constructor(options: BaseGrid.GridOptions);

    options: BaseGrid.GridOptions;

    /**
     * Grid Unit Width
     */
    w: number;

    /**
     * Grid Unit Height
     */
    h: number;

    /**
     * Returns the class responsible for the implementation of a given grid type.
     * @param gridType - The grid type.
     * @returns (typeof BaseGrid) A constructor for a grid of the given type.
     */
    static implementationFor(gridType: CONST.GRID_TYPES): typeof BaseGrid;

    /**
     * Calculate the total size of the canvas with padding applied, as well as the top-left co-ordinates of the inner
     * rectangle that houses the scene.
     * @param gridType - The grid type to calculate padding for.
     * @param width    - The width of the scene.
     * @param height   - The height of the scene.
     * @param size     - The grid size.
     * @param padding  - The percentage of padding.
     * @param options  - Options to configure the padding calculation.
     */
    static calculatePadding(
      gridType: CONST.GRID_TYPES,
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
     * Draw the grid. Subclasses are expected to override this method to perform their type-specific drawing logic.
     * @param options - Override settings used in place of those saved to the scene data.
     *                  (default: `{}`)
     */
    draw(options?: BaseGrid.DrawOptions | undefined): this;

    /**
     * Highlight a grid position for a certain coordinates
     * @param layer   - The highlight layer to use
     * @param options - Additional options to configure behaviour.
     */
    highlightGridPosition(layer: GridHighlight, options?: BaseGrid.HighlightGridPositionOptions): void;

    /**
     * Tests whether the given co-ordinates at the center of a grid space are contained within a given shape.
     * @param x     - The X co-ordinate.
     * @param y     - The Y co-ordinate.
     * @param shape - The shape.
     * @internal
     */
    protected _testShape(x: number, y: number, shape: PIXI.Polygon): boolean;

    /**
     * Given a pair of coordinates (x, y) - return the top-left of the grid square which contains that point
     * @returns An Array [x, y] of the top-left coordinate of the square which contains (x, y)
     */
    getTopLeft(x: number, y: number): PointArray;

    /**
     * Given a pair of coordinates (x, y), return the center of the grid square which contains that point
     * @param x - The x-coordinate
     * @param y - The y-coordinate
     * @returns An array [cx, cy] of the central point of the grid space which contains (x, y)
     */
    getCenter(x: number, y: number): PointArray;

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
     * @param options  - Additional options to configure snapping behaviour.
     * @returns An object containing the coordinates of the snapped location
     */
    getSnappedPosition(
      x: number,
      y: number,
      interval?: number | null,
      options?: InexactPartial<{
        /** The token that is being moved. */
        token?: Token;
      }>,
    ): { x: number; y: number };

    /**
     * Given a pair of pixel coordinates, return the grid position as an Array.
     * Always round down to the nearest grid position so the pixels are within the grid space (from top-left).
     * @param x - The x-coordinate pixel position
     * @param y - The y-coordinate pixel position
     * @returns An array representing the position in grid units
     */
    getGridPositionFromPixels(x: number, y: number): PointArray;

    /**
     * Given a pair of grid coordinates, return the pixel position as an Array.
     * Always round up to a whole pixel so the pixel is within the grid space (from top-left).
     * @param x - The x-coordinate grid position
     * @param y - The y-coordinate grid position
     * @returns An array representing the position in pixels
     */
    getPixelsFromGridPosition(x: number, y: number): PointArray;

    /**
     * Shift a pixel position [x,y] by some number of grid units dx and dy
     * @param x  - The starting x-coordinate in pixels
     * @param y  - The starting y-coordinate in pixels
     * @param dx - The number of grid positions to shift horizontally
     * @param dy - The number of grid positions to shift vertically
     * @param options - Additional options to configure shift behaviour.
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
        token?: Token;
      }>,
    ): PointArray;

    /**
     * Measure the distance traversed over an array of measured segments
     * @param segments - An Array of measured movement segments
     * @param options  - Additional options which modify the measurement
     *                   (default: `{}`)
     * @returns An Array of distance measurements for each segment
     */
    measureDistances(segments: GridLayer.Segment[], options?: GridLayer.MeasureDistancesOptions | undefined): number[];

    /**
     * Get the grid row and column positions which are neighbors of a certain position
     * @param row - The grid row coordinate against which to test for neighbors
     * @param col - The grid column coordinate against which to test for neighbors
     * @returns An array of grid positions which are neighbors of the row and column
     */
    getNeighbors(row: number, col: number): PointArray[];

    /**
     * Determine a placeable's bounding box based on the size of the grid.
     * @param w - The width in grid spaces.
     * @param h - The height in grid spaces.
     */
    getRect(w: number, h: number): PIXI.Rectangle;

    /**
     * Calculate the resulting token position after moving along a ruler segment.
     * @param ray    - The ray being moved along.
     * @param offset - The offset of the ruler's origin relative to the token's position.
     * @param token  - The token placeable being moved.
     * @internal
     */
    protected _getRulerDestination(ray: Ray, offset: Point, token: Token): { x: number; y: number };
  }

  namespace BaseGrid {
    interface GridOptions {
      dimensions: Canvas["dimensions"];
      color: string;
      alpha: Scene["data"]["gridAlpha"];
      columns?: boolean;
      even?: boolean;
    }

    type DrawOptions = InexactPartial<{
      /**
       * The grid color.
       * @defaultValue `null`
       */
      color?: string | null;

      /**
       * The grid transparency.
       * @defaultValue `null`
       */
      alpha?: number | null;
    }>;

    interface HighlightGridPositionOptions {
      /**
       * The x-coordinate of the highlighted position
       */
      x?: number;

      /**
       * The y-coordinate of the highlighted position
       */
      y?: number;

      /**
       * The hex fill color of the highlight
       * @defaultValue `0x33BBFF`
       */
      color?: number;

      /**
       * The hex border color of the highlight
       * @defaultValue `null`
       */
      border?: number | null;

      /**
       * The opacity of the highlight
       * @defaultValue `0.25`
       */
      alpha?: number;

      /**
       * A predefined shape to highlight
       * @defaultValue `null`
       */
      shape?: PIXI.Polygon | null;
    }
  }
}
