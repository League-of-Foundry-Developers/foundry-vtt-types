import { expectTypeOf } from "vitest";

import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;
import AdaptiveLightingShader = foundry.canvas.rendering.shaders.AdaptiveLightingShader;
import AdaptiveVisionShader = foundry.canvas.rendering.shaders.AdaptiveVisionShader;

expectTypeOf(AdaptiveVisionShader.FRAGMENT_FUNCTIONS).toEqualTypeOf<string>();
expectTypeOf(AdaptiveVisionShader.SHADER_TECHNIQUES).toEqualTypeOf<
  Record<string, AdaptiveLightingShader.ShaderTechnique>
>();
expectTypeOf(AdaptiveVisionShader.create()).toEqualTypeOf<AdaptiveVisionShader>();

declare const myAVS: AdaptiveVisionShader;
expectTypeOf(myAVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
