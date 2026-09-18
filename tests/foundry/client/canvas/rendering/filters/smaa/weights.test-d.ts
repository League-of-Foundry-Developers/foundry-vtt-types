import { test } from "vitest";

// `SMAABWeightCalculationFilter` is only imported in `smaa.mjs`, is only assigned to a private property of `SMAAFilter`, and never gets re-exported, so it cannot currently be tested.
// It's only testable alteration to its parent class is the constructor interface

test.todo("foundry/client/canvas/rendering/filters/smaa/weights");
