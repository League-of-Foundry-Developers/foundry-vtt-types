import { describe, expectTypeOf, test } from "vitest";

import HexagonalGrid = foundry.grid.HexagonalGrid;
import BaseGrid = foundry.grid.BaseGrid;
import Canvas = foundry.canvas.Canvas;

export const minimalConfig = { size: 100 } satisfies HexagonalGrid.Configuration;
export const fullConfig = {
  size: 100,
  alpha: 0.7,
  color: "#FDACBE",
  columns: true,
  even: true,
  diagonals: CONST.GRID_DIAGONALS.ALTERNATING_1,
  distance: 5,
  units: "ft",
  style: "diamondPoints",
  thickness: 2,
} satisfies HexagonalGrid.Configuration;
export const nullishConfig = {
  size: 100,
  alpha: undefined,
  color: undefined,
  columns: undefined,
  even: undefined,
  diagonals: undefined,
  distance: undefined,
  units: undefined,
  style: undefined,
  thickness: undefined,
} satisfies HexagonalGrid.Configuration;

describe("HexagonalGrid Tests", () => {
  test("Construction", () => {
    // @ts-expect-error -- a configuration containing at least `size` is required
    new HexagonalGrid();

    new HexagonalGrid(minimalConfig);
    new HexagonalGrid(fullConfig);
    new HexagonalGrid(nullishConfig);
  });

  const grid = new HexagonalGrid(fullConfig);

  test("Type", () => {
    expectTypeOf(grid.type).toEqualTypeOf<
      | typeof CONST.GRID_TYPES.HEXEVENQ
      | typeof CONST.GRID_TYPES.HEXEVENR
      | typeof CONST.GRID_TYPES.HEXODDQ
      | typeof CONST.GRID_TYPES.HEXODDR
    >();

    expectTypeOf(grid.isGridless).toEqualTypeOf<false>();
    expectTypeOf(grid.isSquare).toEqualTypeOf<false>();
    expectTypeOf(grid.isHexagonal).toEqualTypeOf<true>();
  });

  const point2D = { x: 500, y: 500 } satisfies Canvas.Point;
  const point3D = { x: 500, y: 500, elevation: 20 } satisfies Canvas.ElevatedPoint;
  const offset2D = { i: 5, j: 5 } satisfies BaseGrid.Offset2D;
  const offset3D = { i: 5, j: 5, k: 2 } satisfies BaseGrid.Offset3D;
  const cube2D = { q: 2, r: 5, s: -7 } satisfies HexagonalGrid.Cube2D;
  const cube3D = { q: 2, r: 5, s: -7, k: 2 } satisfies HexagonalGrid.Cube3D;
  const rect = { x: 0, y: 0, height: 500, width: 500 } satisfies Canvas.Rectangle;

  // Overrides of abstract methods of BaseGrid:

  test("#getOffset", () => {
    expectTypeOf(grid.getOffset(point2D)).toEqualTypeOf<BaseGrid.Offset2D>();
    expectTypeOf(grid.getOffset(offset2D)).toEqualTypeOf<BaseGrid.Offset2D>();
    expectTypeOf(grid.getOffset(cube2D)).toEqualTypeOf<BaseGrid.Offset2D>();

    expectTypeOf(grid.getOffset(point3D)).toEqualTypeOf<BaseGrid.Offset3D>();
    expectTypeOf(grid.getOffset(offset3D)).toEqualTypeOf<BaseGrid.Offset3D>();
    expectTypeOf(grid.getOffset(cube3D)).toEqualTypeOf<BaseGrid.Offset3D>();
  });

  test("#getAdjacentOffsets", () => {
    expectTypeOf(grid.getAdjacentOffsets(point2D)).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getAdjacentOffsets(offset2D)).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getAdjacentOffsets(cube2D)).toEqualTypeOf<BaseGrid.Offset2D[]>();

    expectTypeOf(grid.getAdjacentOffsets(point3D)).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getAdjacentOffsets(offset3D)).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getAdjacentOffsets(cube3D)).toEqualTypeOf<BaseGrid.Offset3D[]>();
  });

  test("#testAdjacency", () => {
    expectTypeOf(grid.testAdjacency(point2D, point2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(point2D, offset2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(point2D, cube2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(offset2D, point2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(offset2D, offset2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(offset2D, cube2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(cube2D, cube2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(cube2D, point2D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(cube2D, offset2D)).toBeBoolean();

    expectTypeOf(grid.testAdjacency(point3D, point3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(point3D, offset3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(point3D, cube3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(offset3D, offset3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(offset3D, point3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(offset3D, cube3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(cube3D, cube3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(cube3D, point3D)).toBeBoolean();
    expectTypeOf(grid.testAdjacency(cube3D, offset3D)).toBeBoolean();
  });

  test("#getShiftedOffset", () => {
    expectTypeOf(grid.getShiftedOffset(point2D, CONST.MOVEMENT_DIRECTIONS.DOWN)).toEqualTypeOf<BaseGrid.Offset2D>();
    expectTypeOf(grid.getShiftedOffset(offset2D, CONST.MOVEMENT_DIRECTIONS.UP)).toEqualTypeOf<BaseGrid.Offset2D>();
    expectTypeOf(grid.getShiftedOffset(cube2D, CONST.MOVEMENT_DIRECTIONS.DOWN_LEFT)).toEqualTypeOf<BaseGrid.Offset2D>();

    expectTypeOf(grid.getShiftedOffset(point3D, CONST.MOVEMENT_DIRECTIONS.LEFT)).toEqualTypeOf<BaseGrid.Offset3D>();
    expectTypeOf(grid.getShiftedOffset(offset3D, CONST.MOVEMENT_DIRECTIONS.RIGHT)).toEqualTypeOf<BaseGrid.Offset3D>();
    expectTypeOf(grid.getShiftedOffset(cube3D, CONST.MOVEMENT_DIRECTIONS.UP_RIGHT)).toEqualTypeOf<BaseGrid.Offset3D>();
  });

  test("#getShiftedPoint", () => {
    expectTypeOf(grid.getShiftedPoint(point2D, CONST.MOVEMENT_DIRECTIONS.DOWN)).toEqualTypeOf<Canvas.Point>();

    expectTypeOf(grid.getShiftedPoint(point3D, CONST.MOVEMENT_DIRECTIONS.LEFT)).toEqualTypeOf<Canvas.ElevatedPoint>();
  });

  test("#getTopLeftPoint", () => {
    expectTypeOf(grid.getTopLeftPoint(point2D)).toEqualTypeOf<Canvas.Point>();
    expectTypeOf(grid.getTopLeftPoint(offset2D)).toEqualTypeOf<Canvas.Point>();
    expectTypeOf(grid.getTopLeftPoint(cube2D)).toEqualTypeOf<Canvas.Point>();

    expectTypeOf(grid.getTopLeftPoint(point3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
    expectTypeOf(grid.getTopLeftPoint(offset3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
    expectTypeOf(grid.getTopLeftPoint(cube3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
  });

  test("#getCenterPoint", () => {
    expectTypeOf(grid.getCenterPoint(point2D)).toEqualTypeOf<Canvas.Point>();
    expectTypeOf(grid.getCenterPoint(offset2D)).toEqualTypeOf<Canvas.Point>();
    expectTypeOf(grid.getCenterPoint(cube2D)).toEqualTypeOf<Canvas.Point>();

    expectTypeOf(grid.getCenterPoint(point3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
    expectTypeOf(grid.getCenterPoint(offset3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
    expectTypeOf(grid.getCenterPoint(cube3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
  });

  test("#getVertices", () => {
    expectTypeOf(grid.getVertices(point2D)).toEqualTypeOf<Canvas.Point[]>();
    expectTypeOf(grid.getVertices(offset2D)).toEqualTypeOf<Canvas.Point[]>();
    expectTypeOf(grid.getVertices(cube2D)).toEqualTypeOf<Canvas.Point[]>();
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
    from: HexagonalGrid.Coordinates2D,
    to: HexagonalGrid.Coordinates2D,
    distance: number,
    segment: BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>,
  ) => {
    if ("x" in from) {
      expectTypeOf(from).toEqualTypeOf<Canvas.Point>();
    } else if ("i" in from) {
      expectTypeOf(from).toEqualTypeOf<BaseGrid.Offset2D>();
    } else {
      expectTypeOf(from).toEqualTypeOf<HexagonalGrid.Cube2D>();
    }
    if ("x" in to) {
      expectTypeOf(to).toEqualTypeOf<Canvas.Point>();
    } else if ("i" in to) {
      expectTypeOf(to).toEqualTypeOf<BaseGrid.Offset2D>();
    } else {
      expectTypeOf(to).toEqualTypeOf<HexagonalGrid.Cube2D>();
    }
    if ("x" in segment) {
      expectTypeOf(segment).toEqualTypeOf<Extract<BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>, Canvas.Point>>();
      expectTypeOf(segment.x).toBeNumber();
      expectTypeOf(segment.y).toBeNumber();
    } else if ("i" in segment) {
      expectTypeOf(segment).toEqualTypeOf<Extract<BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>, BaseGrid.Offset2D>>();
      expectTypeOf(segment.i).toBeNumber();
      expectTypeOf(segment.j).toBeNumber();
    } else {
      expectTypeOf(segment).toEqualTypeOf<
        Extract<BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>, HexagonalGrid.Cube2D>
      >();
      expectTypeOf(segment.q).toBeNumber();
      expectTypeOf(segment.r).toBeNumber();
      expectTypeOf(segment.s).toBeNumber();
    }
    return distance;
  }) satisfies BaseGrid.CostFunction<HexagonalGrid.Coordinates2D>;

  const costFunction3D = ((
    from: HexagonalGrid.Coordinates3D,
    to: HexagonalGrid.Coordinates3D,
    distance: number,
    segment: BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>,
  ) => {
    if ("x" in from) {
      expectTypeOf(from).toEqualTypeOf<Canvas.ElevatedPoint>();
    } else if ("i" in from) {
      expectTypeOf(from).toEqualTypeOf<BaseGrid.Offset3D>();
    } else {
      expectTypeOf(from).toEqualTypeOf<HexagonalGrid.Cube3D>();
    }
    if ("x" in to) {
      expectTypeOf(to).toEqualTypeOf<Canvas.ElevatedPoint>();
    } else if ("i" in to) {
      expectTypeOf(to).toEqualTypeOf<BaseGrid.Offset3D>();
    } else {
      expectTypeOf(to).toEqualTypeOf<HexagonalGrid.Cube3D>();
    }
    if ("x" in segment) {
      expectTypeOf(segment).toEqualTypeOf<
        Extract<BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>, Canvas.ElevatedPoint>
      >();
      expectTypeOf(segment.x).toBeNumber();
      expectTypeOf(segment.y).toBeNumber();
      expectTypeOf(segment.elevation).toBeNumber();
    } else if ("i" in segment) {
      expectTypeOf(segment).toEqualTypeOf<Extract<BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>, BaseGrid.Offset3D>>();
      expectTypeOf(segment.i).toBeNumber();
      expectTypeOf(segment.j).toBeNumber();
      expectTypeOf(segment.k).toBeNumber();
    } else {
      expectTypeOf(segment).toEqualTypeOf<
        Extract<BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>, HexagonalGrid.Cube3D>
      >();
      expectTypeOf(segment.q).toBeNumber();
      expectTypeOf(segment.r).toBeNumber();
      expectTypeOf(segment.s).toBeNumber();
      expectTypeOf(segment.k).toBeNumber();
    }
    return distance;
  }) satisfies BaseGrid.CostFunction<HexagonalGrid.Coordinates3D>;

  const waypointPoint2D = {
    ...point2D,
    measure: true,
    teleport: false,
  } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>;
  const waypointPoint2DWithCost = {
    ...point2D,
    measure: true,
    cost: 4,
  } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>;

  const waypointOffset2D = { ...offset2D, measure: true } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>;
  const waypointOffset2DWithCost = {
    ...offset2D,
    measure: true,
    cost: costFunction2D,
  } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>;

  const waypointCube2D = { ...cube2D, measure: true } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>;
  const waypointCube2DWithCost = {
    ...cube2D,
    measure: true,
    cost: costFunction2D,
  } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates2D>;

  const waypointPoint3D = { ...point3D, measure: true } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>;
  const waypointPoint3DWithCost = {
    ...point3D,
    measure: true,
    cost: costFunction3D,
  } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>;

  const waypointOffset3D = { ...offset3D, measure: true } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>;
  const waypointOffset3DWithCost = {
    ...offset3D,
    measure: true,
    cost: 2,
    teleport: false,
  } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>;

  const waypointCube3D = { ...cube3D, measure: true } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>;
  const waypointCube3DWithCost = {
    ...cube3D,
    measure: true,
    cost: costFunction3D,
  } satisfies BaseGrid.Waypoint<HexagonalGrid.Coordinates3D>;

  test("#measurePath", () => {
    expectTypeOf(
      grid.measurePath([
        waypointOffset2D,
        waypointPoint2D,
        waypointCube2D,
        waypointOffset2DWithCost,
        waypointPoint2DWithCost,
        waypointCube2DWithCost,
      ]),
    ).toEqualTypeOf<BaseGrid.MeasurePathResult>();
    expectTypeOf(
      grid.measurePath([waypointOffset2D, waypointPoint2D, waypointCube2DWithCost], { cost: costFunction2D }),
    ).toEqualTypeOf<BaseGrid.MeasurePathResult>();

    expectTypeOf(
      grid.measurePath([
        waypointOffset3D,
        waypointPoint3D,
        waypointCube3D,
        waypointOffset3DWithCost,
        waypointPoint3DWithCost,
        waypointCube3DWithCost,
      ]),
    ).toEqualTypeOf<BaseGrid.MeasurePathResult>();
    expectTypeOf(
      grid.measurePath([waypointOffset3D, waypointPoint3D, waypointCube3D], { cost: costFunction3D }),
    ).toEqualTypeOf<BaseGrid.MeasurePathResult>();

    // This works at runtime, because `_measurePath` decides `is3D` based on the first waypoint,
    // and ignores the elevation keys of subsequent waypoints.
    expectTypeOf(grid.measurePath([waypointOffset2D, waypointOffset3D])).toEqualTypeOf<BaseGrid.MeasurePathResult>();
    // Unfortunately this doesn't work at runtime, or rather, it mostly works, but the `euclidean` in the Result will be `NaN`
    grid.measurePath([waypointOffset3D, waypointOffset2D]);
    // @ts-expect-error -- at least it fails for literals
    grid.measurePath([{ x: 0, y: 0, elevation: 0 }, waypointOffset2D]);
    // @ts-expect-error -- including cubes
    grid.measurePath([{ q: 1, r: 1, s: 1, k: 2 }, waypointCube2D]);

    // @ts-expect-error -- wrong cost function
    grid.measurePath([waypointOffset2D, waypointPoint2D, waypointCube2D], { cost: costFunction3D });
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
        [
          waypointOffset2D,
          waypointPoint2D,
          waypointCube2D,
          waypointOffset2DWithCost,
          waypointPoint2DWithCost,
          waypointCube2DWithCost,
        ],
        {},
        result,
      ),
    ).toBeVoid();
    expectTypeOf(
      grid["_measurePath"]([waypointOffset2D, waypointPoint2D, waypointCube2D], { cost: costFunction2D }, result),
    ).toBeVoid();

    expectTypeOf(
      grid["_measurePath"](
        [
          waypointOffset3D,
          waypointPoint3D,
          waypointCube3D,
          waypointOffset3DWithCost,
          waypointPoint3DWithCost,
          waypointCube3DWithCost,
        ],
        {},
        result,
      ),
    ).toBeVoid();
    expectTypeOf(
      grid["_measurePath"]([waypointOffset3D, waypointPoint3D, waypointCube3D], { cost: costFunction3D }, result),
    ).toBeVoid();

    // This works at runtime, because `_measurePath` decides `is3D` based on the first waypoint,
    // and ignores the elevation keys of subsequent waypoints.
    expectTypeOf(grid["_measurePath"]([waypointOffset2D, waypointOffset3D], {}, result)).toBeVoid();
    // Unfortunately this doesn't work at runtime, or rather, it mostly works, but the `euclidean` in the Result will be `NaN`
    grid["_measurePath"]([waypointOffset3D, waypointOffset2D], {}, result);
    // @ts-expect-error -- at least it fails for literals
    grid["_measurePath"]([{ x: 0, y: 0, elevation: 0 }, waypointOffset2D], {}, result);
    // @ts-expect-error -- including cubes
    grid["_measurePath"]([{ q: 1, r: 1, s: 1, k: 2 }, waypointOffset2D], {}, result);

    // @ts-expect-error -- wrong cost function
    grid["_measurePath"]([waypointOffset2D, waypointPoint2D], { cost: costFunction3D }, result);
  });

  test("#getDirectPath", () => {
    expectTypeOf(grid.getDirectPath([point2D, point2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([point2D, offset2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([point2D, cube2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([offset2D, point2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([offset2D, offset2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([offset2D, cube2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([cube2D, cube2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([cube2D, point2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();
    expectTypeOf(grid.getDirectPath([cube2D, offset2D])).toEqualTypeOf<BaseGrid.Offset2D[]>();

    expectTypeOf(grid.getDirectPath([point3D, point3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([point3D, offset3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([point3D, cube3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([offset3D, offset3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([offset3D, point3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([offset3D, cube3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([cube3D, cube3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([cube3D, point3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
    expectTypeOf(grid.getDirectPath([cube3D, offset3D])).toEqualTypeOf<BaseGrid.Offset3D[]>();
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

  // Methods specific to HexagonalGrid:

  test("#getCube", () => {
    expectTypeOf(grid.getCube(point2D)).toEqualTypeOf<HexagonalGrid.Cube2D>();
    expectTypeOf(grid.getCube(offset2D)).toEqualTypeOf<HexagonalGrid.Cube2D>();
    expectTypeOf(grid.getCube(cube2D)).toEqualTypeOf<HexagonalGrid.Cube2D>();

    expectTypeOf(grid.getCube(point3D)).toEqualTypeOf<HexagonalGrid.Cube3D>();
    expectTypeOf(grid.getCube(offset3D)).toEqualTypeOf<HexagonalGrid.Cube3D>();
    expectTypeOf(grid.getCube(cube3D)).toEqualTypeOf<HexagonalGrid.Cube3D>();
  });

  test("#getAdjacentCubes", () => {
    expectTypeOf(grid.getAdjacentCubes(point2D)).toEqualTypeOf<HexagonalGrid.Cube2D[]>();
    expectTypeOf(grid.getAdjacentCubes(offset2D)).toEqualTypeOf<HexagonalGrid.Cube2D[]>();
    expectTypeOf(grid.getAdjacentCubes(cube2D)).toEqualTypeOf<HexagonalGrid.Cube2D[]>();

    expectTypeOf(grid.getAdjacentCubes(point3D)).toEqualTypeOf<HexagonalGrid.Cube3D[]>();
    expectTypeOf(grid.getAdjacentCubes(offset3D)).toEqualTypeOf<HexagonalGrid.Cube3D[]>();
    expectTypeOf(grid.getAdjacentCubes(cube3D)).toEqualTypeOf<HexagonalGrid.Cube3D[]>();
  });

  test("#getShiftedCube", () => {
    expectTypeOf(grid.getShiftedCube(point2D, CONST.MOVEMENT_DIRECTIONS.DOWN)).toEqualTypeOf<HexagonalGrid.Cube2D>();
    expectTypeOf(
      grid.getShiftedCube(offset2D, CONST.MOVEMENT_DIRECTIONS.DOWN_LEFT),
    ).toEqualTypeOf<HexagonalGrid.Cube2D>();
    expectTypeOf(
      grid.getShiftedCube(cube2D, CONST.MOVEMENT_DIRECTIONS.DOWN_RIGHT),
    ).toEqualTypeOf<HexagonalGrid.Cube2D>();

    expectTypeOf(grid.getShiftedCube(point3D, CONST.MOVEMENT_DIRECTIONS.LEFT)).toEqualTypeOf<HexagonalGrid.Cube3D>();
    expectTypeOf(grid.getShiftedCube(offset3D, CONST.MOVEMENT_DIRECTIONS.RIGHT)).toEqualTypeOf<HexagonalGrid.Cube3D>();
    expectTypeOf(grid.getShiftedCube(cube3D, CONST.MOVEMENT_DIRECTIONS.UP)).toEqualTypeOf<HexagonalGrid.Cube3D>();
  });

  test(".cubeRound", () => {
    expectTypeOf(HexagonalGrid.cubeRound(cube2D)).toEqualTypeOf<HexagonalGrid.Cube2D>();
    expectTypeOf(HexagonalGrid.cubeRound(cube3D)).toEqualTypeOf<HexagonalGrid.Cube3D>();
  });

  test("#pointToCube", () => {
    expectTypeOf(grid.pointToCube(point2D)).toEqualTypeOf<HexagonalGrid.Cube2D>();
    expectTypeOf(grid.pointToCube(point3D)).toEqualTypeOf<HexagonalGrid.Cube3D>();
  });

  test("#cubeToPoint", () => {
    expectTypeOf(grid.cubeToPoint(cube2D)).toEqualTypeOf<Canvas.Point>();
    expectTypeOf(grid.cubeToPoint(cube3D)).toEqualTypeOf<Canvas.ElevatedPoint>();
  });

  test("#offsetToCube", () => {
    expectTypeOf(grid.offsetToCube(offset2D)).toEqualTypeOf<HexagonalGrid.Cube2D>();
    expectTypeOf(grid.offsetToCube(offset3D)).toEqualTypeOf<HexagonalGrid.Cube3D>();
  });

  test("#cubeToOffset", () => {
    expectTypeOf(grid.cubeToOffset(cube2D)).toEqualTypeOf<BaseGrid.Offset2D>();
    expectTypeOf(grid.cubeToOffset(cube3D)).toEqualTypeOf<BaseGrid.Offset3D>();
  });

  test(".cubeDistance", () => {
    expectTypeOf(HexagonalGrid.cubeDistance(cube2D, cube2D)).toBeNumber();
  });
});
// declare const config: foundry.grid.HexagonalGrid.Configuration;

// const grid = new foundry.grid.HexagonalGrid(config);

// expectTypeOf(grid.columns).toEqualTypeOf<boolean>();
// expectTypeOf(grid.even).toEqualTypeOf<boolean>();

// declare const coords: foundry.grid.HexagonalGrid.Coordinates;
// declare const p: Canvas.Point;
// declare const bounds: Canvas.Rectangle;
// expectTypeOf(grid.getOffset(coords)).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset>();
// expectTypeOf(grid.getOffsetRange(bounds)).toEqualTypeOf<foundry.grid.HexagonalGrid.OffsetRange>();
// expectTypeOf(grid.getAdjacentOffsets(coords)).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset[]>();
// expectTypeOf(grid.testAdjacency(coords, coords)).toEqualTypeOf<boolean>();
// expectTypeOf(grid.getShiftedOffset(coords, 1)).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset>();
// expectTypeOf(grid.getShiftedPoint(p, 1)).toEqualTypeOf<Canvas.Point>();
// expectTypeOf(grid.getCube(coords)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube>();
// expectTypeOf(grid.getAdjacentCubes(coords)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube[]>();
// expectTypeOf(grid.getShiftedCube(coords, 1)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube>();
// expectTypeOf(grid.getTopLeftPoint(coords)).toEqualTypeOf<Canvas.Point>();
// expectTypeOf(grid.getCenterPoint(coords)).toEqualTypeOf<Canvas.Point>();
// expectTypeOf(grid.getShape()).toEqualTypeOf<Canvas.Point[]>();
// expectTypeOf(grid.getVertices(coords)).toEqualTypeOf<Canvas.Point[]>();

// declare const behavior: foundry.grid.HexagonalGrid.SnappingBehavior;
// declare const cube: foundry.grid.HexagonalGrid.Cube2D;
// declare const offset: foundry.grid.HexagonalGrid.Offset;

// expectTypeOf(grid.getSnappedPoint(p, behavior)).toEqualTypeOf<Canvas.Point>();
// expectTypeOf(grid.calculateDimensions(1, 2, 3)).toEqualTypeOf<foundry.grid.HexagonalGrid.Dimensions>();
// expectTypeOf(grid.getDirectPath([coords])).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset[]>();
// expectTypeOf(grid.getTranslatedPoint(p, 1, 1)).toEqualTypeOf<Canvas.Point>();
// expectTypeOf(grid.getCircle(p, 1)).toEqualTypeOf<Canvas.Point[]>();
// expectTypeOf(grid.pointToCube(p)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube>();
// expectTypeOf(grid.cubeToPoint(cube)).toEqualTypeOf<Canvas.Point>();
// expectTypeOf(grid.offsetToCube(offset)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube>();
// expectTypeOf(grid.cubeToOffset(cube)).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset>();

// expectTypeOf(foundry.grid.HexagonalGrid.cubeRound(cube)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube>();
// expectTypeOf(foundry.grid.HexagonalGrid.cubeDistance(cube, cube)).toEqualTypeOf<number>();
