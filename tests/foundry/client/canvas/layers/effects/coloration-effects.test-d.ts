import { expectTypeOf } from "vitest";
import { CanvasColorationEffects, CanvasLayer } from "#client/canvas/layers/_module.mjs";

const layer = new CanvasColorationEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.filter).toEqualTypeOf<VisualEffectsMaskingFilter.ImplementationInstance | undefined>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasColorationEffects>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.clear()).toBeVoid();
