import { expectTypeOf } from "vitest";
import { GlowOverlayFilter } from "#client/canvas/rendering/filters/_module.mjs";

const myGOF = GlowOverlayFilter.create();
expectTypeOf(myGOF).toEqualTypeOf<GlowOverlayFilter>();

expectTypeOf(GlowOverlayFilter.createFragmentShader(2, 20)).toEqualTypeOf<string>();

expectTypeOf(myGOF.padding).toEqualTypeOf<number>();
expectTypeOf(myGOF.animated).toEqualTypeOf<boolean>();
