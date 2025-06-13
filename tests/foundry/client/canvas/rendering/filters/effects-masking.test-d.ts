import { expectTypeOf } from "vitest";
import { VisualEffectsMaskingFilter } from "#client/canvas/rendering/filters/_module.mjs";

expectTypeOf(VisualEffectsMaskingFilter.FILTER_MODES).toExtend<
  Record<keyof VisualEffectsMaskingFilter.FilterModes, VisualEffectsMaskingFilter.FILTER_MODES>
>();
expectTypeOf(VisualEffectsMaskingFilter.POST_PROCESS_TECHNIQUES).toExtend<
  Record<
    keyof VisualEffectsMaskingFilter.PostProcessTechniques,
    { id: string & VisualEffectsMaskingFilter.POST_PROCESS_TECHNIQUES_ID; glsl: string }
  >
>();
expectTypeOf(VisualEffectsMaskingFilter.fragmentPostProcess(["CONTRAST"])).toEqualTypeOf<string>();

const myVEMF = VisualEffectsMaskingFilter.create({ postProcessModes: ["EXPOSURE"], someUniform: 7, someOther: [2, 3] });

expectTypeOf(myVEMF.updatePostprocessModes(["EXPOSURE"], { foo: 16, bar: [1, 2, 3] })).toEqualTypeOf<void>();
