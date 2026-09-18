import { expectTypeOf, test } from "vitest";

import VisionMaskFilter = foundry.canvas.rendering.filters.VisionMaskFilter;

test("foundry/client/canvas/rendering/filters/vision-mask-filter", () => {
  const myVMF = VisionMaskFilter.create();
  expectTypeOf(myVMF).toEqualTypeOf<VisionMaskFilter>();

  expectTypeOf(myVMF.suppressed).toEqualTypeOf<boolean>();
  expectTypeOf(myVMF.enabled).toEqualTypeOf<boolean>();
});
