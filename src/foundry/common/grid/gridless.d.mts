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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Configuration extends BaseGrid.Configuration {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Offset extends BaseGrid.Offset {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface OffsetRange extends BaseGrid.OffsetRange {}

  type Coordinates = Offset | Point;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface SnappingBehavior extends BaseGrid.SnappingBehavior {}

  type MeasurePathWaypoint = BaseGrid.MeasurePathWaypoint;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface MeasurePathResultWaypoint extends BaseGrid.MeasurePathResultWaypoint {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface MeasurePathResultSegment extends BaseGrid.MeasurePathResultSegment {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface MeasurePathResult extends BaseGrid.MeasurePathResult {}

  type MeasurePathCostFunction = BaseGrid.MeasurePathCostFunction;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Dimensions extends BaseGrid.Dimensions {}
}

export default Gridless;
