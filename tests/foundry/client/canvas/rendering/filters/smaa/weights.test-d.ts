import { expectTypeOf, test } from "vitest";

import SMAABlendingWeightCalculationFilter = foundry.canvas.rendering.filters.SMAABlendingWeightCalculationFilter;

test("foundry/client/canvas/rendering/filters/smaa/weights", () => {
  const filter = new SMAABlendingWeightCalculationFilter({
    threshold: 0.1,
    maxSearchSteps: 16,
    maxSearchStepsDiag: 8,
    cornerRounding: 25,
    disableDiagDetection: false,
    disableCornerDetection: false,
  });
  expectTypeOf(filter).toExtend<PIXI.Filter>();

  // @ts-expect-error `localContrastAdaptionFactor` is not used by this filter
  new SMAABlendingWeightCalculationFilter({ localContrastAdaptionFactor: 2 });
});
