import type BaseGrid from "./base.d.mts";

import type { InexactPartial } from "../../../types/utils.d.mts";

declare class Gridless extends BaseGrid {
  override type: number;

  calculateDimensions(
    sceneWidth: number,
    sceneHeight: number,
    padding: number,
  ): { width: number; height: number; x: number; y: number; rows: number; columns: number };

  getOffset(coords: BaseGrid.GridCoordinates): BaseGrid.GridOffset;

  getOffsetRange(bounds: Rectangle): { i0: number; j0: number; i1: number; j1: number };

  getAdjacentOffsets(coords: BaseGrid.GridCoordinates): BaseGrid.GridOffset[];

  testAdjacency(coords1: BaseGrid.GridCoordinates, coords2: BaseGrid.GridCoordinates): boolean;

  getShiftedOffset(coords: BaseGrid.GridCoordinates, direction: number): BaseGrid.GridOffset;

  getShiftedPoint(point: Point, direction: number): Point;

  getTopLeftPoint(coords: BaseGrid.GridCoordinates): Point;

  getCenterPoint(coords: BaseGrid.GridCoordinates): Point;

  getShape(): Point[];

  getVertices(coords: BaseGrid.GridCoordinates): Point[];

  getSnappedPoint({ x, y }: Point, behavior: BaseGrid.GridSnappingBehavior): Point;

  protected _measurePath(
    waypoints: BaseGrid.GridMeasurePathWaypoint[],
    options: InexactPartial<{ cost: BaseGrid.GridMeasurePathCostFunction }>,
    result: BaseGrid.GridMeasurePathResult,
  ): void;

  getDirectPath(waypoints: BaseGrid.GridCoordinates[]): BaseGrid.GridOffset[];

  getTranslatedPoint(point: Point, direction: number, distance: number): Point;

  getCircle(center: Point, radius: number): Point[];

  getCone(origin: Point, radius: number, direction: number, angle: number): Point[];
}

declare namespace Gridless {}

export default Gridless;
