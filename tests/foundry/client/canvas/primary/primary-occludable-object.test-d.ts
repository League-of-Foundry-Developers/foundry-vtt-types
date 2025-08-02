import { describe, expectTypeOf, test } from "vitest";

import PrimaryOccludableObjectMixin = foundry.canvas.primary.PrimaryOccludableObjectMixin;
import Token = foundry.canvas.placeables.Token;

declare const someToken: Token.Implementation;

describe("PrimaryOccludableObject tests", () => {
  const myPOO = new (PrimaryOccludableObjectMixin(PIXI.Container))();

  test("Miscellaneous", () => {
    expectTypeOf(myPOO.hidden).toBeBoolean();
    expectTypeOf(myPOO.occluded).toBeBoolean();
    expectTypeOf(myPOO.occlusionMode).toEqualTypeOf<CONST.OCCLUSION_MODES>();
    expectTypeOf(myPOO.unoccludedAlpha).toBeNumber();
    expectTypeOf(myPOO.occludedAlpha).toBeNumber();

    expectTypeOf(myPOO.hoverFade).toBeBoolean();
    myPOO.hoverFade = true; // Setter

    expectTypeOf(myPOO["_occlusionState"]).toEqualTypeOf<PrimaryOccludableObjectMixin.OcclusionState>();
    expectTypeOf(myPOO["_hoverFadeState"]).toEqualTypeOf<PrimaryOccludableObjectMixin.HoverFadeState>();
    expectTypeOf(myPOO["_restrictionState"]).toBeNumber();

    expectTypeOf(myPOO.restrictsLight).toBeBoolean();
    myPOO.restrictsLight = true; // Setter

    expectTypeOf(myPOO.restrictsWeather).toBeBoolean();
    myPOO.restrictsWeather = true; // Setter

    expectTypeOf(myPOO.isOccludable).toBeBoolean();
    expectTypeOf(myPOO.debounceSetOcclusion(false)).toEqualTypeOf<boolean>();
    expectTypeOf(myPOO.updateCanvasTransform()).toBeVoid();
    expectTypeOf(myPOO["_shouldRenderDepth"]()).toBeBoolean();

    expectTypeOf(myPOO.testOcclusion(someToken)).toEqualTypeOf<boolean>();
    expectTypeOf(myPOO.testOcclusion(someToken, { corners: true })).toEqualTypeOf<boolean>();
    expectTypeOf(myPOO.testOcclusion(someToken, { corners: undefined })).toEqualTypeOf<boolean>();
  });

  test("Deprecated", () => {
    // deprecated since v12, until v14

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myPOO.roof).toBeBoolean();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    myPOO.roof = false; // Setter

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myPOO.containsPixel(500, 500, 0.5)).toEqualTypeOf<boolean>();
  });
});
