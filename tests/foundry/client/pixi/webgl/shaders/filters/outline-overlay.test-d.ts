import { expectTypeOf } from "vitest";

expectTypeOf(OutlineOverlayFilter.vertexShader).toEqualTypeOf<string>();
expectTypeOf(OutlineOverlayFilter.createFragmentShader()).toEqualTypeOf<string>();

let myOOF;
expectTypeOf((myOOF = OutlineOverlayFilter.create())).toEqualTypeOf<OutlineOverlayFilter>();
expectTypeOf(myOOF.thickness).toEqualTypeOf<number>();
