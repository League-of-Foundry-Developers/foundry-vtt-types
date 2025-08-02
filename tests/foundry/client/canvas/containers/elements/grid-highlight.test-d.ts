import { describe, expectTypeOf, test } from "vitest";

import GridHighlight = foundry.canvas.containers.GridHighlight;

declare const smoothGeometry: PIXI.smooth.SmoothGraphicsGeometry;

describe("GridHighlight tests", () => {
  test("Construction", () => {
    // @ts-expect-error must pass a name
    new GridHighlight();
    new GridHighlight("someName");
    new GridHighlight("someName", smoothGeometry);
  });

  const grid = new GridHighlight("someName", smoothGeometry);

  test("Miscellaneous", () => {
    expectTypeOf(grid.name).toEqualTypeOf<string>();
    expectTypeOf(grid.positions).toEqualTypeOf<Set<GridHighlight.PositionString>>();
    expectTypeOf(grid.highlight(100, 100)).toEqualTypeOf<boolean>();
    expectTypeOf(grid.clear()).toEqualTypeOf<GridHighlight>();
    expectTypeOf(grid.destroy()).toEqualTypeOf<void>();
    expectTypeOf(grid.destroy({ children: true, texture: true, baseTexture: true })).toEqualTypeOf<void>();
  });
});
