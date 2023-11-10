import { expectTypeOf } from "vitest";

class CustomMaskFilter extends AbstractBaseMaskFilter {}

expectTypeOf(CustomMaskFilter.create()).toEqualTypeOf<CustomMaskFilter>();

expectTypeOf(InverseOcclusionMaskFilter.create()).toEqualTypeOf<InverseOcclusionMaskFilter>();
