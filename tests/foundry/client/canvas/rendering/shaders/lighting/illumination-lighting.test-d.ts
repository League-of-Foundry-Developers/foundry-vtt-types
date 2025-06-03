import { expectTypeOf } from "vitest";
import { AdaptiveIlluminationShader } from "#client/canvas/rendering/shaders/_module.mjs";

let myAIS;

expectTypeOf(AdaptiveIlluminationShader.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf(AdaptiveIlluminationShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf((myAIS = AdaptiveIlluminationShader.create())).toEqualTypeOf<AdaptiveIlluminationShader>();

expectTypeOf(myAIS.isRequired).toEqualTypeOf<boolean>();
expectTypeOf(myAIS.initialUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
