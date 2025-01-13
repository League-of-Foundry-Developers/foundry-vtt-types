import { expectTypeOf } from "vitest";

let myACS;

expectTypeOf(AdaptiveColorationShader.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf(AdaptiveColorationShader.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
expectTypeOf((myACS = AdaptiveColorationShader.create())).toEqualTypeOf<AdaptiveColorationShader>();

expectTypeOf(myACS.isRequired).toEqualTypeOf<boolean>();
expectTypeOf(myACS.initialUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
