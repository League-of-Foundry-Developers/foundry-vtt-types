import { expectTypeOf } from "vitest";

let myGOF;
expectTypeOf(GlowOverlayFilter.createFragmentShader(2, 20)).toEqualTypeOf<string>();
expectTypeOf((myGOF = GlowOverlayFilter.create())).toEqualTypeOf<GlowOverlayFilter>();

expectTypeOf(myGOF.padding).toEqualTypeOf<number>();
expectTypeOf(myGOF.animated).toEqualTypeOf<boolean>();
