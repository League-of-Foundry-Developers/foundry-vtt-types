import { expectTypeOf, test } from "vitest";

import ColorationVisionShader = foundry.canvas.rendering.shaders.ColorationVisionShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

test("foundry/client/canvas/rendering/shaders/vision/coloration-vision", () => {
  const CVS = ColorationVisionShader;
  let myCVS;

  expectTypeOf(CVS.SHADER_HEADER).toEqualTypeOf<string>();
  expectTypeOf((myCVS = CVS.create())).toEqualTypeOf<ColorationVisionShader>();

  expectTypeOf(myCVS.isRequired).toEqualTypeOf<boolean>();
  expectTypeOf(myCVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
});
