import { expectTypeOf } from "vitest";

import CanvasColorationEffects = foundry.canvas.layers.CanvasColorationEffects;
import CanvasLayer = foundry.canvas.layers.CanvasLayer;
import VisualEffectsMaskingFilter = foundry.canvas.rendering.filters.VisualEffectsMaskingFilter;

const layer = new CanvasColorationEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.filter).toEqualTypeOf<VisualEffectsMaskingFilter.Implementation | undefined>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasColorationEffects>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.clear()).toBeVoid();
