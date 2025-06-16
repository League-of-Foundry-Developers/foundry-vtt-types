import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;

declare const coordinates: foundry.grid.HexagonalGrid.Coordinates;
declare const grid: foundry.grid.HexagonalGrid;

const gridHex = new foundry.grid.GridHex(coordinates, grid);

expectTypeOf(gridHex.grid).toEqualTypeOf<foundry.grid.HexagonalGrid>();
expectTypeOf(gridHex.cube).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube>();
expectTypeOf(gridHex.offset).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset>();
expectTypeOf(gridHex.center).toEqualTypeOf<Canvas.Point>();
expectTypeOf(gridHex.topLeft).toEqualTypeOf<Canvas.Point>();
expectTypeOf(gridHex.getNeighbors()).toEqualTypeOf<foundry.grid.GridHex[]>();
expectTypeOf(gridHex.shiftCube(1, 2, 3)).toEqualTypeOf<foundry.grid.GridHex>();
expectTypeOf(gridHex.equals(gridHex)).toEqualTypeOf<boolean>();
