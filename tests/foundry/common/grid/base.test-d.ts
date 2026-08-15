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
    expectTypeOf(baseGrid.getRectangle({ x: 50, y: 50 }, 3, 4, { x: 0.5, y: 0.5 }, 30)).toEqualTypeOf<Canvas.Point[]>();
    expectTypeOf(baseGrid.getLine({ x: 50, y: 50 }, 5, 1, 270)).toEqualTypeOf<Canvas.Point[]>();
    expectTypeOf(baseGrid.getCone({ x: 50, y: 50 }, 5, 270, 60)).toEqualTypeOf<Canvas.Point[]>();
    expectTypeOf(baseGrid.getEllipse({ x: 50, y: 50 }, 3, 5, 45)).toEqualTypeOf<Canvas.Point[] | number[]>();
    expectTypeOf(baseGrid.getRing({ x: 50, y: 50 }, 5, 1, 2)).toEqualTypeOf<BaseGrid.Ring>();

    // measurePath not tested here due to complexity and having fake overrides in every subclass
  });
});
