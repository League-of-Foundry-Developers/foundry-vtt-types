import { describe, expectTypeOf, test } from "vitest";

import PrimaryCanvasContainer = foundry.canvas.primary.PrimaryCanvasContainer;

declare const renderer: PIXI.Renderer;

describe("PrimaryCanvasContainer tests", () => {
  const myPCC = new PrimaryCanvasContainer();
  test("Miscellaneous", () => {
    expectTypeOf(myPCC.sort).toBeNumber();
    myPCC.sort = 5; // Setter

    expectTypeOf(myPCC.elevation).toBeNumber();
    myPCC.elevation = 5; // Setter

    expectTypeOf(myPCC.sortLayer).toBeNumber();
    myPCC.sortLayer = 5; // Setter

    expectTypeOf(myPCC.zIndex).toBeNumber();
    myPCC.zIndex = 5; // Setter

    expectTypeOf(myPCC.inPrimary).toBeBoolean();
    expectTypeOf(myPCC.shouldRenderDepth).toBeBoolean();
    expectTypeOf(myPCC["_onAddedPrimary"]()).toBeVoid();
    expectTypeOf(myPCC["_onRemovedPrimary"]()).toBeVoid();
    expectTypeOf(myPCC["_onElevationChange"]()).toBeVoid();
    expectTypeOf(myPCC["_shouldRenderDepth"]()).toBeBoolean();
    expectTypeOf(myPCC.sortChildren()).toBeVoid();
    expectTypeOf(myPCC.updateCanvasTransform()).toBeVoid();

    expectTypeOf(myPCC.renderDepthData(renderer)).toBeVoid();
  });
});
