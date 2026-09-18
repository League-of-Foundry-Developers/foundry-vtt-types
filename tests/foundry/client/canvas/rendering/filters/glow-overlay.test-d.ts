import { expectTypeOf, test } from "vitest";

import GlowOverlayFilter = foundry.canvas.rendering.filters.GlowOverlayFilter;

test("foundry/client/canvas/rendering/filters/glow-overlay", () => {
  const myGOF = GlowOverlayFilter.create();
  expectTypeOf(myGOF).toEqualTypeOf<GlowOverlayFilter>();

  expectTypeOf(myGOF.padding).toEqualTypeOf<number>();
  expectTypeOf(myGOF.animated).toEqualTypeOf<boolean>();
});
