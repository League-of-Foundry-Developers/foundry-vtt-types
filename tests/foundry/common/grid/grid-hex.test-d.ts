import { describe, expectTypeOf, test } from "vitest";

import * as hexGridHelpers from "./hexagonal.test-d.ts";

import GridHex = foundry.grid.GridHex;
import HexagonalGrid = foundry.grid.HexagonalGrid;
import BaseGrid = foundry.grid.BaseGrid;
import Canvas = foundry.canvas.Canvas;

describe("GridHex Tests", () => {
  const grid = new HexagonalGrid(hexGridHelpers.minimalConfig);

  const point2D = { x: 500, y: 500 } satisfies Canvas.Point;
  const offset2D = { i: 5, j: 5 } satisfies BaseGrid.Offset2D;
  const cube2D = { q: 2, r: 5, s: -7 } satisfies HexagonalGrid.Cube2D;

  test("Construction", () => {
    // @ts-expect-error Passing coordinates and a grid is required
    new GridHex();

    // eslint-disable-next-line @typescript-eslint/no-deprecated -- deprecated construction signature
    new GridHex({ row: 5, col: 6 }, grid);

    // eslint-disable-next-line @typescript-eslint/no-deprecated -- deprecated construction signature
    new GridHex(cube2D, hexGridHelpers.fullConfig);

    // valid constructions
    new GridHex(point2D, grid);
    new GridHex(offset2D, grid);
    new GridHex(cube2D, grid);
  });

  const gridHex = new GridHex(cube2D, grid);

  test("Properties and getters", () => {
    expectTypeOf(gridHex.grid).toEqualTypeOf<HexagonalGrid>();
    expectTypeOf(gridHex.cube).toEqualTypeOf<HexagonalGrid.Cube2D>();
    expectTypeOf(gridHex.offset).toEqualTypeOf<BaseGrid.Offset2D>();
    expectTypeOf(gridHex.center).toEqualTypeOf<Canvas.Point>();
    expectTypeOf(gridHex.topLeft).toEqualTypeOf<Canvas.Point>();
  });

  test("Methods", () => {
    expectTypeOf(gridHex.getNeighbors()).toEqualTypeOf<GridHex[]>();
    expectTypeOf(gridHex.shiftCube(1, 2, 3)).toEqualTypeOf<GridHex>();
    expectTypeOf(gridHex.equals(gridHex)).toEqualTypeOf<boolean>();
  });
});
