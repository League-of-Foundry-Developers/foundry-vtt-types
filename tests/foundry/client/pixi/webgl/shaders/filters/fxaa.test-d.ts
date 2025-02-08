import { expectTypeOf } from "vitest";

expectTypeOf(AdaptiveFXAAFilter.create()).toEqualTypeOf<AdaptiveFXAAFilter>();

expectTypeOf(AdaptiveFXAAFilter.defaultUniforms.lumaMinimum).toEqualTypeOf<AbstractBaseShader.UniformValue>();
