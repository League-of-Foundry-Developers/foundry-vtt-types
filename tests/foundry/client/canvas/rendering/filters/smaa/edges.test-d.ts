import { expectTypeOf, test } from "vitest";

import SMAAEdgeDetectionFilter = foundry.canvas.rendering.filters.SMAAEdgeDetectionFilter;

test("foundry/client/canvas/rendering/filters/smaa/edges", () => {
  const filter = new SMAAEdgeDetectionFilter({ threshold: 0.1, localContrastAdaptionFactor: 2 });
  expectTypeOf(filter).toExtend<PIXI.Filter>();

  // @ts-expect-error both config keys are required
  new SMAAEdgeDetectionFilter({ threshold: 0.1 });
});
