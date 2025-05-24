import type BaseGrid from "./base.d.mts";

import type { InexactPartial } from "#utils";

declare class Gridless extends BaseGrid {
  override type: typeof CONST.GRID_TYPES.GRIDLESS;

  calculateDimensions(sceneWidth: number, sceneHeight: number, padding: number): Gridless.Dimensions;

  getOffset(coords: Gridless.Coordinates): Gridless.Offset;

  getOffsetRange(bounds: Canvas.Rectangle): Gridless.OffsetRange;

  getAdjacentOffsets(coords: Gridless.Coordinates): Gridless.Offset[];

  testAdjacency(coords1: Gridless.Coordinates, coords2: Gridless.Coordinates): boolean;

  getShiftedOffset(coords: Gridless.Coordinates, direction: number): Gridless.Offset;

  getShiftedPoint(point: Canvas.Point, direction: number): Canvas.Point;

  getTopLeftPoint(coords: Gridless.Coordinates): Canvas.Point;

  getCenterPoint(coords: Gridless.Coordinates): Canvas.Point;

  getShape(): Canvas.Point[];

  getVertices(coords: Gridless.Coordinates): Canvas.Point[];

  getSnappedPoint({ x, y }: Canvas.Point, behavior: Gridless.SnappingBehavior): Canvas.Point;

  protected _measurePath(
    waypoints: Gridless.MeasurePathWaypoint[],
    options: InexactPartial<{ cost: Gridless.MeasurePathCostFunction }>,
    result: Gridless.MeasurePathResult,
  ): void;

  getDirectPath(waypoints: Gridless.Coordinates[]): Gridless.Offset[];

  getTranslatedPoint(point: Canvas.Point, direction: number, distance: number): Canvas.Point;

  getCircle(center: Canvas.Point, radius: number): Canvas.Point[];

  getCone(origin: Canvas.Point, radius: number, direction: number, angle: number): Canvas.Point[];
}

declare namespace Gridless {
  interface Configuration extends BaseGrid.Configuration {}

  interface Offset extends BaseGrid.Offset {}

  interface OffsetRange extends BaseGrid.OffsetRange {}

  type Coordinates = Offset | Canvas.Point;

  interface SnappingBehavior extends BaseGrid.SnappingBehavior {}

  type MeasurePathWaypoint = BaseGrid.MeasurePathWaypoint;

  interface MeasurePathResultWaypoint extends BaseGrid.MeasurePathResultWaypoint {}

  interface MeasurePathResultSegment extends BaseGrid.MeasurePathResultSegment {}

  interface MeasurePathResult extends BaseGrid.MeasurePathResult {}

  type MeasurePathCostFunction = BaseGrid.MeasurePathCostFunction;

  interface Dimensions extends BaseGrid.Dimensions {}
}

export default Gridless;
