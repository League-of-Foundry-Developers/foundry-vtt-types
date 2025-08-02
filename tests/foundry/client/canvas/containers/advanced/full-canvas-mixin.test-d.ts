import { describe, expectTypeOf, test } from "vitest";

import FullCanvasObjectMixin = foundry.canvas.containers.FullCanvasObjectMixin;

class MyFullCanvasContainer extends FullCanvasObjectMixin(PIXI.Container) {}

describe("FullCanvasObjectMixin tests", () => {
  test("Miscellaneous", () => {
    const myFullCanvasContainer = new MyFullCanvasContainer();

    expectTypeOf(myFullCanvasContainer.calculateBounds()).toEqualTypeOf<void>();
  });
});
