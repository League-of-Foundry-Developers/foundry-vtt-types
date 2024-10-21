import type BaseGrid from "./base.d.mts";

import type { InexactPartial } from "../../../types/utils.d.mts";

declare class Gridless extends BaseGrid {
  override type: number;

  calculateDimensions(sceneWidth: number, sceneHeight: number, padding: number): Gridless.Dimensions;

  getOffset(coords: Gridless.Coordinates): Gridless.Offset;

  getOffsetRange(bounds: Rectangle): Gridless.OffsetRange;

  getAdjacentOffsets(coords: Gridless.Coordinates): Gridless.Offset[];

  testAdjacency(coords1: Gridless.Coordinates, coords2: Gridless.Coordinates): boolean;

  getShiftedOffset(coords: Gridless.Coordinates, direction: number): Gridless.Offset;

  getShiftedPoint(point: Point, direction: number): Point;

  getTopLeftPoint(coords: Gridless.Coordinates): Point;

  getCenterPoint(coords: Gridless.Coordinates): Point;

  getShape(): Point[];

  getVertices(coords: Gridless.Coordinates): Point[];

  getSnappedPoint({ x, y }: Point, behavior: Gridless.SnappingBehavior): Point;

  protected _measurePath(
    waypoints: Gridless.MeasurePathWaypoint[],
    options: InexactPartial<{ cost: Gridless.MeasurePathCostFunction }>,
    result: Gridless.MeasurePathResult,
  ): void;

  getDirectPath(waypoints: Gridless.Coordinates[]): Gridless.Offset[];

  getTranslatedPoint(point: Point, direction: number, distance: number): Point;

  getCircle(center: Point, radius: number): Point[];

  getCone(origin: Point, radius: number, direction: number, angle: number): Point[];
}

declare namespace Gridless {
  interface Configuration extends BaseGrid.Configuration {}

  interface Offset extends BaseGrid.Offset {}

  interface OffsetRange extends BaseGrid.OffsetRange {}

  type Coordinates = Offset | Point;

  interface SnappingBehavior extends BaseGrid.SnappingBehavior {}

  type MeasurePathWaypoint = BaseGrid.MeasurePathWaypoint;

  interface MeasurePathResultWaypoint extends BaseGrid.MeasurePathResultWaypoint {}

  interface MeasurePathResultSegment extends BaseGrid.MeasurePathResultSegment {}

  interface MeasurePathResult extends BaseGrid.MeasurePathResult {}

  type MeasurePathCostFunction = BaseGrid.MeasurePathCostFunction;

  interface Dimensions extends BaseGrid.Dimensions {}
}

export default Gridless;
