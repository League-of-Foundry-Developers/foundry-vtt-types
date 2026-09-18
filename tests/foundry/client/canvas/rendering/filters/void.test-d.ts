import { expectTypeOf, test } from "vitest";

import VoidFilter = foundry.canvas.rendering.filters.VoidFilter;

test("foundry/client/canvas/rendering/filters/void", () => {
  const myVoidFilter = VoidFilter.create();
  expectTypeOf(myVoidFilter).toEqualTypeOf<VoidFilter>();

  expectTypeOf(myVoidFilter.padding).toEqualTypeOf<number>();
});
