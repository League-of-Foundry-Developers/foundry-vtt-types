import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;

declare const config: foundry.grid.HexagonalGrid.Configuration;

const hexGrid = new foundry.grid.HexagonalGrid(config);

expectTypeOf(hexGrid.type).toEqualTypeOf<
  | typeof foundry.CONST.GRID_TYPES.HEXEVENQ
  | typeof foundry.CONST.GRID_TYPES.HEXEVENR
  | typeof foundry.CONST.GRID_TYPES.HEXODDQ
  | typeof foundry.CONST.GRID_TYPES.HEXODDR
>();
expectTypeOf(hexGrid.columns).toEqualTypeOf<boolean>();
expectTypeOf(hexGrid.even).toEqualTypeOf<boolean>();

declare const coords: foundry.grid.HexagonalGrid.Coordinates;
declare const p: Canvas.Point;
declare const bounds: Canvas.Rectangle;
expectTypeOf(hexGrid.getOffset(coords)).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset>();
expectTypeOf(hexGrid.getOffsetRange(bounds)).toEqualTypeOf<foundry.grid.HexagonalGrid.OffsetRange>();
expectTypeOf(hexGrid.getAdjacentOffsets(coords)).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset[]>();
expectTypeOf(hexGrid.testAdjacency(coords, coords)).toEqualTypeOf<boolean>();
expectTypeOf(hexGrid.getShiftedOffset(coords, 1)).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset>();
expectTypeOf(hexGrid.getShiftedPoint(p, 1)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(hexGrid.getCube(coords)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube2D>();
expectTypeOf(hexGrid.getAdjacentCubes(coords)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube2D[]>();
expectTypeOf(hexGrid.getShiftedCube(coords, 1)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube2D>();
expectTypeOf(hexGrid.getTopLeftPoint(coords)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(hexGrid.getCenterPoint(coords)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(hexGrid.getShape()).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(hexGrid.getVertices(coords)).toEqualTypeOf<Canvas.Point[]>();

declare const behavior: foundry.grid.HexagonalGrid.SnappingBehavior;
declare const cube: foundry.grid.HexagonalGrid.Cube2D;
declare const offset: foundry.grid.HexagonalGrid.Offset;

expectTypeOf(hexGrid.getSnappedPoint(p, behavior)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(hexGrid.calculateDimensions(1, 2, 3)).toEqualTypeOf<foundry.grid.HexagonalGrid.Dimensions>();
expectTypeOf(hexGrid.getDirectPath([coords])).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset[]>();
expectTypeOf(hexGrid.getTranslatedPoint(p, 1, 1)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(hexGrid.getCircle(p, 1)).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(hexGrid.pointToCube(p)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube2D>();
expectTypeOf(hexGrid.cubeToPoint(cube)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(hexGrid.offsetToCube(offset)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube2D>();
expectTypeOf(hexGrid.cubeToOffset(cube)).toEqualTypeOf<foundry.grid.HexagonalGrid.Offset>();

expectTypeOf(foundry.grid.HexagonalGrid.cubeRound(cube)).toEqualTypeOf<foundry.grid.HexagonalGrid.Cube2D>();
expectTypeOf(foundry.grid.HexagonalGrid.cubeDistance(cube, cube)).toEqualTypeOf<number>();
