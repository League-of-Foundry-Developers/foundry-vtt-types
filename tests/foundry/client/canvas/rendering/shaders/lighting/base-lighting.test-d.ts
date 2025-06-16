import { expectTypeOf } from "vitest";
import { AdaptiveLightingShader } from "#client/canvas/rendering/shaders/_module.mjs";

let myALS;

expectTypeOf(AdaptiveLightingShader.forceDefaultColor).toEqualTypeOf<boolean>();
expectTypeOf(AdaptiveLightingShader.SHADER_TECHNIQUES).toExtend<
  Record<string, AdaptiveLightingShader.ShaderTechnique>
>();
expectTypeOf(AdaptiveLightingShader.getShaderTechniques("background")).toEqualTypeOf<string>();
expectTypeOf((myALS = AdaptiveLightingShader.create())).toEqualTypeOf<AdaptiveLightingShader>();

expectTypeOf(myALS.update()).toEqualTypeOf<void>();
// deprecated since 12 until 14 but a second instance test was desired
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myALS.getDarknessPenalty(0.8, -0.2)).toEqualTypeOf<number>();
