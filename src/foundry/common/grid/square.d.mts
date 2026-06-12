import type { InexactPartial } from "#utils";
import type { BaseGrid } from "#common/grid/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

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

  override calculateDimensions(sceneWidth: number, sceneHeight: number, padding: number): BaseGrid.Dimensions;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /**
   * @deprecated "`SquareGrid#getCenter` is deprecated. Use {@linkcode SquareGrid.getCenterPoint | SquareGrid#getCenterPoint} instead."
   * (since v12, until v14)
   */
  override getCenter(x: number, y: number): Canvas.PointTuple;

  /**
   * @deprecated "`SquareGrid#getSnappedPosition` is deprecated. Use {@linkcode SquareGrid.getSnappedPoint | SquareGrid#getSnappedPoint}
   * instead." (since v12, until v14)
   */
  override getSnappedPosition(
    x: number,
    y: number,
    interval?: number,
    options?: { token?: Token.Implementation | undefined },
  ): PIXI.IPointData;

  /**
   * @deprecated "`SquareGrid#getGridPositionFromPixels` is deprecated. This function is based on the 'brick wall' grid. For getting the
   * offset coordinates of the hex containing the given point use {@linkcode SquareGrid.getOffset | SquareGrid#getOffset}."
   * (since v12, until v14)
   */
  override getGridPositionFromPixels(x: number, y: number): [row: number, col: number];

  /**
   * @deprecated "`SquareGrid#getPixelsFromGridPosition` is deprecated. This function is based on the 'brick wall' grid. For getting the
   * top-left coordinates of the hex at the given offset coordinates use
   * {@linkcode SquareGrid.getTopLeftPoint | SquareGrid#getTopLeftPoint}." (since v12, until v14))
   */
  override getPixelsFromGridPosition(row: number, col: number): Canvas.PointTuple;

  // shiftPosition deprecated override changes neither signature nor (erroneously) class name in deprecation warning. (since v12, until v14)

  /**
   * @deprecated "`SquareGrid#measureDistances` is deprecated. Use {@linkcode SquareGrid.measurePath | SquareGrid#measurePath} instead,
   * which returns grid distance (`gridSpaces: true`) and Euclidean distance (`gridSpaces: false`)." (since v12, until v14)
   */
  override measureDistances(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    segments: BaseGrid.Segment[],
    options?: {
      /** @defaultValue `false` */
      gridSpaces?: boolean | undefined;
    },
  ): number[];

  #SquareGrid: true;
}

declare namespace SquareGrid {
  interface Configuration extends InexactPartial<BaseGrid._Diagonals>, BaseGrid.Configuration {}

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

export default SquareGrid;
