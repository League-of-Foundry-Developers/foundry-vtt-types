import { expectTypeOf } from "vitest";

let myALS;

expectTypeOf(AdaptiveLightingShader.forceDefaultColor).toEqualTypeOf<boolean>();
expectTypeOf(AdaptiveLightingShader.SHADER_TECHNIQUES).toMatchTypeOf<
  Record<string, AdaptiveLightingShader.ShaderTechnique>
>();
expectTypeOf(AdaptiveLightingShader.getShaderTechniques("background")).toEqualTypeOf<string>();
expectTypeOf((myALS = AdaptiveLightingShader.create())).toEqualTypeOf<AdaptiveLightingShader>();

expectTypeOf(myALS.update()).toEqualTypeOf<void>();
// deprecated since 12 until 14 but a second instance test was desired
expectTypeOf(myALS.getDarknessPenalty(0.8, -0.2)).toEqualTypeOf<number>();
