import { expectTypeOf, test } from "vitest";

import PrimaryCanvasGroupAmbienceFilter = foundry.canvas.rendering.filters.PrimaryCanvasGroupAmbienceFilter;

test("foundry/client/canvas/rendering/filters/environment", () => {
  expectTypeOf(PrimaryCanvasGroupAmbienceFilter.create()).toEqualTypeOf<PrimaryCanvasGroupAmbienceFilter>();
});
