import { expectTypeOf } from "vitest";

class CustomMaskFilter extends AbstractBaseMaskFilter {}

expectTypeOf(CustomMaskFilter.create()).toEqualTypeOf<CustomMaskFilter>();

expectTypeOf(InverseOcclusionMaskFilter.create()).toEqualTypeOf<InverseOcclusionMaskFilter>();

const x: VisualEffectsMaskingFilter.CreateOptions = {
  filterMode: "background",
  postProcessModes: ["CONTRAST"],
  foobar: 3,
};

VisualEffectsMaskingFilter.create(x);
