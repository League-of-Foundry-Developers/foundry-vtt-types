import { expectTypeOf, test } from "vitest";

import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;
import AdaptiveColorationShader = foundry.canvas.rendering.shaders.AdaptiveColorationShader;

test("foundry/client/canvas/rendering/shaders/lighting/coloration-lighting", () => {
  let myACS;

  expectTypeOf(AdaptiveColorationShader.SHADER_HEADER).toEqualTypeOf<string>();
  expectTypeOf(AdaptiveColorationShader.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
  expectTypeOf((myACS = AdaptiveColorationShader.create())).toEqualTypeOf<AdaptiveColorationShader>();

  expectTypeOf(myACS.isRequired).toEqualTypeOf<boolean>();
  expectTypeOf(myACS.initialUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
});
