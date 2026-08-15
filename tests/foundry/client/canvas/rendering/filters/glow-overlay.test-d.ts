import { expectTypeOf } from "vitest";

import GlowOverlayFilter = foundry.canvas.rendering.filters.GlowOverlayFilter;

const myGOF = GlowOverlayFilter.create();
expectTypeOf(myGOF).toEqualTypeOf<GlowOverlayFilter>();

expectTypeOf(myGOF.padding).toEqualTypeOf<number>();
expectTypeOf(myGOF.animated).toEqualTypeOf<boolean>();
