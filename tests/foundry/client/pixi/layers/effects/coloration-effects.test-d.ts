import { expectTypeOf } from "vitest";

const layer = new CanvasColorationEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.filter).toEqualTypeOf<VisualEffectsMaskingFilter.ConfiguredInstance | undefined>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasColorationEffects>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.clear()).toBeVoid();
