import { expectTypeOf, test } from "vitest";

import IlluminationVisionShader = foundry.canvas.rendering.shaders.IlluminationVisionShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

test("foundry/client/canvas/rendering/shaders/vision/illumination-vision", () => {
  const IVS = IlluminationVisionShader;
  let myIVS;

  expectTypeOf(IVS.ADJUSTMENTS).toEqualTypeOf<string>();
  expectTypeOf((myIVS = IVS.create())).toEqualTypeOf<IlluminationVisionShader>();

  expectTypeOf(myIVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
});
