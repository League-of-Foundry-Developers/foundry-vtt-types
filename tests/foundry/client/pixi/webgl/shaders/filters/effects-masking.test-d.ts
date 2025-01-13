import { expectTypeOf } from "vitest";

const VEMF = VisualEffectsMaskingFilter;

expectTypeOf(VEMF.FILTER_MODES).toMatchTypeOf<Record<string, number & VisualEffectsMaskingFilter.FILTER_MODES>>();
expectTypeOf(VEMF.POST_PROCESS_TECHNIQUES).toMatchTypeOf<
  Record<string, { id: string & VisualEffectsMaskingFilter.POST_PROCESS_TECHNIQUES_ID; glsl: string }>
>();
expectTypeOf(VEMF.fragmentPostProcess(["CONTRAST"])).toEqualTypeOf<string>();

const myVEMF = VEMF.create({ postProcessModes: ["EXPOSURE"] });

expectTypeOf(myVEMF.updatePostprocessModes(["EXPOSURE"], { foo: 16, bar: [1, 2, 3] })).toEqualTypeOf<void>();
