import { describe, expectTypeOf, test } from "vitest";

import PrimaryCanvasObjectMixin = foundry.canvas.primary.PrimaryCanvasObjectMixin;

declare const renderer: PIXI.Renderer;
declare const primaryCanvasGroup: foundry.canvas.groups.PrimaryCanvasGroup;
declare const primaryCanvasContainer: foundry.canvas.primary.PrimaryCanvasContainer;

describe("PrimaryCanvasObjectMixin tests", () => {
  const myPCO = new (PrimaryCanvasObjectMixin(PIXI.Container))();

  test("Miscellaneous", () => {
    expectTypeOf(myPCO.object).toEqualTypeOf<PrimaryCanvasObjectMixin.OwningObject | null>();

    expectTypeOf(myPCO.elevation).toBeNumber();
    myPCO.elevation = 20; // Setter

    expectTypeOf(myPCO.sort).toBeNumber();
    myPCO.sort = 20; // Setter

    expectTypeOf(myPCO.sortLayer).toBeNumber();
    myPCO.sortLayer = 20; // Setter

    expectTypeOf(myPCO.zIndex).toBeNumber();
    myPCO.zIndex = 20; // Setter

    expectTypeOf(myPCO.inPrimary).toBeBoolean();
    expectTypeOf(myPCO["_primaryIndex"]).toBeNumber();
    expectTypeOf(myPCO["_onAdded"](primaryCanvasGroup)).toBeVoid();
    expectTypeOf(myPCO["_onAdded"](primaryCanvasContainer)).toBeVoid();
    expectTypeOf(myPCO["_onAddedPrimary"]()).toBeVoid();
    expectTypeOf(myPCO["_onRemoved"](primaryCanvasGroup)).toBeVoid();
    expectTypeOf(myPCO["_onRemoved"](primaryCanvasContainer)).toBeVoid();
    expectTypeOf(myPCO["_onRemovedPrimary"]()).toBeVoid();
    expectTypeOf(myPCO["_onElevationChange"]()).toBeVoid();

    expectTypeOf(myPCO.shouldRenderDepth).toBeBoolean();

    expectTypeOf(myPCO.renderDepthData(renderer)).toEqualTypeOf<void>();
  });
});
