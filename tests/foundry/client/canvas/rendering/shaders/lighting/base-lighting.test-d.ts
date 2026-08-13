import { expectTypeOf } from "vitest";

import AdaptiveLightingShader = foundry.canvas.rendering.shaders.AdaptiveLightingShader;

let myALS;

expectTypeOf(AdaptiveLightingShader.forceDefaultColor).toEqualTypeOf<boolean>();
expectTypeOf(AdaptiveLightingShader.SHADER_TECHNIQUES).toExtend<
  Record<string, AdaptiveLightingShader.ShaderTechnique>
>();
expectTypeOf(AdaptiveLightingShader.getShaderTechniques("background")).toEqualTypeOf<string>();
expectTypeOf((myALS = AdaptiveLightingShader.create())).toEqualTypeOf<AdaptiveLightingShader>();

expectTypeOf(myALS.update()).toEqualTypeOf<void>();
