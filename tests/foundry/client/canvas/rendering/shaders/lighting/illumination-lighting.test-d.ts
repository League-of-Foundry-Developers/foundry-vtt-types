import { expectTypeOf, test } from "vitest";

import AdaptiveIlluminationShader = foundry.canvas.rendering.shaders.AdaptiveIlluminationShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

declare const myAIS: AbstractBaseShader;

test("foundry/client/canvas/rendering/shaders/lighting/illumination-lighting", () => {
  expectTypeOf(AdaptiveIlluminationShader.SHADER_HEADER).toEqualTypeOf<string>();
  expectTypeOf(AdaptiveIlluminationShader.create()).toEqualTypeOf<AdaptiveIlluminationShader>();
  expectTypeOf(myAIS.initialUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
});
