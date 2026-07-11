import { expectTypeOf } from "vitest";

import CanvasDarknessEffects = foundry.canvas.layers.CanvasDarknessEffects;
import CanvasLayer = foundry.canvas.layers.CanvasLayer;

const layer = new CanvasDarknessEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<CanvasLayer.AnyConstructor>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasDarknessEffects>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.clear()).toBeVoid();
