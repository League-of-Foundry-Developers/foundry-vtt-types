import { expectTypeOf } from "vitest";

import AdaptiveIlluminationShader = foundry.canvas.rendering.shaders.AdaptiveIlluminationShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

expectTypeOf(AdaptiveIlluminationShader.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf(AdaptiveIlluminationShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(AdaptiveIlluminationShader.create()).toEqualTypeOf<AdaptiveIlluminationShader>();

declare const myAIS: AbstractBaseShader;
expectTypeOf(myAIS.initialUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
