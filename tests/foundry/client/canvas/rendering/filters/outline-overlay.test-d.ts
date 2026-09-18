import { expectTypeOf, test } from "vitest";

import OutlineOverlayFilter = foundry.canvas.rendering.filters.OutlineOverlayFilter;

test("foundry/client/canvas/rendering/filters/outline-overlay", () => {
  let myOOF;
  expectTypeOf((myOOF = OutlineOverlayFilter.create())).toEqualTypeOf<OutlineOverlayFilter>();
  expectTypeOf(myOOF.thickness).toEqualTypeOf<number>();
});
