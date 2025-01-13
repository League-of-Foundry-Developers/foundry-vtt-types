import { expectTypeOf } from "vitest";

expectTypeOf(InvisibilityFilter.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(InvisibilityFilter.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();

let myIF;
expectTypeOf((myIF = InvisibilityFilter.create())).toEqualTypeOf<InvisibilityFilter>();
expectTypeOf(myIF.padding).toEqualTypeOf<number>();
