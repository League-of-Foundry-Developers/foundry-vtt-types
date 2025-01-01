import type BaseGrid from "./base.d.mts";

import type { InexactPartial } from "../../../utils/index.d.mts";

declare class SquareGrid extends BaseGrid {
  /**
   * The square grid constructor.
   */
  constructor(config: SquareGrid.Configuration);

  override type: CONST.GRID_TYPES;

  diagonals: number;

  getOffset(coords: SquareGrid.Coordinates): SquareGrid.Offset;

  getOffsetRange(bounds: Canvas.Rectangle): SquareGrid.OffsetRange;

  getAdjacentOffsets(coords: SquareGrid.Coordinates): SquareGrid.Offset[];

  testAdjacency(coords1: SquareGrid.Coordinates, coords2: SquareGrid.Coordinates): boolean;

  getShiftedOffset(coords: SquareGrid.Coordinates, direction: number): SquareGrid.Offset;

  getShiftedPoint(point: Canvas.Point, direction: number): Canvas.Point;

  getTopLeftPoint(coords: SquareGrid.Coordinates): Canvas.Point;

  getCenterPoint(coords: SquareGrid.Coordinates): Canvas.Point;

  getShape(): Canvas.Point[];

  getVertices(coords: SquareGrid.Coordinates): Canvas.Point[];

  getSnappedPoint({ x, y }: Canvas.Point, behavior: SquareGrid.SnappingBehavior): Canvas.Point;

  /** @privateRemarks This is added so that ts knows this class has a private method. */
  #snapToCenter(point: Canvas.Point, resolution: number): Canvas.Point;

  protected _measurePath(
    waypoints: SquareGrid.MeasurePathWaypoint[],
    options: InexactPartial<{ cost: SquareGrid.MeasurePathCostFunction }>,
    result: SquareGrid.MeasurePathResult,
  ): void;

  /**
   * Returns the sequence of grid offsets of a shortest, direct path passing through the given waypoints.
   * @see {@link https://en.wikipedia.org/wiki/Bresenham's_line_algorithm}
   * @param waypoints - The waypoints the path must pass through
   * @returns The sequence of grid offsets of a shortest, direct path
   */
  getDirectPath(waypoints: SquareGrid.Coordinates[]): SquareGrid.Offset[];

  getTranslatedPoint(point: Canvas.Point, direction: number, distance: number): Canvas.Point;

  getCircle(center: Canvas.Point, radius: number): Canvas.Point[];

  calculateDimensions(sceneWidth: number, sceneHeight: number, padding: number): SquareGrid.Dimensions;
}

declare namespace SquareGrid {
  interface Configuration extends BaseGrid.Configuration {
    /**
     * The rule for diagonal measurement (see {@link CONST.GRID_DIAGONALS})
     * Default: `CONST.GRID_DIAGONALS.EQUIDISTANT`,
     */
    diagonals: number;
  }

  interface Offset extends BaseGrid.Offset {}

  interface OffsetRange extends BaseGrid.OffsetRange {}

  type Coordinates = Offset | Canvas.Point;

  interface SnappingBehavior extends BaseGrid.SnappingBehavior {}

  type MeasurePathWaypoint = BaseGrid.MeasurePathWaypoint;

  interface MeasurePathResultWaypoint extends BaseGrid.MeasurePathResultWaypoint {
    /** The total number of diagonals moved along a direct path up to this waypoint. */
    diagonals: number;
  }

  interface MeasurePathResultSegment extends BaseGrid.MeasurePathResultSegment {
    /** The number of diagonals moved along this segment. */
    diagonals: number;
  }

  interface MeasurePathResult extends BaseGrid.MeasurePathResult {
    /** The total number of diagonals moved along a direct path through all waypoints. */
    diagonals: number;
  }

  type MeasurePathCostFunction = BaseGrid.MeasurePathCostFunction;

  interface Dimensions extends BaseGrid.Dimensions {}
}

export default SquareGrid;
