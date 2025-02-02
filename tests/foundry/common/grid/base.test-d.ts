import { expectTypeOf } from "vitest";

declare const baseGrid: foundry.grid.BaseGrid;

expectTypeOf(baseGrid.size).toEqualTypeOf<number>();
expectTypeOf(baseGrid.sizeX).toEqualTypeOf<number>();
expectTypeOf(baseGrid.sizeY).toEqualTypeOf<number>();
expectTypeOf(baseGrid.distance).toEqualTypeOf<number>();
expectTypeOf(baseGrid.units).toEqualTypeOf<string>();
expectTypeOf(baseGrid.style).toEqualTypeOf<string>();
expectTypeOf(baseGrid.thickness).toEqualTypeOf<number>();
expectTypeOf(baseGrid.color).toEqualTypeOf<Color>();
expectTypeOf(baseGrid.alpha).toEqualTypeOf<number>();
expectTypeOf(baseGrid.type).toEqualTypeOf<foundry.CONST.GRID_TYPES>();
expectTypeOf(baseGrid.isGridless).toEqualTypeOf<boolean>();
expectTypeOf(baseGrid.isSquare).toEqualTypeOf<boolean>();
expectTypeOf(baseGrid.isHexagonal).toEqualTypeOf<boolean>();
expectTypeOf(baseGrid.measurePath([], {})).toEqualTypeOf<foundry.grid.BaseGrid.MeasurePathResult>();

declare const p: Canvas.Point;
expectTypeOf(baseGrid.getCone(p, 1, 1, 1)).toEqualTypeOf<Canvas.Point[]>();
