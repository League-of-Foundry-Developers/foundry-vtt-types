import { expectTypeOf, test } from "vitest";

import AmplificationBackgroundVisionShader = foundry.canvas.rendering.shaders.AmplificationBackgroundVisionShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

test("foundry/client/canvas/rendering/shaders/vision/effects/amplification", () => {
  const ABVS = AmplificationBackgroundVisionShader;
  let myABVS;

  expectTypeOf(ABVS.SHADER_HEADER).toEqualTypeOf<string>();
  expectTypeOf((myABVS = ABVS.create())).toEqualTypeOf<AmplificationBackgroundVisionShader>();

  expectTypeOf(myABVS.isRequired).toEqualTypeOf<boolean>();
  expectTypeOf(myABVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
});
