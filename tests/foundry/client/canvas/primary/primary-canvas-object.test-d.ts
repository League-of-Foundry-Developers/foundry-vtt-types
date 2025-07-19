import { describe, expectTypeOf, test } from "vitest";

import CanvasTransformMixin = foundry.canvas.primary.CanvasTransformMixin;
import PrimaryCanvasObjectMixin = foundry.canvas.primary.PrimaryCanvasObjectMixin;

declare const renderer: PIXI.Renderer;
declare const primaryCanvasGroup: foundry.canvas.groups.PrimaryCanvasGroup;
declare const primaryCanvasContainer: foundry.canvas.primary.PrimaryCanvasContainer;

describe("CanvasTransformMixin Tests", () => {
  const myCT = new (CanvasTransformMixin(PIXI.Container))();
  test("Uncategorized", () => {
    expectTypeOf(myCT.canvasBounds).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(myCT["_canvasBounds"]).toEqualTypeOf<PIXI.Bounds>();
    expectTypeOf(myCT["_canvasBoundsID"]).toBeNumber();
    expectTypeOf(myCT.updateCanvasTransform()).toBeVoid;
    expectTypeOf(myCT["_onCanvasTransformUpdate"]()).toBeVoid();
    expectTypeOf(myCT["_onCanvasBoundsUpdate"]()).toBeVoid();
    expectTypeOf(myCT.containsCanvasPoint({ x: 1000, y: 1000 })).toEqualTypeOf<boolean>();
  });
});

describe("PrimaryCanvasObjectMixin Tests", () => {
  const myPCO = new (PrimaryCanvasObjectMixin(PIXI.Container))();

  test("Uncategorized", () => {
    expectTypeOf(myPCO.object).toEqualTypeOf<PrimaryCanvasObjectMixin.OwningObject | null>();

    expectTypeOf(myPCO.elevation).toBeNumber();
    myPCO.elevation = 20; // Setter

    expectTypeOf(myPCO.sort).toBeNumber();
    myPCO.sort = 20; // Setter

    expectTypeOf(myPCO.sortLayer).toBeNumber();
    myPCO.sortLayer = 20; // Setter

    expectTypeOf(myPCO.zIndex).toBeNumber();
    myPCO.zIndex = 20; // Setter

    expectTypeOf(myPCO["_onAdded"](primaryCanvasGroup)).toBeVoid();
    expectTypeOf(myPCO["_onAdded"](primaryCanvasContainer)).toBeVoid();
    expectTypeOf(myPCO["_onRemoved"](primaryCanvasGroup)).toBeVoid();
    expectTypeOf(myPCO["_onRemoved"](primaryCanvasContainer)).toBeVoid();

    expectTypeOf(myPCO.shouldRenderDepth).toBeBoolean();

    expectTypeOf(myPCO.renderDepthData(renderer)).toEqualTypeOf<void>();
  });

  test("Deprecated", () => {
    // deprecated since v12, until v14

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myPCO.document).toEqualTypeOf<foundry.canvas.placeables.PlaceableObject.AnyCanvasDocument | null>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myPCO.updateBounds()).toBeVoid();
  });
});
