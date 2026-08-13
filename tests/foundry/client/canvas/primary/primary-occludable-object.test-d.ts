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
    expectTypeOf(myPOO["_occludedBySameElevationSurfaces"]).toBeBoolean();
    expectTypeOf(myPOO.unoccludedAlpha).toBeNumber();
    expectTypeOf(myPOO.occludedAlpha).toBeNumber();

    expectTypeOf(myPOO.hoverFade).toBeBoolean();
    myPOO.hoverFade = true; // Setter

    expectTypeOf(myPOO["_occlusionState"]).toEqualTypeOf<PrimaryOccludableObjectMixin.OcclusionState>();
    expectTypeOf(myPOO["_occlusionState"].surface).toBeNumber();
    expectTypeOf(myPOO["_hoverFadeState"]).toEqualTypeOf<PrimaryOccludableObjectMixin.HoverFadeState>();
    expectTypeOf(myPOO["_restrictionState"]).toBeNumber();

    expectTypeOf(myPOO.restrictsLight).toBeBoolean();
    myPOO.restrictsLight = true; // Setter

    expectTypeOf(myPOO.restrictsWeather).toBeBoolean();
    myPOO.restrictsWeather = true; // Setter

    expectTypeOf(myPOO.isOccludable).toBeBoolean();
    expectTypeOf(myPOO["_occlusionElevation"]).toBeNumber();
    expectTypeOf(myPOO.debounceSetOcclusion(false)).toBeVoid();
    expectTypeOf(myPOO.debounceSetOcclusion.cancel()).toBeVoid();
    expectTypeOf(myPOO.updateTransform()).toBeVoid();
    expectTypeOf(myPOO["_shouldRenderDepth"]()).toBeBoolean();

    expectTypeOf(myPOO.testOcclusion(someToken)).toEqualTypeOf<boolean>();
  });
});
