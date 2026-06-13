import { describe, expectTypeOf, test } from "vitest";

import SquareGrid = foundry.grid.SquareGrid;
import BaseGrid = foundry.grid.BaseGrid;
import Canvas = foundry.canvas.Canvas;

export const minimalConfig = { size: 100 } satisfies SquareGrid.Configuration;
export const fullConfig = {
  size: 100,
  alpha: 0.7,
  color: "#FDACBE",
  diagonals: CONST.GRID_DIAGONALS.ALTERNATING_1,
  distance: 1,
  units: "m",
  style: "squarePoints",
  thickness: 2,
} satisfies SquareGrid.Configuration;
export const nullishConfig = {
  size: 100,
  alpha: undefined,
  color: undefined,
  diagonals: undefined,
  distance: undefined,
  units: undefined,
  style: undefined,
  thickness: undefined,
} satisfies SquareGrid.Configuration;

describe("HexagonalGrid Tests", () => {
  test("Construction", () => {
    // @ts-expect-error -- a configuration containing at least `size` is required
    new SquareGrid();

    new SquareGrid(minimalConfig);
    new SquareGrid(fullConfig);
    new SquareGrid(nullishConfig);
  });

  const grid = new SquareGrid(fullConfig);

  test("Type", () => {
    expectTypeOf(grid.type).toEqualTypeOf<typeof CONST.GRID_TYPES.SQUARE>();

    expectTypeOf(grid.isGridless).toEqualTypeOf<false>();
    expectTypeOf(grid.isSquare).toEqualTypeOf<true>();
    expectTypeOf(grid.isHexagonal).toEqualTypeOf<false>();
  });

  test("Configuration properties", () => {
    expectTypeOf(grid.diagonals).toEqualTypeOf<CONST.GRID_DIAGONALS>();
  });

  const point2D = { x: 500, y: 500 } satisfies Canvas.Point;
  const point3D = { x: 500, y: 500, elevation: 20 } satisfies Canvas.ElevatedPoint;
  const offset2D = { i: 5, j: 5 } satisfies BaseGrid.Offset2D;
  const offset3D = { i: 5, j: 5, k: 2 } satisfies BaseGrid.Offset3D;
  const rect = { x: 0, y: 0, height: 500, width: 500 } satisfies Canvas.Rectangle;

  // Overrides of abstract methods of BaseGrid:

  test("#getOffset", () => {
    expectTypeOf(grid.getOffset(point2D)).toEqualTypeOf<BaseGrid.Offset2D>();
    expectTypeOf(grid.getOffset(offset2D)).toEqualTypeOf<BaseGrid.Offset2D>();

    expectTypeOf(grid.getOffset(point3D)).toEqualTypeOf<BaseGrid.Offset3D>();
    expectTypeOf(grid.getOffset(offset3D)).toEqualTypeOf<BaseGrid.Offset3D>();
  });

  test("#getAdjacentOffsets", () => {
    expectTypeOf(grid.getAdjacentOffsets(point2D)).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getAdjacentOffsets(offset2D)).toEqualTypeOf<BaseGrid.Offset2D[]>();

    expectTypeOf(grid.getAdjacentOffsets(point3D)).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getAdjacentOffsets(offset3D)).toEqualTypeOf<BaseGrid.Offset3D[]>();
  });

  test("#testAdjacency", () => {
    expectTypeOf(grid.testAdjacency(point2D, point2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(point2D, offset2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(offset2D, offset2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(offset2D, point2D)).toBeBoolean();

    expectTypeOf(grid.testAdjacency(point3D, point3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(point3D, offset3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(offset3D, offset3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(offset3D, point3D)).toBeBoolean();
  });

  test("#getShiftedOffset", () => {
    expectTypeOf(grid.getShiftedOffset(point2D, CONST.MOVEMENT_DIRECTIONS.DOWN)).toEqualTypeOf<BaseGrid.Offset2D>();
    expectTypeOf(grid.getShiftedOffset(offset2D, CONST.MOVEMENT_DIRECTIONS.UP)).toEqualTypeOf<BaseGrid.Offset2D>();

    expectTypeOf(grid.getShiftedOffset(point3D, CONST.MOVEMENT_DIRECTIONS.LEFT)).toEqualTypeOf<BaseGrid.Offset3D>();
    expectTypeOf(grid.getShiftedOffset(offset3D, CONST.MOVEMENT_DIRECTIONS.RIGHT)).toEqualTypeOf<BaseGrid.Offset3D>();
  });

  test("#getShiftedPoint", () => {
    expectTypeOf(grid.getShiftedPoint(point2D, CONST.MOVEMENT_DIRECTIONS.DOWN)).toEqualTypeOf<Canvas.Point>();

    expectTypeOf(grid.getShiftedPoint(point3D, CONST.MOVEMENT_DIRECTIONS.LEFT)).toEqualTypeOf<Canvas.ElevatedPoint>();
  });

  test("#getTopLeftPoint", () => {
    expectTypeOf(grid.getTopLeftPoint(point2D)).toEqualTypeOf<Canvas.Point>();
    expectTypeOf(grid.getTopLeftPoint(offset2D)).toEqualTypeOf<Canvas.Point>();

    expectTypeOf(grid.getTopLeftPoint(point3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
    expectTypeOf(grid.getTopLeftPoint(offset3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
  });

  test("#getCenterPoint", () => {
    expectTypeOf(grid.getCenterPoint(point2D)).toEqualTypeOf<Canvas.Point>();
    expectTypeOf(grid.getCenterPoint(offset2D)).toEqualTypeOf<Canvas.Point>();

    expectTypeOf(grid.getCenterPoint(point3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
    expectTypeOf(grid.getCenterPoint(offset3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
  });

  test("#getVertices", () => {
    expectTypeOf(grid.getVertices(point2D)).toEqualTypeOf<Canvas.Point[]>();
    expectTypeOf(grid.getVertices(offset2D)).toEqualTypeOf<Canvas.Point[]>();
  });

  const snappingBehavior = {
    mode: CONST.GRID_SNAPPING_MODES.CENTER | CONST.GRID_SNAPPING_MODES.BOTTOM_LEFT_CORNER,
    resolution: 2,
  } satisfies BaseGrid.SnappingBehavior;

  test("#getSnappedPoint", () => {
    expectTypeOf(grid.getSnappedPoint(point2D, snappingBehavior)).toEqualTypeOf<Canvas.Point>();

    expectTypeOf(grid.getSnappedPoint(point3D, snappingBehavior)).toEqualTypeOf<Canvas.ElevatedPoint>();
  });

  const costFunction2D = ((
    from: BaseGrid.Coordinates2D,
    to: BaseGrid.Coordinates2D,
    distance: number,
    segment: BaseGrid.Waypoint<BaseGrid.Coordinates2D>,
  ) => {
    if ("x" in from) {
      expectTypeOf(from).toEqualTypeOf<Canvas.Point>();
    } else {
      expectTypeOf(from).toEqualTypeOf<BaseGrid.Offset2D>();
    }
    if ("x" in to) {
      expectTypeOf(to).toEqualTypeOf<Canvas.Point>();
    } else {
      expectTypeOf(to).toEqualTypeOf<BaseGrid.Offset2D>();
    }
    if ("x" in segment) {
      expectTypeOf(segment).toEqualTypeOf<Extract<BaseGrid.Waypoint<BaseGrid.Coordinates2D>, Canvas.Point>>();
      expectTypeOf(segment.x).toBeNumber();
      expectTypeOf(segment.y).toBeNumber();
    } else {
      expectTypeOf(segment).toEqualTypeOf<Extract<BaseGrid.Waypoint<BaseGrid.Coordinates2D>, BaseGrid.Offset2D>>();
      expectTypeOf(segment.i).toBeNumber();
      expectTypeOf(segment.j).toBeNumber();
    }
    return distance;
  }) satisfies BaseGrid.CostFunction<BaseGrid.Coordinates2D>;

  const costFunction3D = ((
    from: BaseGrid.Coordinates3D,
    to: BaseGrid.Coordinates3D,
    distance: number,
    segment: BaseGrid.Waypoint<BaseGrid.Coordinates3D>,
  ) => {
    if ("x" in from) {
      expectTypeOf(from).toEqualTypeOf<Canvas.ElevatedPoint>();
    } else {
      expectTypeOf(from).toEqualTypeOf<BaseGrid.Offset3D>();
    }
    if ("x" in to) {
      expectTypeOf(to).toEqualTypeOf<Canvas.ElevatedPoint>();
    } else {
      expectTypeOf(to).toEqualTypeOf<BaseGrid.Offset3D>();
    }
    if ("x" in segment) {
      expectTypeOf(segment).toEqualTypeOf<Extract<BaseGrid.Waypoint<BaseGrid.Coordinates3D>, Canvas.ElevatedPoint>>();
      expectTypeOf(segment.x).toBeNumber();
      expectTypeOf(segment.y).toBeNumber();
      expectTypeOf(segment.elevation).toBeNumber();
    } else {
      expectTypeOf(segment).toEqualTypeOf<Extract<BaseGrid.Waypoint<BaseGrid.Coordinates3D>, BaseGrid.Offset3D>>();
      expectTypeOf(segment.i).toBeNumber();
      expectTypeOf(segment.j).toBeNumber();
      expectTypeOf(segment.k).toBeNumber();
    }
    return distance;
  }) satisfies BaseGrid.CostFunction<BaseGrid.Coordinates3D>;

  const waypointPoint2D = {
    ...point2D,
    measure: true,
    teleport: false,
  } satisfies BaseGrid.Waypoint<BaseGrid.Coordinates2D>;
  const waypointPoint2DWithCost = {
    ...point2D,
    measure: true,
    cost: 4,
  } satisfies BaseGrid.Waypoint<BaseGrid.Coordinates2D>;

  const waypointOffset2D = { ...offset2D, measure: true } satisfies BaseGrid.Waypoint<BaseGrid.Coordinates2D>;
  const waypointOffset2DWithCost = {
    ...offset2D,
    measure: true,
    cost: costFunction2D,
  } satisfies BaseGrid.Waypoint<BaseGrid.Coordinates2D>;

  const waypointPoint3D = { ...point3D, measure: true } satisfies BaseGrid.Waypoint<BaseGrid.Coordinates3D>;
  const waypointPoint3DWithCost = {
    ...point3D,
    measure: true,
    cost: costFunction3D,
  } satisfies BaseGrid.Waypoint<BaseGrid.Coordinates3D>;

  const waypointOffset3D = { ...offset3D, measure: true } satisfies BaseGrid.Waypoint<BaseGrid.Coordinates3D>;
  const waypointOffset3DWithCost = {
    ...offset3D,
    measure: true,
    cost: 2,
    teleport: false,
  } satisfies BaseGrid.Waypoint<BaseGrid.Coordinates3D>;

  test("#measurePath", () => {
    expectTypeOf(
      grid.measurePath([waypointOffset2D, waypointPoint2D, waypointOffset2DWithCost, waypointPoint2DWithCost]),
    ).toEqualTypeOf<BaseGrid.MeasurePathResult>();
    expectTypeOf(
      grid.measurePath([waypointOffset2D, waypointPoint2D], { cost: costFunction2D }),
    ).toEqualTypeOf<BaseGrid.MeasurePathResult>();

    expectTypeOf(
      grid.measurePath([waypointOffset3D, waypointPoint3D, waypointOffset3DWithCost, waypointPoint3DWithCost]),
    ).toEqualTypeOf<BaseGrid.MeasurePathResult>();
    expectTypeOf(
      grid.measurePath([waypointOffset3D, waypointPoint3D], { cost: costFunction3D }),
    ).toEqualTypeOf<BaseGrid.MeasurePathResult>();

    // This works at runtime, because `_measurePath` decides `is3D` based on the first waypoint,
    // and ignores the elevation keys of subsequent waypoints.
    expectTypeOf(grid.measurePath([waypointOffset2D, waypointOffset3D])).toEqualTypeOf<BaseGrid.MeasurePathResult>();
    // Unfortunately this doesn't work at runtime, or rather, it mostly works, but the `euclidean` in the Result will be `NaN`
    grid.measurePath([waypointOffset3D, waypointOffset2D]);
    // @ts-expect-error -- at least it fails for literals
    grid.measurePath([{ x: 0, y: 0, elevation: 0 }, waypointOffset2D]);

    // @ts-expect-error -- wrong cost function
    grid.measurePath([waypointOffset2D, waypointPoint2D], { cost: costFunction3D });
  });

  const result = {
    waypoints: [],
    segments: [],
    distance: 0,
    cost: 0,
    spaces: 0,
    diagonals: 0,
    euclidean: 0,
  } satisfies BaseGrid.MeasurePathResult;

  test("#_measurePath", () => {
    expectTypeOf(
      grid["_measurePath"](
        [waypointOffset2D, waypointPoint2D, waypointOffset2DWithCost, waypointPoint2DWithCost],
        {},
        result,
      ),
    ).toBeVoid();
    expectTypeOf(
      grid["_measurePath"]([waypointOffset2D, waypointPoint2D], { cost: costFunction2D }, result),
    ).toBeVoid();

    expectTypeOf(
      grid["_measurePath"](
        [waypointOffset3D, waypointPoint3D, waypointOffset3DWithCost, waypointPoint3DWithCost],
        {},
        result,
      ),
    ).toBeVoid();
    expectTypeOf(
      grid["_measurePath"]([waypointOffset3D, waypointPoint3D], { cost: costFunction3D }, result),
    ).toBeVoid();

    // This works at runtime, because `_measurePath` decides `is3D` based on the first waypoint,
    // and ignores the elevation keys of subsequent waypoints.
    expectTypeOf(grid["_measurePath"]([waypointOffset2D, waypointOffset3D], {}, result)).toBeVoid();
    // Unfortunately this doesn't work at runtime, or rather, it mostly works, but the `euclidean` in the Result will be `NaN`
    grid["_measurePath"]([waypointOffset3D, waypointOffset2D], {}, result);
    // @ts-expect-error -- at least it fails for literals
    grid["_measurePath"]([{ x: 0, y: 0, elevation: 0 }, waypointOffset2D], {}, result);

    // @ts-expect-error -- wrong cost function
    grid["_measurePath"]([waypointOffset2D, waypointPoint2D], { cost: costFunction3D }, result);
  });

  test("#getDirectPath", () => {
    expectTypeOf(grid.getDirectPath([point2D, point2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([point2D, offset2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([offset2D, offset2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([offset2D, point2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();

    expectTypeOf(grid.getDirectPath([point3D, point3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([point3D, offset3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([offset3D, offset3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([offset3D, point3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
  });

  test("#getTranslatedPoint", () => {
    expectTypeOf(grid.getTranslatedPoint(point2D, 120, 50)).toEqualTypeOf<Canvas.Point>();

    expectTypeOf(grid.getTranslatedPoint(point3D, 120, 50)).toEqualTypeOf<Canvas.ElevatedPoint>();
  });

  test("Methods without overloads", () => {
    expectTypeOf(grid.getOffsetRange(rect)).toEqualTypeOf<BaseGrid.OffsetRange>();

    expectTypeOf(grid.getShape()).toEqualTypeOf<Canvas.Point[]>;

    expectTypeOf(grid.getCircle(point2D, 30)).toEqualTypeOf<Canvas.Point[]>();

    expectTypeOf(grid.calculateDimensions(2000, 3000, 0.25)).toEqualTypeOf<BaseGrid.Dimensions>();
  });
});
