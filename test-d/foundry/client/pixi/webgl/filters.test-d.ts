import { expectType } from "tsd";

class CustomMaskFilter extends AbstractBaseMaskFilter {}

expectType<CustomMaskFilter>(CustomMaskFilter.create());

expectType<InverseOcclusionMaskFilter>(InverseOcclusionMaskFilter.create());
