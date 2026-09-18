import { expectTypeOf, test } from "vitest";

import AdaptiveDarknessShader = foundry.canvas.rendering.shaders.AdaptiveDarknessShader;

test("foundry/client/canvas/rendering/shaders/lighting/darkness-lighting", () => {
  let myADS;

  expectTypeOf(AdaptiveDarknessShader.FRAGMENT_BEGIN).toEqualTypeOf<string>();
  expectTypeOf((myADS = AdaptiveDarknessShader.create())).toEqualTypeOf<AdaptiveDarknessShader>();

  expectTypeOf(myADS.update()).toEqualTypeOf<void>();
  expectTypeOf(myADS.isRequired).toEqualTypeOf<boolean>();
});
