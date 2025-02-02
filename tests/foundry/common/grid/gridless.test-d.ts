import { expectTypeOf } from "vitest";

declare const config: foundry.grid.BaseGrid.Configuration;

const gridlessGrid = new foundry.grid.GridlessGrid(config);

expectTypeOf(gridlessGrid.type).toEqualTypeOf<typeof foundry.CONST.GRID_TYPES.GRIDLESS>();
expectTypeOf(gridlessGrid.calculateDimensions(1, 2, 3)).toEqualTypeOf<foundry.grid.GridlessGrid.Dimensions>();

declare const coords: foundry.grid.GridlessGrid.Coordinates;
declare const p: Canvas.Point;
declare const bounds: Canvas.Rectangle;
expectTypeOf(gridlessGrid.getOffset(coords)).toEqualTypeOf<foundry.grid.GridlessGrid.Offset>();
expectTypeOf(gridlessGrid.getOffsetRange(bounds)).toEqualTypeOf<foundry.grid.GridlessGrid.OffsetRange>();
expectTypeOf(gridlessGrid.getAdjacentOffsets(coords)).toEqualTypeOf<foundry.grid.GridlessGrid.Offset[]>();
expectTypeOf(gridlessGrid.testAdjacency(coords, coords)).toEqualTypeOf<boolean>();
expectTypeOf(gridlessGrid.getShiftedOffset(coords, 1)).toEqualTypeOf<foundry.grid.GridlessGrid.Offset>();
expectTypeOf(gridlessGrid.getShiftedPoint(p, 1)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(gridlessGrid.getTopLeftPoint(coords)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(gridlessGrid.getCenterPoint(coords)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(gridlessGrid.getShape()).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(gridlessGrid.getVertices(coords)).toEqualTypeOf<Canvas.Point[]>();

declare const behavior: foundry.grid.GridlessGrid.SnappingBehavior;
expectTypeOf(gridlessGrid.getSnappedPoint(p, behavior)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(gridlessGrid.getDirectPath([coords])).toEqualTypeOf<foundry.grid.GridlessGrid.Offset[]>();
expectTypeOf(gridlessGrid.getTranslatedPoint(p, 1, 1)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(gridlessGrid.getCircle(p, 1)).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(gridlessGrid.getCone(p, 1, 2, 3)).toEqualTypeOf<Canvas.Point[]>();
