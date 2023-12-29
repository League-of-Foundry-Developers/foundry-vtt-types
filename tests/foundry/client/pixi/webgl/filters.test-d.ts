import { expectTypeOf } from "vitest";

class CustomMaskFilter extends AbstractBaseMaskFilter {}

expectTypeOf(CustomMaskFilter.create()).toEqualTypeOf<CustomMaskFilter>();

expectTypeOf(InverseOcclusionMaskFilter.create()).toEqualTypeOf<InverseOcclusionMaskFilter>();

/**
 * Due to foundry creating an un-TS-like `create` function,
 * the only correct way is to directly feed the arguments into the create function
 * Letting the overload handle the typing
 */
VisualEffectsMaskingFilter.create({
  filterMode: "background",
  postProcessModes: ["CONTRAST"],
  foobar: 3,
});
