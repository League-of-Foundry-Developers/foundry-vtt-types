import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;

declare const config: foundry.grid.SquareGrid.Configuration;

const squareGrid = new foundry.grid.SquareGrid(config);

expectTypeOf(squareGrid.type).toEqualTypeOf<typeof foundry.CONST.GRID_TYPES.SQUARE>();
expectTypeOf(squareGrid.diagonals).toEqualTypeOf<number>();

declare const coords: foundry.grid.SquareGrid.Coordinates;
declare const p: Canvas.Point;
declare const bounds: Canvas.Rectangle;
expectTypeOf(squareGrid.getOffset(coords)).toEqualTypeOf<foundry.grid.SquareGrid.Offset>();
expectTypeOf(squareGrid.getOffsetRange(bounds)).toEqualTypeOf<foundry.grid.SquareGrid.OffsetRange>();
expectTypeOf(squareGrid.getAdjacentOffsets(coords)).toEqualTypeOf<foundry.grid.SquareGrid.Offset[]>();
expectTypeOf(squareGrid.testAdjacency(coords, coords)).toEqualTypeOf<boolean>();
expectTypeOf(squareGrid.getShiftedOffset(coords, 1)).toEqualTypeOf<foundry.grid.SquareGrid.Offset>();
expectTypeOf(squareGrid.getShiftedPoint(p, 1)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(squareGrid.getTopLeftPoint(coords)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(squareGrid.getCenterPoint(coords)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(squareGrid.getShape()).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(squareGrid.getVertices(coords)).toEqualTypeOf<Canvas.Point[]>();

declare const behavior: foundry.grid.SquareGrid.SnappingBehavior;

expectTypeOf(squareGrid.getSnappedPoint(p, behavior)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(squareGrid.getDirectPath([coords])).toEqualTypeOf<foundry.grid.SquareGrid.Offset[]>();
expectTypeOf(squareGrid.getTranslatedPoint(p, 1, 1)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(squareGrid.getCircle(p, 1)).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(squareGrid.calculateDimensions(1, 2, 3)).toEqualTypeOf<foundry.grid.SquareGrid.Dimensions>();
