import type SquareGrid from "src/foundry/common/grid/square.d.mts";
import { expectTypeOf } from "vitest";

const myGrid = new foundry.grid.SquareGrid({
  diagonals: CONST.GRID_DIAGONALS.ALTERNATING_1,
  size: 100,
  color: "0x000000",
  alpha: 3,
});

expectTypeOf(
  myGrid.getDirectPath([
    { i: 30, j: 200 },
    { x: 2000, y: 2000 },
  ]),
).toEqualTypeOf<SquareGrid.Offset[]>();
