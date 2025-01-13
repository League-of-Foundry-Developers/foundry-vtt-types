import { expectTypeOf } from "vitest";

let myABS;

expectTypeOf(AdaptiveBackgroundShader.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf((myABS = AdaptiveBackgroundShader.create())).toEqualTypeOf<AdaptiveBackgroundShader>();

expectTypeOf(myABS.isRequired).toEqualTypeOf<boolean>();
