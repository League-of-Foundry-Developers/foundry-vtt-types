import { expectTypeOf, test } from "vitest";

import SMAANeighborhoodBlendingFilter = foundry.canvas.rendering.filters.SMAANeighborhoodBlendingFilter;

test("foundry/client/canvas/rendering/filters/smaa/blend", () => {
  expectTypeOf(new SMAANeighborhoodBlendingFilter()).toExtend<PIXI.Filter>();
});
