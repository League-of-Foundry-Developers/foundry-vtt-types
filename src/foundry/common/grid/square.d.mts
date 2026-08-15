import type { InexactPartial } from "#utils";
import type { BaseGrid } from "#common/grid/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

declare class SquareGrid extends BaseGrid {
  /** The square grid constructor. */
  constructor(config: SquareGrid.Configuration);

  override type: typeof CONST.GRID_TYPES.SQUARE;

  // fake type override
  override get isGridless(): false;

  // fake type override
  override get isHexagonal(): false;

  // fake type override
  override get isSquare(): true;

  /**
   * The rule for diagonal measurement (see {@linkcode CONST.GRID_DIAGONALS}).
   * @privateRemarks Defined at construction, not in the class body. Foundry marks `@readonly` but does nothing to enforce that at runtime.
   */
  diagonals: CONST.GRID_DIAGONALS;

  override getOffset(coords: BaseGrid.Coordinates3D): BaseGrid.Offset3D;
  override getOffset(coords: BaseGrid.Coordinates2D): BaseGrid.Offset2D;

  override getOffsetRange(bounds: Canvas.Rectangle): BaseGrid.OffsetRange;

  override getAdjacentOffsets(coords: BaseGrid.Coordinates3D): BaseGrid.Offset3D[];
  override getAdjacentOffsets(coords: BaseGrid.Coordinates2D): BaseGrid.Offset2D[];

  override testAdjacency(coords1: BaseGrid.Coordinates3D, coords2: BaseGrid.Coordinates3D): boolean;
  override testAdjacency(coords1: BaseGrid.Coordinates2D, coords2: BaseGrid.Coordinates2D): boolean;

  override getShiftedOffset(coords: BaseGrid.Coordinates3D, direction: CONST.MOVEMENT_DIRECTIONS): BaseGrid.Offset3D;
  override getShiftedOffset(coords: BaseGrid.Coordinates2D, direction: CONST.MOVEMENT_DIRECTIONS): BaseGrid.Offset2D;

  override getShiftedPoint(point: Canvas.ElevatedPoint, direction: CONST.MOVEMENT_DIRECTIONS): Canvas.ElevatedPoint;
  override getShiftedPoint(point: Canvas.Point, direction: CONST.MOVEMENT_DIRECTIONS): Canvas.Point;

  override getTopLeftPoint(coords: BaseGrid.Coordinates3D): Canvas.ElevatedPoint;
  override getTopLeftPoint(coords: BaseGrid.Coordinates2D): Canvas.Point;

  override getCenterPoint(coords: BaseGrid.Coordinates3D): Canvas.ElevatedPoint;
  override getCenterPoint(coords: BaseGrid.Coordinates2D): Canvas.Point;

  override getShape(): Canvas.Point[];

  override getVertices(coords: BaseGrid.Coordinates2D): Canvas.Point[];

  override getSnappedPoint(point: Canvas.ElevatedPoint, behavior: BaseGrid.SnappingBehavior): Canvas.ElevatedPoint;
  override getSnappedPoint(point: Canvas.Point, behavior: BaseGrid.SnappingBehavior): Canvas.Point;

  // fake type override
  override measurePath(
    waypoints: BaseGrid.Waypoint<BaseGrid.Coordinates3D>[],
    options?: BaseGrid.MeasurePathOptions<BaseGrid.Coordinates3D>,
  ): BaseGrid.MeasurePathResult;
  // fake type override
  override measurePath(
    waypoints: BaseGrid.Waypoint<BaseGrid.Coordinates2D>[],
    options?: BaseGrid.MeasurePathOptions<BaseGrid.Coordinates2D>,
  ): BaseGrid.MeasurePathResult;

  protected override _measurePath(
    waypoints: BaseGrid.Waypoint<BaseGrid.Coordinates3D>[],
    options: BaseGrid.MeasurePathOptions<BaseGrid.Coordinates3D>,
    result: BaseGrid.MeasurePathResult,
  ): void;
  protected override _measurePath(
    waypoints: BaseGrid.Waypoint<BaseGrid.Coordinates2D>[],
    options: BaseGrid.MeasurePathOptions<BaseGrid.Coordinates2D>,
    result: BaseGrid.MeasurePathResult,
  ): void;

  override getDirectPath(waypoints: BaseGrid.Coordinates3D[]): BaseGrid.Offset3D[];
  override getDirectPath(waypoints: BaseGrid.Coordinates2D[]): BaseGrid.Offset2D[];

  override getTranslatedPoint(point: Canvas.ElevatedPoint, direction: number, distance: number): Canvas.ElevatedPoint;
  override getTranslatedPoint(point: Canvas.Point, direction: number, distance: number): Canvas.Point;

  override getCircle(center: Canvas.Point, radius: number): Canvas.Point[];

  override getEllipse(center: Canvas.Point, radiusX: number, radiusY: number, rotation: number): Canvas.Point[];

  override getRing(center: Canvas.Point, radius: number, innerWidth: number, outerWidth: number): BaseGrid.Ring;

  override calculateDimensions(sceneWidth: number, sceneHeight: number, padding: number): BaseGrid.Dimensions;

  #SquareGrid: true;
}

declare namespace SquareGrid {
  interface Configuration extends InexactPartial<BaseGrid._Diagonals>, BaseGrid.Configuration {}
}

export default SquareGrid;
