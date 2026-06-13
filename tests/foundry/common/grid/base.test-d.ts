import { describe, expectTypeOf, test } from "vitest";

import BaseGrid = foundry.grid.BaseGrid;
import Canvas = foundry.canvas.Canvas;

// all testing of abstract methods will be done in the non-abstract grid class' files.
declare const baseGrid: BaseGrid;

describe("BaseGrid Tests", () => {
  test("Configuration properties", () => {
    expectTypeOf(baseGrid.size).toEqualTypeOf<number>();
    expectTypeOf(baseGrid.sizeX).toEqualTypeOf<number>();
    expectTypeOf(baseGrid.sizeY).toEqualTypeOf<number>();
    expectTypeOf(baseGrid.distance).toEqualTypeOf<number>();
    expectTypeOf(baseGrid.units).toEqualTypeOf<string>();
    expectTypeOf(baseGrid.style).toEqualTypeOf<BaseGrid.ConfiguredStyle>();
    expectTypeOf(baseGrid.thickness).toEqualTypeOf<number>();
    expectTypeOf(baseGrid.color).toEqualTypeOf<Color>();
    expectTypeOf(baseGrid.alpha).toEqualTypeOf<number>();
    expectTypeOf(baseGrid.type).toEqualTypeOf<CONST.GRID_TYPES>();
  });

  test("Type getters", () => {
    expectTypeOf(baseGrid.isGridless).toEqualTypeOf<boolean>();
    expectTypeOf(baseGrid.isSquare).toEqualTypeOf<boolean>();
    expectTypeOf(baseGrid.isHexagonal).toEqualTypeOf<boolean>();
  });

  test("Non-abstract methods", () => {
    expectTypeOf(baseGrid.getCone({ x: 50, y: 50 }, 5, 270, 60)).toEqualTypeOf<Canvas.Point[]>();

    // measurePath not tested here due to complexity and having fake overrides in every subclass
  });
});
