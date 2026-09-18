import { expectTypeOf, test } from "vitest";

import AdaptiveBackgroundShader = foundry.canvas.rendering.shaders.AdaptiveBackgroundShader;

test("foundry/client/canvas/rendering/shaders/lighting/background-lighting", () => {
  let myABS;

  expectTypeOf(AdaptiveBackgroundShader.SHADER_HEADER).toEqualTypeOf<string>();
  expectTypeOf((myABS = AdaptiveBackgroundShader.create())).toEqualTypeOf<AdaptiveBackgroundShader>();

  expectTypeOf(myABS.isRequired).toEqualTypeOf<boolean>();
});
