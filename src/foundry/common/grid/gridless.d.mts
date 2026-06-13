import type { BaseGrid } from "#common/grid/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

declare class GridlessGrid extends BaseGrid {
  override type: typeof CONST.GRID_TYPES.GRIDLESS;

  // fake type override
  override get isGridless(): true;

  // fake type override
  override get isHexagonal(): false;

  // fake type override
  override get isSquare(): false;

  override calculateDimensions(sceneWidth: number, sceneHeight: number, padding: number): BaseGrid.Dimensions;

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

  override getSnappedPoint(point: Canvas.ElevatedPoint, behavior?: BaseGrid.SnappingBehavior): Canvas.ElevatedPoint;
  override getSnappedPoint(point: Canvas.Point, behavior?: BaseGrid.SnappingBehavior): Canvas.Point;

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

  override getCone(origin: Canvas.Point, radius: number, direction: number, angle: number): Canvas.Point[];
}

declare namespace GridlessGrid {
  /** @deprecated Use {@linkcode BaseGrid.Configuration} instead. This warning will be removed in v14. */
  type Configuration = BaseGrid.Configuration;

  /** @deprecated Use {@linkcode BaseGrid.Offset2D} or {@linkcode BaseGrid.Offset3D} as appropriate. This warning will be removed in v14. */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type Offset = BaseGrid.Offset;

  /** @deprecated Use {@linkcode BaseGrid.OffsetRange} instead. This warning will be removed in v14. */
  type OffsetRange = BaseGrid.OffsetRange;

  /**
   * @deprecated Use {@linkcode BaseGrid.Coordinates2D} or {@linkcode BaseGrid.Coordinates3D} as appropriate.
   * This warning will be removed in v14.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type Coordinates = Offset | Canvas.PossiblyElevatedPoint;

  /** @deprecated Use {@linkcode BaseGrid.SnappingBehavior} instead. This warning will be removed in v14. */
  type SnappingBehavior = BaseGrid.SnappingBehavior;

  /**
   * @deprecated Use {@linkcode BaseGrid.Waypoint}`<`{@linkcode BaseGrid.Coordinates2D}`>`/`<`{@linkcode BaseGrid.Coordinates3D}`>`
   * instead as appropriate. This warning will be removed in v14.
   */
  type MeasurePathWaypoint = BaseGrid.Waypoint<BaseGrid.Coordinates2D | BaseGrid.Coordinates3D>;

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

export default GridlessGrid;
