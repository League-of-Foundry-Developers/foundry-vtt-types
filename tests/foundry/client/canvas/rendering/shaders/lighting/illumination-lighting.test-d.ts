import { expectTypeOf } from "vitest";
import { AdaptiveIlluminationShader } from "#client/canvas/rendering/shaders/_module.mjs";

import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

expectTypeOf(AdaptiveIlluminationShader.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf(AdaptiveIlluminationShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(AdaptiveIlluminationShader.create()).toEqualTypeOf<AdaptiveIlluminationShader>();

declare const myAIS: AbstractBaseShader;
expectTypeOf(myAIS.initialUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
