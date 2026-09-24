import { expectTypeOf, test } from "vitest";

import CanvasDarknessEffects = foundry.canvas.layers.CanvasDarknessEffects;
import CanvasLayer = foundry.canvas.layers.CanvasLayer;

test("foundry/client/canvas/layers/effects/darkness-effects", () => {
  const layer = new CanvasDarknessEffects();

  expectTypeOf(layer.options.baseClass).toEqualTypeOf<CanvasLayer.AnyConstructor>();
  expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasDarknessEffects>>();
  expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
  expectTypeOf(layer.clear()).toBeVoid();
  expectTypeOf(layer.filter).toEqualTypeOf<foundry.canvas.rendering.filters.VoidFilter | undefined>();
});
